// Mock data for ERP demo - all data is static for presentation purposes

export interface Unit {
  id: string
  unitNo: string
  projectName: string
  towerName: string
  floor: number
  type: string
  carpetArea: number
  price: number
  pricePerSqFt: number
  status: "available" | "reserved" | "booked" | "sold"
  statusHistory: { date: string; status: string; user: string }[]
  amenities: string[]
}

export interface Lead {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  source: "Walk-in" | "Channel Partner" | "Property Portal" | "Digital Ads" | "Referral" | "Campaign"
  budget: string
  preferredProject: string
  unitType: string
  status: "New" | "Contacted" | "Site Visit Scheduled" | "Interested" | "Not Interested" | "Lost" | "Qualified" | "Negotiation" | "Converted"
  interestedUnit: string
  assignedTo: string
  createdAt: string
  lastActivity: string
}

export interface Campaign {
  id: string
  name: string
  type: "Project Launch" | "Festive Offer" | "Online Ad" | "Event"
  channel: "Online" | "Offline"
  status: "Active" | "Completed" | "Planned"
  startDate: string
  endDate: string
  budget: number
  spend: number
  leadsGenerated: number
  conversions: number
  roi: number
}

export interface Activity {
  id: string
  leadId: string
  type: "Call" | "Meeting" | "Site Visit" | "Email" | "WhatsApp"
  description: string
  date: string
  status: "Completed" | "Scheduled" | "Pending"
  outcome?: string
}

export interface Reservation {
  id: string
  leadId: string
  unitId: string
  customerName: string
  unitNo: string
  reservationAmount: number
  reservationDate: string
  expiryDate: string
  status: "active" | "expired" | "converted"
}

export interface Booking {
  id: string
  customerId: string
  customerName: string
  unitId: string
  unitNo: string
  bookingDate: string
  totalAmount: number
  bookingAmount: number
  status: "pending" | "confirmed" | "cancelled"
}

export interface Invoice {
  id: string
  invoiceNo: string
  customerId: string
  customerName: string
  unitNo: string
  amount: number
  dueDate: string
  status: "draft" | "sent" | "paid" | "overdue" | "partial"
  milestones: { id: string; name: string; amount: number; dueDate: string; status: string }[]
}

export interface Payment {
  id: string
  customerId: string
  customerName: string
  invoiceId: string
  amount: number
  paymentDate: string
  paymentMode: string
  reference: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  unitNo: string
  totalBilled: number
  totalPaid: number
  outstanding: number
  ledger: { date: string; description: string; debit: number; credit: number; balance: number }[]
}

export interface Document {
  id: string
  customerId: string
  customerName: string
  unitNo: string
  documentType: string
  status: "pending" | "received" | "verified"
  uploadedAt: string | null
}

// Projects Data
export const projects = [
  { id: "p1", name: "Samarth Heights", type: "Residential", towers: ["Tower A", "Tower B", "Tower C"] },
  { id: "p2", name: "Samarth Gardens", type: "Residential", towers: ["Tower 1", "Tower 2"] },
  { id: "p3", name: "Samarth Residency", type: "Residential", towers: ["Block A", "Block B", "Block C", "Block D"] },
  { id: "p4", name: "Samarth Plaza", type: "Commercial", towers: ["Wing A (Retail)", "Wing B (Offices)"] },
]

