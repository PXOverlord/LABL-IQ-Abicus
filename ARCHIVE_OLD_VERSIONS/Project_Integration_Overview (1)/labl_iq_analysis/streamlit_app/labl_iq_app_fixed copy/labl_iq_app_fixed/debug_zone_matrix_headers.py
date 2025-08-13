#!/usr/bin/env python3
"""
Print the first 10 rows and columns of the UPS Zone matrix sheet to inspect headers and indices.
"""
import pandas as pd

zone_matrix_file = "data/2025 Amazon Quote Tool Template.xlsx"
sheet_name = "UPS Zone matrix_April 2024"

print(f"Loading sheet '{sheet_name}' from {zone_matrix_file}...")
df = pd.read_excel(zone_matrix_file, sheet_name=sheet_name, header=None)

print("\nFirst 10 rows and columns:")
print(df.iloc[:10, :10])

print("\nColumn headers (first 20):")
print(list(df.iloc[0, :20]))

print("\nRow indices (first 20):")
print(list(df.iloc[:20, 0])) 