export type ThemeMode = 'light' | 'dark';

export type SupportedLanguage = 'EN' | 'HI' | 'MR' | 'TA' | 'TE' | 'BN';

export type UserRole = 'citizen' | 'officer';

export interface UserProfile {
  id: string;
  name: string;
  avatarInitials: string;
  role: UserRole;
  email: string;
  ward: string;
  district: string;
  state: string;
  aadhaarMasked: string;
  badge: string;
  karmaPoints: number;
  nationalRank: number;
  totalNationalNagriks: number;
  stateRank: number;
  totalStateNagriks: number;
  districtRank: number;
  totalDistrictNagriks: number;
  wardRank: number;
  totalWardNagriks: number;
}

export interface GrievanceAuditEntry {
  id: string;
  date: string;
  author: string;
  role: string;
  text: string;
  statusBadge?: string;
}

export interface Grievance {
  id: string;
  token: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  urgency: 'Urgent' | 'Priority' | 'Standard';
  severityScore: number;
  status: 'In Progress' | 'Resolved' | 'Under Triage' | 'Field Dispatched';
  state: string;
  district: string;
  ward: string;
  locationName: string;
  department: string;
  targetHours: number;
  hoursLeft: number;
  reportedAt: string;
  citizenName: string;
  citizenAvatar: string;
  citizenRole: string;
  verified: boolean;
  source?: 'voice' | 'web' | 'mobile' | 'emergency';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  supportsCount: number;
  isSupportedByMe?: boolean;
  latitude: number;
  longitude: number;
  auditTrail: GrievanceAuditEntry[];
}

export interface CivicReel {
  id: string;
  token: string;
  title: string;
  description: string;
  category: string;
  severityScore: number;
  status: string;
  slaLeft: string;
  state: string;
  district: string;
  ward: string;
  locality: string;
  department: string;
  creatorName: string;
  creatorAvatar: string;
  creatorVerified: boolean;
  date: string;
  videoUrl: string;
  thumbnailUrl: string;
  supportsCount: number;
  isSupportedByMe?: boolean;
  updates: GrievanceAuditEntry[];
}

export interface GISSpot {
  id: string;
  token: string;
  tier: 'national' | 'state' | 'district' | 'landmark';
  title: string;
  category: string;
  severity: 'CRITICAL HAZARD' | 'HIGH PRIORITY' | 'MODERATE ISSUE';
  severityScore: number;
  location: string;
  state: string;
  district: string;
  ward: string;
  details: string;
  department: string;
  sla: string;
  lat: number;
  lng: number;
  reportsCount: number;
}

export interface WelfareScheme {
  id: string;
  title: string;
  tagline: string;
  category: string;
  ministry: string;
  badge: string;
  entitlements: string[];
  eligibility: string[];
  documentsRequired: string[];
  applyLink: string;
  dbtBenefit?: string;
}

export interface NagrikCitizen {
  id: string;
  rank: number;
  name: string;
  avatarInitials: string;
  badge: string;
  karmaPoints: number;
  reportsFiled: number;
  reportsResolved: number;
  state: string;
  district: string;
  ward: string;
  standingText: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: string[];
  tags?: string[];
}