// Units Data
export const units: Unit[] = [
  {
    id: "u1",
    unitNo: "A-101",
    projectName: "Samarth Heights",
    towerName: "Tower A",
    floor: 1,
    type: "2 BHK",
    carpetArea: 850,
    price: 7500000,
    pricePerSqFt: 8824,
    status: "available",
    statusHistory: [{ date: "2024-01-15", status: "Listed", user: "Admin" }],
    amenities: ["Balcony", "Parking", "Club Access"],
  },
  {
    id: "u2",
    unitNo: "A-102",
    projectName: "Samarth Heights",
    towerName: "Tower A",
    floor: 1,
    type: "3 BHK",
    carpetArea: 1200,
    price: 10500000,
    pricePerSqFt: 8750,
    status: "reserved",
    statusHistory: [
      { date: "2024-01-15", status: "Listed", user: "Admin" },
      { date: "2024-02-20", status: "Reserved", user: "Sales Team" },
    ],
    amenities: ["Balcony", "Parking", "Club Access", "Garden View"],
  },
  {
    id: "u3",
    unitNo: "A-201",
    projectName: "Samarth Heights",
    towerName: "Tower A",
    floor: 2,
    type: "2 BHK",
    carpetArea: 850,
    price: 7800000,
    pricePerSqFt: 9176,
    status: "booked",
    statusHistory: [
      { date: "2024-01-15", status: "Listed", user: "Admin" },
      { date: "2024-02-10", status: "Reserved", user: "Sales Team" },
      { date: "2024-02-25", status: "Booked", user: "Sales Team" },
    ],
    amenities: ["Balcony", "Parking", "Club Access"],
  },
  {
    id: "u4",
    unitNo: "A-202",
    projectName: "Samarth Heights",
    towerName: "Tower A",
    floor: 2,
    type: "3 BHK",
    carpetArea: 1200,
    price: 10800000,
    pricePerSqFt: 9000,
    status: "sold",
    statusHistory: [
      { date: "2024-01-15", status: "Listed", user: "Admin" },
      { date: "2024-01-25", status: "Reserved", user: "Sales Team" },
      { date: "2024-02-05", status: "Booked", user: "Sales Team" },
      { date: "2024-03-01", status: "Sold", user: "Finance" },
    ],
    amenities: ["Balcony", "Parking", "Club Access", "Garden View"],
  },
  {
    id: "u5",
    unitNo: "B-101",
    projectName: "Samarth Heights",
    towerName: "Tower B",
    floor: 1,
    type: "2 BHK",
    carpetArea: 900,
    price: 8100000,
    pricePerSqFt: 9000,
    status: "available",
    statusHistory: [{ date: "2024-01-15", status: "Listed", user: "Admin" }],
    amenities: ["Balcony", "Parking", "Club Access"],
  },
  {
    id: "u6",
    unitNo: "B-102",
    projectName: "Samarth Heights",
    towerName: "Tower B",
    floor: 1,
    type: "4 BHK",
    carpetArea: 1800,
    price: 16200000,
    pricePerSqFt: 9000,
    status: "available",
    statusHistory: [{ date: "2024-01-15", status: "Listed", user: "Admin" }],
    amenities: ["Balcony", "Parking", "Club Access", "Private Terrace"],
  },
  {
    id: "u7",
    unitNo: "1-301",
    projectName: "Samarth Gardens",
    towerName: "Tower 1",
    floor: 3,
    type: "2 BHK",
    carpetArea: 800,
    price: 6400000,
    pricePerSqFt: 8000,
    status: "reserved",
    statusHistory: [
      { date: "2024-02-01", status: "Listed", user: "Admin" },
      { date: "2024-03-10", status: "Reserved", user: "Sales Team" },
    ],
    amenities: ["Balcony", "Parking"],
  },
  {
    id: "u8",
    unitNo: "1-302",
    projectName: "Samarth Gardens",
    towerName: "Tower 1",
    floor: 3,
    type: "3 BHK",
    carpetArea: 1100,
    price: 8800000,
    pricePerSqFt: 8000,
    status: "available",
    statusHistory: [{ date: "2024-02-01", status: "Listed", user: "Admin" }],
    amenities: ["Balcony", "Parking", "Garden View"],
  },
  {
    id: "u9",
    unitNo: "GF-01",
    projectName: "Samarth Plaza",
    towerName: "Wing A (Retail)",
    floor: 0,
    type: "Shop",
    carpetArea: 450,
    price: 12500000,
    pricePerSqFt: 27777,
    status: "available",
    statusHistory: [{ date: "2024-03-01", status: "Listed", user: "Admin" }],
    amenities: ["Main Road Facing", "High Ceiling", "Water Connection"],
  },
  {
    id: "u10",
    unitNo: "GF-02",
    projectName: "Samarth Plaza",
    towerName: "Wing A (Retail)",
    floor: 0,
    type: "Showroom",
    carpetArea: 1200,
    price: 35000000,
    pricePerSqFt: 29166,
    status: "booked",
    statusHistory: [
      { date: "2024-03-01", status: "Listed", user: "Admin" },
      { date: "2024-03-10", status: "Booked", user: "Sales Team" },
    ],
    amenities: ["Corner Unit", "glass Frontage", "Private Parking"],
  },
  {
    id: "u11",
    unitNo: "OF-101",
    projectName: "Samarth Plaza",
    towerName: "Wing B (Offices)",
    floor: 1,
    type: "Office",
    carpetArea: 800,
    price: 18000000,
    pricePerSqFt: 22500,
    status: "available",
    statusHistory: [{ date: "2024-03-01", status: "Listed", user: "Admin" }],
    amenities: ["Central AC", "Power Backup", "Conf Room Access"],
  },
]

