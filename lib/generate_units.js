const projects = [
    { name: "Samarth Heights", tower: "Tower A", start_floor: 3, end_floor: 9, units_per_floor: 4, prefix: "A", types: ["2 BHK", "3 BHK"], prices: [7500000, 10500000] },
    { name: "Samarth Heights", tower: "Tower B", start_floor: 2, end_floor: 6, units_per_floor: 4, prefix: "B", types: ["2 BHK", "4 BHK"], prices: [8100000, 16200000] },
    { name: "Samarth Plaza", tower: "Wing A (Retail)", start_floor: 1, end_floor: 3, units_per_floor: 6, prefix: "S", types: ["Shop", "Office"], prices: [12500000, 18000000] },
];

const statuses = ["available", "reserved", "booked", "sold"];
const amenities_list = ["Balcony", "Parking", "Club Access", "Garden View", "Main Road Facing"];
let uid_counter = 100;

for (const p of projects) {
    for (let floor = p.start_floor; floor <= p.end_floor; floor++) {
        for (let i = 1; i <= p.units_per_floor; i++) {
            uid_counter++;
            const u_type = p.types[Math.floor(Math.random() * p.types.length)];
            const price = p.prices[p.types.indexOf(u_type)] + (floor * 50000);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const unit_no = `${p.prefix}-${floor}0${i}`;
            const carpet = u_type.includes("2 BHK") ? 850 : (u_type.includes("3 BHK") ? 1200 : (u_type.includes("4 BHK") ? 1800 : 500));
            const price_sqft = Math.floor(price / carpet);
            const amenities = amenities_list.slice(0, 2);

            console.log(`  {`);
            console.log(`    id: "u${uid_counter}",`);
            console.log(`    unitNo: "${unit_no}",`);
            console.log(`    projectName: "${p.name}",`);
            console.log(`    towerName: "${p.tower}",`);
            console.log(`    floor: ${floor},`);
            console.log(`    type: "${u_type}",`);
            console.log(`    carpetArea: ${carpet},`);
            console.log(`    price: ${price},`);
            console.log(`    pricePerSqFt: ${price_sqft},`);
            console.log(`    status: "${status}",`);
            console.log(`    statusHistory: [{ date: "2024-01-15", status: "Listed", user: "System" }],`);
            console.log(`    amenities: ${JSON.stringify(amenities)}`);
            console.log(`  },`);
        }
    }
}
