import { Grievance, CivicReel, GISSpot, WelfareScheme, NagrikCitizen, UserProfile } from '../types';

export const currentUser: UserProfile = {
  id: 'usr_praneet_dubey',
  name: 'Praneet Dubey',
  avatarInitials: 'PD',
  role: 'citizen',
  email: 'praneet.dubey@gov.in',
  ward: 'Ward 14',
  district: 'Dhar',
  state: 'Madhya Pradesh',
  aadhaarMasked: 'XXXX-XXXX-5060',
  badge: 'Karmat Nagrik',
  karmaPoints: 480,
  nationalRank: 36,
  totalNationalNagriks: 40,
  stateRank: 14,
  totalStateNagriks: 18,
  districtRank: 9,
  totalDistrictNagriks: 13,
  wardRank: 1,
  totalWardNagriks: 1,
};

export const initialGrievances: Grievance[] = [
  {
    id: 'jv-1',
    token: '#2026-8941',
    title: 'Severe 3-Foot Deep Pothole & Waterlogging near Main Hospital Road',
    description: 'Deep road crater near Civil Hospital culvert in Ward 12. Multiple two-wheelers have slipped at night due to poor lighting and rapid water accumulation during monsoon downpours.',
    category: 'Roads & Potholes',
    subCategory: 'Road Surface Damage / Craters',
    urgency: 'Urgent',
    severityScore: 8.8,
    status: 'In Progress',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 12',
    locationName: 'Hospital Chowk, Near District Dispensary',
    department: 'Nagar Palika Parishad Pithampur',
    targetHours: 48,
    hoursLeft: 22,
    reportedAt: '12 Sep 2026 • 09:15 AM',
    citizenName: 'Praneet Dubey',
    citizenAvatar: 'PD',
    citizenRole: 'Citizen',
    verified: true,
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    supportsCount: 24,
    isSupportedByMe: true,
    latitude: 22.5989,
    longitude: 75.3039,
    auditTrail: [
      {
        id: 'aud-1',
        date: '12 Sep 2026 • 09:15 AM',
        author: 'Praneet Dubey (Citizen)',
        role: 'Citizen',
        text: 'Report registered with video evidence. Automated statutory token generated.',
        statusBadge: 'REGISTERED'
      },
      {
        id: 'aud-2',
        date: '12 Sep 2026 • 10:45 AM',
        author: 'AI Smart Triage',
        role: 'Automated AI Engine',
        text: 'Severity triage verified at 8.8/10. High traffic impact detected. Auto-routed to Nagar Palika Parishad Pithampur.',
        statusBadge: 'TRIAGED'
      },
      {
        id: 'aud-3',
        date: '12 Sep 2026 • 02:30 PM',
        author: 'Er. Rajesh Soni (Junior Engineer)',
        role: 'ULB Officer',
        text: 'Rapid cold-mix asphalt patch truck and compaction roller dispatched to site. Work under execution.',
        statusBadge: 'FIELD DISPATCHED'
      }
    ]
  },
  {
    id: 'jv-2',
    token: '#2026-8912',
    title: 'Overflowing Municipal Garbage Dump & Open Waste Burning behind Central Market',
    description: 'Community dumpster near Gandhi Chowk overflowing for 4 consecutive days. Stray cattle and pungent odor causing acute breathing difficulty for local shopkeepers and school commuters.',
    category: 'Garbage & Sanitation',
    subCategory: 'Solid Waste Overaccumulation',
    urgency: 'Urgent',
    severityScore: 8.4,
    status: 'In Progress',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 08',
    locationName: 'Sector 3 Market Square, Main Bazar',
    department: 'Swachh Bharat Mission Cell, Nagar Palika',
    targetHours: 24,
    hoursLeft: 9,
    reportedAt: '12 Sep 2026 • 07:40 AM',
    citizenName: 'Meera Sharma',
    citizenAvatar: 'MS',
    citizenRole: 'Citizen',
    verified: true,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    supportsCount: 31,
    isSupportedByMe: false,
    latitude: 22.602,
    longitude: 75.309,
    auditTrail: [
      {
        id: 'aud-20',
        date: '12 Sep 2026 • 07:40 AM',
        author: 'Meera Sharma',
        role: 'Citizen',
        text: 'Issue logged via WhatsApp Voice Bot. Source segregated photo uploaded.',
        statusBadge: 'REGISTERED'
      },
      {
        id: 'aud-21',
        date: '12 Sep 2026 • 08:10 AM',
        author: 'Sanitation Inspector Office',
        role: 'ULB Officer',
        text: 'Hydraulic tipper dumper routed to Sector 3. Notice issued against illegal open waste incineration.',
        statusBadge: 'INSPECTION ACTIVE'
      }
    ]
  },
  {
    id: 'jv-3',
    token: '#2026-4412',
    title: 'Monsoon Stormwater Drain Desilting Blocked on Linking Road Bandra',
    description: 'Choked roadside drain leading to 1.5-foot water accumulation near shopping galleria. High risk of commercial water intrusion during upcoming high tide forecast.',
    category: 'Sewage & Drain Overflow',
    subCategory: 'Stormwater Clogging',
    urgency: 'Priority',
    severityScore: 7.0,
    status: 'Resolved',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    ward: 'Ward H-West',
    locationName: 'Linking Road, Bandra West, Mumbai Suburban',
    department: 'Brihanmumbai Municipal Corporation (H-West Ward)',
    targetHours: 24,
    hoursLeft: 0,
    reportedAt: '29 Aug 2026 • 02:20 PM',
    citizenName: 'Aarav K. Mehta',
    citizenAvatar: 'AM',
    citizenRole: 'Citizen',
    verified: true,
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    supportsCount: 18,
    isSupportedByMe: true,
    latitude: 19.0607,
    longitude: 72.8362,
    auditTrail: [
      {
        id: 'aud-31',
        date: '29 Aug 2026 • 02:20 PM',
        author: 'Aarav K. Mehta',
        role: 'Citizen',
        text: 'Video proof uploaded showing storm backflow onto footpath.',
        statusBadge: 'REPORTED'
      },
      {
        id: 'aud-32',
        date: '29 Aug 2026 • 05:00 PM',
        author: 'BMC Maintenance Wing',
        role: 'Municipal Contractor',
        text: 'Suction jetting machine operated over 400 meters of concrete culverts. 3.2 tonnes of silt removed.',
        statusBadge: 'WORK COMPLETE'
      },
      {
        id: 'aud-33',
        date: '30 Aug 2026 • 08:30 AM',
        author: 'Quality Audit Cell',
        role: 'AI & Officer Dual Audit',
        text: 'Drain flow capacity restored to 100%. Citizen verified water level normalized.',
        statusBadge: 'CERTIFIED RESOLVED'
      }
    ]
  },
  {
    id: 'jv-4',
    token: '#2026-6632',
    title: 'High-Tension Wire Snapped and Dangling near Municipal Middle School',
    description: '11kV transmission wire hanging less than 5 feet above pedestrian pathway following heavy thunderstorm winds. Severe electrocution hazard for school students.',
    category: 'Electricity Hazard & Wiring',
    subCategory: 'Live Wire Snapping',
    urgency: 'Urgent',
    severityScore: 9.6,
    status: 'In Progress',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 04',
    locationName: 'Near Govt Boys School, Mandu Road',
    department: 'MP Paschim Kshetra Vidyut Vitaran Co. Ltd (MPPKVVCL)',
    targetHours: 6,
    hoursLeft: 2,
    reportedAt: '12 Sep 2026 • 11:30 AM',
    citizenName: 'Suresh Chandra Patidar',
    citizenAvatar: 'SP',
    citizenRole: 'Citizen',
    verified: true,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    supportsCount: 47,
    isSupportedByMe: true,
    latitude: 22.6105,
    longitude: 75.3121,
    auditTrail: [
      {
        id: 'aud-41',
        date: '12 Sep 2026 • 11:30 AM',
        author: 'Suresh Chandra Patidar',
        role: 'Citizen',
        text: 'Emergency priority ticket raised. Automated trigger to DISCOM substation engineer.',
        statusBadge: 'EMERGENCY TRIGGER'
      },
      {
        id: 'aud-42',
        date: '12 Sep 2026 • 11:42 AM',
        author: 'Discom Substation 33/11kV',
        role: 'DISCOM Engineer',
        text: 'Feeder isolated immediately from control center. Lineman gang on site for restringing.',
        statusBadge: 'POWER ISOLATED'
      }
    ]
  },
  {
    id: 'jv-5',
    token: '#2026-3109',
    title: 'Main Pipeline Rupture causing 4-Day Clean Water Supply Outage',
    description: 'Pumping main supplying 400 households in Ward 14 ruptured during optical fiber excavation. Thousands of liters of drinking water wasted while residents are relying on paid private tankers.',
    category: 'Drinking Water & Pipeline Leakage',
    subCategory: 'Pipeline Rupture',
    urgency: 'Urgent',
    severityScore: 8.9,
    status: 'In Progress',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 14',
    locationName: 'Bada Mandir Gali, Dhar Old City',
    department: 'Public Health Engineering Dept (PHED)',
    targetHours: 24,
    hoursLeft: 11,
    reportedAt: '12 Sep 2026 • 06:10 AM',
    citizenName: 'Praneet Dubey',
    citizenAvatar: 'PD',
    citizenRole: 'Citizen',
    verified: true,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=800&q=80',
    supportsCount: 38,
    isSupportedByMe: true,
    latitude: 22.597,
    longitude: 75.302,
    auditTrail: [
      {
        id: 'aud-51',
        date: '12 Sep 2026 • 06:10 AM',
        author: 'Praneet Dubey',
        role: 'Citizen',
        text: 'Water supply emergency ticket raised with geo-tagged images.',
        statusBadge: 'REGISTERED'
      },
      {
        id: 'aud-52',
        date: '12 Sep 2026 • 09:00 AM',
        author: 'PHED Water Works Team',
        role: 'ULB Officer',
        text: 'Emergency valve isolated. Temporary water tanker fleet dispatched to Ward 14.',
        statusBadge: 'RELIEF DEPLOYED'
      }
    ]
  },
  {
    id: 'jv-6',
    token: '#2026-7781',
    title: 'Dark Corridor: 14 Consecutive LED Streetlights Non-Operational on Ring Road',
    description: 'Critical 1.2km stretch pitch black for past two weeks. Women commuters feel unsafe and two hit-and-run incidents have been reported to the local police.',
    category: 'Streetlights',
    subCategory: 'Streetlight Blackout',
    urgency: 'Priority',
    severityScore: 7.8,
    status: 'Resolved',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 19',
    locationName: 'Bypass Ring Road Junction, Dhar',
    department: 'Municipal Electrical Wing (EESL Cell)',
    targetHours: 48,
    hoursLeft: 0,
    reportedAt: '05 Sep 2026 • 08:00 PM',
    citizenName: 'Pooja Vishwakarma',
    citizenAvatar: 'PV',
    citizenRole: 'Citizen',
    verified: true,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    supportsCount: 29,
    isSupportedByMe: false,
    latitude: 22.615,
    longitude: 75.295,
    auditTrail: [
      {
        id: 'aud-61',
        date: '05 Sep 2026 • 08:00 PM',
        author: 'Pooja Vishwakarma',
        role: 'Citizen',
        text: 'Reported non-functional streetlight corridor with photos.',
        statusBadge: 'LOGGED'
      },
      {
        id: 'aud-62',
        date: '07 Sep 2026 • 06:30 PM',
        author: 'EESL Maintenance Squad',
        role: 'Contractor',
        text: 'Replaced 14 CCMS nodes and installed high-lumen LED luminaires. Lux level verified at 28 lux.',
        statusBadge: 'RESOLVED'
      }
    ]
  },
  {
    id: 'jv-7',
    token: '#2026-9043',
    title: 'Stagnant Water Pool Breeding Dengue Mosquitos near Primary Health Sub-Centre',
    description: 'Uncovered municipal plot with 2-foot stagnant rainwater. Local pediatric clinic reports spike of 9 fever and dengue cases in last week. Immediate fogging and larvicide needed.',
    category: 'Health & Fogging',
    subCategory: 'Vector Breeding / Larvicidal',
    urgency: 'Priority',
    severityScore: 7.9,
    status: 'In Progress',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 06',
    locationName: 'Behind Civil Dispensary, Dhar',
    department: 'District Vector Borne Disease Control Office',
    targetHours: 24,
    hoursLeft: 14,
    reportedAt: '12 Sep 2026 • 10:10 AM',
    citizenName: 'Dr. Anand Kulkarni',
    citizenAvatar: 'AK',
    citizenRole: 'Citizen (Doctor)',
    verified: true,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    supportsCount: 35,
    isSupportedByMe: true,
    latitude: 22.605,
    longitude: 75.305,
    auditTrail: [
      {
        id: 'aud-71',
        date: '12 Sep 2026 • 10:10 AM',
        author: 'Dr. Anand Kulkarni',
        role: 'Citizen',
        text: 'Medical alert flagged. AI prioritized to Health & Sanitation cell.',
        statusBadge: 'HEALTH ALERT'
      }
    ]
  }
];

