#!/usr/bin/env python3
"""
Zone Matrix Lookup Test Script

Tests the fixed zone matrix calculation logic with various ZIP code combinations.
"""

import sys
import os
import pandas as pd

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'labl_iq_hybrid_backend', 'app'))

from services.calc_engine import AmazonRateCalculator
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_zone_calculations():
    """Test zone calculations with various ZIP code combinations."""
    
    print("=" * 60)
    print("ZONE MATRIX LOOKUP TEST")
    print("=" * 60)
    
    try:
        # Initialize the calculator
        print("Initializing rate calculator...")
        calculator = AmazonRateCalculator()
        
        print(f"Zone matrix shape: {calculator.zone_matrix.shape}")
        print(f"Zone matrix data type: {calculator.zone_matrix.dtypes.iloc[0]}")
        
        # Test cases: (origin_zip, dest_zip, expected_description)
        test_cases = [
            ("10001", "90210", "NYC to Beverly Hills"),
            ("60601", "33101", "Chicago to Miami"),
            ("94102", "02101", "San Francisco to Boston"),
            ("75201", "98101", "Dallas to Seattle"),
            ("30301", "85001", "Atlanta to Phoenix"),
            ("19101", "80201", "Philadelphia to Denver"),
            ("48201", "97201", "Detroit to Portland"),
            ("55401", "84101", "Minneapolis to Salt Lake City"),
            ("70112", "89101", "New Orleans to Las Vegas"),
            ("32801", "37201", "Orlando to Nashville"),
            # Edge cases
            ("00501", "99950", "Lowest to highest ZIP"),
            ("123", "456", "3-digit ZIPs"),
            ("12345-6789", "98765-4321", "ZIP+4 format"),
            ("INVALID", "90210", "Invalid origin"),
            ("10001", "INVALID", "Invalid destination"),
            ("", "90210", "Empty origin"),
            ("10001", "", "Empty destination"),
            ("K1A0A6", "90210", "Canadian postal code"),
            ("10001", "SW1A1AA", "UK postal code"),
        ]
        
        print("\nTesting zone lookups:")
        print("-" * 60)
        print(f"{'Origin':<12} {'Destination':<12} {'Zone':<4} {'Description'}")
        print("-" * 60)
        
        for origin, dest, description in test_cases:
            try:
                zone = calculator.get_zone(origin, dest)
                print(f"{origin:<12} {dest:<12} {zone:<4} {description}")
            except Exception as e:
                print(f"{origin:<12} {dest:<12} ERR  {description} - Error: {str(e)}")
        
        # Test zone matrix data integrity
        print("\n" + "=" * 60)
        print("ZONE MATRIX DATA INTEGRITY CHECK")
        print("=" * 60)
        
        # Check for invalid zones
        invalid_zones = calculator.zone_matrix[(calculator.zone_matrix < 1) | (calculator.zone_matrix > 8)]
        invalid_count = invalid_zones.count().sum()
        
        if invalid_count > 0:
            print(f"❌ Found {invalid_count} invalid zones in matrix!")
            print("Sample invalid values:")
            for i, (idx, row) in enumerate(invalid_zones.iterrows()):
                if i >= 5:  # Show only first 5
                    break
                for col, val in row.items():
                    if pd.notna(val) and (val < 1 or val > 8):
                        print(f"  Row {idx}, Col {col}: {val}")
        else:
            print("✅ All zones are valid (1-8)")
        
        # Check data types
        print(f"\nZone matrix data type: {calculator.zone_matrix.dtypes.iloc[0]}")
        
        # Check for NaN values
        nan_count = calculator.zone_matrix.isna().sum().sum()
        total_cells = calculator.zone_matrix.size
        print(f"NaN values: {nan_count} out of {total_cells} ({nan_count/total_cells*100:.1f}%)")
        
        # Sample zone values
        print(f"\nSample zone values from matrix:")
        sample_zones = calculator.zone_matrix.iloc[:5, :5]
        print(sample_zones)
        
        print("\n" + "=" * 60)
        print("TEST COMPLETED SUCCESSFULLY")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = test_zone_calculations()
    sys.exit(0 if success else 1)
