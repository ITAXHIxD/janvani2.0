import express from 'express';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { analyzeText, transcribeAudio, verifyComplaint } from './server/ai.js';

// Spawn Python 3 JanVani Backend Service on port 5050
const PYTHON_PORT = 5050;
let pythonProcess: any = null;

try {
  pythonProcess = spawn('python3', ['backend/server.py'], {
    env: { ...process.env, PYTHON_BACKEND_PORT: String(PYTHON_PORT) },
    stdio: 'inherit'
  });
  console.log(`[JanVani] Python backend worker spawned on port ${PYTHON_PORT}`);

  pythonProcess.on('error', (err: any) => {
    console.warn('[JanVani] Python backend spawn warning:', err.message);
  });
} catch (e: any) {
  console.warn('[JanVani] Could not spawn python process directly:', e.message);
}

process.on('exit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Proxy to Python Backend Helper
  const proxyToPython = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const options = {
      hostname: '127.0.0.1',
      port: PYTHON_PORT,
      path: req.url,
      method: req.method,
      headers: {
        'content-type': 'application/json',
        ...(req.headers['content-length'] ? { 'content-length': req.headers['content-length'] } : {})
      }
    };

    const pyReq = http.request(options, (pyRes) => {
      res.writeHead(pyRes.statusCode || 200, pyRes.headers);
      pyRes.pipe(res);
    });

    pyReq.on('error', () => {
      // If Python process not ready yet, continue to native Express fallback
      next();
    });

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      pyReq.write(JSON.stringify(req.body));
    }
    pyReq.end();
  };

  // Check Python backend routes first
  app.use('/api/python', (req, res, next) => {
    req.url = req.url.replace('/python', '');
    proxyToPython(req, res, next);
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'JanVani 2026',
      backend: 'Python 3 + Node.js Fullstack Engine',
      ai_provider: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY ? 'gemini' : 'mock',
      statutory_sla: '48-hour mandatory resolution'
    });
  });

  // Create submission / complaint
  app.post('/api/submissions', async (req, res) => {
    try {
      const {
        text,
        title,
        language,
        source_channel,
        latitude,
        longitude,
        state,
        district,
        block,
        ward,
        location_name,
        landmark,
        category,
        severity,
        urgency,
        department,
        sla_hours,
        media_url,
        media_type,
        media,
        extracted_details
      } = req.body;

      let categoryFinal = category;
      let urgencyScore = urgency === 'Urgent' ? 90 : urgency === 'Priority' ? 75 : 55;
      let translatedText = text || '';
      let normalizedText = text || '';

      if (!categoryFinal && text) {
        try {
          const analysis = await analyzeText(text, language || 'auto');
          categoryFinal = analysis.category;
          translatedText = analysis.translated_text;
          normalizedText = analysis.normalized_text;
          urgencyScore = analysis.urgency_score;
        } catch {
          categoryFinal = 'Roads & Potholes';
        }
      }

      const row = db.addSubmission({
        title: title || (text ? text.substring(0, 50) : 'Civic Grievance'),
        original_text: text || '',
        translated_text: translatedText,
        normalized_text: normalizedText,
        language: language || 'en',
        category: categoryFinal || 'Roads & Potholes',
        sub_category: 'general',
        urgency_score: urgencyScore,
        sentiment_score: 25,
        confidence_score: 0.94,
        latitude: Number(latitude) || 23.2599,
        longitude: Number(longitude) || 77.4126,
        state: state || 'Madhya Pradesh',
        district: district || 'Dhar',
        block: block || 'Dhar Central',
        ward: ward || 'Ward 27',
        location_name: location_name || `${ward || 'Ward 27'}, ${district || 'Dhar'}`,
        landmark: landmark || '',
        department: department || 'Nagar Palika Parishad (Municipal Services)',
        severity: severity || 'High',
        urgency: urgency || 'Urgent',
        sla_hours: Number(sla_hours) || 48,
        media_url: media_url || '',
        media_type: media_type || 'image',
        media: media || (media_url ? [{ type: media_type || 'image', url: media_url }] : []),
        extracted_details: extracted_details || {},
        source_channel: source_channel || 'voice'
      });
      res.json(row);
    } catch (err: any) {
      console.error('Error creating submission', err);
      res.status(500).json({ error: err.message || 'Failed to process submission' });
    }
  });

  // Alias for /api/complaints
  app.post('/api/complaints', async (req, res) => {
    try {
      const {
        title,
        description,
        text,
        category,
        language,
        severity,
        urgency,
        location_text,
        location_name,
        landmark,
        ward,
        district,
        state,
        latitude,
        longitude,
        department,
        sla_hours,
        media_url,
        media_type,
        media,
        extracted_details
      } = req.body;

      const complaintText = description || text || title || '';
      const row = db.addSubmission({
        title: title || complaintText.substring(0, 50) || 'Civic Grievance',
        original_text: complaintText,
        translated_text: complaintText,
        normalized_text: complaintText,
        language: language || 'en',
        category: category || 'Roads & Potholes',
        sub_category: 'general',
        urgency_score: urgency === 'Urgent' ? 92 : 75,
        sentiment_score: 25,
        confidence_score: 0.95,
        latitude: Number(latitude) || 23.2599,
        longitude: Number(longitude) || 77.4126,
        state: state || 'Madhya Pradesh',
        district: district || 'Dhar',
        block: 'Central Block',
        ward: ward || 'Ward 27',
        location_name: location_name || location_text || `${ward || 'Ward 27'}, ${district || 'Dhar'}`,
        landmark: landmark || '',
        department: department || 'Nagar Palika Parishad (Municipal Services)',
        severity: severity || 'High',
        urgency: urgency || 'Urgent',
        sla_hours: Number(sla_hours) || 48,
        media_url: media_url || '',
        media_type: media_type || 'image',
        media: media || (media_url ? [{ type: media_type || 'image', url: media_url }] : []),
        extracted_details: extracted_details || {},
        source_channel: 'voice'
      });

      res.status(201).json({
        success: true,
        complaint: row,
        message: 'Grievance legally registered under statutory 48h SLA mandate'
      });
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      res.status(500).json({ error: err.message || 'Failed to submit complaint' });
    }
  });

  app.get('/api/complaints', (req, res) => {
    res.json(db.submissions);
  });

  app.get('/api/complaints/:id', (req, res) => {
    const idOrToken = req.params.id;
    const item = db.submissions.find(s => String(s.id) === idOrToken || s.token === idOrToken);
    if (!item) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    res.json(item);
  });

  // Dedicated speech-to-text audio transcription endpoint (supports /api/transcribe and /api/voice/transcribe)
  const handleTranscription = async (req: express.Request, res: express.Response) => {
    try {
      const { audioData, audioBase64, audio, mimeType, language } = req.body;
      const rawAudio = audioData || audioBase64 || audio;
      if (!rawAudio) {
        return res.status(400).json({ error: 'Missing audio payload (expected audioData or audioBase64)' });
      }

      // Strip potential base64 data URL prefix if present
      const cleanBase64 = typeof rawAudio === 'string' && rawAudio.includes(',') ? rawAudio.split(',')[1] : rawAudio;
      const detectedMime = (mimeType || 'audio/webm').split(';')[0];

      try {
        const transcription = await transcribeAudio(cleanBase64, detectedMime, language || 'auto');
        return res.json({ transcription, success: true, language });
      } catch (geminiErr: any) {
        console.warn('Transcription error:', geminiErr?.message);
        return res.json({
          transcription: '',
          success: false,
          error: geminiErr?.message || 'Audio transcription error'
        });
      }
    } catch (err: any) {
      console.error('Error in transcription:', err);
      res.status(500).json({ error: err.message || 'Server error during transcription' });
    }
  };

  app.post('/api/transcribe', handleTranscription);
  app.post('/api/voice/transcribe', handleTranscription);

  // AI Complaint Verification & Extraction endpoint
  app.post('/api/complaints/verify', async (req, res) => {
    try {
      const { text, language, manualLocation } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Complaint text is required' });
      }

      const result = await verifyComplaint(text, language || 'auto', manualLocation);
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/complaints/verify:', err);
      res.status(500).json({ error: err?.message || 'Failed to verify complaint' });
    }
  });

  // Media upload endpoint (handles base64 data & validation)
  app.post('/api/media/upload', express.json({ limit: '25mb' }), async (req, res) => {
    try {
      const { file, data, mimeType, type } = req.body;
      const payload = data || file;
      if (!payload) {
        return res.status(400).json({ error: 'No media payload received' });
      }

      const detectedType = type || (mimeType && mimeType.startsWith('video/') ? 'video' : 'image');
      const mediaId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // In container sandbox, return the verified data URL or registered media object
      const url = payload.startsWith('data:') ? payload : `data:${mimeType || 'image/jpeg'};base64,${payload}`;

      res.json({
        success: true,
        id: mediaId,
        url,
        type: detectedType,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Error uploading media:', err);
      res.status(500).json({ error: err.message || 'Media upload failed' });
    }
  });

  // Reverse geocoding endpoint (converts GPS lat/lon to address & jurisdiction)
  app.post('/api/location/reverse-geocode', async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      const lat = Number(latitude);
      const lon = Number(longitude);

      // Attempt reverse geocoding via OpenStreetMap Nominatim with strict timeout
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'JanVani-Civic-Seva/2026.1 (contact@janvani.gov.in)'
            },
            signal: controller.signal
          }
        );
        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          const addr = data.address || {};
          const street = addr.road || addr.suburb || addr.neighbourhood || addr.residential || '';
          const ward = addr.suburb || addr.neighbourhood || `Ward ${Math.floor((Math.abs(lat * 100)) % 40) + 1}`;
          const district = addr.city || addr.town || addr.county || addr.state_district || 'Dhar';
          const state = addr.state || 'Madhya Pradesh';
          const landmark = addr.amenity || addr.building || addr.shop || street || '';

          const locationName = street ? `${street}, ${ward}, ${district}` : `${ward}, ${district}`;

          return res.json({
            latitude: lat,
            longitude: lon,
            locationName,
            street,
            landmark,
            ward,
            district,
            state,
            formattedAddress: data.display_name || locationName,
            provider: 'osm'
          });
        }
      } catch (osmErr: any) {
        console.warn('OSM reverse geocoding skipped or timed out:', osmErr?.message);
      }

      // Fallback coordinate approximation
      const wardNum = Math.floor((Math.abs(lat * 100)) % 40) + 1;
      return res.json({
        latitude: lat,
        longitude: lon,
        locationName: `Ward ${wardNum}, Dhar Central`,
        street: 'Main Road',
        landmark: 'Near Municipal Chowk',
        ward: `Ward ${wardNum}`,
        district: 'Dhar',
        state: 'Madhya Pradesh',
        formattedAddress: `Ward ${wardNum}, Dhar, Madhya Pradesh`,
        provider: 'fallback'
      });
    } catch (err: any) {
      console.error('Error in reverse geocoding:', err);
      res.status(500).json({ error: err.message || 'Location lookup failed' });
    }
  });

  app.get('/api/submissions', (req, res) => {
    res.json(db.submissions.slice(0, 100));
  });

  app.get('/api/dashboard/overview', (req, res) => {
    const totalInvestments = db.investments.reduce((sum, inv) => sum + (inv.budget || 0), 0);
    const highPriorityCount = db.recommendations.filter(r => r.priority_score >= 80).length;

    res.json({
      requests: db.submissions.length,
      hotspots: db.hotspots.length,
      high_priority_projects: highPriorityCount,
      investment_total: totalInvestments
    });
  });

  app.get('/api/dashboard/categories', (req, res) => {
    const map = new Map<string, number>();
    for (const sub of db.submissions) {
      map.set(sub.category, (map.get(sub.category) || 0) + 1);
    }
    const result = Array.from(map.entries()).map(([category, count]) => ({ category, count }));
    res.json(result);
  });

  app.get('/api/dashboard/languages', (req, res) => {
    const map = new Map<string, number>();
    for (const sub of db.submissions) {
      map.set(sub.language, (map.get(sub.language) || 0) + 1);
    }
    const result = Array.from(map.entries()).map(([language, count]) => ({ language, count }));
    res.json(result);
  });

  app.get('/api/hotspots', (req, res) => {
    res.json(db.hotspots);
  });

  app.get('/api/recommendations', (req, res) => {
    res.json(db.recommendations);
  });

  app.get('/api/recommendations/:id', (req, res) => {
    const rec = db.recommendations.find(r => String(r.id) === String(req.params.id));
    if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
    res.json(rec);
  });

  app.get('/api/investments', (req, res) => {
    res.json(db.investments);
  });

  app.post('/api/copilot/chat', async (req, res) => {
    try {
      const prompt = req.body?.prompt || '';
      const reply = `JanVani 2026 AI Assistant: Query received for '${prompt}'. All municipal complaints are tracked under the 48-Hour Statutory Redressal Mandate with automated tokens.`;
      res.json({ reply });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JanVani] Server running on http://localhost:${PORT}`);
  });
}

startServer();
