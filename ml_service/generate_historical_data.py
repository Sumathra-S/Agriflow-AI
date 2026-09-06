"""
AgriFlow AI - Historical Procurement Data Generator
Simulates 30 days of realistic hourly procurement data for training and evaluating
flow congestion forecasting models.

Key variables:
- centre_id, timestamp, day_of_week, hour_of_day
- scheduled_bookings: Number of farmers booked for the slot
- actual_arrivals: Number of farmers who physically arrived (including walk-ins & early arrivals)
- current_queue: Farmers waiting inside the centre gate
- active_capacity_per_hour: Weighbridge & moisture testing processing rate
- congestion_risk: 0=LOW, 1=MEDIUM, 2=HIGH
"""

import json
import math
import random
import os
from datetime import datetime, timedelta

CENTRES = [
    {"id": "mandi-kalan", "name": "Mandi Kalan Procurement Centre", "district": "Ludhiana", "capacity": 18},
    {"id": "khanna-grain", "name": "Khanna Grain Market Centre", "district": "Ludhiana", "capacity": 25},
    {"id": "jagraon-apmc", "name": "Jagraon APMC Procurement Centre", "district": "Ludhiana", "capacity": 20},
    {"id": "raikot-sub", "name": "Raikot Sub-Centre", "district": "Ludhiana", "capacity": 14},
]

def generate_procurement_history(days=30):
    start_date = datetime.now() - timedelta(days=days)
    records = []
    
    random.seed(42)  # Deterministic generation for reproducible results
    
    for day_offset in range(days):
        current_day = start_date + timedelta(days=day_offset)
        is_weekend = current_day.weekday() >= 5
        
        # Seasonal peak factor (days 15-25 represent heavy harvesting peak)
        harvest_surge = 1.35 if (14 <= day_offset <= 24) else 1.0
        
        for centre in CENTRES:
            queue = random.randint(2, 6)
            base_capacity = centre["capacity"]
            
            # Operating hours 08:00 to 18:00
            for hour in range(8, 19):
                timestamp = current_day.replace(hour=hour, minute=0, second=0, microsecond=0)
                
                # Diurnal arrival pattern: peak between 11:00 AM and 14:00 PM
                if 11 <= hour <= 13:
                    time_factor = 1.8
                elif 9 <= hour <= 10 or 14 <= hour <= 15:
                    time_factor = 1.3
                elif 16 <= hour <= 17:
                    time_factor = 0.8
                else:
                    time_factor = 0.5
                
                # Base scheduled bookings for this hour
                base_bookings = int((base_capacity * 0.9) * time_factor * harvest_surge * (0.6 if is_weekend else 1.0))
                bookings = max(2, base_bookings + random.randint(-3, 4))
                
                # Actual arrivals include booking compliance + unannounced walk-ins + spillover
                compliance_rate = random.uniform(0.75, 1.15)
                walk_ins = random.randint(1, 6) if (10 <= hour <= 14) else random.randint(0, 2)
                arrivals = max(1, int(bookings * compliance_rate) + walk_ins)
                
                # Effective processing capacity can vary slightly due to equipment/moisture testing
                capacity_variance = random.choice([0, 0, 0, -2, -4, 1])
                effective_capacity = max(8, base_capacity + capacity_variance)
                
                # Queue accumulation logic
                processed = min(queue + arrivals, effective_capacity)
                queue = max(0, queue + arrivals - processed)
                
                # Pressure ratio: (Current Queue + Next Expected Arrivals) / Effective Capacity
                pressure_ratio = (queue + arrivals) / float(effective_capacity)
                
                if pressure_ratio > 1.8:
                    congestion_risk = 2  # HIGH
                elif pressure_ratio >= 1.0:
                    congestion_risk = 1  # MEDIUM
                else:
                    congestion_risk = 0  # LOW
                    
                records.append({
                    "centre_id": centre["id"],
                    "timestamp": timestamp.isoformat(),
                    "day_of_week": current_day.weekday(),
                    "hour": hour,
                    "scheduled_bookings": bookings,
                    "actual_arrivals": arrivals,
                    "current_queue": queue,
                    "effective_capacity": effective_capacity,
                    "pressure_ratio": round(pressure_ratio, 2),
                    "congestion_risk": congestion_risk,
                    "is_peak_window": 1 if (11 <= hour <= 13) else 0
                })
                
    return records

if __name__ == "__main__":
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "procurement_history.json")
    data = generate_procurement_history(30)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {len(data)} hourly procurement records spanning 30 days -> {out_file}")
