#!/usr/bin/env python3
"""
Test script to verify rate table generation functionality.
"""

import sys
import os
import pandas as pd
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import generate_rate_table

def test_rate_table_generation():
    """Test the rate table generation with sample data."""
    
    print("=== Rate Table Generation Test ===\n")
    
    # Create sample data
    sample_data = pd.DataFrame({
        'zone': [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
        'billable_weight': [0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5],
        'final_rate': [3.50, 4.25, 4.00, 4.75, 4.50, 5.25, 5.00, 5.75, 5.50, 6.25, 6.00, 6.75, 6.50, 7.25, 7.00, 7.75],
        'base_rate': [3.00, 3.75, 3.50, 4.25, 4.00, 4.75, 4.50, 5.25, 5.00, 5.75, 5.50, 6.25, 6.00, 6.75, 6.50, 7.25],
        'total_surcharges': [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
        'markup_amount': [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
        'service_level': ['standard'] * 16,
        'package_type': ['box'] * 16
    })
    
    print("Sample data created:")
    print(f"Shape: {sample_data.shape}")
    print(f"Zones: {sample_data['zone'].unique()}")
    print(f"Weight range: {sample_data['billable_weight'].min():.1f} - {sample_data['billable_weight'].max():.1f} lbs")
    print(f"Rate range: ${sample_data['final_rate'].min():.2f} - ${sample_data['final_rate'].max():.2f}")
    print()
    
    # Generate rate table
    print("Generating rate table...")
    rate_table = generate_rate_table(sample_data, 'standard', 'box')
    
    print("Rate table generated successfully!")
    print(f"Shape: {rate_table.shape}")
    print(f"Columns: {list(rate_table.columns)}")
    print()
    
    # Display rate table
    print("Rate Table Preview:")
    print(rate_table.head(10))  # Show first 10 rows
    print()
    
    # Show statistics
    print("Rate Table Statistics:")
    zone_columns = [col for col in rate_table.columns if col.startswith('Zone')]
    print(f"Zones: {len(zone_columns)}")
    print(f"Weight tiers: {len(rate_table)}")
    
    if zone_columns:
        min_rate = rate_table[zone_columns].min().min()
        max_rate = rate_table[zone_columns].max().max()
        print(f"Rate range: ${min_rate:.2f} - ${max_rate:.2f}")
    
    print("\n✅ Rate table generation test completed successfully!")

if __name__ == "__main__":
    test_rate_table_generation() 