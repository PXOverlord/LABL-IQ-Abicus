from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional
import uuid
import os
import pandas as pd
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.analysis import Analysis
from app.schemas.shipping import (
    UploadResponse, AnalysisResult, DashboardMetrics, RateQuote, 
    RateQuoteRequest, MonthlyTrend, AnalysisStatus
)
from app.schemas.response import APIResponse
from app.api.v1.auth import get_current_user
from app.services.shipping_analyzer import ShippingAnalyzer
from app.services.rate_calculator import RateCalculator

router = APIRouter()

@router.post("/upload", response_model=APIResponse[UploadResponse])
async def upload_shipment_data(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    carriersToAnalyze: Optional[str] = Form(None),
    includeInternational: bool = Form(False),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_extension} not allowed. Allowed types: {settings.ALLOWED_FILE_TYPES}"
        )
    
    # Validate file size
    file_size = 0
    content = await file.read()
    file_size = len(content)
    
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Generate unique IDs
    upload_id = str(uuid.uuid4())
    analysis_id = str(uuid.uuid4())
    
    # Save file
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, f"{upload_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    # Create analysis record
    analysis = Analysis(
        id=analysis_id,
        user_id=current_user.id,
        upload_id=upload_id,
        filename=file.filename,
        status=AnalysisStatus.PROCESSING
    )
    db.add(analysis)
    await db.commit()
    
    # Start background analysis
    background_tasks.add_task(
        process_shipment_analysis,
        analysis_id=analysis_id,
        file_path=file_path,
        carriers_to_analyze=carriersToAnalyze.split(",") if carriersToAnalyze else None,
        include_international=includeInternational
    )
    
    return APIResponse(
        data=UploadResponse(
            uploadId=upload_id,
            message="File uploaded successfully. Analysis in progress."
        ),
        success=True
    )

@router.get("/analysis/{upload_id}", response_model=APIResponse[AnalysisResult])
async def get_analysis_status(
    upload_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Analysis).where(
            Analysis.upload_id == upload_id,
            Analysis.user_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return APIResponse(
        data=AnalysisResult(
            id=analysis.id,
            uploadId=analysis.upload_id,
            totalShipments=analysis.total_shipments,
            totalCost=analysis.total_cost,
            potentialSavings=analysis.potential_savings,
            avgSavingsPerShipment=analysis.avg_savings_per_shipment,
            topSavingsOpportunities=analysis.results.get("top_savings", []) if analysis.results else [],
            carrierBreakdown=analysis.results.get("carrier_breakdown", []) if analysis.results else [],
            zoneAnalysis=analysis.results.get("zone_analysis", []) if analysis.results else [],
            createdAt=analysis.created_at,
            status=AnalysisStatus(analysis.status)
        ),
        success=True
    )

@router.get("/results/{analysis_id}", response_model=APIResponse[AnalysisResult])
async def get_analysis_results(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Analysis).where(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return APIResponse(
        data=AnalysisResult(
            id=analysis.id,
            uploadId=analysis.upload_id,
            totalShipments=analysis.total_shipments,
            totalCost=analysis.total_cost,
            potentialSavings=analysis.potential_savings,
            avgSavingsPerShipment=analysis.avg_savings_per_shipment,
            topSavingsOpportunities=analysis.results.get("top_savings", []) if analysis.results else [],
            carrierBreakdown=analysis.results.get("carrier_breakdown", []) if analysis.results else [],
            zoneAnalysis=analysis.results.get("zone_analysis", []) if analysis.results else [],
            createdAt=analysis.created_at,
            status=AnalysisStatus(analysis.status)
        ),
        success=True
    )

@router.get("/dashboard", response_model=APIResponse[DashboardMetrics])
async def get_dashboard_metrics(
    timeframe: str = "30d",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate date range
    days = {"7d": 7, "30d": 30, "90d": 90}.get(timeframe, 30)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get completed analyses
    result = await db.execute(
        select(Analysis).where(
            Analysis.user_id == current_user.id,
            Analysis.status == AnalysisStatus.COMPLETED,
            Analysis.created_at >= start_date
        ).order_by(desc(Analysis.created_at))
    )
    analyses = result.scalars().all()
    
    # Calculate metrics
    total_shipments = sum(a.total_shipments for a in analyses)
    total_savings = sum(a.potential_savings for a in analyses)
    avg_savings = total_savings / total_shipments if total_shipments > 0 else 0
    
    # Get top carrier (simplified)
    top_carrier = "UPS"  # This would be calculated from actual data
    
    # Get recent analyses
    recent_analyses = analyses[:5]
    
    # Generate monthly trends (simplified)
    monthly_trends = []
    for i in range(3):
        month_date = datetime.utcnow() - timedelta(days=30 * i)
        monthly_trends.append(MonthlyTrend(
            month=month_date.strftime("%b %Y"),
            shipments=total_shipments // 3,
            cost=50000 + (i * 5000),
            savings=total_savings // 3
        ))
    
    return APIResponse(
        data=DashboardMetrics(
            totalShipments=total_shipments,
            totalSavings=total_savings,
            avgSavingsPerShipment=avg_savings,
            topCarrier=top_carrier,
            recentAnalyses=[
                AnalysisResult(
                    id=a.id,
                    uploadId=a.upload_id,
                    totalShipments=a.total_shipments,
                    totalCost=a.total_cost,
                    potentialSavings=a.potential_savings,
                    avgSavingsPerShipment=a.avg_savings_per_shipment,
                    topSavingsOpportunities=[],
                    carrierBreakdown=[],
                    zoneAnalysis=[],
                    createdAt=a.created_at,
                    status=AnalysisStatus(a.status)
                ) for a in recent_analyses
            ],
            monthlyTrends=monthly_trends
        ),
        success=True
    )

@router.post("/quotes", response_model=APIResponse[List[RateQuote]])
async def get_rate_quotes(
    quote_request: RateQuoteRequest,
    current_user: User = Depends(get_current_user)
):
    calculator = RateCalculator()
    quotes = await calculator.get_quotes(
        origin=quote_request.origin,
        destination=quote_request.destination,
        weight=quote_request.weight,
        dimensions=quote_request.dimensions,
        value=quote_request.value
    )
    
    return APIResponse(
        data=quotes,
        success=True
    )

# Background task function
async def process_shipment_analysis(
    analysis_id: str,
    file_path: str,
    carriers_to_analyze: Optional[List[str]] = None,
    include_international: bool = False
):
    """Background task to process shipment analysis"""
    from app.core.database import AsyncSessionLocal
    
    async with AsyncSessionLocal() as db:
        try:
            # Get analysis record
            result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
            analysis = result.scalar_one()
            
            # Process the file
            analyzer = ShippingAnalyzer()
            results = await analyzer.analyze_shipments(
                file_path=file_path,
                carriers_to_analyze=carriers_to_analyze,
                include_international=include_international
            )
            
            # Update analysis with results
            analysis.total_shipments = results["total_shipments"]
            analysis.total_cost = results["total_cost"]
            analysis.potential_savings = results["potential_savings"]
            analysis.avg_savings_per_shipment = results["avg_savings_per_shipment"]
            analysis.results = results
            analysis.status = AnalysisStatus.COMPLETED
            
            await db.commit()
            
        except Exception as e:
            # Update analysis with error
            analysis.status = AnalysisStatus.FAILED
            analysis.error_message = str(e)
            await db.commit()
        
        finally:
            # Clean up uploaded file
            if os.path.exists(file_path):
                os.remove(file_path)