import random

projects = [
    {"name": "Samarth Heights", "tower": "Tower A", "start_floor": 3, "end_floor": 9, "units_per_floor": 4, "prefix": "A", "types": ["2 BHK", "3 BHK"], "prices": [7500000, 10500000]},
    {"name": "Samarth Heights", "tower": "Tower B", "start_floor": 2, "end_floor": 6, "units_per_floor": 4, "prefix": "B", "types": ["2 BHK", "4 BHK"], "prices": [8100000, 16200000]},
    {"name": "Samarth Plaza", "tower": "Wing A (Retail)", "start_floor": 1, "end_floor": 3, "units_per_floor": 6, "prefix": "S", "types": ["Shop", "Office"], "prices": [12500000, 18000000]},
]

statuses = ["available", "reserved", "booked", "sold"]
amenities_list = ["Balcony", "Parking", "Club Access", "Garden View", "Main Road Facing"]
uid_counter = 100

for p in projects:
    for floor in range(p["start_floor"], p["end_floor"] + 1):
        for i in range(1, p["units_per_floor"] + 1):
            uid_counter += 1
            u_type = random.choice(p["types"])
            price = p["prices"][p["types"].index(u_type)] + (floor * 50000)
            status = random.choice(statuses)
            unit_no = f"{p['prefix']}-{floor}0{i}"
            carpet = 850 if "2 BHK" in u_type else (1200 if "3 BHK" in u_type else (1800 if "4 BHK" in u_type else 500))
            price_sqft = int(price/carpet)
            amenities = random.sample(amenities_list, 2)
            
            # Format: { prop: value }
            print(f'  {{')
            print(f'    id: "u{uid_counter}",')
            print(f'    unitNo: "{unit_no}",')
            print(f'    projectName: "{p["name"]}",')
            print(f'    towerName: "{p["tower"]}",')
            print(f'    floor: {floor},')
            print(f'    type: "{u_type}",')
            print(f'    carpetArea: {carpet},')
            print(f'    price: {price},')
            print(f'    pricePerSqFt: {price_sqft},')
            print(f'    status: "{status}",')
            print(f'    statusHistory: [{{ date: "2024-01-15", status: "Listed", user: "System" }}],')
            print(f'    amenities: {str(amenities).replace("\'", "\"")}')
            print(f'  }},')
