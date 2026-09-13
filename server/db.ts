export interface CitizenSubmission {
  id: number;
  token?: string;
  anonymous_user_id: string;
  title?: string;
  original_text: string;
  translated_text: string;
  normalized_text: string;
  language: string;
  category: string;
  sub_category: string;
  urgency_score: number;
  sentiment_score: number;
  confidence_score: number;
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  block: string;
  ward?: string;
  location_name: string;
  landmark?: string;
  department?: string;
  severity?: string;
  urgency?: string;
  sla_hours?: number;
  media_url?: string;
  media_type?: string;
  media?: Array<{ type: 'image' | 'video'; url: string }>;
  extracted_details?: Record<string, any>;
  source_channel: string;
  status: string;
  created_at: string;
}

export interface DemographicData {
  id: number;
  state: string;
  district: string;
  block: string;
  population: number;
  population_density: number;
  rural_population: number;
  urban_population: number;
  youth_ratio: number;
  elderly_ratio: number;
}

export interface InfrastructureIndex {
  id: number;
  state: string;
  district: string;
  category: string;
  score: number;
  national_average: number;
  regional_average: number;
}

export interface PublicInvestment {
  id: number;
  project_name: string;
  state: string;
  district: string;
  category: string;
  budget: number;
  status: string;
  start_date: string;
  expected_completion: string;
}

export interface Hotspot {
  id: number;
  state: string;
  district: string;
  category: string;
  latitude: number;
  longitude: number;
  request_count: number;
  request_growth_rate: number;
  average_urgency: number;
  population_impact: number;
  infrastructure_gap: number;
  investment_gap: number;
  demand_score: number;
  hotspot_score: number;
  created_at: string;
}

export interface Recommendation {
  id: number;
  hotspot_id: number;
  title: string;
  category: string;
  priority_score: number;
  estimated_budget: number;
  estimated_population_impact: string;
  expected_benefit: string;
  explanation: string;
  why_now: string;
  why_here: string;
  why_intervention: string;
  risk_level: string;
  confidence: number;
  created_at: string;
}

const DISTRICT_COORDS: Record<string, [number, number]> = {
  'Demo District Alpha': [23.4500, 77.5500],
  'Demo District Beta': [22.9500, 76.2000],
  'Demo District Gamma': [24.1000, 78.1000],
  'Demo District Delta': [21.8000, 76.8000],
  'Demo District Epsilon': [23.8000, 79.2000],
  'Bhopal': [23.2599, 77.4126],
  'Indore': [22.7196, 75.8577],
  'Pune': [18.5204, 73.8567],
  'Chennai': [13.0827, 80.2707],
  'Hyderabad': [17.3850, 78.4867],
  'Kolkata': [22.5726, 88.3639],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Guwahati': [26.1445, 91.7362],
  'Patna': [25.5941, 85.1376],
  'Ranchi': [23.3441, 85.3096],
  'Nagpur': [21.1458, 79.0882],
  'Nashik': [19.9975, 73.7898],
  'Coimbatore': [11.0168, 76.9558],
  'Mysuru': [12.2958, 76.6394],
};

const PROJECTS: Record<string, [string, number, string]> = {
  Water: ['District Water Storage & Pipeline Expansion', 4500000, 'Expand storage and last-mile pipeline capacity.'],
  Healthcare: ['Rural Primary Care Access Upgrade', 3800000, 'Strengthen primary care coverage with staffing and mobile outreach.'],
  Roads: ['Rural Corridor Connectivity Upgrade', 5200000, 'Repair priority road links connecting high-demand communities.'],
  Education: ['School Infrastructure & Connectivity Upgrade', 3200000, 'Improve school facilities and digital connectivity.'],
  Electricity: ['Reliable Village Power Upgrade', 4100000, 'Reinforce distribution capacity and service reliability.'],
  Sanitation: ['Comprehensive Waste & Sanitation Management', 3500000, 'Construct modern drainage systems and community sanitation units.'],
  Internet: ['Rural Digital Connectivity & Fiber Expansion', 2800000, 'Deploy community Wi-Fi hubs and last-mile optical fiber connectivity.']
};

