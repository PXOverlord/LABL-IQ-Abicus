#!/usr/bin/env python3
"""
Test script to verify rate table generation with real data.
"""

import sys
import os
import pandas as pd
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import generate_rate_table
from calc_engine import AmazonRateCalculator

def test_rate_table_with_real_data():
    """Test the rate table generation with real shipment data."""
    
    print("=== Rate Table Generation with Real Data Test ===\n")
    
    # Path to the real data file
    real_file = "/Users/jasonbabb/Desktop/solbrush amazon june - there data/SOLBRUSH AMAZON SHIPPING TRANSACTIONS/Quote /SolBrush Amazon Rate DownloadAmazon Only .csv"
    
    if not os.path.exists(real_file):
        print(f"❌ Real data file not found: {real_file}")
        return
    
    try:
        # Load real data
        print("Loading real shipment data...")
        df = pd.read_csv(real_file)
        print(f"✅ Loaded {len(df)} shipments")
        
        # Initialize calculator
        print("Initializing rate calculator...")
        template_path = os.path.join(os.path.dirname(__file__), "data", "2025 Amazon Quote Tool Template.xlsx")
        calculator = AmazonRateCalculator(template_path)
        
        # Process a sample of the data (first 1000 shipments for speed)
        sample_df = df.head(1000).copy()
        
        # Convert to shipment format
        shipments = []
        for idx, row in sample_df.iterrows():
            try:
                # Extract basic info
                dest_zip = str(row.get('Ship Postal Code', ''))
                weight = float(row.get('Weight Oz', 0)) / 16.0  # Convert oz to lbs
                
                shipment = {
                    'shipment_id': str(idx),
                    'origin_zip': '75238',  # Default origin
                    'destination_zip': dest_zip,
                    'weight': weight,
                    'billable_weight': weight,
                    'dim_weight': weight,
                    'length': 10.0,  # Default dimensions
                    'width': 8.0,
                    'height': 6.0,
                    'package_type': 'box',
                    'service_level': 'standard',
                    'carrier_rate': float(row.get('Carrier Fee', 0))
                }
                shipments.append(shipment)
            except Exception as e:
                print(f"Warning: Skipping row {idx}: {e}")
                continue
        
        print(f"✅ Processed {len(shipments)} shipments")
        
        if len(shipments) == 0:
            print("❌ No valid shipments to process")
            return
        
        # Calculate rates
        print("Calculating rates...")
        results = calculator.calculate_rates(shipments)
        
        # Convert to DataFrame
        results_df = pd.DataFrame(results)
        print(f"✅ Calculated rates for {len(results_df)} shipments")
        
        # Generate rate table
        print("Generating rate table...")
        rate_table = generate_rate_table(results_df, 'standard', 'box')
        
        print("✅ Rate table generated successfully!")
        print(f"Shape: {rate_table.shape}")
        print(f"Columns: {list(rate_table.columns)}")
        print()
        
        # Display rate table preview
        print("Rate Table Preview (first 10 rows):")
        print(rate_table.head(10))
        print()
        
        # Show statistics
        zone_columns = [col for col in rate_table.columns if col.startswith('Zone')]
        print("Rate Table Statistics:")
        print(f"Zones: {len(zone_columns)}")
        print(f"Weight tiers: {len(rate_table)}")
        
        if zone_columns:
            min_rate = rate_table[zone_columns].min().min()
            max_rate = rate_table[zone_columns].max().max()
            print(f"Rate range: ${min_rate:.2f} - ${max_rate:.2f}")
        
        print("\n✅ Rate table generation with real data test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_rate_table_with_real_data() 