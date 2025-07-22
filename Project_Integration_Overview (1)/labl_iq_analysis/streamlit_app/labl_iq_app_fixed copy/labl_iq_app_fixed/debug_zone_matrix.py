#!/usr/bin/env python3
"""
Debug script to examine the zone matrix and understand zone lookup issues.
"""

import pandas as pd
import os
import sys

def debug_zone_matrix(template_file="data/2025 Amazon Quote Tool Template.xlsx"):
    """Debug the zone matrix to understand lookup issues."""
    
    print("=== ZONE MATRIX DEBUG ===\n")
    
    try:
        # Load the zone matrix
        print(f"Loading zone matrix from: {template_file}")
        zone_matrix = pd.read_excel(template_file, sheet_name='UPS Zone matrix_April 2024')
        
        print(f"Zone matrix shape: {zone_matrix.shape}")
        print(f"Zone matrix columns: {list(zone_matrix.columns)}")
        
        # Set the first column as index (origin ZIPs)
        zone_matrix.set_index('Unnamed: 0', inplace=True)
        
        # Convert all values to numeric, replacing non-numeric with NaN
        zone_matrix = zone_matrix.apply(pd.to_numeric, errors='coerce')
        
        print(f"\nZone matrix index (origin ZIPs): {list(zone_matrix.index)}")
        print(f"Zone matrix columns (destination ZIPs): {list(zone_matrix.columns)}")
        
        # Check for specific ZIP prefixes that might be causing issues
        test_origin = "752"  # From your logs
        test_destinations = ["760", "599", "926", "852", "604"]  # From your logs
        
        print(f"\n=== TESTING ZIP PREFIX LOOKUPS ===")
        print(f"Testing origin ZIP prefix: {test_origin}")
        
        # Check if origin exists
        if test_origin in zone_matrix.index:
            print(f"✅ Origin ZIP prefix '{test_origin}' found in matrix")
        else:
            print(f"❌ Origin ZIP prefix '{test_origin}' NOT found in matrix")
            print(f"Available origin prefixes: {list(zone_matrix.index)}")
            
            # Look for similar prefixes
            similar_origins = [prefix for prefix in zone_matrix.index if str(prefix).startswith(test_origin[:2])]
            if similar_origins:
                print(f"Similar origin prefixes starting with '{test_origin[:2]}': {similar_origins}")
            else:
                print(f"No similar origin prefixes found")
        
        # Test destination lookups
        print(f"\nTesting destination ZIP prefixes:")
        for dest in test_destinations:
            if dest in zone_matrix.columns:
                print(f"✅ Destination ZIP prefix '{dest}' found in matrix")
            else:
                print(f"❌ Destination ZIP prefix '{dest}' NOT found in matrix")
                
                # Look for similar prefixes
                similar_dests = [prefix for prefix in zone_matrix.columns if str(prefix).startswith(dest[:2])]
                if similar_dests:
                    print(f"  Similar destination prefixes starting with '{dest[:2]}': {similar_dests}")
                else:
                    print(f"  No similar destination prefixes found")
        
        # Test actual zone lookups
        print(f"\n=== TESTING ACTUAL ZONE LOOKUPS ===")
        
        # Test with the origin that's being used (75)
        test_origin_actual = "75"
        if test_origin_actual in zone_matrix.index:
            print(f"✅ Origin ZIP prefix '{test_origin_actual}' found in matrix")
            
            for dest in test_destinations:
                if dest in zone_matrix.columns:
                    zone = zone_matrix.loc[test_origin_actual, dest]
                    if pd.isna(zone):
                        print(f"❌ Zone lookup for {test_origin_actual} to {dest}: NaN (defaulting to zone 8)")
                    else:
                        print(f"✅ Zone lookup for {test_origin_actual} to {dest}: Zone {zone}")
                else:
                    print(f"❌ Destination {dest} not found in matrix (defaulting to zone 8)")
        else:
            print(f"❌ Origin ZIP prefix '{test_origin_actual}' NOT found in matrix")
        
        # Analyze the zone matrix structure
        print(f"\n=== ZONE MATRIX ANALYSIS ===")
        
        # Check for NaN values
        nan_count = zone_matrix.isna().sum().sum()
        total_cells = zone_matrix.size
        print(f"Total cells in matrix: {total_cells}")
        print(f"NaN cells: {nan_count} ({nan_count/total_cells*100:.1f}%)")
        print(f"Valid cells: {total_cells - nan_count} ({(total_cells - nan_count)/total_cells*100:.1f}%)")
        
        # Check zone distribution
        valid_zones = zone_matrix.dropna().values.flatten()
        unique_zones = sorted(set(valid_zones))
        print(f"Unique zones in matrix: {unique_zones}")
        
        # Count zones
        zone_counts = {}
        for zone in valid_zones:
            zone_counts[zone] = zone_counts.get(zone, 0) + 1
        
        print(f"Zone distribution:")
        for zone in sorted(zone_counts.keys()):
            print(f"  Zone {zone}: {zone_counts[zone]:,} cells")
        
        # Check for common ZIP prefixes
        print(f"\n=== COMMON ZIP PREFIXES ===")
        print(f"Most common origin prefixes:")
        origin_counts = zone_matrix.index.value_counts().head(10)
        for prefix, count in origin_counts.items():
            print(f"  {prefix}: {count} destinations")
        
        print(f"\nMost common destination prefixes:")
        dest_counts = zone_matrix.columns.value_counts().head(10)
        for prefix, count in dest_counts.items():
            print(f"  {prefix}: {count} origins")
        
        # Recommendations
        print(f"\n=== RECOMMENDATIONS ===")
        
        if test_origin not in zone_matrix.index:
            print(f"🔴 CRITICAL: Your origin ZIP prefix '{test_origin}' is not in the zone matrix!")
            print(f"   This is why many shipments are defaulting to zone 8.")
            print(f"   The zone matrix only has these origin prefixes: {list(zone_matrix.index)}")
            
            # Suggest alternatives
            similar_origins = [prefix for prefix in zone_matrix.index if str(prefix).startswith(test_origin[:2])]
            if similar_origins:
                print(f"   Consider using one of these similar prefixes: {similar_origins}")
        
        if nan_count > total_cells * 0.5:
            print(f"⚠️  WARNING: Over 50% of zone matrix cells are NaN")
            print(f"   This suggests the zone matrix may be incomplete or corrupted")
        
        print(f"\n=== NEXT STEPS ===")
        print(f"1. Check if your origin ZIP should be in the zone matrix")
        print(f"2. Verify the zone matrix template is complete and up-to-date")
        print(f"3. Consider using a different origin ZIP that exists in the matrix")
        print(f"4. Update the zone matrix to include your ZIP prefix if needed")
        
    except Exception as e:
        print(f"❌ Error loading zone matrix: {e}")
        return

if __name__ == "__main__":
    # Use command line argument if provided, otherwise use default
    template_file = sys.argv[1] if len(sys.argv) > 1 else "data/2025 Amazon Quote Tool Template.xlsx"
    debug_zone_matrix(template_file) 