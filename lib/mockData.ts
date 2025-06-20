import { Asset, User, Component, Accessory, License, BitLockerKey, ZabbixVM, ActivityLog, DashboardStats } from "@/types";

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: 1, // Changed to number
    assetTag: "LT-001",
    serialNumber: "DELLXPS15-001",
    model: "Dell XPS 15",
    status: "deployed",
    category: "Laptop",
    manufacturer: "Dell",
    purchaseDate: "2023-01-15",
    purchaseCost: 1800,
    warrantyExpires: "2026-01-14",
    assignedTo: 101, // Assuming user ID
    location: "Office A-101",
    notes: "Primary laptop for John Doe",
    ipAddress: "192.168.1.101",
    macAddress: "00:1A:2B:3C:4D:E1",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-05-01T14:30:00Z",
    dateReleased: "2023-01-20",
    releasedBy: "IT Admin",
    financeChecked: true,
  },
  {
    id: 2, // Changed to number
    assetTag: "DK-005",
    serialNumber: "HPELITEDESK-005",
    model: "HP EliteDesk 800 G9",
    status: "available",
    category: "Desktop",
    manufacturer: "HP",
    purchaseDate: "2023-03-20",
    purchaseCost: 1200,
    warrantyExpires: "2026-03-19",
    location: "IT Storage Room",
    notes: "Standard office desktop",
    ipAddress: "",
    macAddress: "00:1A:2B:3C:4D:E2",
    createdAt: "2023-03-20T09:00:00Z",
    updatedAt: "2024-04-15T11:00:00Z",
    financeChecked: true,
  },
   {
    id: 3, // Changed to number
    assetTag: "SV-002",
    serialNumber: "DELLPESRV-002",
    model: "Dell PowerEdge R740",
    status: "maintenance",
    category: "Server",
    manufacturer: "Dell",
    purchaseDate: "2022-11-01",
    purchaseCost: 5500,
    warrantyExpires: "2025-10-31",
    location: "Data Center Rack 3",
    notes: "Scheduled firmware update",
    ipAddress: "10.0.0.5",
    macAddress: "00:1A:2B:3C:4D:E3",
    createdAt: "2022-11-01T08:00:00Z",
    updatedAt: "2024-05-04T16:00:00Z",
    financeChecked: true,
  },
  {
    id: 4, // Changed to number
    assetTag: "MN-010",
    serialNumber: "DELLU2723QE-010",
    model: "Dell UltraSharp U2723QE",
    status: "deployed",
    category: "Monitor",
    manufacturer: "Dell",
    purchaseDate: "2023-06-10",
    purchaseCost: 600,
    warrantyExpires: "2026-06-09",
    assignedTo: 102, // Assuming user ID
    location: "Office B-205",
    notes: "4K Monitor for Jane Smith",
    createdAt: "2023-06-10T11:00:00Z",
    updatedAt: "2023-06-15T09:15:00Z",
    dateReleased: "2023-06-15",
    releasedBy: "IT Support",
    financeChecked: true,
  },
   {
    id: 5, // Changed to number
    assetTag: "PR-003",
    serialNumber: "HPLJPRO400-003",
    model: "HP LaserJet Pro M404dn",
    status: "decommissioned",
    category: "Printer",
    manufacturer: "HP",
    purchaseDate: "2020-05-01",
    purchaseCost: 400,
    warrantyExpires: "2023-04-30",
    location: "Recycling Area",
    notes: "Replaced with newer model",
    ipAddress: "192.168.1.200",
    macAddress: "00:1A:2B:3C:4D:E4",
    createdAt: "2020-05-01T13:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
    financeChecked: false, // Might not be checked if decommissioned early
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 101, // Changed to number
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    department: "IT",
    position: "System Administrator",
    phone: "123-456-7890",
    location: "Office A-101",
    isActive: true,
    isAdmin: true,
    lastLogin: "2024-05-04T15:30:00Z",
    createdAt: "2022-08-01T09:00:00Z",
    updatedAt: "2024-05-04T15:30:00Z",
  },
  {
    id: 102, // Changed to number
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "manager",
    department: "Marketing",
    position: "Marketing Manager",
    phone: "123-456-7891",
    location: "Office B-205",
    isActive: true,
    isAdmin: false,
    lastLogin: "2024-05-03T11:00:00Z",
    createdAt: "2023-02-10T10:00:00Z",
    updatedAt: "2024-05-03T11:00:00Z",
  },
  {
    id: 103, // Changed to number
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "user",
    department: "Sales",
    position: "Sales Representative",
    phone: "123-456-7892",
    location: "Remote",
    isActive: true,
    isAdmin: false,
    lastLogin: "2024-05-04T09:45:00Z",
    createdAt: "2023-05-15T14:00:00Z",
    updatedAt: "2024-05-04T09:45:00Z",
  },
   {
    id: 104, // Changed to number
    name: "Emily White",
    email: "emily.white@example.com",
    role: "user",
    department: "Human Resources",
    position: "HR Specialist",
    phone: "123-456-7893",
    location: "Office C-301",
    isActive: false, // Example of inactive user
    isAdmin: false,
    lastLogin: "2024-02-28T17:00:00Z",
    createdAt: "2023-07-20T11:30:00Z",
    updatedAt: "2024-03-01T09:00:00Z",
  },
];