function clamp(v: number): number {
  return Math.max(0.0, Math.min(100.0, Number(v) || 0));
}

function hotspotScore(
  demand: number,
  urgency: number,
  population: number,
  infraGap: number,
  growth: number,
  investmentGap: number
): number {
  return clamp(
    demand * 0.25 +
    urgency * 0.20 +
    population * 0.20 +
    infraGap * 0.15 +
    growth * 0.10 +
    investmentGap * 0.10
  );
}

function priorityScore(hotspot: number, feasibility = 75): number {
  return clamp(hotspot * 0.75 + feasibility * 0.25);
}

class InMemDB {
  submissions: CitizenSubmission[] = [];
  demographics: DemographicData[] = [];
  infrastructure: InfrastructureIndex[] = [];
  investments: PublicInvestment[] = [];
  hotspots: Hotspot[] = [];
  recommendations: Recommendation[] = [];

  private nextSubId = 1;
  private nextInvId = 1;
  private nextHotspotId = 1;
  private nextRecId = 1;

  constructor() {
    this.seed();
  }

  seed() {
    const districts = Object.keys(DISTRICT_COORDS);
    const categories = ['Water', 'Roads', 'Healthcare', 'Education', 'Electricity', 'Sanitation', 'Internet'];

    let dId = 1;
    for (const d of districts) {
      const pop = Math.floor(45000 + ((d.charCodeAt(0) * 8321) % 235000));
      this.demographics.push({
        id: dId++,
        state: 'Madhya Pradesh',
        district: d,
        block: 'Block 1',
        population: pop,
        population_density: 150 + (pop % 700),
        rural_population: Math.floor(pop * 0.7),
        urban_population: Math.floor(pop * 0.3),
        youth_ratio: 0.32,
        elderly_ratio: 0.08
      });

      for (const c of categories) {
        const score = (d === 'Demo District Alpha' && c === 'Water') ? 28 : 40 + ((d.length * 7 + c.length * 13) % 40);
        this.infrastructure.push({
          id: this.infrastructure.length + 1,
          state: 'Madhya Pradesh',
          district: d,
          category: c,
          score,
          national_average: 61,
          regional_average: 55
        });
      }

      for (let j = 0; j < 2; j++) {
        const c = categories[(d.length + j * 3) % categories.length];
        this.investments.push({
          id: this.nextInvId++,
          project_name: `${c} Improvement Package ${j + 1}`,
          state: 'Madhya Pradesh',
          district: d,
          category: c,
          budget: 1200000 + ((d.length * 1100000 + j * 900000) % 3800000),
          status: j === 0 ? 'Active' : 'Planned',
          start_date: '2026-01-01',
          expected_completion: '2027-12-31'
        });
      }
    }

    const samplePhrases: Record<string, string[]> = {
      Water: ['हमारे गांव में पानी की बहुत समस्या है।', 'There is no clean water in our village', 'தண்ணீர் விநியோகம் மிகவும் குறைவாக உள்ளது.'],
      Roads: ['गांव की सड़क बहुत खराब है।', 'The village road is broken and damaged', 'சாலை மிகவும் பழுதடைந்துள்ளது.'],
      Healthcare: ['अस्पताल में डॉक्टर उपलब्ध नहीं हैं।', 'Primary health center needs doctors and basic supplies', 'மருத்துவமனையில் மருத்துவர் இல்லை.'],
      Education: ['School classrooms need urgent roof repair', 'विद्यालय में शिक्षकों की कमी है।', 'பள்ளி வகுப்பறைகள் சேதமடைந்துள்ளன.'],
      Electricity: ['Frequent power cuts and low voltage in our block', 'बिजली बार-बार जाती है।', 'மின்சாரம் அடிக்கடி துண்டிக்கப்படுகிறது.'],
      Sanitation: ['Drainage and sanitation are overflowed', 'नालियों की सफाई नहीं हो रही है।', 'சாக்கடை வசதி இல்லை.'],
      Internet: ['Mobile network and internet are unavailable in our village', 'मोबाइल नेटवर्क बहुत कमजोर है।', 'இணைய வசதி இல்லை.']
    };

    // Generate ~5000 realistic synthetic submissions distributed across districts
    for (let i = 0; i < 5000; i++) {
      const dIndex = (i * 7 + (i % 13) * 17) % districts.length;
      const cIndex = (i * 11 + Math.floor(i / 19)) % categories.length;
      const d = districts[dIndex];
      const c = categories[cIndex];
      const coords = DISTRICT_COORDS[d] || [23.2599, 77.4126];

      const pList = samplePhrases[c] || ['Issue reported'];
      const text = pList[i % pList.length];
      const isHindi = text.includes('है') || text.includes('में') || text.includes('पानी') || text.includes('सड़क');
      const isTamil = text.includes('நீர்') || text.includes('சாலை') || text.includes('மருத்துவ');
      const lang = isHindi ? 'hi' : isTamil ? 'ta' : 'en';

      this.submissions.push({
        id: this.nextSubId++,
        anonymous_user_id: `anon-${(i % 1500) + 1}`,
        original_text: text,
        translated_text: lang === 'en' ? text : `Community development issue reported regarding ${c.toLowerCase()}.`,
        normalized_text: text.trim(),
        language: lang,
        category: c,
        sub_category: c === 'Water' ? 'shortage' : 'general',
        urgency_score: 45 + ((i * 13) % 54),
        sentiment_score: 15 + ((i * 7) % 35),
        confidence_score: 0.82 + ((i % 17) / 100),
        latitude: coords[0] + (((i % 100) - 50) / 1000),
        longitude: coords[1] + ((((i * 3) % 100) - 50) / 1000),
        state: 'Madhya Pradesh',
        district: d,
        block: 'Block 1',
        location_name: `${d} Ward ${((i % 12) + 1)}`,
        source_channel: i % 3 === 0 ? 'voice' : i % 3 === 1 ? 'whatsapp' : 'web',
        status: 'analyzed',
        created_at: new Date(Date.now() - (5000 - i) * 60000).toISOString()
      });
    }

    this.rebuildIntelligence();
  }

