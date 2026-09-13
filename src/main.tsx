import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import { AppProvider } from './context/AppContext';
import Shell from './components/Shell';
import Dashboard from './pages/Dashboard';
import GrievanceFeedPage from './pages/GrievanceFeedPage';
import CivicReelsPage from './pages/CivicReelsPage';
import GISMapPage from './pages/GISMapPage';
import WelfareSchemesPage from './pages/WelfareSchemesPage';
import TransparencyPage from './pages/TransparencyPage';
import ProfilePage from './pages/ProfilePage';
import AudioTranscribePage from './pages/AudioTranscribePage';

function AppRoutes() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transcribe" element={<AudioTranscribePage />} />
        <Route path="/feed" element={<GrievanceFeedPage />} />
        <Route path="/reels" element={<CivicReelsPage />} />
        <Route path="/map" element={<GISMapPage />} />
        <Route path="/dashboard/map" element={<GISMapPage />} />
        <Route path="/schemes" element={<WelfareSchemesPage />} />
        <Route path="/transparency" element={<TransparencyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/report" element={<GrievanceFeedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
}