// Mock Components
export const mockComponents: Component[] = [
  {
    id: "comp-001", // Keep component ID as string if needed, DB uses SERIAL
    name: "Intel Core i7-11700K",
    type: "Processor", 
    category: "cpu",
    model: "Core i7-11700K",
    manufacturer: "Intel",
    serialNumber: "INTEL-I7-001",
    purchaseDate: "2022-05-10",
    purchaseCost: 349.99,
    status: "deployed",
    assetId: "2", // Changed to string representation of numeric ID 2 (HP EliteDesk)
    notes: "High-performance CPU"
  },
  {
    id: "comp-002", // Keep component ID as string
    name: "Kingston 16GB DDR4",
    type: "Memory", 
    category: "ram",
    model: "HyperX 16GB DDR4-3200",
    manufacturer: "Kingston",
    serialNumber: "KINGSTON-RAM-001",
    purchaseDate: "2022-05-10",
    purchaseCost: 89.99,
    status: "deployed",
    assetId: "2", // Changed to string representation of numeric ID 2 (HP EliteDesk)
    notes: "Standard RAM module"
  },
  {
    id: "comp-003", // Keep component ID as string
    name: "Samsung 1TB SSD",
    type: "Storage Drive", 
    category: "storage",
    model: "970 EVO Plus",
    manufacturer: "Samsung",
    serialNumber: "SAMSUNG-SSD-001",
    purchaseDate: "2022-05-10",
    purchaseCost: 149.99,
    status: "available",
    // No assetId as it's available
    notes: "High-speed SSD"
  }
];