// Campaigns Data
export const campaigns: Campaign[] = [
  {
    id: "camp1",
    name: "New Year Bonanza",
    type: "Festive Offer",
    channel: "Online",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    budget: 500000,
    spend: 350000,
    leadsGenerated: 150,
    conversions: 12,
    roi: 240,
  },
  {
    id: "camp2",
    name: "Samarth Heights Launch",
    type: "Project Launch",
    channel: "Offline",
    status: "Completed",
    startDate: "2023-11-01",
    endDate: "2023-11-30",
    budget: 1000000,
    spend: 980000,
    leadsGenerated: 300,
    conversions: 45,
    roi: 310,
  },
]

// Leads Data
export const leads: Lead[] = [
  {
    id: "l1",
    name: "Rajesh Kumar",
    contact: "rajesh.k",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    source: "Website",
    budget: "75L - 1Cr",
    preferredProject: "Samarth Heights",
    unitType: "2 BHK",
    status: "Qualified",
    interestedUnit: "A-101",
    assignedTo: "Priya Sharma",
    createdAt: "2024-03-01",
    lastActivity: "2024-03-05",
  },
  {
    id: "l2",
    name: "Sunita Patel",
    contact: "sunita.p",
    email: "sunita.p@email.com",
    phone: "+91 87654 32109",
    source: "Referral",
    budget: "1Cr - 1.5Cr",
    preferredProject: "Samarth Heights",
    unitType: "3 BHK",
    status: "Negotiation",
    interestedUnit: "B-102",
    assignedTo: "Amit Singh",
    createdAt: "2024-02-28",
    lastActivity: "2024-03-08",
  },
  {
    id: "l3",
    name: "Vikram Mehta",
    contact: "vikram.m",
    email: "v.mehta@email.com",
    phone: "+91 76543 21098",
    source: "Property Portal",
    budget: "60L - 80L",
    preferredProject: "Samarth Gardens",
    unitType: "2 BHK",
    status: "New",
    interestedUnit: "1-302",
    assignedTo: "Priya Sharma",
    createdAt: "2024-03-05",
    lastActivity: "2024-03-05",
  },
  {
    id: "l4",
    name: "Anita Desai",
    contact: "anita.d",
    email: "anita.desai@email.com",
    phone: "+91 65432 10987",
    source: "Walk-in",
    budget: "90L - 1.2Cr",
    preferredProject: "Samarth Heights",
    unitType: "3 BHK",
    status: "Contacted",
    interestedUnit: "A-201",
    assignedTo: "Amit Singh",
    createdAt: "2024-03-03",
    lastActivity: "2024-03-04",
  },
  {
    id: "l5",
    name: "Mohan Reddy",
    contact: "mohan.r",
    email: "mohan.r@email.com",
    phone: "+91 54321 09876",
    source: "Social Media",
    budget: "1Cr+",
    preferredProject: "Samarth Heights",
    unitType: "3 BHK",
    status: "Converted",
    interestedUnit: "A-202",
    assignedTo: "Priya Sharma",
    createdAt: "2024-02-15",
    lastActivity: "2024-02-25",
  },
]

// Activities Data
export const activities: Activity[] = [
  {
    id: "act1",
    leadId: "l1",
    type: "Call",
    description: "Initial inquiry call",
    date: "2024-03-01",
    status: "Completed",
    outcome: "Interested in 2BHK, scheduled site visit",
  },
  {
    id: "act2",
    leadId: "l1",
    type: "Site Visit",
    description: "Visited Samarth Heights with family",
    date: "2024-03-05",
    status: "Completed",
    outcome: "Liked A-101, requested price negotiation",
  },
]

// Reservations Data
export const reservations: Reservation[] = [
  {
    id: "r1",
    leadId: "l1",
    unitId: "u2",
    customerName: "Rajesh Kumar",
    unitNo: "A-102",
    reservationAmount: 100000,
    reservationDate: "2024-03-01",
    expiryDate: "2024-03-15",
    status: "active",
  },
  {
    id: "r2",
    leadId: "l2",
    unitId: "u7",
    customerName: "Sunita Patel",
    unitNo: "1-301",
    reservationAmount: 75000,
    reservationDate: "2024-03-10",
    expiryDate: "2024-03-24",
    status: "active",
  },
]

// Bookings Data
export const bookings: Booking[] = [
  {
    id: "b1",
    customerId: "c1",
    customerName: "Mohan Reddy",
    unitId: "u4",
    unitNo: "A-202",
    bookingDate: "2024-02-25",
    totalAmount: 10800000,
    bookingAmount: 1080000,
    status: "confirmed",
  },
  {
    id: "b2",
    customerId: "c2",
    customerName: "Kavita Shah",
    unitId: "u3",
    unitNo: "A-201",
    bookingDate: "2024-02-28",
    totalAmount: 7800000,
    bookingAmount: 780000,
    status: "confirmed",
  },
]

