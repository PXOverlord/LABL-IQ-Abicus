#!/usr/bin/env python3
"""
Simple test to check EDAS lookup logic.
"""

import os
from calc_engine import AmazonRateCalculator

# Path to the template
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "data", "2025 Amazon Quote Tool Template.xlsx")

def test_edas_lookup():
    """Test EDAS lookup logic."""
    
    print("=== EDAS Lookup Test ===\n")
    
    # Load the calculator
    calc = AmazonRateCalculator(TEMPLATE_PATH)
    
    # Test some known EDAS ZIPs from the debug output
    test_zips = ['01005', '01008', '01011', '65248', '84521', '76430']
    
    for zip_code in test_zips:
        print(f"Testing ZIP: {zip_code}")
        
        # Check if ZIP is in dictionaries
        in_das = zip_code in calc.das_zips_dict
        in_edas = zip_code in calc.edas_zips_dict
        in_remote = zip_code in calc.remote_zips_dict
        
        print(f"  In DAS dict: {in_das} (value: {calc.das_zips_dict.get(zip_code, 'NOT FOUND')})")
        print(f"  In EDAS dict: {in_edas} (value: {calc.edas_zips_dict.get(zip_code, 'NOT FOUND')})")
        print(f"  In Remote dict: {in_remote} (value: {calc.remote_zips_dict.get(zip_code, 'NOT FOUND')})")
        
        # Test the apply_surcharges method
        surcharges = calc.apply_surcharges(10.0, zip_code, 1.0, 'box')
        print(f"  Surcharges applied: DAS=${surcharges['das_surcharge']}, EDAS=${surcharges['edas_surcharge']}, Remote=${surcharges['remote_surcharge']}")
        
        # Determine what was applied
        applied = "None"
        if surcharges['remote_surcharge'] > 0:
            applied = "Remote"
        elif surcharges['edas_surcharge'] > 0:
            applied = "EDAS"
        elif surcharges['das_surcharge'] > 0:
            applied = "DAS"
        
        print(f"  Applied: {applied}")
        print()

if __name__ == "__main__":
    test_edas_lookup() 