import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any
import asyncio

class ShippingAnalyzer:
    def __init__(self):
        self.carrier_rates = {
            "UPS": {"ground": 8.50, "2day": 15.75, "overnight": 35.25},
            "FedEx": {"ground": 9.25, "2day": 16.50, "overnight": 37.00},
            "USPS": {"ground": 7.85, "priority": 12.30, "express": 28.95},
        }
    
    async def analyze_shipments(
        self, 
        file_path: str, 
        carriers_to_analyze: Optional[List[str]] = None,
        include_international: bool = False
    ) -> Dict[str, Any]:
        """Analyze shipment data and calculate savings opportunities"""
        
        # Read the uploaded file
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
        
        # Standardize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Basic data validation
        required_columns = ['origin_zip', 'destination_zip', 'weight', 'actual_cost', 'carrier']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Calculate analysis metrics
        total_shipments = len(df)
        total_cost = df['actual_cost'].sum()
        
        # Calculate potential savings (simplified logic)
        df['zone'] = self._calculate_zone(df['origin_zip'], df['destination_zip'])
        df['recommended_cost'] = df.apply(self._calculate_recommended_cost, axis=1)
        df['potential_savings'] = df['actual_cost'] - df['recommended_cost']
        df['potential_savings'] = df['potential_savings'].clip(lower=0)
        
        potential_savings = df['potential_savings'].sum()
        avg_savings_per_shipment = potential_savings / total_shipments if total_shipments > 0 else 0
        
        # Generate carrier breakdown
        carrier_breakdown = []
        for carrier in df['carrier'].unique():
            carrier_data = df[df['carrier'] == carrier]
            carrier_breakdown.append({
                "carrier": carrier,
                "shipments": len(carrier_data),
                "cost": float(carrier_data['actual_cost'].sum()),
                "savings": float(carrier_data['potential_savings'].sum())
            })
        
        # Generate zone analysis
        zone_analysis = []
        for zone in df['zone'].unique():
            zone_data = df[df['zone'] == zone]
            zone_analysis.append({
                "zone": f"Zone {zone}",
                "shipments": len(zone_data),
                "avgCost": float(zone_data['actual_cost'].mean()),
                "savings": float(zone_data['potential_savings'].sum())
            })
        
        # Generate top savings opportunities
        top_savings = df.nlargest(10, 'potential_savings').to_dict('records')
        top_savings_opportunities = []
        for record in top_savings:
            top_savings_opportunities.append({
                "carrier": record['carrier'],
                "service": "Ground",  # Simplified
                "currentCost": float(record['actual_cost']),
                "recommendedCost": float(record['recommended_cost']),
                "savings": float(record['potential_savings'])
            })
        
        return {
            "total_shipments": total_shipments,
            "total_cost": float(total_cost),
            "potential_savings": float(potential_savings),
            "avg_savings_per_shipment": float(avg_savings_per_shipment),
            "carrier_breakdown": carrier_breakdown,
            "zone_analysis": zone_analysis,
            "top_savings": top_savings_opportunities[:5]
        }
    
    def _calculate_zone(self, origin_zip: pd.Series, destination_zip: pd.Series) -> pd.Series:
        """Calculate shipping zone based on ZIP codes (simplified)"""
        # This is a simplified zone calculation
        # In practice, you'd use actual zone mapping tables
        origin_int = pd.to_numeric(origin_zip.astype(str).str[:3], errors='coerce')
        dest_int = pd.to_numeric(destination_zip.astype(str).str[:3], errors='coerce')
        
        distance = np.abs(origin_int - dest_int)
        
        # Simple zone mapping
        zones = np.where(distance <= 50, 2,
                np.where(distance <= 150, 3,
                np.where(distance <= 300, 4,
                np.where(distance <= 600, 5,
                np.where(distance <= 1000, 6, 7)))))
        
        return pd.Series(zones)
    
    def _calculate_recommended_cost(self, row: pd.Series) -> float:
        """Calculate recommended shipping cost based on optimized carrier selection"""
        weight = row.get('weight', 1)
        zone = row.get('zone', 3)
        
        # Base rate calculation (simplified)
        base_rate = 5.00 + (weight * 0.50) + (zone * 1.25)
        
        # Apply carrier-specific adjustments
        carrier_multipliers = {
            "UPS": 1.0,
            "FedEx": 1.05,
            "USPS": 0.92,
            "DHL": 1.15
        }
        
        carrier = row.get('carrier', 'UPS')
        multiplier = carrier_multipliers.get(carrier, 1.0)
        
        return base_rate * multiplier