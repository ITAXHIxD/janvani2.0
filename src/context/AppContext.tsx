import React, { createContext, useContext, useState, useEffect } from 'react';
import { Grievance, CivicReel, GISSpot, WelfareScheme, NagrikCitizen, UserProfile, ThemeMode, CopilotMessage } from '../types';
import { initialGrievances, initialReels, initialGISSpots, welfareSchemes, nagrikLeaderboard, currentUser } from '../data/mockData';
import { SupportedLanguage, getTranslation, translateCategory, translateStatus, translateUrgency, normalizeLanguageCode } from '../i18n/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage | string) => void;
  t: (key: string, fallback?: string) => string;
  translateCategory: (category: string) => string;
  translateStatus: (status: string) => string;
  translateUrgency: (urgency: string) => string;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  grievances: Grievance[];
  reels: CivicReel[];
  gisSpots: GISSpot[];
  schemes: WelfareScheme[];
  citizens: NagrikCitizen[];
  addGrievance: (grievance: Partial<Grievance>) => Grievance;
  toggleSupportGrievance: (id: string) => void;
  addAuditComment: (grievanceId: string, comment: string) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isFileModalOpen: boolean;
  setIsFileModalOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isCertificateModalOpen: boolean;
  setIsCertificateModalOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  sendMessageToCopilot: (text: string) => Promise<void>;
  isCopilotLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Bright is DEFAULT as explicitly requested: "bright as default and dark mode"
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('janvani-theme') as ThemeMode;
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('janvani-lang');
    return (saved && ['EN', 'HI', 'MR', 'TA', 'TE', 'BN'].includes(saved.toUpperCase()))
      ? (saved.toUpperCase() as SupportedLanguage)
      : 'EN';
  });

  const setLanguage = (lang: SupportedLanguage | string) => {
    const norm = normalizeLanguageCode(lang);
    setLanguageState(norm);
    localStorage.setItem('janvani-lang', norm);
  };

  const t = (key: string, fallback?: string) => getTranslation(language, key, fallback);
  const transCategory = (cat: string) => translateCategory(cat, language);
  const transStatus = (st: string) => translateStatus(st, language);
  const transUrgency = (urg: string) => translateUrgency(urg, language);
  const [user, setUser] = useState<UserProfile>(currentUser);
  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    const saved = localStorage.getItem('janvani-grievances');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialGrievances;
  });

  const [reels, setReels] = useState<CivicReel[]>(initialReels);
  const [gisSpots, setGisSpots] = useState<GISSpot[]>(initialGISSpots);
  const [schemes] = useState<WelfareScheme[]>(welfareSchemes);
  const [citizens, setCitizens] = useState<NagrikCitizen[]>(nagrikLeaderboard);

  // Modal states
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Copilot conversation
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Namaste Praneet! I am your 24x7 JanVani AI Copilot powered by Gemini. You can ask me to file a civic complaint, check statutory 48-hour SLA status, or explore government welfare schemes like Swachh Bharat 2.0 and AMRUT.',
      timestamp: 'Just now',
      quickActions: [
        'Check Ward 14 Pothole SLA (#2026-8941)',
        'Check Swachh Bharat 2.0 Toilet Subsidy',
        'How to earn Nagrik Karma points?'
      ]
    }
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('janvani-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Persist grievances to local storage
  useEffect(() => {
    localStorage.setItem('janvani-grievances', JSON.stringify(grievances));
  }, [grievances]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addGrievance = (data: Partial<Grievance>): Grievance => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const token = `#2026-${randomNum}`;
    const newGrievance: Grievance = {
      id: `jv-${Date.now()}`,
      token,
      title: data.title || 'Civic Infrastructure Grievance',
      description: data.description || '',
      category: data.category || 'Roads & Potholes',
      subCategory: data.subCategory || 'General Civic Defect',
      urgency: data.urgency || 'Urgent',
      severityScore: data.severityScore || 8.2,
      status: 'In Progress',
      state: data.state || 'Madhya Pradesh',
      district: data.district || 'Dhar',
      ward: data.ward || 'Ward 14',
      locationName: data.locationName || 'Ward Area, Dhar',
      department: data.department || 'Nagar Palika Parishad Dhar',
      targetHours: data.targetHours || 48,
      hoursLeft: data.targetHours || 48,
      reportedAt: 'Just now',
      citizenName: user.name,
      citizenAvatar: user.avatarInitials,
      citizenRole: user.role === 'citizen' ? 'Citizen' : 'Officer',
      verified: true,
      mediaType: data.mediaType || 'image',
      mediaUrl: data.mediaUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      thumbnailUrl: data.thumbnailUrl || data.mediaUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      supportsCount: 1,
      isSupportedByMe: true,
      latitude: data.latitude || 22.5989,
      longitude: data.longitude || 75.3039,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          date: 'Just now',
          author: `${user.name} (${user.role})`,
          role: user.role,
          text: 'Grievance submitted. Statutory 48-hour SLA counter initiated.',
          statusBadge: 'TICKET GENERATED'
        }
      ]
    };

    setGrievances(prev => [newGrievance, ...prev]);

    // Also if video, create reel
    if (data.mediaType === 'video') {
      const newReel: CivicReel = {
        id: `reel-${Date.now()}`,
        token,
        title: newGrievance.title,
        description: newGrievance.description,
        category: newGrievance.category,
        severityScore: newGrievance.severityScore,
        status: 'IN PROGRESS',
        slaLeft: `${newGrievance.targetHours}h left`,
        state: newGrievance.state,
        district: newGrievance.district,
        ward: newGrievance.ward,
        locality: newGrievance.locationName,
        department: newGrievance.department,
        creatorName: user.name,
        creatorAvatar: user.avatarInitials,
        creatorVerified: true,
        date: 'Today',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-traveling-on-a-road-in-the-countryside-40893-large.mp4',
        thumbnailUrl: newGrievance.thumbnailUrl,
        supportsCount: 1,
        isSupportedByMe: true,
        updates: newGrievance.auditTrail
      };
      setReels(prev => [newReel, ...prev]);
    }

    // Award user Karma Points
    setUser(prev => ({
      ...prev,
      karmaPoints: prev.karmaPoints + 50
    }));

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // safe ignore
    }

    return newGrievance;
  };

  const toggleSupportGrievance = (id: string) => {
    setGrievances(prev =>
      prev.map(g => {
        if (g.id === id) {
          const supported = !g.isSupportedByMe;
          return {
            ...g,
            isSupportedByMe: supported,
            supportsCount: supported ? g.supportsCount + 1 : Math.max(0, g.supportsCount - 1)
          };
        }
        return g;
      })
    );

    setReels(prev =>
      prev.map(r => {
        if (r.id === id || r.token === id) {
          const supported = !r.isSupportedByMe;
          return {
            ...r,
            isSupportedByMe: supported,
            supportsCount: supported ? r.supportsCount + 1 : Math.max(0, r.supportsCount - 1)
          };
        }
        return r;
      })
    );
  };

  const addAuditComment = (grievanceId: string, comment: string) => {
    const entry = {
      id: `aud-${Date.now()}`,
      date: 'Just now',
      author: `${user.name} (${user.role})`,
      role: user.role,
      text: comment,
      statusBadge: 'COMMUNITY OBSERVATION'
    };

    setGrievances(prev =>
      prev.map(g => {
        if (g.id === grievanceId || g.token === grievanceId) {
          return {
            ...g,
            auditTrail: [...g.auditTrail, entry]
          };
        }
        return g;
      })
    );

    setReels(prev =>
      prev.map(r => {
        if (r.id === grievanceId || r.token === grievanceId) {
          return {
            ...r,
            updates: [...r.updates, entry]
          };
        }
        return r;
      })
    );
  };

  const sendMessageToCopilot = async (text: string) => {
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    setCopilotMessages(prev => [...prev, userMsg]);
    setIsCopilotLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });

      if (res.ok) {
        const data = await res.json();
        setCopilotMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: 'Just now',
            quickActions: data.quickActions,
            tags: data.tags
          }
        ]);
      } else {
        throw new Error('API request fallback');
      }
    } catch (e) {
      let replyText = `I have analyzed your civic inquiry regarding "${text}". `;
      if (text.toLowerCase().includes('pothole') || text.toLowerCase().includes('road') || text.toLowerCase().includes('8941')) {
        replyText += `Regarding Grievance #2026-8941 at Civil Hospital Road: It is currently marked IN PROGRESS with 22 hours remaining on its 48-hour statutory SLA. The Junior Engineer has dispatched the cold-mix asphalt truck to site.`;
      } else if (text.toLowerCase().includes('swachh') || text.toLowerCase().includes('toilet') || text.toLowerCase().includes('subsidy')) {
        replyText += `Under Swachh Bharat Mission (Urban 2.0), individual households without sanitary facilities are eligible for a direct DBT subsidy of ₹10,000 credited to their Aadhaar-seeded bank account. You can apply with your Aadhaar, bank passbook, and proof of residence.`;
      } else if (text.toLowerCase().includes('karma') || text.toLowerCase().includes('points') || text.toLowerCase().includes('rank')) {
        replyText += `You currently have 480 Karma points and hold Rank #9 in Dhar District! You earn +50 points for filing verified civic reports with photo/video proof, +30 points for verifying completed municipal work, and +10 points for upvoting community issues.`;
      } else {
        replyText += `Under JanVani 2026 guidelines, all registered complaints carry a legally binding SLA (24h to 48h). Would you like to file a new grievance or locate nearby problem hotspots on the 3-Tier GIS Map?`;
      }

      setCopilotMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: 'Just now',
          quickActions: ['+ File a new Grievance', 'View GIS Heatmap', 'Check my Ward Leaderboard']
        }
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t,
        translateCategory: transCategory,
        translateStatus: transStatus,
        translateUrgency: transUrgency,
        user,
        setUser,
        grievances,
        reels,
        gisSpots,
        schemes,
        citizens,
        addGrievance,
        toggleSupportGrievance,
        addAuditComment,
        isCopilotOpen,
        setIsCopilotOpen,
        isFileModalOpen,
        setIsFileModalOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isCertificateModalOpen,
        setIsCertificateModalOpen,
        copilotMessages,
        sendMessageToCopilot,
        isCopilotLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
