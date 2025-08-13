import os
import csv
from collections import Counter
from calc_engine import AmazonRateCalculator

# Path to the template and the real file
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "data", "2025 Amazon Quote Tool Template.xlsx")
REAL_FILE = "/Users/jasonbabb/Desktop/solbrush amazon june - there data/SOLBRUSH AMAZON SHIPPING TRANSACTIONS/Quote /SolBrush Amazon Rate DownloadAmazon Only .csv"

# Column mapping for the real file
DEST_ZIP_COL = "Ship Postal Code"
WEIGHT_COL = "Weight Oz"

# Load the calculator
calc = AmazonRateCalculator(TEMPLATE_PATH)

results = []
surcharge_types = []

with open(REAL_FILE, newline="") as csvfile:
    reader = csv.DictReader(csvfile)
    for i, row in enumerate(reader):
        dest_zip = row.get(DEST_ZIP_COL, "").strip()
        try:
            weight = float(row.get(WEIGHT_COL, 0))
        except Exception:
            weight = 0.0
        # Run surcharge logic
        sur = calc.apply_surcharges(10.0, dest_zip, weight, 'box')
        # Determine which surcharge was applied
        applied = "None"
        if sur['remote_surcharge'] > 0:
            applied = "Remote"
        elif sur['edas_surcharge'] > 0:
            applied = "EDAS"
        elif sur['das_surcharge'] > 0:
            applied = "DAS"
        results.append({
            'row': i+1,
            'dest_zip': dest_zip,
            'das': sur['das_surcharge'],
            'edas': sur['edas_surcharge'],
            'remote': sur['remote_surcharge'],
            'applied': applied
        })
        surcharge_types.append(applied)
        if i >= 4999:  # Limit to first 5000 rows for speed
            break

# Summarize
counter = Counter(surcharge_types)
total = sum(counter.values())
print(f"\nSurcharge summary for {len(results)} shipments:")
for k in ['DAS', 'EDAS', 'Remote', 'None']:
    pct = 100.0 * counter.get(k, 0) / total if total else 0
    print(f"  {k}: {counter.get(k, 0)} ({pct:.1f}%)")

print("\nSample results:")
for r in results[:10]:
    print(r) 