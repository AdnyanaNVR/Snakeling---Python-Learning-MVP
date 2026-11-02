import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { RightWidgets } from './components/RightWidgets';
import { LearningMap } from './components/LearningMap';
import { LeaderboardView } from './components/LeaderboardView';
import { ShopView } from './components/ShopView';
import { ProfileView } from './components/ProfileView';
import { InteractiveLessonModal } from './components/InteractiveLessonModal';
import { LoginModal, RegisterModal } from './components/AuthModals';
import { ProModal, SettingsModal } from './components/SettingsAndProModals';
import { LandingView } from './components/LandingView';
import { Check, AlertCircle } from 'lucide-react';

const MainShell: React.FC = () => {
  const { activeTab, toast, isLessonActive, isLoggedIn } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {!isLoggedIn ? (
        <>
          <LandingView onEnterApp={() => {}} />
          <LoginModal />
          <RegisterModal />
          <ProModal />
        </>
      ) : (
        <div className="bg-[#121212] text-[#fafafa] font-sans antialiased min-h-screen flex selection:bg-[#3ecf8e] selection:text-[#0e0e0e] relative">
          {/* LEFT NAVIGATION SIDEBAR */}
          <Sidebar onOpenSettings={() => setShowSettings(true)} />

          {/* CENTER & RIGHT CONTENT CONTAINER (DESKTOP FIXED SHELL, MOBILE SCROLLABLE) */}
          <main className="flex-1 flex justify-center h-screen overflow-hidden pb-16 lg:pb-0">
            <div className="max-w-[1200px] w-full h-full flex flex-col lg:flex-row justify-between px-4 sm:px-6 py-4 gap-8">
              {/* CENTER VIEW */}
              {activeTab === 'belajar' && <LearningMap />}
              {activeTab === 'papan_skor' && <div className="flex-1 h-full overflow-y-auto pr-1"><LeaderboardView /></div>}
              {activeTab === 'toko' && <div className="flex-1 h-full overflow-y-auto pr-1"><ShopView /></div>}
              {activeTab === 'profil' && <div className="flex-1 h-full overflow-y-auto pr-1"><ProfileView onOpenSettings={() => setShowSettings(true)} /></div>}

              {/* RIGHT STATS & PROMOTIONS SIDEBAR (STAYS IN PLACE) */}
              <RightWidgets />
            </div>
          </main>

          {/* INTERACTIVE LESSON MODAL */}
          {isLessonActive && <InteractiveLessonModal />}

          {/* AUTH & DIALOG MODALS */}
          <LoginModal />
          <RegisterModal />
          <ProModal />
          <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION - ALWAYS VISIBLE */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'error'
                ? 'bg-[#2b1416] border-[#ef4444]/40 text-[#ffb4ab]'
                : toast.type === 'info'
                ? 'bg-[#152538] border-[#38bdf8]/40 text-[#e0f2fe]'
                : 'bg-[#18261e] border-[#3ecf8e]/40 text-[#fafafa]'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                toast.type === 'error'
                  ? 'bg-[#ef4444]/20 text-[#ef4444]'
                  : toast.type === 'info'
                  ? 'bg-[#38bdf8]/20 text-[#38bdf8]'
                  : 'bg-[#3ecf8e]/20 text-[#3ecf8e]'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
            </span>
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