export const initialReels: CivicReel[] = [
  {
    id: 'reel-1',
    token: '#2026-4412',
    title: 'Monsoon Stormwater Drain Desilting Blocked on Linking Road Bandra',
    description: 'Choked roadside drain leading to 1.5-foot water accumulation near shopping galleria. High risk of commercial water intrusion during high tide forecast.',
    category: 'Sewage & Drain Overflow',
    severityScore: 7.0,
    status: 'RESOLVED & VERIFIED',
    slaLeft: '0h left (Resolved in 18h)',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    ward: 'Ward H-West (Bandra West)',
    locality: 'Linking Road, Bandra West, Mumbai Suburban, Maharashtra',
    department: 'Brihanmumbai Municipal Corporation (H-West Ward)',
    creatorName: 'Aarav K. Mehta',
    creatorAvatar: 'AM',
    creatorVerified: true,
    date: '29 Aug 2026 • Ward H-West (Bandra West)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-1749-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    supportsCount: 18,
    isSupportedByMe: true,
    updates: [
      {
        id: 'up-1',
        date: '29 Aug 2026 • 02:20 PM',
        author: 'Aarav K. Mehta',
        role: 'Citizen Reporter',
        text: 'Water entered 3 retail shops at ground level. Urgently need desilting vehicle.',
        statusBadge: 'FILED'
      },
      {
        id: 'up-2',
        date: '29 Aug 2026 • 06:15 PM',
        author: 'BMC Emergency Monsoon Cell',
        role: 'ULB Maintenance',
        text: 'High-power super-sucker de-watering pump deployed. Water cleared in 90 minutes.',
        statusBadge: 'PUMPED'
      },
      {
        id: 'up-3',
        date: '30 Aug 2026 • 09:00 AM',
        author: 'Ward H-West Audit Officer',
        role: 'Government Inspector',
        text: 'Field inspection verified. Both inlet grates cleared and concrete slab reinforced.',
        statusBadge: 'CERTIFIED'
      }
    ]
  },
  {
    id: 'reel-2',
    token: '#2026-8941',
    title: 'Severe 3-Foot Deep Pothole & Waterlogging near Main Hospital Road',
    description: 'Deep road crater near Civil Hospital culvert in Ward 12. Multiple two-wheelers have slipped at night due to poor lighting and rapid water accumulation.',
    category: 'Roads & Potholes',
    severityScore: 8.8,
    status: 'IN PROGRESS',
    slaLeft: '22h left',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 12',
    locality: 'Hospital Chowk, Near District Dispensary, Dhar, MP',
    department: 'Nagar Palika Parishad Pithampur',
    creatorName: 'Praneet Dubey',
    creatorAvatar: 'PD',
    creatorVerified: true,
    date: '12 Sep 2026 • Ward 12 (Civil Hospital)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-traveling-on-a-road-in-the-countryside-40893-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    supportsCount: 24,
    isSupportedByMe: true,
    updates: [
      {
        id: 'up-21',
        date: '12 Sep 2026 • 09:15 AM',
        author: 'Praneet Dubey',
        role: 'Citizen Reporter',
        text: 'Ambulances are having to take a 4 km detour. Requesting immediate patchwork.',
        statusBadge: 'EMERGENCY'
      },
      {
        id: 'up-22',
        date: '12 Sep 2026 • 02:30 PM',
        author: 'Junior Engineer Road Maintenance',
        role: 'ULB Officer',
        text: 'Material and steam roller arrived on site. Wet patch being excavated.',
        statusBadge: 'DISPATCHED'
      }
    ]
  },
  {
    id: 'reel-3',
    token: '#2026-8912',
    title: 'Overflowing Municipal Garbage Dump & Open Waste Burning behind Central Market',
    description: 'Community dumpster near Gandhi Chowk overflowing for 4 consecutive days. Stray cattle and pungent odor causing acute breathing difficulty for local shopkeepers.',
    category: 'Garbage & Sanitation',
    severityScore: 8.4,
    status: 'IN PROGRESS',
    slaLeft: '9h left',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 08',
    locality: 'Sector 3 Market Square, Main Bazar, Dhar',
    department: 'Swachh Bharat Mission Cell, Nagar Palika',
    creatorName: 'Meera Sharma',
    creatorAvatar: 'MS',
    creatorVerified: true,
    date: '12 Sep 2026 • Ward 08 (Main Bazar)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-sorting-waste-materials-for-recycling-49817-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    supportsCount: 31,
    isSupportedByMe: false,
    updates: [
      {
        id: 'up-31',
        date: '12 Sep 2026 • 07:40 AM',
        author: 'Meera Sharma',
        role: 'Citizen',
        text: 'Dumpster full to brim. People dumping on pedestrian walkway.',
        statusBadge: 'LOGGED'
      }
    ]
  }
];

