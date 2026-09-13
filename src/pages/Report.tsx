import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Send, ShieldCheck, CheckCircle2, MicOff, Sparkles } from 'lucide-react';

const API = '/api';

export default function Report() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('auto');
  const [busy, setBusy] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [result, setResult] = useState<any>();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const submit = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const r = await fetch(API + '/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: lang,
          source_channel: 'voice'
        })
      });
      const data = await r.json();
      setResult(data);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setBusy(false);
    }
  };

  const toggleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording and send audio to gemini-3.5-transcribe
      setIsRecording(false);
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = async () => {
          if (audioChunksRef.current.length > 0) {
            const mimeType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            await transcribeAudio(audioBlob, mimeType);
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
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

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(250);
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please allow microphone access in your browser.');
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (blob: Blob, mimeType: string) => {
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
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.transcription && data.transcription.trim()) {
          setText((prev) => (prev ? prev + ' ' : '') + data.transcription.trim());
        }
      }
    } catch (err) {
      console.warn('Transcription error in report:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b11] px-5 py-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="text-sm text-[#7f8da0] hover:text-white transition">
          ← JanVaani
        </Link>
        <div className="mt-10">
          <div className="label text-[#7ea2ff]">CITIZEN PORTAL</div>
          <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">Tell us what your community needs.</h1>
          <p className="mt-3 max-w-2xl text-[#8391a4]">
            Share a local issue in your own language. Keep it simple; the platform structures the signal for development planning.
          </p>
        </div>

        {result ? (
          <div className="glass mt-8 rounded-[30px] p-7">
            <div className="flex items-center gap-2 text-[#54d49a]">
              <CheckCircle2 size={19} /> Report received
            </div>
            <h2 className="mt-3 text-2xl font-black text-white">Thank you for speaking up.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Language', result.language],
                ['Category', result.category],
                ['Urgency', Math.round(result.urgency_score) + '/100'],
                ['District', result.district],
                ['Confidence', Math.round(result.confidence_score * 100) + '%'],
                ['Status', result.status]
              ].map(([a, b]) => (
                <div className="rounded-2xl border border-white/6 bg-white/[.025] p-4" key={a as string}>
                  <div className="label">{a}</div>
                  <div className="mt-1 font-semibold text-white">{b}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setText('');
                }}
                className="text-sm font-bold text-[#7ea2ff] hover:underline"
              >
                Submit another issue
              </button>
              <Link to="/dashboard" className="text-sm font-bold text-[#8d99aa] hover:text-white">
                View in Command Center →
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass mt-8 rounded-[30px] p-6">
            <div className="grid gap-5 sm:grid-cols-[170px_1fr]">
              <div>
                <div className="label">LANGUAGE</div>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="mt-2 w-full rounded-xl p-3"
                >
                  <option value="auto">Auto-detect</option>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                  <option value="bn">বাংলা</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
              <div>
                <div className="label">YOUR MESSAGE</div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-2 min-h-52 w-full resize-none rounded-2xl p-4 leading-7"
                  placeholder="Example: हमारे गांव में पानी की बहुत समस्या है। / There is no clean water supply in our locality."
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-white/6 pt-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isTranscribing}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  isRecording
                    ? 'border-red-500/50 bg-red-500/20 text-red-300 animate-pulse'
                    : isTranscribing
                    ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                    : 'border-white/10 bg-white/[.04] text-white hover:bg-white/[.08]'
                }`}
              >
                {isRecording ? (
                  <MicOff size={16} />
                ) : isTranscribing ? (
                  <Sparkles size={16} className="animate-spin" />
                ) : (
                  <Mic size={16} />
                )}
                {isRecording
                  ? 'Listening… (Click to stop)'
                  : isTranscribing
                  ? 'Transcribing with gemini-3.5-transcribe…'
                  : 'Voice input (gemini-3.5-transcribe)'}
              </button>
              <div className="flex-1 text-xs text-[#65748a]">
                <ShieldCheck size={14} className="mr-1 inline text-[#54d49a]" /> Identity is not shown in public views.
              </div>
              <button
                disabled={busy || text.trim().length < 3}
                onClick={submit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6f96ff] px-5 py-3 text-sm font-bold text-white disabled:opacity-40 hover:bg-[#5b85f7] transition"
              >
                <Send size={15} />
                {busy ? 'Processing…' : 'Submit report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
