import { GoogleGenAI } from '@google/genai';

const KEY: Record<string, string[]> = {
  Water: ['water', 'पानी', 'जल', 'நீர்', 'நீரு', 'জল', 'पाणी', 'नल', 'पाइप'],
  Roads: ['road', 'roads', 'सड़क', 'सडक', 'சாலை', 'ரோడ్డు', 'রাস্তা', 'रस्ता', 'गड्ढे'],
  Healthcare: ['health', 'hospital', 'doctor', 'clinic', 'अस्पताल', 'स्वास्थ्य', 'दवा', 'மருத்துவ', 'ஆரோக்கிய', 'স্বাস্থ্য'],
  Education: ['school', 'education', 'teacher', 'classroom', 'विद्यालय', 'शिक्षा', 'स्कूल', 'பள்ளி', 'విద్య', 'শিক্ষা'],
  Electricity: ['electricity', 'power', 'light', 'बिजली', 'करंट', 'மின்சாரம்', 'విద్యుత్', 'বিদ্যুৎ'],
  Sanitation: ['toilet', 'sanitation', 'sewage', 'drain', 'garbage', 'स्वच्छता', 'शौचालय', 'नाली', 'கழிவு', 'சுகாதாரம்', 'పరిశుభ్రత', 'পয়ঃনিষ্কাশন'],
  Internet: ['internet', 'network', 'wifi', 'signal', 'mobile', 'इंटरनेट', 'नेटवर्क', 'நெட்வொர்க்', 'இணையம்', 'ఇంటర్నెట్', 'ইন্টারনেট']
};

const LANG: Record<string, string[]> = {
  hi: ['है', 'में', 'गांव', 'समस्या', 'पानी', 'सड़क', 'बिजली', 'अस्पताल', 'चाहिए'],
  ta: ['நீர்', 'சாலை', 'மருத்துவ', 'பள்ளி', 'வேண்டும்'],
  te: ['నీరు', 'రోడ్డు', 'ఆరోగ్య', 'విద్య', 'కావాలి'],
  bn: ['জল', 'রাস্তা', 'স্বাস্থ্য', 'শিক্ষা', 'সমস্যা'],
  mr: ['पाणी', 'रस्ता', 'आरोग्य', 'शिक्षण', 'आहे']
};

export interface AnalysisResult {
  language: string;
  translated_text: string;
  normalized_text: string;
  category: string;
  sub_category: string;
  urgency_score: number;
  sentiment_score: number;
  confidence_score: number;
  location_name: string;
  state: string;
  district: string;
  block: string;
  provider: string;
}

export function fallbackAnalyze(text: string, requestedLanguage = 'auto'): AnalysisResult {
  let lang = requestedLanguage !== 'auto' ? requestedLanguage : 'en';
  if (requestedLanguage === 'auto') {
    for (const [code, hints] of Object.entries(LANG)) {
      if (hints.some((h) => text.toLowerCase().includes(h.toLowerCase()))) {
        lang = code;
        break;
      }
    }
  }

  const counts: Record<string, number> = {};
  for (const [cat, words] of Object.entries(KEY)) {
    counts[cat] = words.reduce((acc, w) => (text.toLowerCase().includes(w.toLowerCase()) ? acc + 1 : acc), 0);
  }

  let bestCat = 'Other';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      bestCat = cat;
    }
  }
  if (bestCat === 'Other' && maxCount === 0) {
    bestCat = 'Water'; // Default civic category if unspecified
  }

  const lower = text.toLowerCase();
  const isUrgent = ['urgent', 'critical', 'emergency', 'तुरंत', 'गंभीर', 'बहुत', 'खतरा', 'जान'].some((x) => lower.includes(x));
  const urgentScore = isUrgent ? 90 : ['Water', 'Healthcare', 'Electricity'].includes(bestCat) ? 72 : 58;

  return {
    language: lang,
    translated_text: lang === 'en' ? text : `Citizen report regarding ${bestCat.toLowerCase()} requirements in the community.`,
    normalized_text: text.trim().replace(/\s+/g, ' '),
    category: bestCat,
    sub_category: bestCat === 'Water' ? 'shortage' : 'general',
    urgency_score: urgentScore,
    sentiment_score: 25.0,
    confidence_score: maxCount >= 2 ? 0.95 : 0.86,
    location_name: 'Demo Village',
    state: 'Madhya Pradesh',
    district: 'Demo District Alpha',
    block: 'Demo Block',
    provider: 'local-heuristic'
  };
}

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