export const initialGISSpots: GISSpot[] = [
  {
    id: 'spot-1',
    token: 'SPOT-NH44-GWL',
    tier: 'national',
    title: 'NH-44 North-South Highway Corridor Chokepoint',
    category: 'Roads & Potholes',
    severity: 'CRITICAL HAZARD',
    severityScore: 9.4,
    location: 'NH-44 Gwalior-Jhansi-Lalitpur Section',
    state: 'Madhya Pradesh',
    district: 'Gwalior',
    ward: 'Highway Segment KM 118',
    details: 'Monsoon heavy vehicle axle road deformation, 1.5-meter deep crater clusters, and zero reflective markers creating high-risk collision zones.',
    department: 'NHAI PIU / Ministry of Road Transport & Highways',
    sla: '24h - 48h',
    lat: 26.2183,
    lng: 78.1828,
    reportsCount: 42
  },
  {
    id: 'spot-2',
    token: 'SPOT-DMIC-PIT',
    tier: 'district',
    title: 'DMIC Pithampur Freight Bypass & Bagdun Junction',
    category: 'Roads & Potholes',
    severity: 'CRITICAL HAZARD',
    severityScore: 8.9,
    location: 'Sector 3 Industrial Hub, Dhar-Indore Corridor',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Pithampur Industrial Zone',
    details: 'Industrial freight bottleneck with broken concrete culverts, unpaved muddy road shoulders, and heavy commercial vehicle stagnation during shifts.',
    department: 'MP Industrial Development Corporation (MPIDC)',
    sla: '24h - 48h',
    lat: 22.612,
    lng: 75.362,
    reportsCount: 29
  },
  {
    id: 'spot-3',
    token: 'SPOT-IND-RAJ',
    tier: 'state',
    title: 'Rajwada Heritage Chokepoint & Water Supply Breakdown',
    category: 'Drinking Water & Pipeline Leakage',
    severity: 'HIGH PRIORITY',
    severityScore: 8.2,
    location: 'Rajwada Circle & MG Road, Indore Central',
    state: 'Madhya Pradesh',
    district: 'Indore',
    ward: 'Ward 45 Central',
    details: 'Sub-surface 300mm cast-iron pipeline fractured, causing road depression near heritage structure and drinking water loss for 1,200 shops.',
    department: 'Indore Municipal Corporation (IMC)',
    sla: '24h',
    lat: 22.7196,
    lng: 75.8577,
    reportsCount: 38
  },
  {
    id: 'spot-4',
    token: 'SPOT-DHR-HOS',
    tier: 'landmark',
    title: 'Civil Hospital Stormwater Backflow & Culvert Blockade',
    category: 'Sewage & Drain Overflow',
    severity: 'CRITICAL HAZARD',
    severityScore: 8.8,
    location: 'District Hospital Approach Road, Dhar',
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 12 Hospital Area',
    details: '3-foot deep pothole & waterlogging obstructing ambulance entrance. Emergency department detour required.',
    department: 'Nagar Palika Parishad Dhar',
    sla: '12h - 24h',
    lat: 22.5989,
    lng: 75.3039,
    reportsCount: 24
  }
];

