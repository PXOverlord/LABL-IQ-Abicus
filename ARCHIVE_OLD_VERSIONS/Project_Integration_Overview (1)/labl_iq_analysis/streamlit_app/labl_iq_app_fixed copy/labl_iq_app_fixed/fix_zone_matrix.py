#!/usr/bin/env python3
"""
Script to fix the zone matrix by replacing invalid zone values with reasonable defaults.
"""

import pandas as pd
import numpy as np
import os
import sys

def fix_zone_matrix(template_file="data/2025 Amazon Quote Tool Template.xlsx", output_file="data/zone_matrix_fixed.xlsx"):
    """Fix the zone matrix by replacing invalid zones with reasonable defaults and save as a new file."""
    
    print("=== FIXING ZONE MATRIX ===\n")
    
    try:
        # Load the zone matrix
        print(f"Loading zone matrix from: {template_file}")
        zone_matrix = pd.read_excel(template_file, sheet_name='UPS Zone matrix_April 2024')
        
        print(f"Original zone matrix shape: {zone_matrix.shape}")
        
        # Set the first column as index (origin ZIPs)
        zone_matrix.set_index('Unnamed: 0', inplace=True)
        
        # Check for invalid zones BEFORE numeric conversion
        print(f"\n=== ANALYZING RAW ZONE VALUES ===")
        
        # Get all unique values in the matrix
        all_values = []
        for col in zone_matrix.columns:
            values = zone_matrix[col].dropna().values
            all_values.extend(values)
        
        unique_values = sorted(set(all_values))
        print(f"All unique values found: {unique_values}")
        
        # Identify invalid zones (should be 1-8 for UPS)
        valid_zone_range = set(range(1, 9))  # Zones 1-8
        invalid_zones = set(unique_values) - valid_zone_range
        print(f"Invalid zones found: {invalid_zones}")
        
        if not invalid_zones:
            print("✅ No invalid zones found - zone matrix is already correct!")
            # Save a copy anyway
            zone_matrix.reset_index().to_excel(output_file, sheet_name='UPS Zone matrix_April 2024', index=False)
            print(f"✅ Zone matrix copied to {output_file}")
            return
        
        # Count occurrences of invalid zones
        print(f"\n=== COUNTING INVALID ZONES ===")
        for invalid_zone in sorted(invalid_zones):
            count = (zone_matrix == invalid_zone).sum().sum()
            print(f"Zone {invalid_zone}: {count:,} occurrences")
        
        # Create a mapping for invalid zones to valid zones
        print(f"\n=== CREATING ZONE MAPPING ===")
        zone_mapping = {}
        
        # Map invalid zones to reasonable defaults based on typical UPS zone patterns
        for invalid_zone in invalid_zones:
            if invalid_zone > 8:
                # High zone numbers -> map to zone 8 (farthest)
                zone_mapping[invalid_zone] = 8
                print(f"Mapping zone {invalid_zone} -> zone 8 (farthest)")
            elif invalid_zone < 1:
                # Low zone numbers -> map to zone 2 (local/close)
                zone_mapping[invalid_zone] = 2
                print(f"Mapping zone {invalid_zone} -> zone 2 (local)")
            else:
                # Other invalid zones -> map to zone 5 (mid-range)
                zone_mapping[invalid_zone] = 5
                print(f"Mapping zone {invalid_zone} -> zone 5 (mid-range)")
        
        # Apply the mapping
        print(f"\n=== APPLYING ZONE MAPPING ===")
        total_fixed = 0
        for invalid_zone, valid_zone in zone_mapping.items():
            mask = zone_matrix == invalid_zone
            count = mask.sum().sum()
            zone_matrix[mask] = valid_zone
            total_fixed += count
            print(f"Fixed {count:,} cells: zone {invalid_zone} -> zone {valid_zone}")
        
        print(f"Total cells fixed: {total_fixed:,}")
        
        # Now convert to numeric after fixing
        print(f"\n=== CONVERTING TO NUMERIC AFTER FIX ===")
        zone_matrix = zone_matrix.apply(pd.to_numeric, errors='coerce')
        
        # Verify the fix
        print(f"\n=== VERIFYING FIX ===")
        valid_zones_after = zone_matrix.dropna().values.flatten()
        unique_zones_after = sorted(set(valid_zones_after))
        print(f"Unique zone values after fix: {unique_zones_after}")
        
        invalid_zones_after = set(unique_zones_after) - valid_zone_range
        if not invalid_zones_after:
            print("✅ All zones are now valid!")
        else:
            print(f"❌ Still have invalid zones: {invalid_zones_after}")
        
        # Count zones after fix
        zone_counts = {}
        for zone in valid_zones_after:
            zone_counts[zone] = zone_counts.get(zone, 0) + 1
        
        print(f"\nZone distribution after fix:")
        for zone in sorted(zone_counts.keys()):
            print(f"  Zone {zone}: {zone_counts[zone]:,} cells")
        
        # Test specific lookups
        print(f"\n=== TESTING SPECIFIC LOOKUPS ===")
        test_cases = [
            ("752", "760"),  # Your origin to a destination
            ("75", "76"),    # Similar prefixes
            ("4", "5"),      # Low zones
            ("8", "9"),      # High zones
        ]
        
        for origin, dest in test_cases:
            if origin in zone_matrix.index and dest in zone_matrix.columns:
                zone = zone_matrix.loc[origin, dest]
                if pd.isna(zone):
                    print(f"❌ {origin} to {dest}: NaN")
                else:
                    print(f"✅ {origin} to {dest}: Zone {zone}")
            else:
                print(f"❌ {origin} or {dest} not found in matrix")
        
        # Save the fixed matrix as a new Excel file
        print(f"\n=== SAVING FIXED MATRIX TO NEW FILE ===")
        zone_matrix.reset_index().to_excel(output_file, sheet_name='UPS Zone matrix_April 2024', index=False)
        print(f"✅ Fixed zone matrix saved to {output_file}")
        
        # Create a summary report
        summary_file = "zone_matrix_fix_summary.txt"
        with open(summary_file, 'w') as f:
            f.write("ZONE MATRIX FIX SUMMARY\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Original invalid zones: {invalid_zones}\n")
            f.write(f"Zone mapping applied:\n")
            for invalid_zone, valid_zone in zone_mapping.items():
                f.write(f"  Zone {invalid_zone} -> Zone {valid_zone}\n")
            f.write(f"\nTotal cells fixed: {total_fixed:,}\n")
            f.write(f"Final zone distribution:\n")
            for zone in sorted(zone_counts.keys()):
                f.write(f"  Zone {zone}: {zone_counts[zone]:,} cells\n")
        
        print(f"✅ Summary saved to {summary_file}")
        
        print(f"\n=== NEXT STEPS ===")
        print(f"1. The fixed zone matrix is saved as {output_file}")
        print(f"2. Review the file and, if correct, use it in your app")
        print(f"3. The original template is preserved and unchanged")
        print(f"4. Check the summary file for details on what was fixed")
        
    except Exception as e:
        print(f"❌ Error fixing zone matrix: {e}")
        import traceback
        traceback.print_exc()
        return

if __name__ == "__main__":
    # Use command line argument if provided, otherwise use default
    template_file = sys.argv[1] if len(sys.argv) > 1 else "data/2025 Amazon Quote Tool Template.xlsx"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "data/zone_matrix_fixed.xlsx"
    fix_zone_matrix(template_file, output_file) 