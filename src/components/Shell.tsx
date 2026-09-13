import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { JanVaniLogo } from './JanVaniLogo';
import { FileGrievanceModal } from './FileGrievanceModal';
import { VoiceSevaModal } from './VoiceSevaModal';
import { AICopilotDrawer } from './AICopilotDrawer';
import { LoginModal } from './LoginModal';
import { EmergencyModal } from './EmergencyModal';
import { CertificateModal } from './CertificateModal';
import { FloatingCopilotWidget } from './FloatingCopilotWidget';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileTopServicesBar } from './MobileTopServicesBar';
import { Menu, X } from 'lucide-react';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50/80 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5">
        <JanVaniLogo size="sm" variant="compact" />

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Main Screen Default Services Bar */}
      <MobileTopServicesBar />

      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-slate-900 z-10 shadow-2xl overflow-y-auto border-r border-slate-200 dark:border-slate-800">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-slate-200 dark:border-slate-800">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Instagram-Style) */}
      <MobileBottomNav />

      {/* Global Modals & Floating Tools */}
      <FileGrievanceModal />
      <VoiceSevaModal />
      <AICopilotDrawer />
      <LoginModal />
      <EmergencyModal />
      <CertificateModal />
      <FloatingCopilotWidget />
    </div>
  );
}
