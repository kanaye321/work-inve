// Asset Types
export interface Asset {
  id: number;
  assetTag: string;
  serialNumber?: string;
  model: string;
  status: "deployed" | "available" | "maintenance" | "decommissioned" | "assigned" | "returned" | "resigned" | "replacement" | "defective"; // Added more statuses based on AssetFormModal
  category: string;
  manufacturer?: string; // Added
  purchaseDate?: string; // Assuming string format like 'YYYY-MM-DD'
  purchaseCost?: number;
  warrantyExpires?: string; // Added, assuming string format like 'YYYY-MM-DD'
  assignedTo?: number | string; // Allow string based on AssetFormModal usage
  location?: string;
  notes?: string;
  ipAddress?: string;
  macAddress?: string;
  createdAt?: string;
  updatedAt?: string;
  dateReleased?: string; // Added based on AssetFormModal
  releasedBy?: string; // Added based on AssetFormModal
  financeChecked?: boolean; // Added based on AssetFormModal
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "manager" | "user"; // Added based on UsersPage usage
  department?: string;
  position?: string; // Added
  phone?: string;
  location?: string;
  isActive?: boolean; // Added
  isAdmin?: boolean; // Added for admin user creation
  lastLogin?: string; // Added based on UsersPage usage
  createdAt?: string;
  updatedAt?: string;
}

// Component Types
export interface Component {
  id: string;
  name: string;
  type: string;
  category: 'cpu' | 'ram' | 'storage' | 'gpu' | 'motherboard' | 'other';
  model: string;
  manufacturer: string;
  serialNumber: string;
  capacitySpecs?: string;
  purchaseDate: string;
  purchaseCost: number;
  status: 'available' | 'deployed' | 'maintenance' | 'decommissioned' | 'returned' | 'borrowed' | 'permanent';
  assignedTo?: string;
  assetId?: string;
  releasedBy?: string;
  dateReleased?: string;
  returnedTo?: string;
  dateReturned?: string;
  notes?: string;
}

// Accessory Types
export interface Accessory {
  id: number;
  name: string;
  category: string;
  manufacturer?: string;
  model?: string;
  purchaseDate?: string; // Assuming string format like 'YYYY-MM-DD'
  purchaseCost?: number;
  quantity: number;
  quantityAvailable: number;
  location?: string; // Added
  createdAt?: string;
  updatedAt?: string;
  // Add missing fields used in accessories page
  status?: 'returned' | 'borrowed' | 'permanent';
  assignedTo?: string;
  releasedBy?: string;
  dateReleased?: string;
  returnedTo?: string;
  dateReturned?: string;
  notes?: string;
}

// License Types
export interface License {
  id: number;
  name: string;
  software: string;
  key: string; // Added
  seats: number;
  seatsAvailable: number;
  purchaseDate?: string; // Assuming string format like 'YYYY-MM-DD'
  expirationDate?: string; // Assuming string format like 'YYYY-MM-DD'
  purchaseCost?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// BitLocker Key Types
export interface BitLockerKey {
  id: string;
  assetId: string;
  serialNumber: string;
  recoveryKey: string;
  createdAt: string;
  lastAccessed?: string;
  notes?: string;
}

// Zabbix VM Types
export interface ZabbixVM {
  id: string;
  name: string;
  hostId: string;
  ipAddress: string;
  status: 'up' | 'down' | 'unknown';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
  lastCheck: string;
  os?: string;
  notes?: string;
}

// VM Inventory Types
export interface VMInventory {
  id: string;
  startDate: string;
  endDate: string;
  validity: 'overdue' | 'available';
  hypervisor: string;
  hostname: string;
  hostModel: string;
  hostIpAddress: string;
  hostOS: string;
  rack: string;
  vmId: string;
  vmName: string;
  vmStatus: string;
  vmIpAddress: string;
  internetAccess: boolean;
  vmOS: string;
  vmOSVersion: string;
  deployedBy: string;
  user: string;
  department: string;
  jiraTicketNumber: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  action: string;
  itemType: "asset" | "user" | "component" | "accessory" | "license" | "bitlocker" | "vm" | "system";
  itemId: string;
  timestamp: string;
  userId: string;
  details: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalAssets: number;
  deployedAssets: number;
  availableAssets: number;
  maintenanceAssets: number;
  totalUsers: number;
  totalLicenses: number;
  expiringLicenses: number;
  totalComponents: number;
  totalAccessories: number;
  recentActivities: ActivityLog[];
}