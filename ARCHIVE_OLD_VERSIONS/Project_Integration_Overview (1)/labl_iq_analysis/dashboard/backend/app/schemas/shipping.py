from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AnalysisStatus(str, Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class UploadResponse(BaseModel):
    uploadId: str
    message: str

class CarrierBreakdown(BaseModel):
    carrier: str
    shipments: int
    cost: float
    savings: float

class ZoneAnalysis(BaseModel):
    zone: str
    shipments: int
    avgCost: float
    savings: float

class SavingsOpportunity(BaseModel):
    carrier: str
    service: str
    currentCost: float
    recommendedCost: float
    savings: float

class AnalysisResult(BaseModel):
    id: str
    uploadId: str
    totalShipments: int
    totalCost: float
    potentialSavings: float
    avgSavingsPerShipment: float
    topSavingsOpportunities: List[SavingsOpportunity]
    carrierBreakdown: List[CarrierBreakdown]
    zoneAnalysis: List[ZoneAnalysis]
    createdAt: datetime
    status: AnalysisStatus

class MonthlyTrend(BaseModel):
    month: str
    shipments: int
    cost: float
    savings: float

class DashboardMetrics(BaseModel):
    totalShipments: int
    totalSavings: float
    avgSavingsPerShipment: float
    topCarrier: str
    recentAnalyses: List[AnalysisResult]
    monthlyTrends: List[MonthlyTrend]

class RateQuoteRequest(BaseModel):
    origin: str
    destination: str
    weight: float
    dimensions: Dict[str, float]  # length, width, height
    value: Optional[float] = None

class RateQuote(BaseModel):
    carrier: str
    service: str
    cost: float
    deliveryDays: int
    deliveryDate: str