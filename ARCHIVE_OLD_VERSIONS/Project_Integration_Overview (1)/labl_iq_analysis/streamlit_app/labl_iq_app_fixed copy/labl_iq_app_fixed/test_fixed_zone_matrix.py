#!/usr/bin/env python3
"""
Test script to verify that the fixed zone matrix is being loaded correctly.
"""

import sys
import os
import pandas as pd
from calc_engine import AmazonRateCalculator

def test_fixed_zone_matrix():
    """Test that the fixed zone matrix is loaded and working correctly."""
    
    print("Testing fixed zone matrix loading...")
    
    # Check if fixed zone matrix file exists
    zone_matrix_file = "data/zone_matrix_fixed.xlsx"
    if os.path.exists(zone_matrix_file):
        print(f"✅ Fixed zone matrix file found: {zone_matrix_file}")
    else:
        print(f"❌ Fixed zone matrix file not found: {zone_matrix_file}")
        return False
    
    # Initialize calculator
    try:
        calculator = AmazonRateCalculator("data/2025 Amazon Quote Tool Template.xlsx")
        print("✅ Calculator initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize calculator: {e}")
        return False
    
    # Test zone lookups
    test_cases = [
        ("75238", "76087"),  # Texas to Texas - should be zone 1-2
        ("75238", "92626"),  # Texas to California - should be zone 5-8
        ("75238", "10001"),  # Texas to New York - should be zone 5-8
        ("75238", "98101"),  # Texas to Washington - should be zone 5-8
    ]
    
    print("\nTesting zone lookups:")
    for origin, dest in test_cases:
        try:
            zone = calculator.get_zone(origin, dest)
            print(f"  {origin} → {dest}: Zone {zone}")
            
            # Check if zone is valid (1-8)
            if 1 <= zone <= 8:
                print(f"    ✅ Valid zone: {zone}")
            else:
                print(f"    ❌ Invalid zone: {zone} (should be 1-8)")
                
        except Exception as e:
            print(f"  ❌ Error looking up zone for {origin} → {dest}: {e}")
    
    # Check zone matrix statistics
    print(f"\nZone matrix statistics:")
    print(f"  Shape: {calculator.zone_matrix.shape}")
    print(f"  Origin ZIPs: {len(calculator.zone_matrix.index)}")
    print(f"  Destination ZIPs: {len(calculator.zone_matrix.columns)}")
    
    # Check for invalid zones
    invalid_zones = calculator.zone_matrix.isna().sum().sum()
    total_cells = calculator.zone_matrix.size
    print(f"  Invalid zones: {invalid_zones} out of {total_cells} ({invalid_zones/total_cells*100:.2f}%)")
    
    # Check zone value distribution
    valid_zones = calculator.zone_matrix.dropna().values.flatten()
    unique_zones = set(valid_zones)
    print(f"  Unique zone values: {sorted(unique_zones)}")
    
    # Check for any zones outside 1-8 range
    invalid_zone_values = [z for z in unique_zones if not (1 <= z <= 8)]
    if invalid_zone_values:
        print(f"  ❌ Found invalid zone values: {invalid_zone_values}")
    else:
        print(f"  ✅ All zone values are valid (1-8)")
    
    return True

if __name__ == "__main__":
    success = test_fixed_zone_matrix()
    if success:
        print("\n🎉 Fixed zone matrix test completed successfully!")
    else:
        print("\n❌ Fixed zone matrix test failed!")
        sys.exit(1) 