import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Upload,
  Video,
  Camera,
  MapPin,
  Clock,
  Sparkles,
  Shield,
  CheckCircle,
  FileCheck,
  Mic,
  Square,
  AudioLines
} from 'lucide-react';
import { categoriesList, indianStates } from '../data/mockData';
import confetti from 'canvas-confetti';
import { InvalidReportModal } from './InvalidReportModal';
import { verifyCivicReport } from '../utils/civicValidator';

export const FileGrievanceModal: React.FC = () => {
  const { isFileModalOpen, setIsFileModalOpen, addGrievance, user, language, t, translateCategory, translateUrgency } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Roads & Potholes');
  const [state, setState] = useState(user.state);
  const [district, setDistrict] = useState(user.district);
  const [ward, setWard] = useState(user.ward);
  const [locationName, setLocationName] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [urgency, setUrgency] = useState<'Urgent' | 'Priority' | 'Standard'>('Urgent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGrievance, setCreatedGrievance] = useState<any>(null);
  const [isInvalidModalOpen, setIsInvalidModalOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState('');

  const [isMicRecording, setIsMicRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const toggleMicRecording = async () => {
    if (isMicRecording) {
      setIsMicRecording(false);
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = async () => {
          if (audioChunksRef.current.length > 0) {
            const mimeType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            await transcribeAudioToDescription(audioBlob, mimeType);
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
          }
        };
        recorder.stop();
      }
      return;
    }

    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start(250);
      setIsMicRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone.');
      setIsMicRecording(false);
    }
  };

  const transcribeAudioToDescription = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.includes(',') ? res.split(',')[1] : res);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const base64Audio = await base64Promise;

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          mimeType,
          language: language || 'auto'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.transcription && data.transcription.trim()) {
          const text = data.transcription.trim();
          setDescription(prev => prev ? prev + ' ' + text : text);
        }
      }
    } catch (err) {
      console.warn('Transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  if (!isFileModalOpen) return null;

  const handleAutoFillSample = () => {
    setTitle('Broken Water Pipeline and Severe Road Caving on Main Market Road');
    setDescription('Underground municipal pipeline burst since morning, flooding the entire street. Road surface is caving in creating dangerous deep holes for pedestrians and vehicles.');
    setCategory('Drinking Water & Pipeline Leakage');
    setLocationName('Near Bada Mandir Chowk, Main Market');
    setUrgency('Urgent');
    setMediaType('video');
    setMediaUrl('https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=800&q=80');
    setIsInvalidModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToCheck = `${title.trim()}. ${description.trim()}`.trim();
    if (!textToCheck) return;

    setIsSubmitting(true);

    // AI statutory verification gate: check both local heuristics and Gemini verification
    const verifyResult = await verifyCivicReport(textToCheck, language, `${ward}, ${district}`);
    if (!verifyResult.isValid) {
      setIsSubmitting(false);
      setInvalidReason(
        verifyResult.reason ||
        'This statement does not describe a municipal infrastructure problem (such as road damage, water leaks, uncleaned garbage, or streetlight failure).'
      );
      setIsInvalidModalOpen(true);
      return; // HALT SUBMISSION COMPLETELY!
    }

    const severityScore = urgency === 'Urgent' ? 8.8 : urgency === 'Priority' ? 7.4 : 5.5;
    const targetHours = urgency === 'Urgent' ? 24 : 48;

    const created = addGrievance({
      title: title.trim(),
      description: description.trim(),
      category,
      state,
      district,
      ward,
      locationName: locationName || `${ward}, ${district}`,
      urgency,
      severityScore,
      targetHours,
      mediaType,
      mediaUrl: mediaUrl || (mediaType === 'video'
        ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'),
      thumbnailUrl: mediaUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    });

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // fallback
    }

    setIsSubmitting(false);
    setCreatedGrievance(created);
  };

  const handleClose = () => {
    setCreatedGrievance(null);
    setTitle('');
    setDescription('');
    setLocationName('');
    setMediaUrl('');
    setIsFileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {createdGrievance ? (
          /* Success Screen */
          <div className="text-center py-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                {t('voice.slaActiveBadge', 'Statutory 48h SLA Activated')}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                {t('feed.successTitle', 'Grievance Successfully Registered!')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t('voice.lockedWithToken', 'Your complaint is legally locked with automated token:')}
              </p>
              <div className="inline-block mt-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xl font-mono font-black text-orange-600 dark:text-orange-400 tracking-wider">
                {createdGrievance.token}
              </div>
            </div>

            {/* SLA Card */}
            <div className="w-full p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 text-left flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{t('voice.redressalWindow', 'Legal Redressal Window')}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t('voice.targetSlaPrefix', 'Target SLA:')} {createdGrievance.targetHours} {t('voice.targetSlaSuffix', 'Hours Statutory Redressal Mandate')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {t('voice.karmaEarned', '+50 Karma Pts Earned!')}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all cursor-pointer"
              >
                {t('voice.viewFeed', 'View in Grievance Feed')}
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    {t('fileModal.formTag', 'Form JV-01')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {t('fileModal.statutoryBadge', 'Statutory 48h Redressal')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillSample}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('fileModal.autofill', 'Auto-fill demo issue')}
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                {t('feed.fileGrievance', 'File Statutory Municipal Grievance')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t('fileModal.headerSub', 'Direct statutory routing to Nagar Palika Parishad & MoHUA field units.')}
              </p>
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('feed.category', 'Municipal Category')} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  required
                >
                  {categoriesList.filter(c => c !== 'All Civic Issues').map((cat) => (
                    <option key={cat} value={cat}>
                      {translateCategory(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('feed.urgency', 'Priority / Severity Class')} *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Urgent', 'Priority', 'Standard'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        urgency === level
                          ? level === 'Urgent'
                            ? 'bg-red-50 dark:bg-red-950/50 border-red-300 text-red-700 dark:text-red-300 ring-1 ring-red-400'
                            : level === 'Priority'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400'
                            : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {translateUrgency(level)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('feed.titleLabel', 'Grievance Title')} *
              </label>
              <input
                type="text"
                placeholder={t('fileModal.titlePlaceholder', 'e.g. Severe 3-Foot Deep Pothole & Waterlogging near Main Hospital')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('feed.descLabel', 'Issue Description & Hazard Details')} *
                </label>
                <button
                  type="button"
                  onClick={toggleMicRecording}
                  disabled={isTranscribing}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isMicRecording
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 animate-pulse'
                      : isTranscribing
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/60 hover:bg-orange-100'
                  }`}
                  title="Speak with microphone to transcribe using gemini-3.5-transcribe"
                >
                  {isMicRecording ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>{t('voice.stop', 'Stop & Transcribe')}</span>
                    </>
                  ) : isTranscribing ? (
                    <>
                      <Sparkles className="w-3 h-3 animate-spin" />
                      <span>{t('voice.transcribing', 'Transcribing...')}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-orange-600" />
                      <span>{t('fileModal.speakMic', 'Speak with Mic')}</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={3}
                placeholder={t('fileModal.descPlaceholder', 'Describe exact civic issue, public hazard, how long it has been persisting, and vehicle/pedestrian impact...')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Location Fields */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>{t('fileModal.jurisdiction', 'Geographic Jurisdiction')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('fileModal.stateUt', 'State / UT')}
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('fileModal.district', 'District')}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('fileModal.ward', 'Ward / Local Body')}
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('fileModal.landmark', 'Street / Landmark Location')}
                </label>
                <input
                  type="text"
                  placeholder={t('fileModal.landmarkPlaceholder', 'e.g. Hospital Chowk, Near District Dispensary')}
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Media Proof Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('fileModal.proofMedia', 'Proof Media (Photo or Video Reel)')}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                      mediaType === 'video'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{t('fileModal.videoReel', 'Video Reel')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                      mediaType === 'image'
                        ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-300'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t('fileModal.photo', 'Photo')}</span>
                  </button>
                </div>
              </div>

              {/* Upload Input & URL option */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 cursor-pointer shrink-0">
                  <Upload className="w-4 h-4 text-orange-600" />
                  <span>{t('fileModal.chooseFile', 'Choose File...')}</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  placeholder={t('fileModal.mediaPlaceholder', 'Or paste media URL / leave blank for automatic evidence')}
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              {mediaUrl && (
                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 mt-1">
                  <img
                    src={mediaUrl}
                    alt="Proof preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/70 text-white text-[8px] font-bold uppercase">
                    {mediaType}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t('common.cancel', 'Cancel')}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-600/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>{t('fileModal.submitting', 'Sealing Statutory Token...')}</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>{t('fileModal.submitBtn', 'Register Statutory Complaint →')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Invalid Report AI Rejection Modal */}
      <InvalidReportModal
        isOpen={isInvalidModalOpen}
        onClose={() => setIsInvalidModalOpen(false)}
        reason={invalidReason}
        transcription={`${title} ${description}`.trim()}
        onEdit={() => setIsInvalidModalOpen(false)}
        onReRecord={toggleMicRecording}
        onUseSample={handleAutoFillSample}
      />
    </div>
  );
};
