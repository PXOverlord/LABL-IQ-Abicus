#!/usr/bin/env python3
"""
Test script to verify rate table generation with fixed zone matrix.
"""

import sys
import os
import pandas as pd
from calc_engine import AmazonRateCalculator

def test_rate_table_generation():
    """Test rate table generation with fixed zone matrix."""
    
    print("Testing rate table generation with fixed zone matrix...")
    
    # Initialize calculator
    try:
        calculator = AmazonRateCalculator("data/2025 Amazon Quote Tool Template.xlsx")
        print("✅ Calculator initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize calculator: {e}")
        return False
    
    # Create test shipments
    test_shipments = [
        {
            'shipment_id': 'TEST001',
            'origin_zip': '75238',
            'destination_zip': '10001',
            'weight': 5.0,
            'length': 12,
            'width': 10,
            'height': 8,
            'carrier_rate': 15.75,
            'service_level': 'standard',
            'package_type': 'box'
        },
        {
            'shipment_id': 'TEST002',
            'origin_zip': '75238',
            'destination_zip': '90210',
            'weight': 3.5,
            'length': 8,
            'width': 6,
            'height': 4,
            'carrier_rate': 12.50,
            'service_level': 'expedited',
            'package_type': 'box'
        },
        {
            'shipment_id': 'TEST003',
            'origin_zip': '75238',
            'destination_zip': '60007',
            'weight': 8.0,
            'length': 16,
            'width': 14,
            'height': 12,
            'carrier_rate': 20.25,
            'service_level': 'priority',
            'package_type': 'box'
        },
        {
            'shipment_id': 'TEST004',
            'origin_zip': '75238',
            'destination_zip': '92626',
            'weight': 2.0,
            'length': 6,
            'width': 4,
            'height': 3,
            'carrier_rate': 8.50,
            'service_level': 'standard',
            'package_type': 'box'
        }
    ]
    
    print(f"\nTesting rate calculation for {len(test_shipments)} shipments:")
    
    # Calculate rates
    try:
        results = calculator.calculate_rates(test_shipments)
        print(f"✅ Successfully calculated rates for {len(results)} shipments")
    except Exception as e:
        print(f"❌ Failed to calculate rates: {e}")
        return False
    
    # Analyze results
    df = pd.DataFrame(results)
    
    print(f"\nResults summary:")
    print(f"  Total shipments: {len(df)}")
    print(f"  Average zone: {df['zone'].mean():.2f}")
    print(f"  Zone distribution:")
    zone_counts = df['zone'].value_counts().sort_index()
    for zone, count in zone_counts.items():
        print(f"    Zone {zone}: {count} shipments")
    
    print(f"\nRate analysis:")
    print(f"  Average base rate: ${df['base_rate'].mean():.2f}")
    print(f"  Average final rate: ${df['final_rate'].mean():.2f}")
    print(f"  Average savings: ${df['savings'].mean():.2f}")
    print(f"  Average savings %: {df['savings_percent'].mean():.1f}%")
    
    # Check for any invalid zones
    invalid_zones = df[~df['zone'].between(1, 8)]
    if len(invalid_zones) > 0:
        print(f"  ❌ Found {len(invalid_zones)} shipments with invalid zones:")
        for _, row in invalid_zones.iterrows():
            print(f"    {row['shipment_id']}: Zone {row['zone']}")
    else:
        print(f"  ✅ All shipments have valid zones (1-8)")
    
    # Check for any defaulted zones (zone 8)
    defaulted_zones = df[df['zone'] == 8]
    print(f"  Defaulted to zone 8: {len(defaulted_zones)} shipments ({len(defaulted_zones)/len(df)*100:.1f}%)")
    
    # Show detailed results
    print(f"\nDetailed results:")
    for _, row in df.iterrows():
        print(f"  {row['shipment_id']}: {row['origin_zip']} → {row['destination_zip']}")
        print(f"    Zone: {row['zone']}, Weight: {row['weight']} lbs")
        print(f"    Base: ${row['base_rate']:.2f}, Final: ${row['final_rate']:.2f}")
        print(f"    Savings: ${row['savings']:.2f} ({row['savings_percent']:.1f}%)")
        print()
    
    return True

if __name__ == "__main__":
    success = test_rate_table_generation()
    if success:
        print("\n🎉 Rate table generation test completed successfully!")
    else:
        print("\n❌ Rate table generation test failed!")
        sys.exit(1) 