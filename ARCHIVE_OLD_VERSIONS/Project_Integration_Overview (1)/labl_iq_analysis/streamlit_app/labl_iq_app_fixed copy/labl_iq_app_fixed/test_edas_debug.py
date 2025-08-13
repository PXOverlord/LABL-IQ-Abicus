#!/usr/bin/env python3
"""
Detailed debug script to trace EDAS logic.
"""

import os
from calc_engine import AmazonRateCalculator

# Path to the template
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "data", "2025 Amazon Quote Tool Template.xlsx")

def debug_edas_logic():
    """Debug the exact EDAS logic step by step."""
    
    print("=== Detailed EDAS Logic Debug ===\n")
    
    # Load the calculator
    calc = AmazonRateCalculator(TEMPLATE_PATH)
    
    # Test a known EDAS ZIP
    test_zip = "01005"
    
    print(f"Testing ZIP: {test_zip}")
    
    # Step 1: Check if ZIP is in dictionaries
    print(f"1. Dictionary checks:")
    print(f"   In EDAS dict: {test_zip in calc.edas_zips_dict}")
    print(f"   EDAS value: {calc.edas_zips_dict.get(test_zip, 'NOT FOUND')}")
    print(f"   In Remote dict: {test_zip in calc.remote_zips_dict}")
    print(f"   Remote value: {calc.remote_zips_dict.get(test_zip, 'NOT FOUND')}")
    
    # Step 2: Check the standardize_zip method
    print(f"\n2. ZIP standardization:")
    try:
        zip_prefix = calc.standardize_zip(test_zip)
        print(f"   Original ZIP: {test_zip}")
        print(f"   Standardized prefix: {zip_prefix}")
        print(f"   5-digit version: {zip_prefix.zfill(5)[:5]}")
    except Exception as e:
        print(f"   Error in standardize_zip: {e}")
    
    # Step 3: Manually trace the apply_surcharges logic
    print(f"\n3. Manual logic trace:")
    
    # Simulate the logic from apply_surcharges
    dest_zip_str = test_zip
    zip_prefix = calc.standardize_zip(dest_zip_str)
    zip_5digit = zip_prefix.zfill(5)[:5]
    
    print(f"   dest_zip_str: {dest_zip_str}")
    print(f"   zip_prefix: {zip_prefix}")
    print(f"   zip_5digit: {zip_5digit}")
    
    # Check Remote conditions
    remote_applied = False
    print(f"\n   Remote checks:")
    print(f"   - zip_prefix == 'INT': {zip_prefix == 'INT'}")
    print(f"   - zip_prefix.isdigit() and zip_prefix.startswith('9'): {zip_prefix.isdigit() and zip_prefix.startswith('9')}")
    print(f"   - zip_5digit in remote_dict: {zip_5digit in calc.remote_zips_dict}")
    if zip_5digit in calc.remote_zips_dict:
        print(f"   - remote_dict[zip_5digit]: {calc.remote_zips_dict[zip_5digit]}")
    
    if zip_prefix == "INT":
        print(f"   -> Remote applied (international)")
        remote_applied = True
    elif zip_prefix.isdigit() and zip_prefix.startswith('9'):
        print(f"   -> Remote applied (starts with 9)")
        remote_applied = True
    elif zip_5digit and zip_5digit in calc.remote_zips_dict and calc.remote_zips_dict[zip_5digit]:
        print(f"   -> Remote applied (in remote dict)")
        remote_applied = True
    else:
        print(f"   -> Remote NOT applied")
    
    print(f"   remote_applied: {remote_applied}")
    
    # Check EDAS conditions
    print(f"\n   EDAS checks:")
    print(f"   - not remote_applied: {not remote_applied}")
    print(f"   - zip_5digit exists: {zip_5digit is not None}")
    print(f"   - zip_5digit in edas_dict: {zip_5digit in calc.edas_zips_dict}")
    if zip_5digit in calc.edas_zips_dict:
        print(f"   - edas_dict[zip_5digit]: {calc.edas_zips_dict[zip_5digit]}")
    
    if not remote_applied and zip_5digit:
        if zip_5digit in calc.edas_zips_dict and calc.edas_zips_dict[zip_5digit]:
            print(f"   -> EDAS should be applied!")
            edas_amount = calc.criteria_values.get('edas_surcharge', 3.92)
            print(f"   -> EDAS amount: ${edas_amount}")
        else:
            print(f"   -> EDAS NOT applied (not in dict or value is False)")
    else:
        print(f"   -> EDAS NOT applied (remote_applied={remote_applied} or no zip_5digit)")
    
    # Step 4: Test the actual method
    print(f"\n4. Actual method result:")
    surcharges = calc.apply_surcharges(10.0, test_zip, 1.0, 'box')
    print(f"   DAS: ${surcharges['das_surcharge']}")
    print(f"   EDAS: ${surcharges['edas_surcharge']}")
    print(f"   Remote: ${surcharges['remote_surcharge']}")

if __name__ == "__main__":
    debug_edas_logic() 