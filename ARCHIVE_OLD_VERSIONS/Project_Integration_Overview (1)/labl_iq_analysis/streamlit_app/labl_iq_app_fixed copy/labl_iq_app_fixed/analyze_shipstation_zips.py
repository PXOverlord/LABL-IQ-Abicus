#!/usr/bin/env python3
"""
Analyze ShipStation file ZIP codes and check if they match the zone matrix prefixes.
"""

import pandas as pd
import os
from calc_engine import AmazonRateCalculator

def analyze_shipstation_zips():
    """Analyze ZIP codes in the ShipStation file and check zone matrix matches."""
    
    print("=== SHIPSTATION ZIP CODE ANALYSIS ===\n")
    
    # Find the ShipStation file
    shipstation_files = []
    for file in os.listdir("."):
        if ("shipstation" in file.lower() or "ship" in file.lower()) and not file.endswith('.py'):
            shipstation_files.append(file)
    
    if not shipstation_files:
        print("❌ No ShipStation files found in current directory")
        print("Please provide the exact filename or upload the file")
        return
    
    print(f"Found potential ShipStation files: {shipstation_files}")
    
    # Try to load the first one
    filename = shipstation_files[0]
    print(f"\nLoading: {filename}")
    
    try:
        # Try different file formats
        if filename.endswith('.csv'):
            df = pd.read_csv(filename)
        elif filename.endswith('.xlsx') or filename.endswith('.xls'):
            df = pd.read_excel(filename)
        else:
            print(f"❌ Unsupported file format: {filename}")
            return
            
        print(f"✅ Loaded file with shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        
        # Look for ZIP code columns
        zip_columns = []
        for col in df.columns:
            if any(zip_word in col.lower() for zip_word in ['zip', 'postal', 'code']):
                zip_columns.append(col)
        
        print(f"\nZIP code columns found: {zip_columns}")
        
        if not zip_columns:
            print("❌ No ZIP code columns found")
            print("Available columns:")
            for col in df.columns:
                print(f"  - {col}")
            return
        
        # Analyze ZIP codes
        for col in zip_columns:
            print(f"\n=== ANALYZING COLUMN: {col} ===")
            
            # Get unique ZIP codes
            unique_zips = df[col].dropna().unique()
            print(f"Unique ZIP codes: {len(unique_zips)}")
            
            # Show sample ZIP codes
            sample_zips = unique_zips[:10]
            print(f"Sample ZIP codes: {list(sample_zips)}")
            
            # Check ZIP code formats
            zip_lengths = [len(str(zip_code)) for zip_code in sample_zips]
            print(f"ZIP code lengths: {zip_lengths}")
            
            # Standardize ZIP codes using the calc_engine
            calculator = AmazonRateCalculator("data/2025 Amazon Quote Tool Template.xlsx")
            
            standardized_zips = []
            for zip_code in sample_zips:
                try:
                    std_zip = calculator.standardize_zip(str(zip_code))
                    standardized_zips.append(std_zip)
                except:
                    standardized_zips.append("ERROR")
            
            print(f"Standardized ZIP codes: {standardized_zips}")
            
            # Check if standardized ZIPs exist in zone matrix
            zone_matrix = calculator.zone_matrix
            print(f"\nZone matrix shape: {zone_matrix.shape}")
            print(f"Zone matrix index (origin ZIPs): {list(zone_matrix.index)[:10]}...")
            print(f"Zone matrix columns (dest ZIPs): {list(zone_matrix.columns)[:10]}...")
            
            matches = 0
            total_checked = 0
            
            for std_zip in standardized_zips:
                if std_zip != "ERROR":
                    total_checked += 1
                    if std_zip in zone_matrix.index or std_zip in zone_matrix.columns:
                        matches += 1
            
            if total_checked > 0:
                match_rate = matches / total_checked * 100
                print(f"\nZIP prefix match rate: {match_rate:.1f}% ({matches}/{total_checked})")
                
                if match_rate < 50:
                    print("⚠️  WARNING: Low match rate - this explains the high default rate!")
                    print("   The ZIP codes in your file don't match the zone matrix prefixes")
                else:
                    print("✅ Good match rate - the issue might be elsewhere")
        
    except Exception as e:
        print(f"❌ Error loading file: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    analyze_shipstation_zips() 