#!/usr/bin/env python3
"""
Test script to verify surcharge logic is working correctly.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from calc_engine import AmazonRateCalculator

def test_surcharge_logic():
    """Test the surcharge priority logic."""
    
    # Initialize calculator with correct template path
    template_path = os.path.join(os.path.dirname(__file__), "data", "2025 Amazon Quote Tool Template.xlsx")
    calculator = AmazonRateCalculator(template_path)
    
    # Test cases with different ZIP codes
    test_cases = [
        ("92626", "Remote area ZIP starting with 9"),
        ("76087", "DAS eligible ZIP"),
        ("90210", "Remote area ZIP starting with 9"),
        ("12345", "Regular ZIP (no surcharges)"),
        ("E3G7P6", "Canadian postal code (should get Remote)"),
    ]
    
    print("Testing Surcharge Logic:")
    print("=" * 50)
    
    for zip_code, description in test_cases:
        print(f"\nTesting {zip_code} ({description}):")
        
        # Apply surcharges to a base rate
        base_rate = 10.0
        surcharges = calculator.apply_surcharges(base_rate, zip_code, 1.0, 'box')
        
        print(f"  Base Rate: ${base_rate}")
        print(f"  Fuel Surcharge: ${surcharges['fuel_surcharge']}")
        print(f"  DAS Surcharge: ${surcharges['das_surcharge']}")
        print(f"  EDAS Surcharge: ${surcharges['edas_surcharge']}")
        print(f"  Remote Surcharge: ${surcharges['remote_surcharge']}")
        print(f"  Total Surcharges: ${surcharges['total_surcharges']}")
        
        # Check that only one surcharge type is applied
        surcharge_types = []
        if surcharges['das_surcharge'] > 0:
            surcharge_types.append("DAS")
        if surcharges['edas_surcharge'] > 0:
            surcharge_types.append("EDAS")
        if surcharges['remote_surcharge'] > 0:
            surcharge_types.append("Remote")
            
        if len(surcharge_types) > 1:
            print(f"  ❌ ERROR: Multiple surcharge types applied: {surcharge_types}")
        elif len(surcharge_types) == 1:
            print(f"  ✅ Correct: Applied {surcharge_types[0]} only")
        else:
            print(f"  ✅ Correct: No delivery surcharges applied")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    test_surcharge_logic() 