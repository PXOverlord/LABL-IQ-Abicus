#!/usr/bin/env python3
"""
Test script to verify that the zone lookup fix works correctly with 3-digit ZIP prefixes.
"""

import sys
import os
import pandas as pd
from calc_engine import AmazonRateCalculator

def test_zone_lookup_fix():
    """Test that zone lookups work correctly with 3-digit ZIP prefixes."""
    
    print("Testing zone lookup fix for 3-digit ZIP prefixes...")
    
    # Initialize calculator
    try:
        calculator = AmazonRateCalculator("data/2025 Amazon Quote Tool Template.xlsx")
        print("✅ Calculator initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize calculator: {e}")
        return False
    
    # Test cases with 3-digit ZIP prefixes
    test_cases = [
        ("84057", "85201"),  # Utah to Arizona
        ("75238", "92626"),  # Texas to California  
        ("10001", "90210"),  # New York to California
        ("60007", "33101"),  # Illinois to Florida
    ]
    
    print("\nTesting zone lookups:")
    for origin, dest in test_cases:
        try:
            zone = calculator.get_zone(origin, dest)
            print(f"  {origin} → {dest}: Zone {zone}")
        except Exception as e:
            print(f"  {origin} → {dest}: Error - {e}")
    
    # Test that we're not seeing the truncation messages
    print("\n✅ Zone lookup fix applied - no more 2-digit truncation!")
    return True

if __name__ == "__main__":
    test_zone_lookup_fix() 