// Mock Accessories
export const mockAccessories: Accessory[] = [
  {
    id: 301, // Changed to number
    name: "Logitech MX Master 3 Mouse",
    category: "Mouse",
    manufacturer: "Logitech",
    model: "MX Master 3",
    purchaseDate: "2023-04-10",
    purchaseCost: 99,
    quantity: 50,
    quantityAvailable: 25,
    location: "IT Storage - Shelf A",
    createdAt: "2023-04-10T10:00:00Z",
    updatedAt: "2024-05-01T11:00:00Z",
  },
  {
    id: 302, // Changed to number
    name: "Dell Premier Wireless Keyboard",
    category: "Keyboard",
    manufacturer: "Dell",
    model: "KM717",
    purchaseDate: "2023-04-10",
    purchaseCost: 75,
    quantity: 50,
    quantityAvailable: 30,
    location: "IT Storage - Shelf A",
    createdAt: "2023-04-10T10:05:00Z",
    updatedAt: "2024-04-20T14:00:00Z",
  },
  {
    id: 303, // Changed to number
    name: "Anker USB-C Hub",
    category: "Docking Station/Hub",
    manufacturer: "Anker",
    model: "PowerExpand+ 7-in-1",
    purchaseDate: "2023-08-01",
    purchaseCost: 45,
    quantity: 30,
    quantityAvailable: 15,
    location: "IT Storage - Shelf B",
    createdAt: "2023-08-01T09:30:00Z",
    updatedAt: "2024-03-15T16:20:00Z",
  },
   {
    id: 304, // Changed to number
    name: "Jabra Evolve 65 Headset",
    category: "Headset",
    manufacturer: "Jabra",
    model: "Evolve 65 MS Stereo",
    purchaseDate: "2023-09-15",
    purchaseCost: 150,
    quantity: 40,
    quantityAvailable: 40,
    location: "IT Storage - Shelf C",
    createdAt: "2023-09-15T11:00:00Z",
    updatedAt: "2023-09-15T11:00:00Z",
  },
];

// Mock Licenses
export const mockLicenses: License[] = [
  {
    id: 401, // Changed to number
    name: "Microsoft 365 E3",
    software: "Microsoft 365",
    key: "VOL-M365-E3-001",
    seats: 100,
    seatsAvailable: 15,
    purchaseDate: "2024-01-01",
    expirationDate: "2024-12-31",
    purchaseCost: 36000, // Assuming $360/user/year
    notes: "Annual subscription for all employees",
    createdAt: "2024-01-01T09:00:00Z",
    updatedAt: "2024-05-01T10:00:00Z",
  },
  {
    id: 402, // Changed to number
    name: "Adobe Creative Cloud All Apps",
    software: "Adobe Creative Cloud",
    key: "VOL-ADOBECC-001",
    seats: 20,
    seatsAvailable: 5,
    purchaseDate: "2024-03-01",
    expirationDate: "2025-02-28",
    purchaseCost: 12000, // Assuming $600/user/year
    notes: "For Marketing and Design teams",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-04-15T14:30:00Z",
  },
  {
    id: 403, // Changed to number
    name: "JetBrains All Products Pack",
    software: "JetBrains IDEs",
    key: "PERP-JB-ALL-005",
    seats: 10,
    seatsAvailable: 2,
    purchaseDate: "2023-11-15",
    expirationDate: "2024-11-14", // Example expiring soon
    purchaseCost: 6490, // Assuming $649/user/year
    notes: "For Development team",
    createdAt: "2023-11-15T11:00:00Z",
    updatedAt: "2024-04-25T09:00:00Z",
  },
   {
    id: 404, // Changed to number
    name: "Slack Standard Plan",
    software: "Slack",
    key: "SUB-SLACK-STD-001",
    seats: 150,
    seatsAvailable: 20, // Example calculation
    purchaseDate: "2024-02-01",
    expirationDate: "2025-01-31",
    purchaseCost: 12150, // Assuming $6.75/user/month billed annually
    notes: "Company-wide communication tool",
    createdAt: "2024-02-01T14:00:00Z",
    updatedAt: "2024-05-02T16:00:00Z",
  },
];

// Mock BitLocker Keys
export const mockBitLockerKeys: BitLockerKey[] = [
  {
    id: "bitlocker-001", // Keep BitLocker ID as string if needed, DB uses SERIAL
    assetId: "1", // Changed to string representation of numeric ID 1 (Dell XPS 15)
    serialNumber: "DELLXPS15-001",
    recoveryKey: "123456-123456-123456-123456-123456-123456-123456-123456",
    createdAt: "2023-01-16T10:00:00Z",
    lastAccessed: "2023-03-10T14:30:00Z",
    notes: "Executive laptop recovery key"
  },
  {
    id: "bitlocker-002", // Keep BitLocker ID as string
    assetId: "2", // Changed to string representation of numeric ID 2 (HP EliteDesk)
    serialNumber: "HPED800-001",
    recoveryKey: "234567-234567-234567-234567-234567-234567-234567-234567",
    createdAt: "2022-11-12T12:00:00Z",
    notes: "Standard desktop recovery key"
  }
];

