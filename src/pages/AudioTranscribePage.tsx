import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  FileText,
  UploadCloud,
  Clock,
  ArrowRight,
  Trash2,
  Download,
  AlertCircle,
  Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InvalidReportModal } from '../components/InvalidReportModal';
import { verifyCivicReport } from '../utils/civicValidator';

interface TranscriptItem {
  id: string;
  text: string;
  timestamp: string;
  durationSec: number;
  language: string;
  model: string;
  audioUrl?: string;
}

const SAMPLE_CLIPS = [
  {
    title: 'Ward 27 Road Pothole',
    desc: 'Citizen reporting severe crater on main market street',
    lang: 'HI',
    text: 'वार्ड नंबर सत्ताइस में मुख्य बाजार वाली सड़क पर बड़ा गड्ढा हो गया है, जिससे कई गाड़ियां फिसल रही हैं और दुर्घटना हो सकती है। कृपया लोक निर्माण विभाग तुरंत मरम्मत कराए।'
  },
  {
    title: 'Drinking Water Pipeline Burst',
    desc: 'Drinking water wastage flooding residential colony',
    lang: 'HI',
    text: 'हमारे मोहल्ले में पीने के पानी की मेन पाइपलाइन पिछले दो दिनों से फटी हुई है। लाखों लीटर साफ पानी बह रहा है और घरों में पानी की भारी किल्लत हो गई है।'
  },
  {
    title: 'Streetlight Failure & Safety',
    desc: 'Dark junction needing urgent electrical replacement',
    lang: 'EN',
    text: 'All streetlights near the railway underpass junction have been non-functional for over a week, posing a serious safety risk at night for commuters and pedestrians.'
  }
];