export const welfareSchemes: WelfareScheme[] = [
  {
    id: 'scheme-1',
    title: 'Swachh Bharat Mission (Urban 2.0)',
    tagline: 'Open Defecation Free (ODF++) & 100% Scientific Waste Processing for All ULBs',
    category: 'Sanitation & Solid Waste Management',
    ministry: 'Ministry of Housing & Urban Affairs',
    badge: 'Direct Benefit Transfer (DBT)',
    entitlements: [
      'Individual Household Latrine (IHHL) financial subsidy up to ₹10,000 directly transferred to Aadhaar-linked account.',
      'Community and Public Toilets (CT/PT) with IoT hygiene sensors and continuous water supply.',
      'Door-to-door 100% source-segregated solid waste collection with GPS-tracked compactor fleet.',
      'Bioremediation of all legacy dumpsites across 4,500+ Indian urban local bodies.'
    ],
    eligibility: [
      'Urban citizens without access to safe individual household toilet facilities.',
      'Resident Welfare Associations (RWAs) adopting zero-waste society protocols.',
      'BPL cardholders and low-income urban informal settlements.'
    ],
    documentsRequired: [
      'Aadhaar Card (Mandatory for DBT)',
      'Bank Account passbook / cancelled cheque',
      'Proof of Residence / ULB electricity bill',
      'Site photograph of prospective toilet location'
    ],
    applyLink: 'https://swachhbharaturban.gov.in',
    dbtBenefit: '₹10,000 / toilet'
  },
  {
    id: 'scheme-2',
    title: 'AMRUT 2.0 (Atal Mission for Rejuvenation)',
    tagline: 'Universal Water Tap Coverage & 100% Sewage/Septage Management in 500 Cities',
    category: 'Drinking Water & Sewerage',
    ministry: 'Ministry of Housing & Urban Affairs',
    badge: 'Universal Infrastructure',
    entitlements: [
      '2.68 Crore functional household water tap connections across urban India.',
      'Rejuvenation of water bodies, urban lakes, wetlands, and aquifer recharge wells.',
      'City Water Balance Plans (CWBP) and non-revenue water (NRW) reduction below 20%.',
      'Circular economy of water: 20% recycled water mandatory for industrial/civic landscaping.'
    ],
    eligibility: [
      'All statutory towns and urban agglomerations across 28 States & 8 UTs.',
      'Households currently unserved by municipal piped water grid.'
    ],
    documentsRequired: [
      'Property Tax Receipt / Holding Number',
      'Aadhaar of Head of Household',
      'Site locality layout sketch'
    ],
    applyLink: 'https://amrut.gov.in',
    dbtBenefit: 'Free Tap Connection & Water Meter'
  },
  {
    id: 'scheme-3',
    title: 'PM Awas Yojana - Urban 2.0 (PMAY-U)',
    tagline: 'Affordable Pucca Housing for All Eligible Urban Families & EWS/LIG',
    category: 'Housing & Urban Development',
    ministry: 'Ministry of Housing & Urban Affairs',
    badge: 'Interest Subvention Subsidy',
    entitlements: [
      'Direct interest subvention subsidy up to ₹2.67 Lakhs on home loans for EWS and LIG beneficiaries.',
      'Affordable Housing in Partnership (AHP) with all civic amenities (water, electricity, sewerage, roads).',
      'Beneficiary-Led Individual House Construction (BLC) direct grant of ₹1.5 Lakhs to ₹2.5 Lakhs.',
      'All houses geo-tagged and registered in the name of the female head or joint ownership.'
    ],
    eligibility: [
      'Family must not own a pucca house in any part of India.',
      'Annual household income within EWS (up to ₹3 Lakh) or LIG (up to ₹6 Lakh) limits.',
      'Aadhaar biometric authentication.'
    ],
    documentsRequired: [
      'Aadhaar Card and PAN Card',
      'Income Certificate issued by competent Revenue Authority',
      'Land title document (for BLC category)',
      'Bank statement for past 6 months'
    ],
    applyLink: 'https://pmay-urban.gov.in',
    dbtBenefit: 'Up to ₹2,67,000 Subsidy'
  },
  {
    id: 'scheme-4',
    title: 'PM SVANidhi (Urban Street Vendors Micro-Credit)',
    tagline: 'Collateral-Free Working Capital Loan for Urban Street Vendors with 7% Interest Subsidy',
    category: 'Livelihoods & Informal Economy',
    ministry: 'Ministry of Housing & Urban Affairs',
    badge: 'Working Capital Loan',
    entitlements: [
      'First tranche collateral-free loan of ₹10,000; second tranche of ₹20,000; third tranche up to ₹50,000 on timely repayment.',
      '7% interest subsidy per annum credited directly to bank account on quarterly basis.',
      'Digital transaction cashback up to ₹1,200 per year (₹100/month) for QR code payments.',
      'Social security linkage under PM Jeevan Jyoti, PM Suraksha Bima, and Janani Suraksha.'
    ],
    eligibility: [
      'All urban street vendors holding Certificate of Vending / ID Card issued by ULBs.',
      'Vendors possessing Letter of Recommendation (LoR) from Town Vending Committee (TVC).'
    ],
    documentsRequired: [
      'Aadhaar-linked Mobile Number',
      'Vending ID / Certificate of Vending / LoR',
      'Bank Account Details with IFSC'
    ],
    applyLink: 'https://pmsvanidhi.mohua.gov.in',
    dbtBenefit: '₹10,000 - ₹50,000 Loan + 7% Subsidy'
  },
  {
    id: 'scheme-5',
    title: 'Jal Jeevan Mission (Urban Mission)',
    tagline: 'Universal Quality-Monitored Drinking Water Tap for Every Single Urban Household',
    category: 'Drinking Water & Pipeline Leakage',
    ministry: 'Ministry of Jal Shakti & MoHUA',
    badge: 'Quality Potable Water',
    entitlements: [
      'Prescribed potable water supply of 135 liters per capita per day (lpcd) conforming to BIS 10500 standards.',
      'Real-time IoT water quality sensors (pH, turbidity, residual chlorine) installed at ward reservoirs.',
      'Free laboratory testing of tap water samples for citizen welfare.',
      'Direct grievance redressal within 24 hours of contamination or pressure loss reporting.'
    ],
    eligibility: [
      'Households facing erratic, contaminated, or low-pressure water supply.',
      'Slum clusters and peripheral urban habitations without piped connections.'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Ward Proof / Ration Card',
      'Holding Number / Municipal Tax Bill'
    ],
    applyLink: 'https://jaljeevanmission.gov.in',
    dbtBenefit: '135 lpcd Safe Water Tap'
  },
  {
    id: 'scheme-6',
    title: 'DAY-NULM (National Urban Livelihoods Mission)',
    tagline: 'Self-Help Group Formation, Skill Certification & Micro-Enterprise Subsidized Credit',
    category: 'Livelihoods & Skill Development',
    ministry: 'Ministry of Housing & Urban Affairs',
    badge: 'Self-Reliance & Enterprise',
    entitlements: [
      'Interest subvention over and above 7% on bank loans for individual micro-enterprises up to ₹2 Lakhs.',
      'Credit support up to ₹10 Lakhs for Self-Help Groups (SHGs) of urban women.',
      'Free market-aligned vocational skill training with recognized NSQF certification.',
      'Permanent 24x7 Shelters for Urban Homeless (SUH) equipped with beds, hygiene, and nutrition.'
    ],
    eligibility: [
      'Urban poor youth (aged 18-35) seeking vocational training and employment.',
      'Urban women wishing to form SHG federations and launch community micro-enterprises.',
      'Urban homeless and migrant workers.'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Educational certificate (minimum 8th standard for technical courses)',
      'BPL card / EWS certificate',
      'Passport size photographs'
    ],
    applyLink: 'https://nulm.gov.in',
    dbtBenefit: 'Subsidized Loan up to ₹10 Lakh'
  }
];