// Invoices Data
export const invoices: Invoice[] = [
  {
    id: "inv1",
    invoiceNo: "INV-2024-001",
    customerId: "c1",
    customerName: "Mohan Reddy",
    unitNo: "A-202",
    amount: 3240000,
    dueDate: "2024-04-15",
    status: "partial",
    milestones: [
      { id: "m1", name: "Booking Amount", amount: 1080000, dueDate: "2024-02-25", status: "paid" },
      { id: "m2", name: "Foundation", amount: 1080000, dueDate: "2024-03-15", status: "paid" },
      { id: "m3", name: "Plinth", amount: 1080000, dueDate: "2024-04-15", status: "pending" },
    ],
  },
  {
    id: "inv2",
    invoiceNo: "INV-2024-002",
    customerId: "c2",
    customerName: "Kavita Shah",
    unitNo: "A-201",
    amount: 2340000,
    dueDate: "2024-04-10",
    status: "sent",
    milestones: [
      { id: "m4", name: "Booking Amount", amount: 780000, dueDate: "2024-02-28", status: "paid" },
      { id: "m5", name: "Foundation", amount: 780000, dueDate: "2024-03-28", status: "pending" },
      { id: "m6", name: "Plinth", amount: 780000, dueDate: "2024-04-28", status: "pending" },
    ],
  },
  {
    id: "inv3",
    invoiceNo: "INV-2024-003",
    customerId: "c3",
    customerName: "Arun Joshi",
    unitNo: "B-201",
    amount: 2700000,
    dueDate: "2024-03-01",
    status: "overdue",
    milestones: [
      { id: "m7", name: "Booking Amount", amount: 900000, dueDate: "2024-01-15", status: "paid" },
      { id: "m8", name: "Foundation", amount: 900000, dueDate: "2024-02-15", status: "paid" },
      { id: "m9", name: "Plinth", amount: 900000, dueDate: "2024-03-01", status: "overdue" },
    ],
  },
]

// Payments Data
export const payments: Payment[] = [
  {
    id: "pay1",
    customerId: "c1",
    customerName: "Mohan Reddy",
    invoiceId: "inv1",
    amount: 1080000,
    paymentDate: "2024-02-25",
    paymentMode: "Bank Transfer",
    reference: "TXN123456",
  },
  {
    id: "pay2",
    customerId: "c1",
    customerName: "Mohan Reddy",
    invoiceId: "inv1",
    amount: 1080000,
    paymentDate: "2024-03-15",
    paymentMode: "Cheque",
    reference: "CHQ789012",
  },
  {
    id: "pay3",
    customerId: "c2",
    customerName: "Kavita Shah",
    invoiceId: "inv2",
    amount: 780000,
    paymentDate: "2024-02-28",
    paymentMode: "Bank Transfer",
    reference: "TXN345678",
  },
]

// Customers Data
export const customers: Customer[] = [
  {
    id: "c1",
    name: "Mohan Reddy",
    email: "mohan.r@email.com",
    phone: "+91 54321 09876",
    address: "123 MG Road, Bangalore",
    unitNo: "A-202",
    totalBilled: 10800000,
    totalPaid: 2160000,
    outstanding: 8640000,
    ledger: [
      { date: "2024-02-25", description: "Booking Amount Invoice", debit: 1080000, credit: 0, balance: 1080000 },
      { date: "2024-02-25", description: "Booking Payment Received", debit: 0, credit: 1080000, balance: 0 },
      { date: "2024-03-15", description: "Foundation Invoice", debit: 1080000, credit: 0, balance: 1080000 },
      { date: "2024-03-15", description: "Foundation Payment Received", debit: 0, credit: 1080000, balance: 0 },
      { date: "2024-04-15", description: "Plinth Invoice", debit: 1080000, credit: 0, balance: 1080000 },
    ],
  },
  {
    id: "c2",
    name: "Kavita Shah",
    email: "kavita.s@email.com",
    phone: "+91 43210 98765",
    address: "456 Park Street, Mumbai",
    unitNo: "A-201",
    totalBilled: 7800000,
    totalPaid: 780000,
    outstanding: 7020000,
    ledger: [
      { date: "2024-02-28", description: "Booking Amount Invoice", debit: 780000, credit: 0, balance: 780000 },
      { date: "2024-02-28", description: "Booking Payment Received", debit: 0, credit: 780000, balance: 0 },
      { date: "2024-03-28", description: "Foundation Invoice", debit: 780000, credit: 0, balance: 780000 },
    ],
  },
  {
    id: "c3",
    name: "Arun Joshi",
    email: "arun.j@email.com",
    phone: "+91 32109 87654",
    address: "789 Lake View, Pune",
    unitNo: "B-201",
    totalBilled: 9000000,
    totalPaid: 1800000,
    outstanding: 7200000,
    ledger: [
      { date: "2024-01-15", description: "Booking Amount Invoice", debit: 900000, credit: 0, balance: 900000 },
      { date: "2024-01-15", description: "Booking Payment Received", debit: 0, credit: 900000, balance: 0 },
      { date: "2024-02-15", description: "Foundation Invoice", debit: 900000, credit: 0, balance: 900000 },
      { date: "2024-02-15", description: "Foundation Payment Received", debit: 0, credit: 900000, balance: 0 },
      { date: "2024-03-01", description: "Plinth Invoice (OVERDUE)", debit: 900000, credit: 0, balance: 900000 },
    ],
  },
]

