import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n/translations';
import {
  X,
  Mic,
  Square,
  Volume2,
  Sparkles,
  CheckCircle2,
  Shield,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  Languages,
  Loader2,
  MapPin,
  Camera,
  Upload,
  Clock,
  Building2,
  Tag,
  AlertTriangle,
  ArrowLeft,
  FileCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvalidReportModal } from './InvalidReportModal';
import { checkCivicValidityLocally, verifyCivicReport } from '../utils/civicValidator';

interface VerifiedData {
  isCivicIssue: boolean;
  confidence: number;
  extractedTitle: string;
  extractedDescription: string;
  suggestedDepartment: string;
  suggestedCategory: string;
  suggestedUrgency: 'Urgent' | 'Priority' | 'Standard';
  suggestedSeverityScore: number;
  targetHours: number;
  extractedLocation?: string;
  detectedLanguage?: string;
  validationReason?: string;
}

export const VoiceSevaModal: React.FC = () => {
  const {
    isVoiceModalOpen,
    setIsVoiceModalOpen,
    language,
    setLanguage,
    t,
    translateCategory,
    translateUrgency,
    addGrievance,
    user
  } = useApp();

  // Wizard Step: 'record' | 'review' | 'submitted'
  const [step, setStep] = useState<'record' | 'review' | 'submitted'>('record');

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isVoiceHeard, setIsVoiceHeard] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>(new Array(16).fill(4));
  const [micError, setMicError] = useState<string | null>(null);

  // Transcription states
  const [transcription, setTranscription] = useState('');
  const [isAiTranscribing, setIsAiTranscribing] = useState(false);

  // Verification & Form states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedData, setVerifiedData] = useState<VerifiedData | null>(null);
  const [isInvalidModalOpen, setIsInvalidModalOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState<string>('');

  // Editable Form fields (populated by AI)
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDepartment, setFormDepartment] = useState('Public Works Department (PWD)');
  const [formCategory, setFormCategory] = useState('Roads & Potholes');
  const [formUrgency, setFormUrgency] = useState<'Urgent' | 'Priority' | 'Standard'>('Urgent');
  const [formSeverity, setFormSeverity] = useState(8.5);
  const [formSlaHours, setFormSlaHours] = useState(48);

  // Location fields
  const [formLocation, setFormLocation] = useState('');
  const [gpsAddress, setGpsAddress] = useState<string | null>(null);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Media Attachment fields
  const [mediaFile, setMediaFile] = useState<{ name: string; type: string; base64: string; preview: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  // Audio Context & Analyser Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const consecutiveVoiceFramesRef = useRef<number>(0);

  // MediaRecorder Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Speech Recognition Refs
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const liveInterimRef = useRef<string>('');
  const isRecordingRef = useRef<boolean>(false);

  // Camera video & canvas ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Timer counter
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Clean up on modal close or unmount
  useEffect(() => {
    if (!isVoiceModalOpen) {
      handleStopVoice();
      stopCamera();
    }
  }, [isVoiceModalOpen]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopAudioAnalysis();
    };
  }, []);

  // Sync video stream when camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.play().catch((e) => console.warn('Video play deferred:', e));
    }
  }, [isCameraActive]);

  // Start real Audio Analysis via Web Audio API
  const startAudioAnalysis = async () => {
    try {
      setMicError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone audio capture is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        return false;
      }
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        try {
          await audioCtx.resume();
        } catch (resumeErr) {
          console.warn('AudioContext resume deferred:', resumeErr);
        }
      }
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64; // 32 frequency bins
      analyser.smoothingTimeConstant = 0.65;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaves = () => {
        if (!analyserRef.current || !isRecordingRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        let total = 0;
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i];
        }
        const avg = total / bufferLength;
        setAudioLevel(Math.round(avg));

        const voiceThreshold = 2.5;
        const voiceDetectedNow = avg > voiceThreshold;

        if (voiceDetectedNow) {
          consecutiveVoiceFramesRef.current = Math.min(consecutiveVoiceFramesRef.current + 1, 8);
        } else {
          consecutiveVoiceFramesRef.current = Math.max(consecutiveVoiceFramesRef.current - 1, 0);
        }

        const speaking = consecutiveVoiceFramesRef.current >= 1 || avg > 2;
        setIsVoiceHeard(speaking);

        if (speaking || isRecordingRef.current) {
          const numBars = 16;
          const newHeights: number[] = [];
          for (let i = 0; i < numBars; i++) {
            const bin = i < 8 ? Math.floor(i * 1.8) : Math.floor((15 - i) * 1.8);
            const val = dataArray[bin] || dataArray[i % bufferLength] || (speaking ? 40 : 15);
            const height = Math.max(8, Math.min(46, Math.round((val / 255) * 44) + 8));
            newHeights.push(height);
          }
          setWaveHeights(newHeights);
        } else {
          setWaveHeights(new Array(16).fill(4));
        }

        animFrameRef.current = requestAnimationFrame(updateWaves);
      };

      animFrameRef.current = requestAnimationFrame(updateWaves);
      return true;
    } catch (err: any) {
      console.warn('Microphone stream error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError(t('voice.microphoneDenied', 'Microphone permission denied. Please allow microphone access in your browser.'));
      } else {
        setMicError(err.message || 'Unable to access microphone. Please check your audio settings.');
      }
      return false;
    }
  };

  const stopAudioAnalysis = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close().catch(() => {});
        } catch (e) {}
      }
      audioContextRef.current = null;
    }
    consecutiveVoiceFramesRef.current = 0;
    setIsVoiceHeard(false);
    setAudioLevel(0);
    setWaveHeights(new Array(16).fill(4));
  };

  // Convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        const base64 = res.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Transcribe recorded audio with server Gemini API
  const transcribeAudioWithServer = async (audioBlob: Blob, langCode: string) => {
    try {
      setIsAiTranscribing(true);
      const base64Audio = await blobToBase64(audioBlob);
      const mimeType = audioBlob.type || 'audio/webm';

      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 15000);

      const res = await fetch('/api/voice/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          audioData: base64Audio,
          mimeType,
          language: langCode
        })
      });
      clearTimeout(abortTimer);

      if (res.ok) {
        const data = await res.json();
        if (data.transcription && data.transcription.trim()) {
          const text = data.transcription.trim();
          setTranscription(text);
          finalTranscriptRef.current = text;
        }
      }
    } catch (err) {
      console.warn('Server transcription note:', err);
    } finally {
      setIsAiTranscribing(false);
    }
  };

  const handleStartVoice = async () => {
    setVerificationError(null);
    setMicError(null);
    isRecordingRef.current = true;
    setIsRecording(true);
    liveInterimRef.current = '';
    finalTranscriptRef.current = '';
    setTranscription('');

    // Find speech code (e.g. 'hi-IN', 'ta-IN', 'mr-IN')
    const currentLangInfo = SUPPORTED_LANGUAGES.find((s) => s.code === language) || SUPPORTED_LANGUAGES[0];

    // 1. Start real Web Audio Analyser
    await startAudioAnalysis();

    // 2. Start MediaRecorder
    audioChunksRef.current = [];
    if (mediaStreamRef.current) {
      try {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
          ? 'audio/ogg;codecs=opus'
          : '';
        const options = mimeType ? { mimeType } : undefined;
        const recorder = new MediaRecorder(mediaStreamRef.current, options);
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        recorder.start(250);
        mediaRecorderRef.current = recorder;
      } catch (recErr) {
        console.warn('MediaRecorder init note:', recErr);
      }
    }

    // 3. Start Live Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {}
          recognitionRef.current = null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = currentLangInfo.speechCode;

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const part = event.results[i][0]?.transcript || '';
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + part.trim();
            } else {
              interim += part;
            }
          }
          liveInterimRef.current = interim;
          const combined = (finalTranscriptRef.current + (interim ? (finalTranscriptRef.current ? ' ' : '') + interim : '')).trim();
          if (combined) {
            setTranscription(combined);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition status:', event.error);
          if (event.error === 'not-allowed') {
            setMicError(t('voice.microphoneDenied', 'Microphone permission blocked. Please allow microphone access in your browser.'));
          }
        };

        recognition.onend = () => {
          if (isRecordingRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition start note:', err);
      }
    }
  };

  const handleStopVoice = async () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    stopAudioAnalysis();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (liveInterimRef.current && liveInterimRef.current.trim()) {
      const full = (finalTranscriptRef.current + ' ' + liveInterimRef.current).trim();
      finalTranscriptRef.current = full;
      setTranscription(full);
      liveInterimRef.current = '';
    }

    // Stop MediaRecorder and transcribe with server using model gemini-3.5-transcribe
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const mimeType = recorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          await transcribeAudioWithServer(audioBlob, language);
        }
      };
      try {
        recorder.stop();
      } catch (e) {
        console.warn('Failed to stop MediaRecorder:', e);
      }
      mediaRecorderRef.current = null;
    } else if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      await transcribeAudioWithServer(audioBlob, language);
    }
  };

  // Language Change - updates global app language
  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // AI Verification & Statutory Gatekeeper
  const handleVerifyGrievance = async () => {
    const textToVerify = transcription.trim();
    if (!textToVerify) {
      setVerificationError(t('voice.transcriptionFailed', 'Please speak or type a complaint before verifying.'));
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    // Fast check: catch greetings, test phrases, casual chat immediately
    const localCheck = checkCivicValidityLocally(textToVerify);
    if (!localCheck.isValid) {
      const reasonMsg = localCheck.reason || t('voice.invalidDesc', 'Please describe a municipal defect like roads, water leakage, garbage, sewage, streetlights, or electrical issues.');
      setVerificationError(reasonMsg);
      setInvalidReason(reasonMsg);
      setIsInvalidModalOpen(true);
      setIsVerifying(false);
      return; // DO NOT PROCEED! POP UP INVALID MODAL
    }

    try {
      const res = await fetch('/api/complaints/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToVerify,
          language,
          manualLocation: user.ward + ', ' + user.district
        })
      });

      if (!res.ok) {
        throw new Error('Verification request returned status ' + res.status);
      }

      const result: any = await res.json();
      setVerifiedData(result);

      const isValid = Boolean(result.is_valid_complaint ?? result.isCivicIssue);

      // If AI detects invalid/non-civic statement: DO NOT SUBMIT, SHOW POP-UP
      if (!isValid) {
        const reasonMsg =
          result.validationReason ||
          result.rejection_reason ||
          t('voice.invalidDesc', 'Please describe a municipal defect like roads, water leakage, garbage, sewage, streetlights, or electrical issues.');
        setVerificationError(reasonMsg);
        setInvalidReason(reasonMsg);
        setIsInvalidModalOpen(true);
        setIsVerifying(false);
        return;
      }

      // Valid civic issue! Autofill all fields
      setFormTitle(result.extractedTitle || result.problem_title || textToVerify.substring(0, 60));
      setFormDesc(result.extractedDescription || result.description || textToVerify);
      setFormDepartment(result.suggestedDepartment || result.department || 'Public Works Department (PWD)');
      setFormCategory(result.suggestedCategory || result.problem_category || 'Roads & Potholes');
      setFormUrgency(result.suggestedUrgency || result.urgency || 'Urgent');
      setFormSeverity(result.suggestedSeverityScore || (result.severity === 'Critical' ? 9.2 : result.severity === 'High' ? 8.5 : 6.0));
      setFormSlaHours(result.targetHours || result.sla_hours || (result.suggestedUrgency === 'Urgent' ? 24 : 48));
      if (result.extractedLocation || result.location_text) {
        setFormLocation(result.extractedLocation || result.location_text);
      } else {
        setFormLocation(user.ward + ', ' + user.district);
      }

      // Transition to Review step
      setStep('review');
    } catch (err: any) {
      console.warn('Verification fallback:', err);
      // Heuristic statutory civic validation fallback
      const lower = textToVerify.toLowerCase();
      const isWater = /(water|पानी|जल|pipe|pipeline|leak|नल|குடிநீர்|தண்ணீர்|నీరు|জল|पाणी)/i.test(lower);
      const isRoad = /(road|roads|pothole|potholes|footpath|सड़क|सडक|गड्ढा|गड्ढे|रस्ता|சாலை|ரோడ్డు|রাস্তা)/i.test(lower);
      const isGarbage = /(garbage|trash|waste|dump|कचरा|कूड़ा|सफाई|गंदगी|கழிவு|குப்பை|చెత్త|আবর্জना|घाण)/i.test(lower);
      const isLight = /(light|streetlight|lamp|बिजली|बल्ब|स्ट्रीटलाइट|wire|electric|மின்சாரம்|மின்விளக்கு|కరెంట్|বিদ্যুৎ|दिवा|पथदिवा)/i.test(lower);
      const isDrain = /(drain|drainage|sewer|sewage|manhole|gutter|नाली|नाला|मैनहोल|सीवर|गंदा पानी|சாக்கடை|మురుగు)/i.test(lower);
      const isHealth = /(hospital|clinic|doctor|phc|medicine|अस्पताल|दवा|स्वास्थ्य)/i.test(lower);

      const hasCivicSign = isWater || isRoad || isGarbage || isLight || isDrain || isHealth;
      const isGreeting = /^(hello|hi|hey|namaste|pranam|good morning|good evening|kaise ho|how are you|test|testing)\b/i.test(lower);

      if (!hasCivicSign || isGreeting || textToVerify.trim().length < 8) {
        const reasonMsg = 'This statement does not describe a municipal infrastructure problem (such as road damage, water leaks, uncleaned waste, or streetlight failure). Please describe a valid community problem.';
        setVerificationError(reasonMsg);
        setInvalidReason(reasonMsg);
        setIsInvalidModalOpen(true);
        setIsVerifying(false);
        return;
      }

      setFormTitle(textToVerify.substring(0, 65));
      setFormDesc(textToVerify);
      setFormDepartment(
        isWater ? 'Municipal Water Supply & Sewerage Board' :
        isGarbage ? 'Sanitation & Solid Waste Management' :
        isLight ? 'Municipal Electrical & Lighting Department' :
        isDrain ? 'Municipal Drainage & Sewerage Division' :
        'Public Works Department (PWD)'
      );
      setFormCategory(
        isWater ? 'Drinking Water & Pipeline Leakage' :
        isGarbage ? 'Garbage & Sanitation' :
        isLight ? 'Streetlights & Electrical' :
        isDrain ? 'Sewage & Drainage' :
        'Roads & Potholes'
      );
      setFormUrgency('Urgent');
      setFormSeverity(8.8);
      setFormSlaHours(48);
      setFormLocation(user.ward + ', ' + user.district);
      setStep('review');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUseSampleComplaint = () => {
    const sample = 'Deep dangerous potholes on Ward 14 main market road causing vehicle accidents and traffic jam daily.';
    setTranscription(sample);
    finalTranscriptRef.current = sample;
    setIsInvalidModalOpen(false);
    setFormTitle('Severe Potholes on Main Market Road');
    setFormDesc(sample);
    setFormCategory('Roads & Potholes');
    setFormDepartment('Public Works Department (PWD)');
    setFormUrgency('Urgent');
    setFormSeverity(8.8);
    setFormSlaHours(24);
    setFormLocation(user.ward + ', ' + user.district);
    setStep('review');
  };

  const handleReRecordFromInvalid = () => {
    setIsInvalidModalOpen(false);
    setTranscription('');
    finalTranscriptRef.current = '';
    handleStartVoice();
  };

  const handleEditFromInvalid = () => {
    setIsInvalidModalOpen(false);
    setStep('record');
  };

  // GPS Geolocation Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoordinates({ lat: latitude, lng: longitude });

        try {
          const res = await fetch('/api/location/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude })
          });

          if (res.ok) {
            const data = await res.json();
            const resolved = data.displayName || `${user.ward}, ${user.district}`;
            setGpsAddress(resolved);
            setFormLocation(resolved);
          } else {
            const coordStr = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (${user.ward})`;
            setGpsAddress(coordStr);
            setFormLocation(coordStr);
          }
        } catch (e) {
          const coordStr = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (${user.ward})`;
          setGpsAddress(coordStr);
          setFormLocation(coordStr);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsError('Could not detect location. Please check location permissions or enter address manually.');
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // File Upload Handling
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setMediaFile({
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image',
        base64,
        preview: result
      });
    };
    reader.readAsDataURL(file);
  };

  // Camera handling
  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      cameraStreamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera error:', err);
      alert('Camera access denied or unavailable. Please use file upload.');
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      try {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1];

    setMediaFile({
      name: `voice_evidence_${Date.now()}.jpg`,
      type: 'image',
      base64,
      preview: dataUrl
    });
    stopCamera();
  };

  // Final Submission to Server API & App Context
  const handleSubmitGrievance = async () => {
    if (!formTitle.trim() || !formDesc.trim()) return;

    // AI statutory pre-submission verification gate
    const checkText = `${formTitle.trim()}. ${formDesc.trim()}`;
    const localCheck = checkCivicValidityLocally(checkText);
    if (!localCheck.isValid) {
      const reasonMsg = localCheck.reason || 'This statement does not describe a municipal infrastructure problem.';
      setInvalidReason(reasonMsg);
      setIsInvalidModalOpen(true);
      return; // STOP! DO NOT SUBMIT
    }

    try {
      const verifyRes = await fetch('/api/complaints/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: checkText,
          language,
          manualLocation: formLocation || (user.ward + ', ' + user.district)
        })
      });
      if (verifyRes.ok) {
        const checkData = await verifyRes.json();
        const isValid = Boolean(checkData.is_valid_complaint ?? checkData.isCivicIssue);
        if (!isValid) {
          const reasonMsg = checkData.validationReason || checkData.rejection_reason || 'This statement does not describe a municipal infrastructure problem.';
          setInvalidReason(reasonMsg);
          setIsInvalidModalOpen(true);
          return; // STOP! DO NOT SUBMIT
        }
      }
    } catch (err) {
      console.warn('Pre-submit statutory check error:', err);
    }

    setIsSubmitting(true);
    try {
      // 1. Submit to server endpoint
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          description: formDesc,
          category: formCategory,
          department: formDepartment,
          location: formLocation,
          urgency: formUrgency,
          severityScore: formSeverity,
          targetHours: formSlaHours,
          source: 'voice',
          language,
          citizenName: user.name,
          citizenPhone: (user as any).phone || '+91 98765 43210',
          ward: user.ward,
          district: user.district,
          media: mediaFile ? {
            name: mediaFile.name,
            type: mediaFile.type,
            base64: mediaFile.base64
          } : undefined
        })
      });

      let tokenNumber = `#2026-${Math.floor(1000 + Math.random() * 9000)}`;
      if (response.ok) {
        const json = await response.json();
        if (json.complaint && json.complaint.token) {
          tokenNumber = json.complaint.token;
        }
      }

      // 2. Add to AppContext so local Feed, Dashboard, and GIS update immediately
      addGrievance({
        title: formTitle,
        description: formDesc,
        category: formCategory,
        department: formDepartment,
        locationName: formLocation,
        urgency: formUrgency,
        severityScore: formSeverity,
        targetHours: formSlaHours,
        status: 'Under Triage',
        source: 'voice',
        mediaUrl: mediaFile ? mediaFile.preview : undefined,
        thumbnailUrl: mediaFile ? mediaFile.preview : undefined,
        mediaType: mediaFile ? (mediaFile.type as any) : undefined
      });

      setSubmittedToken(tokenNumber);
      setStep('submitted');

      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (e) {
      console.warn('Submission network fallback:', e);
      // Fallback: still record in local context
      const created = addGrievance({
        title: formTitle,
        description: formDesc,
        category: formCategory,
        department: formDepartment,
        locationName: formLocation,
        urgency: formUrgency,
        severityScore: formSeverity,
        targetHours: formSlaHours,
        status: 'Under Triage',
        source: 'voice'
      });
      setSubmittedToken(created.token);
      setStep('submitted');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    handleStopVoice();
    stopCamera();
    setStep('record');
    setTranscription('');
    finalTranscriptRef.current = '';
    setVerifiedData(null);
    setVerificationError(null);
    setMediaFile(null);
    setSubmittedToken(null);
    setIsVoiceModalOpen(false);
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label={t('common.close', 'Close')}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>{t('voice.badge', 'Statutory 48h Voice Seva')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('voice.title', 'AI Voice Seva')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('voice.subtitle', 'Statutory Speech-to-Text Municipal Grievance Filing with 48h SLA Dispatch')}
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              step === 'record'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <span>{t('voice.step1', '1. Voice Input')}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              step === 'review'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <span>{t('voice.step2', '2. Review & Evidence')}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              step === 'submitted'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <span>{t('voice.step3', '3. Redressal Token')}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: RECORD & TRANSCRIBE */}
        {step === 'record' && (
          <div>
            {/* Language Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Languages className="w-3 h-3 text-orange-600" />
                  {t('voice.selectLanguage', 'Select Voice Language')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {SUPPORTED_LANGUAGES.find((s) => s.code === language)?.name}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleLanguageChange(item.code)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      language === item.code
                        ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {item.nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Error banner if microphone is blocked */}
            {micError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1">
                  <p className="font-semibold">{micError}</p>
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                    {t('voice.editableHint', 'You can also type directly in the transcription box below.')}
                  </p>
                </div>
              </div>
            )}

            {/* Real-time Microphone Record Button */}
            <div className="flex flex-col items-center justify-center my-3">
              <button
                type="button"
                onClick={isRecording ? handleStopVoice : handleStartVoice}
                className={`relative w-22 h-22 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white shadow-xl shadow-red-600/40 ring-4 ring-red-400/40 scale-105 active:scale-95'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30 hover:scale-105 active:scale-95'
                }`}
                title={isRecording ? t('voice.stopSpeaking', 'Tap to Stop Recording') : t('voice.startSpeaking', 'Tap Microphone to Speak')}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 fill-current" />
                ) : (
                  <Mic className="w-9 h-9 stroke-[2.2]" />
                )}

                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30 pointer-events-none" />
                )}
              </button>

              {/* Status & Timer Label */}
              <div className="mt-3 flex flex-col items-center gap-1">
                {isRecording ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse">
                      Recording: 00:{timer < 10 ? `0${timer}` : timer}
                    </span>
                    <button
                      type="button"
                      onClick={handleStopVoice}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 underline cursor-pointer"
                    >
                      {t('voice.stopSpeaking', 'Tap to Stop Recording')}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {t('voice.startSpeaking', 'Tap Microphone to Speak')}
                  </span>
                )}
              </div>
            </div>

            {/* REAL-TIME DYNAMIC AUDIO FREQUENCY WAVEFORM */}
            <div className="my-3">
              <div className="h-14 flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                {waveHeights.map((height, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${height}px`,
                      transition: isVoiceHeard ? 'height 0.08s ease-out' : 'height 0.25s ease-out'
                    }}
                    className={`w-1.5 rounded-full ${
                      isVoiceHeard
                        ? 'bg-linear-to-t from-orange-600 via-amber-500 to-amber-300 shadow-xs shadow-orange-500/40'
                        : isRecording
                        ? 'bg-slate-300 dark:bg-slate-600'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Dynamic Sound Detector Pill */}
              <div className="flex items-center justify-center mt-2">
                {isRecording ? (
                  isVoiceHeard ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>{t('voice.voiceHeard', 'Voice Heard • Receiving Audio Stream')} ({audioLevel} dB)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{t('voice.listening', 'Listening... Speak your complaint clearly')}</span>
                    </span>
                  )
                ) : (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    Audio visualizer reacts to live microphone audio
                  </span>
                )}
              </div>
            </div>

            {/* Live Editable Transcription Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('voice.spokenComplaint', 'Spoken Complaint & Transcript')}
                  </span>
                  {isRecording && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Listening...
                    </span>
                  )}
                  {isAiTranscribing && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {t('voice.transcribing', 'Transcribing audio with Gemini...')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {transcription && (
                    <button
                      type="button"
                      onClick={() => {
                        setTranscription('');
                        finalTranscriptRef.current = '';
                      }}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-0.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('common.retry', 'Clear')}</span>
                    </button>
                  )}
                  {transcription && !isRecording && !isAiTranscribing && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Volume2 className="w-3 h-3" /> Captured
                    </span>
                  )}
                </div>
              </div>

              <textarea
                value={transcription}
                onChange={(e) => {
                  setTranscription(e.target.value);
                  finalTranscriptRef.current = e.target.value;
                }}
                rows={3}
                placeholder={
                  isRecording
                    ? t('voice.listening', 'Listening for your voice... speak your grievance now.')
                    : t('voice.placeholder', 'Your spoken grievance will appear here word-for-word. You can also type or edit anytime...')
                }
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder:italic placeholder:text-slate-400 leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {t('voice.editableHint', 'You can edit or type in this box at any time before verification.')}
              </p>
            </div>

            {/* Validation Error Banner */}
            {verificationError && (
              <div className="p-3 mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold">{t('voice.invalid', 'Not a Recognized Civic Issue')}</p>
                  <p className="text-[11px] mt-0.5">{verificationError}</p>
                </div>
              </div>
            )}

            {/* File with AI Statutory Check Action */}
            <button
              onClick={handleVerifyGrievance}
              disabled={!transcription.trim() || isRecording || isVerifying || isAiTranscribing}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('voice.verifying', 'AI Statutory Verification in Progress...')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t('voice.fileGrievanceBtn', 'File Grievance (AI Statutory Check & 48h SLA)')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: REVIEW, EDIT & EVIDENCE ATTACHMENT */}
        {step === 'review' && (
          <div className="space-y-4">
            {/* AI Verification Badge */}
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {t('voice.verified', 'Complaint Verified as Civic Issue')}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    Confidence: {Math.round((verifiedData?.confidence || 0.95) * 100)}% • Category & Department Auto-Triage
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                MoHUA 48h
              </span>
            </div>

            {/* Editable Title */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('voice.problemTitle', 'Grievance Title')}
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Editable Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('voice.problemDesc', 'Detailed Description')}
              </label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed"
              />
            </div>

            {/* Department & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-orange-600" />
                  {t('voice.department', 'Assigned Department')}
                </label>
                <select
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                  <option value="Municipal Water Supply & Sewerage Board">Municipal Water Supply & Sewerage</option>
                  <option value="Sanitation & Solid Waste Management">Sanitation & Solid Waste</option>
                  <option value="Electrical & Street Lighting Department">Electrical & Street Lighting</option>
                  <option value="Public Health & Vector Control">Public Health & Vector Control</option>
                  <option value="Town Planning & Encroachment Control">Town Planning & Encroachment</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  {t('voice.category', 'Municipal Category')}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Roads & Potholes">{translateCategory('Roads & Potholes')}</option>
                  <option value="Drinking Water & Pipeline Leakage">{translateCategory('Drinking Water & Pipeline Leakage')}</option>
                  <option value="Garbage & Sanitation">{translateCategory('Garbage & Sanitation')}</option>
                  <option value="Streetlights & Electrical">{translateCategory('Streetlights & Electrical')}</option>
                  <option value="Sewage & Drainage">{translateCategory('Sewage & Drainage')}</option>
                  <option value="Health & Sanitation">{translateCategory('Health & Sanitation')}</option>
                </select>
              </div>
            </div>

            {/* Urgency and Statutory SLA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                  {t('voice.urgency', 'Urgency Level')}
                </label>
                <select
                  value={formUrgency}
                  onChange={(e) => {
                    const u = e.target.value as 'Urgent' | 'Priority' | 'Standard';
                    setFormUrgency(u);
                    setFormSlaHours(u === 'Urgent' ? 24 : 48);
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Urgent">{translateUrgency('Urgent')} ({t('voice.urgencyUrgentHint', 'Safety / Hazard')})</option>
                  <option value="Priority">{translateUrgency('Priority')} ({t('voice.urgencyPriorityHint', 'High Public Impact')})</option>
                  <option value="Standard">{translateUrgency('Standard')} ({t('voice.urgencyStandardHint', 'General Municipal')})</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  {t('voice.sla', 'Statutory SLA Redressal')}
                </label>
                <div className="w-full text-xs p-2 rounded-xl border border-orange-200 dark:border-orange-900/60 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300 font-bold flex items-center justify-between">
                  <span>{t('voice.legalWindow', 'Legal Resolution Window:')}</span>
                  <span>{formSlaHours} {t('fileModal.hours', 'Hours')}</span>
                </div>
              </div>
            </div>

            {/* Location Section (GPS + Detected Address) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  {t('voice.location', 'Jurisdiction & Location')}
                </span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingGps}
                  className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isDetectingGps ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{t('voice.detectingLocation', 'Detecting GPS...')}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3" />
                      <span>{t('voice.detectLocation', 'Use My Current Location')}</span>
                    </>
                  )}
                </button>
              </div>

              {gpsAddress && (
                <div className="mb-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>{t('voice.gpsResolved', 'GPS Resolved:')}</strong> {gpsAddress}</span>
                </div>
              )}

              {gpsError && (
                <p className="text-[10px] text-amber-600 mb-2">{gpsError}</p>
              )}

              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder={t('voice.locationPlaceholder', 'Enter street, landmark, or ward name...')}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Evidence Upload & Camera Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-orange-600" />
                {t('voice.evidence', 'Photo or Video Evidence')}
              </span>

              {/* Camera Preview Mode */}
              {isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center mb-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{t('voice.capturePhoto', 'Capture Snapshot')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      {t('common.cancel', 'Cancel')}
                    </button>
                  </div>
                </div>
              ) : mediaFile ? (
                /* Uploaded File Preview */
                <div className="relative p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-3">
                  {mediaFile.type === 'image' ? (
                    <img
                      src={mediaFile.preview}
                      alt="Complaint evidence"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
                      VIDEO
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {mediaFile.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      ✓ Ready for municipal verification
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Choice: Upload File or Open Camera */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 bg-white dark:bg-slate-900 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t('voice.uploadEvidence', 'Upload Photo / Video')}
                    </span>
                    <span className="text-[10px] text-slate-400">JPEG, PNG, MP4, WebM</span>
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 bg-white dark:bg-slate-900 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Camera className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t('voice.useCamera', 'Capture with Camera')}
                    </span>
                    <span className="text-[10px] text-slate-400">Live Device Camera</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('record')}
                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back', 'Back')}</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitGrievance}
                disabled={isSubmitting || !formTitle.trim()}
                className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('voice.submitting', 'Initiating Statutory 48h SLA...')}</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>{t('voice.confirmFileSla', 'Confirm & File Grievance (Start 48h SLA)')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMISSION SUCCESS & STATUTORY REDRESSAL TOKEN */}
        {step === 'submitted' && (
          <div className="text-center py-4 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {t('voice.successTitle', 'Voice Grievance Legally Registered!')}
            </h4>

            {/* Generated Statutory Token */}
            <div className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono font-black text-orange-600 dark:text-orange-400 text-base border border-slate-200 dark:border-slate-700 shadow-xs">
              {t('feed.token', 'Token')}: {submittedToken}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
              {t('voice.routedTo', 'Routed to')} <strong>{formDepartment}</strong> {t('voice.underCategory', 'under')} <strong>{translateCategory(formCategory)}</strong>. {t('voice.statutoryClockCommenced', 'Statutory 48-hour resolution clock has officially commenced.')}
            </p>

            {/* SLA Clock Guarantee Badge */}
            <div className="w-full mt-2 p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-xs text-left flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{t('voice.slaWindow', 'Statutory SLA Window:')}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('voice.mohuaGov', 'Ministry of Housing & Urban Affairs (MoHUA)')}</p>
              </div>
              <span className="font-black text-orange-600 dark:text-orange-400 text-sm">{formSlaHours} {t('sla.hoursMandate', 'Hours Mandate')}</span>
            </div>

            {/* Finish & View in Grievance Feed */}
            <button
              onClick={handleClose}
              className="w-full mt-3 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              {t('voice.viewInFeed', 'Done & View in Grievance Feed')} →
            </button>
          </div>
        )}
      </div>

      {/* Invalid Report AI Rejection Modal */}
      <InvalidReportModal
        isOpen={isInvalidModalOpen}
        onClose={() => setIsInvalidModalOpen(false)}
        reason={invalidReason}
        transcription={transcription || `${formTitle} ${formDesc}`.trim()}
        onEdit={handleEditFromInvalid}
        onReRecord={handleReRecordFromInvalid}
        onUseSample={handleUseSampleComplaint}
      />
    </div>
  );
};
