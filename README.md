# JanVaani

Premium civic development intelligence demo: multilingual citizen reporting, transparent demand hotspots, investment context, and explainable development priorities.

## 1. Backend (Windows PowerShell)
```powershell
cd backend
python -m pip install -r requirements.txt
python -m seed.generate
python -m uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000  |  Docs: http://127.0.0.1:8000/docs

## 2. Frontend (new PowerShell window)
```powershell
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (normally http://localhost:5173).

## Important
- Default AI provider is `mock`, so the complete demo works without external AI credentials.
- `AI_PROVIDER=adk` enables the optional Google ADK provider when configured.
- Demo data is synthetic and is labeled as such.
