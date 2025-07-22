#!/usr/bin/env python3
"""
Debug script to investigate why EDAS is not being applied.
"""

import os
import pandas as pd
from calc_engine import AmazonRateCalculator

# Path to the template
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "data", "2025 Amazon Quote Tool Template.xlsx")

def debug_edas():
    """Debug EDAS application logic."""
    
    print("=== EDAS Debug Investigation ===\n")
    
    # Load the calculator
    calc = AmazonRateCalculator(TEMPLATE_PATH)
    
    # 1. Check the template data structure
    print("1. Template Data Structure:")
    print(f"   DAS sheet shape: {calc.das_zips.shape}")
    print(f"   DAS sheet columns: {list(calc.das_zips.columns)}")
    
    # 2. Check the first few rows to understand the data
    print("\n2. First 10 rows of DAS sheet:")
    for i in range(min(10, len(calc.das_zips))):
        row = calc.das_zips.iloc[i]
        print(f"   Row {i}: ZIP={row.iloc[0]}, DAS={row.iloc[1]}, EDAS={row.iloc[2]}, Remote={row.iloc[3]}")
    
    # 3. Check how many ZIPs are marked as EDAS in the template
    edas_count = 0
    edas_zips = []
    for _, row in calc.das_zips.iterrows():
        if pd.notna(row.iloc[0]):
            zip_code = str(row.iloc[0]).strip()
            if zip_code.isdigit():
                zip_5digit = zip_code.zfill(5)[:5]
                if pd.notna(row.iloc[2]) and str(row.iloc[2]).strip() == "Yes":
                    edas_count += 1
                    edas_zips.append(zip_5digit)
                    if len(edas_zips) <= 10:  # Show first 10
                        print(f"   Found EDAS ZIP: {zip_5digit}")
    
    print(f"\n3. EDAS ZIPs in template: {edas_count} total")
    print(f"   First 10 EDAS ZIPs: {edas_zips[:10]}")
    
    # 4. Check the dictionaries loaded by the calculator
    print(f"\n4. Calculator dictionaries:")
    print(f"   DAS dict entries: {len(calc.das_zips_dict)}")
    print(f"   EDAS dict entries: {len(calc.edas_zips_dict)}")
    print(f"   Remote dict entries: {len(calc.remote_zips_dict)}")
    
    # 5. Check how many True values in each dictionary
    das_true = sum(calc.das_zips_dict.values())
    edas_true = sum(calc.edas_zips_dict.values())
    remote_true = sum(calc.remote_zips_dict.values())
    
    print(f"\n5. True values in dictionaries:")
    print(f"   DAS True: {das_true}")
    print(f"   EDAS True: {edas_true}")
    print(f"   Remote True: {remote_true}")
    
    # 6. Test some specific EDAS ZIPs from the template
    print(f"\n6. Testing specific EDAS ZIPs from template:")
    for zip_code in edas_zips[:5]:
        surcharges = calc.apply_surcharges(10.0, zip_code, 1.0, 'box')
        applied = "None"
        if surcharges['remote_surcharge'] > 0:
            applied = "Remote"
        elif surcharges['edas_surcharge'] > 0:
            applied = "EDAS"
        elif surcharges['das_surcharge'] > 0:
            applied = "DAS"
        
        print(f"   ZIP {zip_code}: {applied} (DAS=${surcharges['das_surcharge']}, EDAS=${surcharges['edas_surcharge']}, Remote=${surcharges['remote_surcharge']})")
    
    # 7. Check if any ZIPs from the user's file should be EDAS
    print(f"\n7. Checking user file ZIPs against EDAS list:")
    user_file = "/Users/jasonbabb/Desktop/solbrush amazon june - there data/SOLBRUSH AMAZON SHIPPING TRANSACTIONS/Quote /SolBrush Amazon Rate DownloadAmazon Only .csv"
    
    user_zips = set()
    with open(user_file, 'r') as f:
        import csv
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if i >= 1000:  # Check first 1000 rows
                break
            zip_code = row.get('Ship Postal Code', '').strip()
            if zip_code and zip_code.isdigit():
                zip_5digit = zip_code.zfill(5)[:5]
                user_zips.add(zip_5digit)
    
    # Check which user ZIPs are in the EDAS list
    user_edas_zips = user_zips.intersection(set(edas_zips))
    print(f"   User file has {len(user_zips)} unique ZIPs")
    print(f"   {len(user_edas_zips)} user ZIPs are in EDAS list")
    if user_edas_zips:
        print(f"   User EDAS ZIPs: {list(user_edas_zips)[:10]}")
    else:
        print(f"   No user ZIPs match EDAS list")
    
    # 8. Test a few user ZIPs that should be EDAS
    if user_edas_zips:
        print(f"\n8. Testing user ZIPs that should be EDAS:")
        for zip_code in list(user_edas_zips)[:5]:
            surcharges = calc.apply_surcharges(10.0, zip_code, 1.0, 'box')
            applied = "None"
            if surcharges['remote_surcharge'] > 0:
                applied = "Remote"
            elif surcharges['edas_surcharge'] > 0:
                applied = "EDAS"
            elif surcharges['das_surcharge'] > 0:
                applied = "DAS"
            
            print(f"   ZIP {zip_code}: {applied} (DAS=${surcharges['das_surcharge']}, EDAS=${surcharges['edas_surcharge']}, Remote=${surcharges['remote_surcharge']})")

if __name__ == "__main__":
    debug_edas() 