export const nagrikLeaderboard: NagrikCitizen[] = [
  {
    id: 'nag-1',
    rank: 1,
    name: 'Rameshwar Patel',
    avatarInitials: 'RP',
    badge: 'Param Karmat Nagrik',
    karmaPoints: 920,
    reportsFiled: 44,
    reportsResolved: 41,
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 14 (Old Palace & Bada Bazar)',
    standingText: 'Top 1% in District • 41 certified field audits verified'
  },
  {
    id: 'nag-2',
    rank: 2,
    name: 'Smt. Sunita Verma',
    avatarInitials: 'SV',
    badge: 'Karmat Nagrik',
    karmaPoints: 840,
    reportsFiled: 38,
    reportsResolved: 35,
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 07 (Civil Lines & Court Area)',
    standingText: 'Top 3 in District • SBM Volunteer of the Month'
  },
  {
    id: 'nag-3',
    rank: 3,
    name: 'Dr. Anand Kulkarni',
    avatarInitials: 'AK',
    badge: 'Karmat Nagrik',
    karmaPoints: 780,
    reportsFiled: 32,
    reportsResolved: 30,
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 22 (Industrial Area & Bypass)',
    standingText: 'District Health Champion • 14 dengue clusters prevented'
  },
  {
    id: 'nag-4',
    rank: 4,
    name: 'Kavita Solanki',
    avatarInitials: 'KS',
    badge: 'Karmat Nagrik',
    karmaPoints: 690,
    reportsFiled: 28,
    reportsResolved: 26,
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 03 (Gandhi Chowk)',
    standingText: 'Top 5 in District • Active community organiser'
  },
  {
    id: 'nag-5',
    rank: 5,
    name: 'Virendra Singh Chouhan',
    avatarInitials: 'VC',
    badge: 'Karmat Nagrik',
    karmaPoints: 620,
    reportsFiled: 25,
    reportsResolved: 23,
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 11 (Trimurti Nagar)',
    standingText: 'Active Road & Pothole Spotter'
  },
  {
    id: 'nag-9',
    rank: 9,
    name: 'Praneet Dubey',
    avatarInitials: 'PD',
    badge: 'Karmat Nagrik',
    karmaPoints: 480,
    reportsFiled: 19,
    reportsResolved: 17,
    state: 'Madhya Pradesh',
    district: 'Dhar',
    ward: 'Ward 14 (Old Palace & Bada Bazar)',
    standingText: 'Rank #9 in Dhar District • 120 pts to next rank'
  }
];

export const indianStates = [
  'Madhya Pradesh',
  'Maharashtra',
  'Delhi (NCT)',
  'Uttar Pradesh',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'West Bengal',
  'Rajasthan',
  'Bihar',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Punjab',
  'Haryana',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa',
  'Jammu & Kashmir',
  'Puducherry'
];

export const categoriesList = [
  'All Civic Issues',
  'Roads & Potholes',
  'Garbage & Sanitation',
  'Drinking Water & Pipeline Leakage',
  'Electricity Hazard & Wiring',
  'Sewage & Drain Overflow',
  'Streetlights',
  'Health & Fogging'
];