  rebuildIntelligence() {
    this.hotspots = [];
    this.recommendations = [];
    this.nextHotspotId = 1;
    this.nextRecId = 1;

    // Group submissions by (state, district, category)
    const groups = new Map<string, { state: string; district: string; category: string; count: number; urgencySum: number }>();

    for (const sub of this.submissions) {
      const key = `${sub.state}:::${sub.district}:::${sub.category}`;
      let item = groups.get(key);
      if (!item) {
        item = { state: sub.state, district: sub.district, category: sub.category, count: 0, urgencySum: 0 };
        groups.set(key, item);
      }
      item.count++;
      item.urgencySum += sub.urgency_score;
    }

    for (const [, grp] of groups.entries()) {
      const { state, district, category, count, urgencySum } = grp;
      const avgUrgency = count > 0 ? urgencySum / count : 50;

      const infra = this.infrastructure.find(x => x.district === district && x.category === category);
      const demo = this.demographics.find(x => x.district === district);
      const invs = this.investments.filter(x => x.district === district && x.category === category);

      const scoreI = infra?.score ?? 50;
      const pop = demo?.population ?? 50000;
      const demand = Math.min(100, 35 + count * 1.2);
      const popscore = Math.min(100, 35 + pop / 2000);
      const gap = Math.max(0, 100 - scoreI);
      const totalInv = invs.reduce((s, x) => s + x.budget, 0);
      const igap = Math.min(100, Math.max(0, 100 - totalInv / 50000));
      const growth = Math.min(100, 45 + (count % 55));
      const hs = hotspotScore(demand, avgUrgency, popscore, gap, growth, igap);

      const coords = DISTRICT_COORDS[district] || [23.2599, 77.4126];
      const hId = this.nextHotspotId++;

      const hotspot: Hotspot = {
        id: hId,
        state,
        district,
        category,
        latitude: coords[0] + ((((district.charCodeAt(0) + category.charCodeAt(0)) % 100) - 50) / 1000),
        longitude: coords[1] + ((((district.charCodeAt(district.length - 1) + category.charCodeAt(category.length - 1)) % 100) - 50) / 1000),
        request_count: count,
        request_growth_rate: growth - 50,
        average_urgency: avgUrgency,
        population_impact: Math.floor(pop * 0.42),
        infrastructure_gap: gap,
        investment_gap: igap,
        demand_score: demand,
        hotspot_score: hs,
        created_at: new Date().toISOString()
      };
      this.hotspots.push(hotspot);

      const proj = PROJECTS[category] || [`${category} Community Improvement Program`, 2500000, `Target the highest-demand ${category.toLowerCase()} gaps.`];
      const title = proj[0];
      const budget = proj[1];
      const interv = proj[2];
      const ps = priorityScore(hs);

      const rec: Recommendation = {
        id: this.nextRecId++,
        hotspot_id: hId,
        title,
        category,
        priority_score: ps,
        estimated_budget: budget,
        estimated_population_impact: `${Math.floor(pop * 0.35).toLocaleString()}–${Math.floor(pop * 0.55).toLocaleString()}`,
        expected_benefit: interv,
        explanation: `${count} citizen reports, average urgency ${Math.round(avgUrgency)}/100, infrastructure score ${Math.round(scoreI)}/100 and estimated local population ${pop.toLocaleString()}.`,
        why_now: `Demand has a modeled growth signal of ${Math.round(growth - 50)}%.`,
        why_here: `${district} has an infrastructure gap of ${Math.round(gap)} points in ${category.toLowerCase()}.`,
        why_intervention: interv,
        risk_level: ps > 80 ? 'Low' : 'Medium',
        confidence: 0.88,
        created_at: new Date().toISOString()
      };
      this.recommendations.push(rec);
    }
  }