export async function transcribeAudio(base64Audio: string, mimeType = 'audio/webm', languagePrompt = 'auto'): Promise<string> {
  if (!base64Audio || base64Audio.length < 100) {
    return '';
  }

  const ai = getGeminiClient();
  if (!ai) {
    console.warn('[JanVani] Gemini client unavailable for transcription');
    return '';
  }

  const cleanMime = (mimeType || 'audio/webm').split(';')[0];
  const audioPart = {
    inlineData: {
      mimeType: cleanMime,
      data: base64Audio
    }
  };

  const instruction = languagePrompt && languagePrompt !== 'auto'
    ? `Transcribe this audio verbatim in ${languagePrompt}. Output only the exact spoken words.`
    : `Transcribe this audio verbatim in the exact language spoken. Output only the spoken words without extra commentary.`;

  // 1. Primary transcription model: gemini-3.5-transcribe as mandated
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: instruction }
        ]
      }
    });

    let text = (response.text || '').trim();
    if (!text && response.candidates?.[0]?.content?.parts) {
      text = response.candidates[0].content.parts
        .map((p: any) => p.text || '')
        .join(' ')
        .trim();
    }

    if (text) {
      console.log('[JanVani] gemini-3.5-transcribe succeeded:', text.substring(0, 80));
      return text;
    }
  } catch (err: any) {
    console.warn('[JanVani] gemini-3.5-transcribe note:', err?.message || err);
  }

  // 2. High-accuracy multimodal fallback: gemini-3.8-flash (if rate-limited or quota exceeded)
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        audioPart,
        instruction
      ]
    });

    let text = (response.text || '').trim();
    if (!text && response.candidates?.[0]?.content?.parts) {
      text = response.candidates[0].content.parts
        .map((p: any) => p.text || '')
        .join(' ')
        .trim();
    }

    if (text) {
      console.log('[JanVani] gemini-3.8-flash fallback transcribe succeeded:', text.substring(0, 80));
      return text;
    }
  } catch (fallbackErr: any) {
    console.warn('[JanVani] gemini-3.8-flash transcription note:', fallbackErr?.message);
  }

  return '';
}