export default function AudioTranscribePage() {
  const { language, setIsFileModalOpen } = useApp();
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [detectedModel, setDetectedModel] = useState('gemini-3.5-transcribe');
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language || 'auto');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isInvalidModalOpen, setIsInvalidModalOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState('');
  const [isValidatingForGrievance, setIsValidatingForGrievance] = useState(false);
  const [history, setHistory] = useState<TranscriptItem[]>(() => {
    try {
      const saved = localStorage.getItem('janvani_transcripts_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('janvani_transcripts_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save transcription history:', e);
    }
  }, [history]);

  // Clean up media and intervals on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startVisualizer = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        // Normalize 0 to 100
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Web Audio API visualizer note:', err);
    }
  };

  // Convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Start microphone recording
  const handleStartRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      startVisualizer(stream);

      // Determine supported MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start(250);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setErrorMsg(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser address bar.'
          : 'Could not access microphone: ' + (err.message || 'Please check your audio device.')
      );
    }
  };

  // Stop recording and trigger gemini-3.5-transcribe
  const handleStopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      return;
    }

    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioLevel(0);

    const recorder = mediaRecorderRef.current;
    const duration = recordingTime;

    recorder.onstop = async () => {
      try {
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);

        await sendAudioToTranscribe(audioBlob, mimeType, duration);
      } catch (err: any) {
        console.error('Transcription processing error:', err);
        setErrorMsg('Error processing recorded audio: ' + (err.message || 'Unknown error'));
      } finally {
        stopRecordingCleanup();
      }
    };

    try {
      recorder.stop();
    } catch (e) {
      console.warn('Error stopping recorder:', e);
      stopRecordingCleanup();
    }
  };

  // Send audio payload to /api/transcribe (invoking gemini-3.5-transcribe)
  const sendAudioToTranscribe = async (audioBlob: Blob, mimeType: string, durationSec: number) => {
    setIsTranscribing(true);
    setErrorMsg(null);

    try {
      const base64Audio = await blobToBase64(audioBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          mimeType,
          language: selectedLang
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const text = (data.transcription || '').trim();

      if (text) {
        setTranscribedText(text);
        setDetectedModel(data.model || 'gemini-3.5-transcribe');

        const newItem: TranscriptItem = {
          id: `tx_${Date.now()}`,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          durationSec: durationSec || 5,
          language: selectedLang,
          model: data.model || 'gemini-3.5-transcribe'
        };
        setHistory((prev) => [newItem, ...prev.slice(0, 14)]);
      } else {
        setTranscribedText('');
        setErrorMsg('No speech detected in audio. Please speak clearly into your microphone and try again.');
      }
    } catch (err: any) {
      console.error('Transcription API error:', err);
      setErrorMsg('Transcription failed: ' + (err.message || 'Check server connection'));
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const mimeType = file.type || 'audio/webm';
    const localUrl = URL.createObjectURL(file);
    setAudioUrl(localUrl);

    await sendAudioToTranscribe(file, mimeType, 10);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Use sample clip
  const handleUseSample = (sample: typeof SAMPLE_CLIPS[0]) => {
    setTranscribedText(sample.text);
    setDetectedModel('gemini-3.5-transcribe');
    setSelectedLang(sample.lang);

    const newItem: TranscriptItem = {
      id: `sample_${Date.now()}`,
      text: sample.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationSec: 8,
      language: sample.lang,
      model: 'gemini-3.5-transcribe'
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 14)]);
  };

  // Copy text to clipboard
  const handleCopy = () => {
    if (!transcribedText) return;
    navigator.clipboard.writeText(transcribedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download as text file
  const handleDownloadTxt = () => {
    if (!transcribedText) return;
    const element = document.createElement('a');
    const file = new Blob([transcribedText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `janvani-transcription-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Text to speech playback
  const handleSpeakAloud = () => {
    if (!transcribedText) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(transcribedText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const wordCount = transcribedText.trim() ? transcribedText.trim().split(/\s+/).length : 0;
  const charCount = transcribedText.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner / Feature Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Model: gemini-3.5-transcribe</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Transcribe Audio
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Input audio with your microphone to transcribe citizen complaints, municipal issues, and voice statements into verbatim text using Google's <span className="font-semibold text-orange-600 dark:text-orange-400">gemini-3.5-transcribe</span> model.
            </p>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Spoken Language:
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              disabled={isRecording || isTranscribing}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="auto">Auto Detect Language</option>
              <option value="HI">हिन्दी (Hindi)</option>
              <option value="EN">English</option>
              <option value="MR">मराठी (Marathi)</option>
              <option value="TA">தமிழ் (Tamil)</option>
              <option value="TE">తెలుగు (Telugu)</option>
              <option value="BN">বাংলা (Bengali)</option>
              <option value="GU">ગુજરાતી (Gujarati)</option>
              <option value="KN">ಕನ್ನಡ (Kannada)</option>
              <option value="PA">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Microphone Interaction Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recording & Input Station */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center text-center shadow-xs relative overflow-hidden">
            {/* Background pulsing glow when recording */}
            {isRecording && (
              <div
                className="absolute inset-0 bg-red-500/10 dark:bg-red-500/15 pointer-events-none transition-opacity duration-300 animate-pulse"
              />
            )}

            {/* Status Pill */}
            <div className="mb-6">
              {isTranscribing ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Transcribing with gemini-3.5-transcribe...
                </span>
              ) : isRecording ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  Listening & Recording Microphone...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Mic className="w-3.5 h-3.5 text-slate-500" />
                  Microphone Ready
                </span>
              )}
            </div>

            {/* Central Big Microphone Button */}
            <div className="relative my-2">
              {isRecording && (
                <div
                  className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"
                  style={{ transform: `scale(${1 + audioLevel / 100})` }}
                />
              )}

              <button
                type="button"
                id="mic-transcribe-button"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isTranscribing}
                className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-400/40 shadow-red-600/40'
                    : isTranscribing
                    ? 'bg-amber-500 text-white cursor-not-allowed opacity-80'
                    : 'bg-linear-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white ring-4 ring-orange-500/20 shadow-orange-600/30 hover:scale-105'
                }`}
                title={isRecording ? 'Click to Stop and Transcribe' : 'Click to Speak into Microphone'}
              >
                {isRecording ? (
                  <>
                    <Square className="w-9 h-9 fill-current" />
                    <span className="text-[11px] font-black uppercase mt-1 tracking-wider">Stop</span>
                  </>
                ) : isTranscribing ? (
                  <>
                    <Sparkles className="w-9 h-9 animate-spin" />
                    <span className="text-[10px] font-bold mt-1">Wait...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-9 h-9 stroke-[2.2]" />
                    <span className="text-[11px] font-black uppercase mt-1 tracking-wider">Record</span>
                  </>
                )}
              </button>
            </div>

            {/* Timer & Level Indicator */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {formatTimer(recordingTime)}
              </div>

              {isRecording && (
                <div className="w-48 space-y-1">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-75"
                      style={{ width: `${Math.max(5, audioLevel)}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Mic Input Level: {audioLevel}%
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 max-w-sm">
              {isRecording
                ? 'Speak clearly into your microphone. Click STOP when finished to run transcription.'
                : 'Click the microphone button to start recording voice from your device.'}
            </p>

            {/* Recorded Audio Playback Bar */}
            {audioUrl && !isRecording && (
              <div className="mt-5 w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-orange-600" />
                  Your Audio:
                </span>
                <audio controls src={audioUrl} className="h-8 max-w-[240px] rounded-lg" />
              </div>
            )}
          </div>

          {/* Alternative: Upload audio or Try sample clips */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-orange-600" />
                Or Upload Pre-Recorded Audio File
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={isRecording || isTranscribing}
                className="hidden"
                id="audio-file-upload-input"
              />
              <label
                htmlFor="audio-file-upload-input"
                className="flex-1 py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-slate-500" />
                Choose WAV, MP3, WebM, M4A or OGG
              </label>
            </div>

            {/* Quick Demo Test Clips */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Quick Test Samples (Instant Simulation):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_CLIPS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUseSample(sample)}
                    disabled={isRecording || isTranscribing}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {sample.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {sample.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transcription Output & Action Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex-1 flex flex-col shadow-xs">
            {/* Header with counts and badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Transcribed Text
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {wordCount} words • {charCount} chars
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                  {detectedModel}
                </span>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Text Output Box */}
            <div className="flex-1 min-h-[220px] relative">
              {isTranscribing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Sparkles className="w-8 h-8 text-orange-500 animate-spin mb-3" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Transcribing speech with model gemini-3.5-transcribe...
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Processing verbatim audio phonemes into structured text
                  </p>
                </div>
              ) : (
                <textarea
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  placeholder="Your audio transcription will appear here. Press the microphone button above to begin speaking..."
                  className="w-full h-full min-h-[220px] p-4 text-sm sm:text-base leading-relaxed rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-y font-normal"
                />
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!transcribedText}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Copy transcription to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSpeakAloud}
                  disabled={!transcribedText}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Speak text aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  disabled={!transcribedText}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Download as text file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTranscribedText('');
                    setAudioUrl(null);
                  }}
                  disabled={!transcribedText}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
                  title="Clear text"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct Link to File Grievance with this text */}
              <button
                type="button"
                onClick={async () => {
                  if (!transcribedText.trim()) return;
                  setIsValidatingForGrievance(true);
                  try {
                    const result = await verifyCivicReport(transcribedText.trim(), selectedLang);
                    if (!result.isValid) {
                      setInvalidReason(
                        result.reason ||
                        'This statement does not describe a municipal infrastructure problem (such as road damage, water leaks, uncleaned garbage, or streetlight failure).'
                      );
                      setIsInvalidModalOpen(true);
                      setIsValidatingForGrievance(false);
                      return; // STOP! DO NOT PROCEED TO FILE
                    }
                    setIsFileModalOpen(true);
                  } finally {
                    setIsValidatingForGrievance(false);
                  }
                }}
                disabled={!transcribedText || isValidatingForGrievance}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs shadow-orange-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isValidatingForGrievance ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking Issue...</span>
                  </>
                ) : (
                  <>
                    <span>File as Grievance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* History of Past Transcriptions */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  Recent Transcriptions
                </h3>
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-[11px] font-semibold text-slate-500 hover:text-red-500 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear History
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setTranscribedText(item.text)}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-orange-50/60 dark:hover:bg-orange-950/20 hover:border-orange-200 transition-colors cursor-pointer flex items-start justify-between gap-3"
                  >
                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>
                    <span className="shrink-0 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invalid Non-Civic Report Modal */}
      <InvalidReportModal
        isOpen={isInvalidModalOpen}
        onClose={() => setIsInvalidModalOpen(false)}
        reason={invalidReason}
        onUseSample={() => {
          setTranscribedText(SAMPLE_CLIPS[0].text);
          setIsInvalidModalOpen(false);
        }}
        onReRecord={() => {
          setIsInvalidModalOpen(false);
          setTranscribedText('');
          handleStartRecording();
        }}
      />
    </div>
  );
}
