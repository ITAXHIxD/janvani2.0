// Utility for Statutory Civic Complaint Verification under JanVani 48h SLA framework

export interface CivicValidationResult {
  isValid: boolean;
  reason?: string;
  category?: string;
  urgency?: 'Urgent' | 'Priority' | 'Standard';
  title?: string;
  department?: string;
}

// Regex patterns for greetings, casual chat, testing, and non-civic questions
const GREETINGS_REGEX = /^(hello|hi|hey|namaste|pranam|good morning|good evening|good afternoon|vanakkam|namaskara|kya haal|kaise ho|how are you|who are you|kya chal raha)\b/i;
const TEST_GIBBERISH_REGEX = /^(test|testing|check|checking|sample|trial|asdf|qwerty|1234|xyz|abc|ok|okay|fine|yes|no|none)\b/i;
const CASUAL_QUESTIONS_REGEX = /^(who is|what is|tell me|sing|joke|story|recipe|code|weather|capital of|how to make)\b/i;

// Civic domain keyword indicators (Multilingual: EN, Hindi, Marathi, Tamil, Telugu, Bengali)
const CIVIC_KEYWORDS = [
  // Roads
  'road', 'roads', 'pothole', 'potholes', 'footpath', 'divider', 'caved', 'crater', 'asphalt',
  'सड़क', 'सडक', 'गड्ढा', 'गड्ढे', 'रस्ता', 'சாலை', 'ரோడ్డు', 'রাস্তা', 'రహదారి', 'గుంతలు',
  // Water
  'water', 'pipeline', 'leak', 'leakage', 'pipe', 'tap', 'drinking water', 'contamination', 'dirty water',
  'पानी', 'जल', 'नल', 'पाइप', 'रिसाव', 'गंदा पानी', 'குடிநீர்', 'தண்ணீர்', 'నీరు', 'জল', 'पाणी',
  // Garbage / Sanitation
  'garbage', 'trash', 'waste', 'dump', 'dustbin', 'bins', 'cleaning', 'litter', 'filth',
  'कचरा', 'कूड़ा', 'सफाई', 'गंदगी', 'डस्टबिन', 'கழிவு', 'குப்பை', 'చెత్త', 'আবর্জना', 'घाण', 'कचरापेटी',
  // Streetlights / Electrical
  'streetlight', 'street light', 'lamp', 'bulb', 'electricity', 'wire', 'spark', 'transformer', 'pole', 'darkness',
  'बिजली', 'बल्ब', 'स्ट्रीटलाइट', 'करंट', 'खंभा', 'अंधेरा', 'மின்சாரம்', 'மின்விளக்கு', 'కరెంట్', 'বিদ্যুৎ', 'दिवा', 'पथदिवा',
  // Drainage / Sewerage
  'drain', 'drainage', 'sewer', 'sewage', 'manhole', 'gutter', 'overflow', 'choked', 'stagnant',
  'नाली', 'नाला', 'सीवर', 'मैनहोल', 'गटर', 'சாக்கடை', 'முరుగు', 'নর্দমা', 'गटार',
  // Public Health / Hospital
  'hospital', 'clinic', 'dispensary', 'phc', 'medicine', 'doctor', 'dengue', 'malaria', 'mosquitoes',
  'अस्पताल', 'दवाखाना', 'दवा', 'स्वास्थ्य', 'मच्छर', 'மருத்துவ', 'ஆரோக்கிய', 'ఆరోగ్య', 'স্বাস্থ্য',
  // Hazard / Encroachment
  'encroachment', 'traffic light', 'fallen tree', 'stray cattle', 'open pit', 'hazard',
  'अतिक्रमण', 'ट्रैफिक लाइट', 'खतरा', 'गिरा पेड़'
];

/**
 * Fast synchronous check to determine if text is definitely non-civic.
 */
export function checkCivicValidityLocally(text: string): { isValid: boolean; reason?: string } {
  const trimmed = (text || '').trim();
  const lower = trimmed.toLowerCase();

  if (trimmed.length < 8) {
    return {
      isValid: false,
      reason: 'The description is too short (minimum 8 characters required). Please describe the municipal defect (e.g. pothole, water leak, garbage heap).'
    };
  }

  if (GREETINGS_REGEX.test(lower)) {
    return {
      isValid: false,
      reason: 'This statement appears to be a greeting or social remark. JanVani registers official municipal grievances (such as damaged roads, water leaks, or broken streetlights).'
    };
  }

  if (TEST_GIBBERISH_REGEX.test(lower)) {
    return {
      isValid: false,
      reason: 'This text appears to be a test phrase or placeholder. Please provide a description of a real public civic hazard.'
    };
  }

  if (CASUAL_QUESTIONS_REGEX.test(lower)) {
    return {
      isValid: false,
      reason: 'This query does not describe a municipal infrastructure hazard or civic defect.'
    };
  }

  // Check if at least one municipal civic keyword is present
  const hasCivicKeyword = CIVIC_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
  if (!hasCivicKeyword) {
    return {
      isValid: false,
      reason: 'This statement does not contain a recognizable municipal problem (such as road potholes, water leaks, uncollected garbage, or faulty streetlights).'
    };
  }

  return { isValid: true };
}

/**
 * Full verification check combining local statutory rules + Gemini AI verification.
 */
export async function verifyCivicReport(
  text: string,
  language = 'en',
  manualLocation?: string
): Promise<CivicValidationResult> {
  // Step 1: Instant local heuristic check
  const localCheck = checkCivicValidityLocally(text);
  if (!localCheck.isValid) {
    return {
      isValid: false,
      reason: localCheck.reason
    };
  }

  // Step 2: Server-side Gemini statutory evaluation
  try {
    const res = await fetch('/api/complaints/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.trim(),
        language,
        manualLocation
      })
    });

    if (res.ok) {
      const data = await res.json();
      const isValid = Boolean(data.is_valid_complaint ?? data.isCivicIssue);
      if (!isValid) {
        return {
          isValid: false,
          reason:
            data.validationReason ||
            data.rejection_reason ||
            'AI statutory verification determined this statement is not a municipal civic grievance.'
        };
      }

      return {
        isValid: true,
        category: data.problem_category || data.suggestedCategory,
        urgency: data.urgency || data.suggestedUrgency,
        title: data.problem_title || data.extractedTitle,
        department: data.department || data.suggestedDepartment
      };
    }
  } catch (err) {
    console.warn('AI verification network fallback:', err);
  }

  // If local passed and network had error, accept local validation
  return {
    isValid: true
  };
}