export async function analyzeText(text: string, requestedLanguage = 'auto'): Promise<AnalysisResult> {
  const ai = getGeminiClient();
  if (!ai) {
    return fallbackAnalyze(text, requestedLanguage);
  }

  try {
    const prompt = `Analyze this citizen report for a civic development intelligence platform:
Language preference: ${requestedLanguage}
Citizen text: "${text}"

Respond with ONLY a JSON object with these exact keys:
{
  "language": string (ISO code e.g. "en", "hi", "ta", "te", "bn", "mr"),
  "translated_text": string (English translation of the report),
  "normalized_text": string (cleaned up text),
  "category": string (One of: "Water", "Roads", "Healthcare", "Education", "Electricity", "Sanitation", "Internet", "Other"),
  "sub_category": string,
  "urgency_score": number (0 to 100),
  "sentiment_score": number (0 to 100, where 0 is very distressed/negative, 50 neutral),
  "confidence_score": number (0.0 to 1.0),
  "location_name": string (extracted village or town or "Demo Village"),
  "state": string (state name e.g. "Madhya Pradesh"),
  "district": string (e.g. "Demo District Alpha"),
  "block": string
}`;

    const response = await ai.models.generateContent({
      model: process.env.ADK_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);

    return {
      language: parsed.language || requestedLanguage || 'en',
      translated_text: parsed.translated_text || text,
      normalized_text: parsed.normalized_text || text.trim(),
      category: parsed.category || 'Water',
      sub_category: parsed.sub_category || 'general',
      urgency_score: Number(parsed.urgency_score) || 60,
      sentiment_score: Number(parsed.sentiment_score) || 30,
      confidence_score: Number(parsed.confidence_score) || 0.92,
      location_name: parsed.location_name || 'Demo Village',
      state: parsed.state || 'Madhya Pradesh',
      district: parsed.district || 'Demo District Alpha',
      block: parsed.block || 'Demo Block',
      provider: 'gemini'
    };
  } catch (err) {
    console.warn('Gemini analysis failed, falling back to local heuristic', err);
    return fallbackAnalyze(text, requestedLanguage);
  }
}

export interface ComplaintVerificationResult {
  is_valid_complaint: boolean;
  isCivicIssue: boolean;
  confidence: number;
  problem_category: string;
  suggestedCategory: string;
  problem_title: string;
  extractedTitle: string;
  description: string;
  extractedDescription: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  urgency: 'Urgent' | 'Priority' | 'Standard';
  suggestedUrgency: 'Urgent' | 'Priority' | 'Standard';
  location_text: string;
  extractedLocation: string;
  landmark: string;
  duration?: string;
  department: string;
  suggestedDepartment: string;
  sla_hours: number;
  targetHours: number;
  rejection_reason?: string;
  validationReason?: string;
  extracted_details: Record<string, any>;
  missing_details: string[];
}

export async function verifyComplaint(
  text: string,
  language = 'auto',
  manualLocation?: string
): Promise<ComplaintVerificationResult> {
  const trimmed = (text || '').trim();
  if (!trimmed || trimmed.length < 5) {
    const reason = 'Statement is too brief or empty. Please describe a municipal defect like roads, water, garbage, or streetlights.';
    return {
      is_valid_complaint: false,
      isCivicIssue: false,
      confidence: 0.99,
      rejection_reason: reason,
      validationReason: reason,
      problem_category: 'Other Civic Issue',
      suggestedCategory: 'Other Civic Issue',
      problem_title: '',
      extractedTitle: '',
      description: trimmed,
      extractedDescription: trimmed,
      severity: 'Low',
      urgency: 'Standard',
      suggestedUrgency: 'Standard',
      location_text: '',
      extractedLocation: '',
      landmark: '',
      department: 'General Administration',
      suggestedDepartment: 'General Administration',
      sla_hours: 48,
      targetHours: 48,
      extracted_details: {},
      missing_details: ['Issue description', 'Location']
    };
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are a municipal grievance verification officer under the Government of India statutory grievance redressal framework (e.g., CPGRAMS / JanVani).
Evaluate the citizen's statement and determine if it is a genuine civic/public infrastructure/municipal problem.

Valid civic problems:
- Potholes, damaged roads, broken footpaths, road caving
- Water pipeline leaks, contamination, low pressure, no water supply
- Garbage heaps, overflowing bins, uncollected waste, illegal dumping
- Dead streetlights, broken poles, hanging electrical wires, transformer spark
- Blocked drains, open sewage overflow, broken manholes
- Mosquito breeding, public sanitation, public toilet maintenance
- Stray animal hazard, fallen trees blocking traffic, damaged traffic signals
- Government hospital/health center or school building defects

Non-civic / Invalid problems:
- Greetings ("hello", "namaste", "good morning")
- Casual chatter, personal stories, opinions
- Commercial sales, product queries, shopping, job requests
- Math, general knowledge questions, jokes, gibberish/nonsense, random words

Citizen input:
"""${trimmed}"""
Selected language code: "${language}"
Known location context: "${manualLocation || ''}"

Return ONLY a valid JSON object with these exact keys:
{
  "is_valid_complaint": boolean,
  "confidence": number (between 0.0 and 1.0),
  "rejection_reason": string or null (if invalid, explain why in friendly tone respecting citizen's language),
  "problem_category": string (One of: "Roads & Potholes", "Drinking Water & Pipeline Leakage", "Garbage & Sanitation", "Streetlights & Electrical", "Sewage & Drainage", "Public Health & Clinics", "Government Schools", "Illegal Encroachment", "Other Civic Issue"),
  "problem_title": string (concise, formal municipal title in the same language as spoken, maximum 12 words),
  "description": string (the complete, cleaned citizen statement),
  "severity": "Critical" | "High" | "Medium" | "Low",
  "urgency": "Urgent" | "Priority" | "Standard",
  "location_text": string (extracted street/area/ward or ""),
  "landmark": string (extracted building, school, hospital, shop, or chowk if mentioned),
  "duration": string (e.g. "2 days", "since morning", "1 week" if mentioned, else ""),
  "department": string (e.g., "Public Works Department (PWD)", "Nagar Palika Parishad - Water Supply", "Municipal Sanitation Unit", "Discom / Electricity Board", "Drainage & Sewerage Division"),
  "sla_hours": number (either 24 or 48 based on statutory severity),
  "extracted_details": {
    "hazard_type": string,
    "impact": string,
    "duration": string
  },
  "missing_details": string[] (any missing helpful details e.g. ["exact house/shop number", "photo proof"])
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      const isValid = Boolean(parsed.is_valid_complaint);
      const reason = parsed.rejection_reason || (isValid ? undefined : 'This statement does not describe a municipal infrastructure or public civic problem.');
      const title = parsed.problem_title || trimmed.substring(0, 60);
      const desc = parsed.description || trimmed;
      const cat = parsed.problem_category || 'Roads & Potholes';
      const dept = parsed.department || 'Nagar Palika Parishad (Municipal Services)';
      const urg = parsed.urgency || 'Urgent';
      const loc = parsed.location_text || manualLocation || '';
      const sla = Number(parsed.sla_hours) || 48;

      return {
        is_valid_complaint: isValid,
        isCivicIssue: isValid,
        confidence: Number(parsed.confidence) || 0.9,
        rejection_reason: reason,
        validationReason: reason,
        problem_category: cat,
        suggestedCategory: cat,
        problem_title: title,
        extractedTitle: title,
        description: desc,
        extractedDescription: desc,
        severity: parsed.severity || 'High',
        urgency: urg,
        suggestedUrgency: urg,
        location_text: loc,
        extractedLocation: loc,
        landmark: parsed.landmark || '',
        duration: parsed.duration || '',
        department: dept,
        suggestedDepartment: dept,
        sla_hours: sla,
        targetHours: sla,
        extracted_details: parsed.extracted_details || {},
        missing_details: Array.isArray(parsed.missing_details) ? parsed.missing_details : []
      };
    } catch (err: any) {
      console.warn('[JanVani] Gemini verification warning, running fallback verification:', err?.message);
    }
  }

  // Local Rule-Based Verification Fallback
  return fallbackVerifyComplaint(trimmed, language, manualLocation);
}

function fallbackVerifyComplaint(
  text: string,
  _language: string,
  manualLocation?: string
): ComplaintVerificationResult {
  const lower = text.toLowerCase();

  // Non-civic patterns (greetings, small talk, gibberish, common non-civic questions)
  const isGreeting = /^(hello|hi|hey|namaste|pranam|good morning|good evening|kaise ho|how are you|test|testing|who are you|kya haal hai|vanakkam|namaskara|kya hal)\b/i.test(lower);
  const isNonCivicQuestion = /^(who is|what is|tell me|how to make|can you|calculate|write code|sing|recipe|joke|translate)\b/i.test(lower);
  const isGibberish = /^([a-z0-9])\1{4,}/i.test(lower) || /^[0-9\s.,!?-]+$/.test(text);
  const isTooShort = text.trim().length < 10;

  // Civic keywords check
  const hasRoadKeywords = /(road|roads|pothole|potholes|footpath|divider|caved|सड़क|सडक|गड्ढा|गड्ढे|रस्ता|சாலை|ரோడ్డు|রাস্তা)/i.test(lower);
  const hasWaterKeywords = /(water|pipeline|leak|leakage|pipe|tap|drinking|पानी|जल|नल|पाइप|रिसाव|குடிநீர்|தண்ணீர்|నీరు|জল|पाणी)/i.test(lower);
  const hasGarbageKeywords = /(garbage|trash|waste|dump|bins|dustbin|कचरा|कूड़ा|सफाई|गंदगी|கழிவு|குப்பை|చెత్త|আবর্জना|घाण)/i.test(lower);
  const hasLightKeywords = /(streetlight|light|lamp|pole|electricity|wire|spark|transformer|बिजली|बल्ब|स्ट्रीटलाइट|करंट|மின்சாரம்|மின்விளக்கு|కరెంట్|বিদ্যুৎ|दिवा|पथदिवा)/i.test(lower);
  const hasDrainKeywords = /(drain|drainage|sewer|sewage|manhole|gutter|guttering|नाली|नाला|मैनहोल|सीवर|गंदा पानी|சாக்கடை|మురుగు)/i.test(lower);
  const hasHealthKeywords = /(hospital|clinic|doctor|phc|medicine|dispensary|अस्पताल|दवा|स्वास्थ्य|மருத்துவ|ஆரோக்கிய|ఆరోగ్య|স্বাস্থ্য)/i.test(lower);
  const hasGeneralCivic = /(encroachment|illegal|hazard|park|tree fell|animal|stray|nuisance|traffic light|अतिक्रमण|खतरा|मच्छर)/i.test(lower);

  const hasAnyCivicIssue = hasRoadKeywords || hasWaterKeywords || hasGarbageKeywords || hasLightKeywords || hasDrainKeywords || hasHealthKeywords || hasGeneralCivic;

  if (isGreeting || isNonCivicQuestion || isGibberish || isTooShort || !hasAnyCivicIssue) {
    const reason = isGreeting
      ? 'This statement appears to be a greeting. Please describe a municipal infrastructure problem such as roads, water, sanitation, or lighting.'
      : isNonCivicQuestion
      ? 'This question does not describe a municipal hazard or public service grievance.'
      : isTooShort
      ? 'The description is too short. Please describe the specific municipal defect and location.'
      : 'This statement does not describe a public civic or municipal issue (like potholes, water leaks, garbage, or faulty streetlights).';

    return {
      is_valid_complaint: false,
      isCivicIssue: false,
      confidence: 0.95,
      rejection_reason: reason,
      validationReason: reason,
      problem_category: 'Other Civic Issue',
      suggestedCategory: 'Other Civic Issue',
      problem_title: 'Unclassified Report',
      extractedTitle: 'Unclassified Report',
      description: text,
      extractedDescription: text,
      severity: 'Low',
      urgency: 'Standard',
      suggestedUrgency: 'Standard',
      location_text: manualLocation || '',
      extractedLocation: manualLocation || '',
      landmark: '',
      department: 'Citizen Helpdesk',
      suggestedDepartment: 'Citizen Helpdesk',
      sla_hours: 48,
      targetHours: 48,
      extracted_details: {},
      missing_details: ['Civic issue description', 'Location']
    };
  }

  // Detect category
  let category = 'Roads & Potholes';
  let department = 'Public Works Department (PWD) / Nagar Palika';
  let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'High';
  let urgency: 'Urgent' | 'Priority' | 'Standard' = 'Urgent';

  if (hasWaterKeywords) {
    category = 'Drinking Water & Pipeline Leakage';
    department = 'Nagar Palika Parishad - Water Supply';
  } else if (hasGarbageKeywords) {
    category = 'Garbage & Sanitation';
    department = 'Nagar Palika Solid Waste Management';
  } else if (hasLightKeywords) {
    category = 'Streetlights & Electrical';
    department = 'Municipal Electrical & Lighting Department';
  } else if (hasDrainKeywords) {
    category = 'Sewage & Drainage';
    department = 'Municipal Drainage & Sewerage Division';
    severity = 'Critical';
  } else if (hasHealthKeywords) {
    category = 'Public Health & Clinics';
    department = 'District Health Office & Primary Health Center';
  }

  // Extract location cues
  let locationText = manualLocation || '';
  let landmark = '';
  const nearMatch = text.match(/(?:near|at|opposite|behind|pass|के पास|के सामने|पर|वार्ड|ward)\s+([^,.\n]+)/i);
  if (nearMatch && nearMatch[1]) {
    landmark = nearMatch[1].trim();
    if (!locationText) locationText = landmark;
  }

  // Extract duration cues
  let duration = '';
  const durMatch = text.match(/(\d+\s*(?:day|days|hour|hours|week|weeks|din|ghante|दिन|घंटे|हफ्ते|రోజులు|நாட்கள்))/i);
  if (durMatch) {
    duration = durMatch[0];
  }

  const title = text.length > 55 ? text.substring(0, 55) + '...' : text;

  return {
    is_valid_complaint: true,
    isCivicIssue: true,
    confidence: 0.92,
    problem_category: category,
    suggestedCategory: category,
    problem_title: title,
    extractedTitle: title,
    description: text,
    extractedDescription: text,
    severity,
    urgency,
    suggestedUrgency: urgency,
    location_text: locationText,
    extractedLocation: locationText,
    landmark,
    duration,
    department,
    suggestedDepartment: department,
    sla_hours: 48,
    targetHours: 48,
    extracted_details: {
      category,
      duration: duration || 'Recently reported',
      landmark: landmark || 'Local ward area'
    },
    missing_details: locationText ? [] : ['Exact street landmark or ward number']
  };
}
