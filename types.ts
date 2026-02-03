export enum UserRole {
  BENEFACTOR = 'BENEFACTOR',
  BENEFICIARY = 'BENEFICIARY'
}

export enum AssetCategory {
  SOCIAL = 'Social Media',
  FINANCIAL = 'Financial Accounts',
  LEGAL = 'Legal Documents',
  PERSONAL = 'Personal Files',
  CRYPTO = 'Crypto Wallets',
  GAMING = 'Gaming Accounts',
  HEIRLOOM = 'Physical Items'
}

export enum VerificationStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export enum AccountStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DECEASED = 'Deceased'
}

export type Permission = 'VIEW' | 'TRANSFER' | 'MANAGE';

export interface LegacyMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  handle?: string;
  description: string;
  password?: string;
  attachments?: string[]; 
  assignedNomineeIds: string[];
  status: 'Locked' | 'Assigned';
}

export interface Nominee {
  id: string;
  name: string;
  email: string;
  relationship: string;
  aadharNumber?: string;
  panNumber?: string;
  verificationStatus: VerificationStatus;
  securityKey: string;
  permissions: Permission[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profilePhoto?: string;
  role: UserRole;
  status: AccountStatus;
  legacyMessage?: string;
  legacyMedia?: LegacyMedia[];
}