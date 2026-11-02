import React from 'react';
import { useApp } from '../context/AppContext';

interface LandingViewProps {
  onEnterApp: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp }) => {
  const { setShowLoginModal, setShowRegisterModal, isLoggedIn, playSound } = useApp();

  const handleStart = () => {
    playSound('click');
    if (!isLoggedIn) {
      setShowRegisterModal(true);
    } else {
      onEnterApp();
    }
  };

  const handleOpenLogin = () => {
    playSound('click');
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      onEnterApp();
    }
  };

  return (
    <div className="bg-[#121212] text-[#fafafa] h-screen max-h-screen overflow-hidden flex flex-col justify-between selection:bg-[#3ecf8e] selection:text-[#121212]">
      {/* Top Header */}
      <header className="w-full border-b border-[#2e2e2e]/60 bg-[#121212]/95 backdrop-blur shrink-0 z-50">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-brand font-extrabold tracking-tight text-[#fafafa] lowercase leading-none">
              snakeling
            </span>
          </div>

          <button
            onClick={handleStart}
            className="tactile-btn-primary font-brand font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl cursor-pointer"
          >
            MULAI
          </button>
        </div>
      </header>

      {/* Main Hero Section with Generous Whitespace */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 lg:px-10 py-4 sm:py-8 flex flex-col justify-between items-center relative z-10 min-h-0 overflow-hidden">
        {/* Upper Hero Copy Block */}
        <div className="max-w-2xl mx-auto text-center z-20 shrink-0 my-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-brand font-extrabold text-[#fafafa] leading-[1.12] tracking-tight mb-3 sm:mb-4 lowercase">
            belajar bahasa python<br />
            dengan <span className="text-[#3ecf8e]">snakeling</span>
          </h1>
          <p className="text-[#b4b4b4] text-sm sm:text-base md:text-lg max-w-lg mx-auto mb-6 sm:mb-8 font-normal leading-relaxed">
            Kuasai pemrograman Python lewat misi interaktif, latihan visual, dan pengalaman terminal yang seru.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleStart}
              className="tactile-btn-primary w-full sm:w-[220px] font-brand font-bold text-xs sm:text-sm tracking-wider uppercase py-3 px-6 rounded-xl cursor-pointer"
            >
              MULAI BELAJAR
            </button>
            <button
              onClick={handleOpenLogin}
              className="tactile-btn-secondary w-full sm:w-[220px] font-brand font-semibold text-xs sm:text-sm tracking-wider uppercase py-3 px-6 rounded-xl cursor-pointer"
            >
              SUDAH PUNYA AKUN?
            </button>
          </div>
        </div>

        {/* Lower Mascot & Terminal Composition with Airy Surrounding Space */}
        <div className="relative w-full max-w-[800px] h-[220px] sm:h-[260px] md:h-[290px] flex items-center justify-center z-10 shrink my-auto">
          {/* Ambient Soft Backdrop Glow */}
          <div className="absolute w-[360px] sm:w-[480px] h-[180px] sm:h-[240px] bg-[#3ecf8e]/12 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* Central Terminal IDE Card */}
          <div className="relative z-20 flex flex-col items-center">
            <div className="w-60 sm:w-68 md:w-76 h-[220px] sm:h-[250px] md:h-[270px] bg-[#1c1b1b] rounded-2xl border border-[#2e2e2e] shadow-[0_0_50px_-10px_rgba(62,207,142,0.18)] p-3.5 flex flex-col justify-between items-center relative overflow-hidden">
              {/* IDE Header Bar */}
              <div className="w-full flex items-center justify-between pb-2 border-b border-[#2e2e2e]/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#393939]" />
                  <span className="w-2 h-2 rounded-full bg-[#393939]" />
                  <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
                </div>
                <span className="font-mono text-[11px] text-[#898989] font-medium tracking-tight">
                  main.py
                </span>
                <span className="font-mono text-[10px] text-[#3ecf8e] px-1.5 py-0.5 rounded bg-[#3ecf8e]/10">
                  RUNNING
                </span>
              </div>

              {/* Floating Terminal Command Badge */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 z-30 mascot-float">
                <div className="px-3.5 py-1 rounded-full bg-[#242424] border border-[#3ecf8e]/40 shadow-lg shadow-black/40 flex items-center gap-1.5">
                  <span className="text-[#3ecf8e] text-[11px] font-mono font-bold">$</span>
                  <span className="font-mono text-[11px] text-[#fafafa] font-medium">
                    snakeling.run()
                  </span>
                </div>
              </div>

              {/* Mascot Inside Central Frame */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 mt-auto -mb-2 z-20 flex items-end justify-center transition-transform hover:scale-105 duration-300">
                <img
                  src="/logo_snakepreview.png"
                  alt="snakeling mascot"
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Terminal Sub-footer Bar */}
              <div className="w-full pt-1.5 flex items-center justify-between border-t border-[#2e2e2e]/60 text-[10px] sm:text-[11px] font-mono text-[#898989]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" />
                  UTF-8
                </span>
                <span className="text-[#b4b4b4]">Level 1 • Intro</span>
              </div>
            </div>

            <div className="w-56 sm:w-64 h-2 bg-black/50 rounded-full blur-md mt-1.5" />
          </div>

          {/* Clean, Uncluttered Side Accents (with plenty of whitespace around) */}
          {/* Left Code Snippet Accent */}
          <div className="absolute left-0 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 mascot-float hidden md:block">
            <div className="bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl p-3 shadow-xl backdrop-blur w-[160px]">
              <div className="flex items-center gap-1 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#898989]/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#898989]/50" />
                <span className="font-mono text-[9px] text-[#898989] ml-1">python</span>
              </div>
              <p className="font-mono text-xs text-[#3ecf8e] font-medium">def learn():</p>
              <p className="font-mono text-[11px] text-[#b4b4b4] pl-2.5">xp += 50</p>
              <p className="font-mono text-[11px] text-[#3ecf8e] pl-2.5">return True</p>
            </div>
          </div>

          {/* Right Streak Accent */}
          <div className="absolute right-0 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 mascot-float hidden md:block">
            <div className="bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl p-3 shadow-xl backdrop-blur flex items-center gap-2.5">
              <span className="text-lg">🔥</span>
              <div>
                <div className="font-mono text-[10px] text-[#898989] uppercase tracking-wider">Streak Active</div>
                <div className="font-mono text-xs font-bold text-[#fafafa]">7 Hari Berturut</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer with Air Space */}
      <footer className="relative w-full border-t border-[#2e2e2e]/60 bg-[#0e0e0e] shrink-0 z-10 py-3 sm:py-4">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
            <p className="text-[#898989] font-medium text-[11px] sm:text-xs tracking-wider font-mono">
              © 2025 snakeling • belajar coding python gratis &amp; seru
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] sm:text-xs text-[#898989]">
            <button onClick={handleStart} className="hover:text-[#3ecf8e] transition cursor-pointer">modul</button>
            <button onClick={handleStart} className="hover:text-[#3ecf8e] transition cursor-pointer">komunitas</button>
            <button onClick={handleStart} className="hover:text-[#3ecf8e] transition cursor-pointer">dokumentasi</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
