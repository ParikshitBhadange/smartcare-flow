export type UserRole = 'hospital_admin' | 'central_admin' | 'policy_maker';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId?: string;
  avatar?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  region: string;
  type: 'government' | 'private' | 'charitable';
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

export type BatchStatus = 'normal' | 'low' | 'overstock' | 'near_expiry' | 'expired';

export interface DrugBatch {
  id: string;
  drugName: string;
  batchId: string;
  quantity: number;
  unit: string;
  location: string;
  expiryDate: string;
  manufacturer: string;
  status: BatchStatus;
  hospitalId: string;
  category: string;
  reorderLevel: number;
  lastUpdated: string;
}

export type TransferStatus = 'suggested' | 'approved' | 'in_transit' | 'completed' | 'rejected';
export type TransferReason = 'shortage' | 'overstock' | 'expiry_risk';

export interface Transfer {
  id: string;
  fromHospitalId: string;
  fromHospitalName: string;
  toHospitalId: string;
  toHospitalName: string;
  drugName: string;
  batchId: string;
  quantity: number;
  reason: TransferReason;
  status: TransferStatus;
  suggestedDate: string;
  approvedDate?: string;
  completedDate?: string;
  distance?: number;
  justification: string;
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';
export type AlertCategory = 'shortage' | 'overstock' | 'expiry' | 'system';

export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  description: string;
  drugName?: string;
  hospitalId: string;
  hospitalName: string;
  timestamp: string;
  isRead: boolean;
  actionTaken: boolean;
}

export interface KPIData {
  totalSKUs: number;
  totalStockValue: number;
  imminentExpiryBatches: number;
  activeShortageItems: number;
}

export interface StateKPIData {
  hospitalsWithShortage: number;
  totalExcessStock: number;
  atRiskExpiryValue: number;
}

export interface ConsumptionData {
  month: string;
  forecast: number;
  actual: number;
}

export interface CriticalDrug {
  drugName: string;
  hospitalsShort: number;
  hospitalsExcess: number;
  actionNeeded: string;
}

export interface ActivityItem {
  id: string;
  type: 'transfer' | 'delivery' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export interface RegionData {
  region: string;
  shortageIntensity: number; // 0-100
  excessIntensity: number; // 0-100
}