// Mock Zabbix VMs
export const mockZabbixVMs: ZabbixVM[] = [
  {
    id: "vm-001",
    name: "Web Server",
    hostId: "zabbix-host-001",
    ipAddress: "192.168.1.10",
    status: "up",
    cpuUsage: 45.2,
    memoryUsage: 62.8,
    diskUsage: 78.5,
    uptime: "45 days, 12 hours",
    lastCheck: "2023-05-25T10:15:00Z",
    os: "Ubuntu 22.04 LTS",
    notes: "Primary web server"
  },
  {
    id: "vm-002",
    name: "Database Server",
    hostId: "zabbix-host-002",
    ipAddress: "192.168.1.11",
    status: "up",
    cpuUsage: 68.7,
    memoryUsage: 75.3,
    diskUsage: 82.1,
    uptime: "30 days, 6 hours",
    lastCheck: "2023-05-25T10:15:00Z",
    os: "CentOS 8",
    notes: "Primary database server"
  },
  {
    id: "vm-003",
    name: "File Server",
    hostId: "zabbix-host-003",
    ipAddress: "192.168.1.12",
    status: "down",
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 65.4,
    uptime: "0",
    lastCheck: "2023-05-25T10:15:00Z",
    os: "Windows Server 2019",
    notes: "File storage server - currently down for maintenance"
  }
];

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-001", // Keep log ID as string if needed, DB uses SERIAL
    action: "checkout",
    itemType: "asset",
    itemId: "1", // Changed to string representation of numeric asset ID 1
    timestamp: "2023-05-20T10:30:00Z",
    userId: "101", // Changed to string representation of numeric user ID 101
    details: "Checked out Dell XPS 15 to John Smith"
  },
  {
    id: "log-002", // Keep log ID as string
    action: "create",
    itemType: "user",
    itemId: "103", // Changed to string representation of numeric user ID 103
    timestamp: "2022-03-20T11:45:00Z",
    userId: "101", // Changed to string representation of numeric user ID 101
    details: "Created new user: Robert Johnson" // Corrected name based on mockUsers
  },
  {
    id: "log-003", // Keep log ID as string
    action: "update",
    itemType: "asset",
    itemId: "2", // Changed to string representation of numeric asset ID 2
    timestamp: "2023-03-15T14:20:00Z",
    userId: "101", // Changed to string representation of numeric user ID 101
    details: "Updated HP EliteDesk 800 status to available"
  },
  {
    id: "log-004", // Keep log ID as string
    action: "assign",
    itemType: "license",
    itemId: "401", // Changed to string representation of numeric license ID 401
    timestamp: "2023-02-10T11:15:00Z",
    userId: "102", // Changed to string representation of numeric user ID 102 (Jane Smith)
    details: "Assigned Microsoft 365 license to Jane Smith" // Corrected details
  },
  {
    id: "log-005", // Keep log ID as string
    action: "access",
    itemType: "bitlocker",
    itemId: "1", // Changed to string representation of numeric bitlocker ID (assuming DB ID 1 corresponds to bitlocker-001)
    timestamp: "2023-03-10T14:30:00Z",
    userId: "101", // Changed to string representation of numeric user ID 101
    details: "Accessed BitLocker recovery key for Dell XPS 15"
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalAssets: 5,
  deployedAssets: 3,
  availableAssets: 1,
  maintenanceAssets: 1,
  totalUsers: 3,
  totalLicenses: 3,
  expiringLicenses: 1,
  totalComponents: 3,
  totalAccessories: 3,
  recentActivities: mockActivityLogs.slice(0, 5)
};