// Documents Data
export const documents: Document[] = [
  {
    id: "d1",
    customerId: "c1",
    customerName: "Mohan Reddy",
    unitNo: "A-202",
    documentType: "Identity Proof",
    status: "verified",
    uploadedAt: "2024-02-20",
  },
  {
    id: "d2",
    customerId: "c1",
    customerName: "Mohan Reddy",
    unitNo: "A-202",
    documentType: "Address Proof",
    status: "verified",
    uploadedAt: "2024-02-20",
  },
  {
    id: "d3",
    customerId: "c1",
    customerName: "Mohan Reddy",
    unitNo: "A-202",
    documentType: "PAN Card",
    status: "received",
    uploadedAt: "2024-02-22",
  },
  {
    id: "d4",
    customerId: "c1",
    customerName: "Mohan Reddy",
    unitNo: "A-202",
    documentType: "Bank Statement",
    status: "pending",
    uploadedAt: null,
  },
  {
    id: "d5",
    customerId: "c2",
    customerName: "Kavita Shah",
    unitNo: "A-201",
    documentType: "Identity Proof",
    status: "verified",
    uploadedAt: "2024-02-25",
  },
  {
    id: "d6",
    customerId: "c2",
    customerName: "Kavita Shah",
    unitNo: "A-201",
    documentType: "Address Proof",
    status: "received",
    uploadedAt: "2024-02-26",
  },
  {
    id: "d7",
    customerId: "c2",
    customerName: "Kavita Shah",
    unitNo: "A-201",
    documentType: "PAN Card",
    status: "pending",
    uploadedAt: null,
  },
]

// Dashboard Stats
export const dashboardStats = {
  presales: {
    totalLeads: 450,
    newLeads: 45,
    siteVisits: 28,
    hotLeads: 55,
    conversionRate: 12, // percentage
    campaignSpend: 1540000,
    leadsBySource: [
      { name: "Digital Ads", value: 180 },
      { name: "Walk-in", value: 45 },
      { name: "Referral", value: 65 },
      { name: "Channel Partner", value: 120 },
      { name: "Portals", value: 40 },
    ],
  },
  sales: {
    totalUnits: 150,
    unitsSold: 45,
    unitsBooked: 18,
    unitsReserved: 12,
    unitsAvailable: 75,
    totalRevenue: 485000000,
    revenueCollected: 125000000,
    revenueTarget: 600000000,
  },
  finance: {
    totalReceivables: 360000000,
    currentDue: 85000000,
    overdue: 42000000,
    collected: 125000000,
    pendingInvoices: 28,
    overdueInvoices: 8,
  },
  inventory: {
    projects: 3,
    towers: 9,
    totalUnits: 150,
    available: 75,
    reserved: 12,
    booked: 18,
    sold: 45,
  },
}

// Mock API functions
export const fetchUnits = () => Promise.resolve(units)
export const fetchLeads = () => Promise.resolve(leads)
export const fetchReservations = () => Promise.resolve(reservations)
export const fetchBookings = () => Promise.resolve(bookings)
export const fetchInvoices = () => Promise.resolve(invoices)
export const fetchPayments = () => Promise.resolve(payments)
export const fetchCustomers = () => Promise.resolve(customers)
export const fetchDocuments = () => Promise.resolve(documents)
export const fetchDashboardStats = () => Promise.resolve(dashboardStats)
