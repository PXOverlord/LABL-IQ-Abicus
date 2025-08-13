#!/usr/bin/env python3
"""
Analyze the density of the fixed zone matrix and print stats about valid/NaN cells, and sample missing pairs.
"""
import pandas as pd
import numpy as np

zone_matrix_file = "data/zone_matrix_fixed.xlsx"
sheet_name = "UPS Zone matrix_April 2024"

print(f"Loading zone matrix from {zone_matrix_file}...")
zone_matrix = pd.read_excel(zone_matrix_file, sheet_name=sheet_name, index_col=0)

print(f"Zone matrix shape: {zone_matrix.shape}")
total_cells = zone_matrix.size
nan_cells = zone_matrix.isna().sum().sum()
valid_cells = total_cells - nan_cells

print(f"Total cells: {total_cells}")
print(f"Valid (non-NaN) cells: {valid_cells}")
print(f"NaN cells: {nan_cells}")
print(f"Percent NaN: {nan_cells/total_cells:.2%}")

# Show a few missing pairs
missing_pairs = []
for i, origin in enumerate(zone_matrix.index):
    for j, dest in enumerate(zone_matrix.columns):
        if pd.isna(zone_matrix.loc[origin, dest]):
            missing_pairs.append((origin, dest))
        if len(missing_pairs) >= 10:
            break
    if len(missing_pairs) >= 10:
        break

print("\nSample missing origin/destination pairs:")
for origin, dest in missing_pairs:
    print(f"  {origin} → {dest}") 