  addSubmission(payload: Partial<CitizenSubmission>): CitizenSubmission {
    const id = this.nextSubId++;
    const token = payload.token || `#JV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const sub: CitizenSubmission = {
      id,
      token,
      anonymous_user_id: payload.anonymous_user_id || 'anon-demo',
      title: payload.title || (payload.original_text ? payload.original_text.substring(0, 60) : 'Civic Grievance'),
      original_text: payload.original_text || '',
      translated_text: payload.translated_text || payload.original_text || '',
      normalized_text: payload.normalized_text || payload.original_text || '',
      language: payload.language || 'en',
      category: payload.category || 'Water',
      sub_category: payload.sub_category || 'general',
      urgency_score: payload.urgency_score ?? 75,
      sentiment_score: payload.sentiment_score ?? 30,
      confidence_score: payload.confidence_score ?? 0.92,
      latitude: payload.latitude || 23.2599,
      longitude: payload.longitude || 77.4126,
      state: payload.state || 'Madhya Pradesh',
      district: payload.district || 'Demo District Alpha',
      block: payload.block || 'Demo Block',
      ward: payload.ward || 'Ward 14',
      location_name: payload.location_name || 'Demo Village',
      landmark: payload.landmark || '',
      department: payload.department || 'Nagar Palika Parishad (Municipal Services)',
      severity: payload.severity || 'High',
      urgency: payload.urgency || 'Urgent',
      sla_hours: payload.sla_hours || 48,
      media_url: payload.media_url || '',
      media_type: payload.media_type || 'image',
      media: payload.media || (payload.media_url ? [{ type: (payload.media_type as any) || 'image', url: payload.media_url }] : []),
      extracted_details: payload.extracted_details || {},
      source_channel: payload.source_channel || 'voice',
      status: 'submitted',
      created_at: new Date().toISOString()
    };
    this.submissions.unshift(sub);
    this.rebuildIntelligence();
    return sub;
  }

  addInvestment(payload: Partial<PublicInvestment>): PublicInvestment {
    const inv: PublicInvestment = {
      id: this.nextInvId++,
      project_name: payload.project_name || 'New Community Project',
      state: payload.state || 'Madhya Pradesh',
      district: payload.district || 'Demo District Alpha',
      category: payload.category || 'Water',
      budget: payload.budget || 2500000,
      status: payload.status || 'Planned',
      start_date: payload.start_date || '2026-01-01',
      expected_completion: payload.expected_completion || '2027-12-31'
    };
    this.investments.unshift(inv);
    this.rebuildIntelligence();
    return inv;
  }
}

export const db = new InMemDB();
