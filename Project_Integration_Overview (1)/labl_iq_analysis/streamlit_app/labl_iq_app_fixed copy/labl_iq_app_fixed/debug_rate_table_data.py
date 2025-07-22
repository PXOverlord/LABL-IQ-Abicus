#!/usr/bin/env python3
"""
Debug script to analyze data distribution for rate table generation.
This will help understand why so many cells are empty in the rate table.
"""

import pandas as pd
import numpy as np
import os
import sys

def analyze_data_distribution(df):
    """Analyze the distribution of data across zones and weight ranges."""
    
    print("=== DATA DISTRIBUTION ANALYSIS ===\n")
    
    # Check if we have the required columns
    required_cols = ['zone', 'billable_weight', 'final_rate']
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        print(f"❌ Missing required columns: {missing_cols}")
        return
    
    print(f"✅ Total records: {len(df):,}")
    print(f"✅ Columns available: {list(df.columns)}")
    
    # Zone analysis
    print("\n=== ZONE ANALYSIS ===")
    zone_counts = df['zone'].value_counts().sort_index()
    print(f"Zones found: {sorted(df['zone'].unique())}")
    print(f"Zone distribution:")
    for zone, count in zone_counts.items():
        print(f"  Zone {zone}: {count:,} records ({count/len(df)*100:.1f}%)")
    
    # Weight analysis
    print("\n=== WEIGHT ANALYSIS ===")
    print(f"Weight range: {df['billable_weight'].min():.3f} to {df['billable_weight'].max():.3f} lbs")
    print(f"Weight distribution:")
    
    # Check weight distribution in the rate table ranges
    weight_ranges = []
    for i in range(1, 16):  # 1oz to 15oz
        min_wt = i/16
        max_wt = (i+1)/16
        count = len(df[(df['billable_weight'] >= min_wt) & (df['billable_weight'] < max_wt)])
        weight_ranges.append(('oz', i, min_wt, max_wt, count))
    
    for i in range(1, 151):  # 1lb to 150lb
        min_wt = i
        max_wt = i+1
        count = len(df[(df['billable_weight'] >= min_wt) & (df['billable_weight'] < max_wt)])
        weight_ranges.append(('lb', i, min_wt, max_wt, count))
    
    # Show weight ranges with data
    ranges_with_data = [r for r in weight_ranges if r[4] > 0]
    print(f"Weight ranges with data: {len(ranges_with_data)} out of {len(weight_ranges)}")
    
    print("\nTop 20 weight ranges with data:")
    for unit, value, min_wt, max_wt, count in sorted(ranges_with_data, key=lambda x: x[4], reverse=True)[:20]:
        print(f"  {value}{unit} ({min_wt:.3f}-{max_wt:.3f} lbs): {count:,} records")
    
    # Zone + Weight combination analysis
    print("\n=== ZONE + WEIGHT COMBINATION ANALYSIS ===")
    
    # Check each zone/weight combination that should be in the rate table
    zone_list = list(range(2, 9))  # Zones 2-8
    total_cells = 0
    cells_with_data = 0
    empty_combinations = []
    
    for i in range(1, 16):  # 1oz to 15oz
        min_wt = i/16
        max_wt = (i+1)/16
        weight_label = f"<= {i}oz"
        
        for zone in zone_list:
            total_cells += 1
            cell_data = df[(df['zone'].astype(str)==str(zone)) & 
                          (df['billable_weight']>=min_wt) & 
                          (df['billable_weight']<max_wt)]
            
            if len(cell_data) > 0:
                cells_with_data += 1
            else:
                empty_combinations.append(f"Zone {zone}, {weight_label}")
    
    for i in range(1, 151):  # 1lb to 150lb
        min_wt = i
        max_wt = i+1
        weight_label = f"<= {i}lb"
        
        for zone in zone_list:
            total_cells += 1
            cell_data = df[(df['zone'].astype(str)==str(zone)) & 
                          (df['billable_weight']>=min_wt) & 
                          (df['billable_weight']<max_wt)]
            
            if len(cell_data) > 0:
                cells_with_data += 1
            else:
                empty_combinations.append(f"Zone {zone}, {weight_label}")
    
    print(f"Total cells in rate table: {total_cells}")
    print(f"Cells with data: {cells_with_data} ({cells_with_data/total_cells*100:.1f}%)")
    print(f"Cells without data: {total_cells - cells_with_data} ({(total_cells - cells_with_data)/total_cells*100:.1f}%)")
    
    # Show some examples of empty combinations
    print(f"\nExamples of empty combinations (first 20):")
    for combo in empty_combinations[:20]:
        print(f"  {combo}")
    
    # Analyze by zone
    print("\n=== DATA BY ZONE ===")
    for zone in zone_list:
        zone_data = df[df['zone'].astype(str)==str(zone)]
        if len(zone_data) > 0:
            print(f"Zone {zone}: {len(zone_data):,} records")
            print(f"  Weight range: {zone_data['billable_weight'].min():.3f} to {zone_data['billable_weight'].max():.3f} lbs")
            print(f"  Rate range: ${zone_data['final_rate'].min():.2f} to ${zone_data['final_rate'].max():.2f}")
        else:
            print(f"Zone {zone}: NO DATA")
    
    # Check for data quality issues
    print("\n=== DATA QUALITY CHECKS ===")
    
    # Check for NaN zones
    nan_zones = df['zone'].isna().sum()
    if nan_zones > 0:
        print(f"❌ {nan_zones} records have NaN zones")
    
    # Check for invalid zones
    valid_zones = set(range(1, 10))  # Zones 1-9
    invalid_zones = set(df['zone'].dropna().unique()) - valid_zones
    if invalid_zones:
        print(f"❌ Invalid zones found: {invalid_zones}")
    
    # Check for extreme weights
    extreme_weights = df[df['billable_weight'] > 150]
    if len(extreme_weights) > 0:
        print(f"⚠️  {len(extreme_weights)} records have weights > 150 lbs (max in rate table)")
    
    # Check for zero/negative weights
    zero_weights = df[df['billable_weight'] <= 0]
    if len(zero_weights) > 0:
        print(f"❌ {len(zero_weights)} records have zero or negative weights")
    
    print("\n=== RECOMMENDATIONS ===")
    if cells_with_data/total_cells < 0.1:
        print("🔴 CRITICAL: Less than 10% of rate table cells have data!")
        print("   This suggests either:")
        print("   1. Zone calculation issues")
        print("   2. Weight distribution problems")
        print("   3. Data filtering issues")
        print("   4. Template/calculation problems")
    
    if len(zone_counts) < 7:
        print(f"⚠️  Only {len(zone_counts)} zones found, expected 7+ zones")
    
    print("\n=== NEXT STEPS ===")
    print("1. Check zone calculation logic in calc_engine.py")
    print("2. Verify weight conversion and billable_weight calculation")
    print("3. Review data filtering that might remove records")
    print("4. Check if template has zone data for all origin/destination combinations")

if __name__ == "__main__":
    # This script should be run after the app has processed data
    # You can import and use the processed DataFrame from the app
    print("Debug script for rate table data analysis")
    print("Run this after processing data in the Streamlit app")
    print("You can copy the processed DataFrame and run this analysis") 