import csv
import json
import os
import re
import urllib.request
import urllib.parse
import time
from collections import Counter

# Directory containing the CSV files
DATA_DIR = "/Users/jalenkroger/Desktop/Work/JOUR 307/jalenkroger.github.io/drugs-in-lincoln/"

# Drug-related keywords
KEYWORDS = [
    "MARIJUANA", "DRUG", "CONTROLLED SUBSTANCE", "PARAPHERNALIA", "METH",
    "COCAINE", "HEROIN", "OPIATE", "AMPHETAMINE", "NARCOTIC", "CANNABIS",
    "HASHISH", "PCS", "DUI-DRUG"
]

def clean_address(address):
    """Standardizes addresses for geocoding."""
    if not address:
        return ""
    
    # Handle blocks (e.g., "200 BLOCK BRIDGER RD" -> "200 BRIDGER RD")
    address = re.sub(r'\bBLOCK\b', '', address, flags=re.IGNORECASE)
    
    # Handle intersections (e.g., "S 27TH ST / O ST" -> "27th & O St")
    address = address.replace(' / ', ' & ')
    
    # Remove extra spaces
    address = ' '.join(address.split())
    
    # Add city and state
    if address and "LINCOLN" not in address.upper():
        address += ", Lincoln, NE"
    
    return address

def geocode(address):
    """Geocodes an address using Nominatim (OpenStreetMap)."""
    try:
        url = "https://nominatim.openstreetmap.org/search?q=" + urllib.parse.quote(address) + "&format=json&limit=1"
        req = urllib.request.Request(url, headers={'User-Agent': 'DrugArrestMapper/1.0 (jalenkroger.github.io)'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data:
                return float(data[0]['lat']), float(data[0]['lon'])
    except Exception as e:
        print(f"Error geocoding {address}: {e}")
    return None, None

def process_file(filepath):
    """Processes a single CSV file and returns drug-related arrest records."""
    records = []
    with open(filepath, 'r', encoding='latin-1') as f:
        reader = csv.DictReader(f)
        for row in reader:
            charge = row.get('CHARGED', '').upper()
            address = row.get('ONST', '')
            
            if any(kw in charge for kw in KEYWORDS):
                records.append({
                    "address": clean_address(address)
                })
    return records

def save_output(addr_counts, geocodes):
    """Saves the current geocodes as a heatmap list."""
    heatmap_data = []
    for addr, (lat, lon) in geocodes.items():
        if addr in addr_counts:
            heatmap_data.append([lat, lon, addr_counts[addr]])
    
    output_path = os.path.join(DATA_DIR, "drug_arrests.json")
    with open(output_path, 'w') as f:
        json.dump(heatmap_data, f)
    
    # Also save the raw geocode cache
    cache_path = os.path.join(DATA_DIR, "geocodes_cache.json")
    with open(cache_path, 'w') as f:
        json.dump(geocodes, f)

def main():
    all_raw_records = []
    
    # Process ALL Arrest CSVs
    for filename in sorted(os.listdir(DATA_DIR)):
        if filename.endswith(".csv") and ("Arrested" in filename or "arrests" in filename):
            print(f"Processing {filename}...")
            filepath = os.path.join(DATA_DIR, filename)
            all_raw_records.extend(process_file(filepath))
    
    print(f"Found {len(all_raw_records)} total drug-related records (2013-2024).")
    
    # Frequency count of addresses to prioritize hotspots
    addr_counts = Counter(r['address'] for r in all_raw_records if r['address'])
    top_addresses = [addr for addr, count in addr_counts.most_common(500)]
    
    # Load cache if exists
    cache_path = os.path.join(DATA_DIR, "geocodes_cache.json")
    geocodes = {}
    if os.path.exists(cache_path):
        with open(cache_path, 'r') as f:
            geocodes = json.load(f)
    
    print(f"Loaded {len(geocodes)} geocodes from cache.")
    
    new_geocodes_count = 0
    limit = 500
    
    print(f"Processing top {limit} addresses...")
    for i, addr in enumerate(top_addresses):
        if addr in geocodes:
            continue
            
        print(f"Geocoding {i+1}/{limit}: {addr}")
        lat, lon = geocode(addr)
        if lat and lon:
            geocodes[addr] = (lat, lon)
            new_geocodes_count += 1
        
        # Periodic save
        if new_geocodes_count > 0 and new_geocodes_count % 10 == 0:
            print("Saving progress...")
            save_output(addr_counts, geocodes)
        
        # Respect Nominatim's usage policy (1 request per second)
        time.sleep(1.1) 
    
    # Final save
    save_output(addr_counts, geocodes)
    print(f"Process complete. Saved {len(geocodes)} total hotspots.")

if __name__ == "__main__":
    main()
