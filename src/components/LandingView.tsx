import React from 'react';
import { useApp } from '../context/AppContext';
import { SnakelingMascot } from './SnakelingMascot';

interface LandingViewProps {
  onEnterApp: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp }) => {
  const { setShowLoginModal, setShowRegisterModal, playSound } = useApp();

  const handleStart = () => {
    playSound('click');
    onEnterApp();
  };

  const handleOpenLogin = () => {
    playSound('click');
    setShowLoginModal(true);
  };

  return (
    <div className="bg-[#121212] text-[#fafafa] min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#3ecf8e] selection:text-[#121212]">
      {/* Top Header */}
      <header className="w-full border-b border-[#2e2e2e] bg-[#121212]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
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

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col justify-between items-center relative pt-10 md:pt-14 px-4 overflow-visible">
        {/* Center Headline & CTA Button Group */}
        <div className="max-w-3xl mx-auto text-center z-20 mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-[54px] font-brand font-extrabold text-[#fafafa] leading-[1.15] tracking-tight mb-5 lowercase">
            belajar bahasa python<br />
            dengan <span className="text-[#3ecf8e]">snakeling</span>
          </h1>
          <p className="text-[#b4b4b4] text-base sm:text-lg max-w-xl mx-auto mb-8 font-normal">
            Kuasai pemrograman Python lewat misi interaktif, latihan visual, dan pengalaman terminal yang seru.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="tactile-btn-primary w-full sm:w-[260px] font-brand font-bold text-sm tracking-wider uppercase py-3.5 px-6 rounded-xl cursor-pointer"
            >
              MULAI BELAJAR
            </button>
            <button
              onClick={handleOpenLogin}
              className="tactile-btn-secondary w-full sm:w-[260px] font-brand font-semibold text-sm tracking-wider uppercase py-3.5 px-6 rounded-xl cursor-pointer"
            >
              SUDAH PUNYA AKUN?
            </button>
          </div>
        </div>

        {/* Center Stage Gamification Composition */}
        <div className="relative w-full max-w-[980px] h-[360px] sm:h-[400px] flex items-center justify-center z-10">
          {/* Ambient Backdrop Glow */}
          <div className="absolute w-[450px] h-[280px] bg-[#3ecf8e]/10 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* Central Tech Card with Mascot */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Terminal IDE Card Container */}
            <div className="w-64 sm:w-72 md:w-80 h-[310px] sm:h-[340px] bg-[#1c1b1b] rounded-2xl border border-[#2e2e2e] shadow-[0_0_50px_-10px_rgba(62,207,142,0.18)] p-4 flex flex-col justify-between items-center relative overflow-hidden">
              {/* IDE Header Bar */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#2e2e2e]/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#393939]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#393939]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]" />
                </div>
                <span className="font-mono text-[11px] text-[#898989] font-medium tracking-tight">
                  main.py
                </span>
                <span className="font-mono text-[10px] text-[#3ecf8e] px-1.5 py-0.5 rounded bg-[#3ecf8e]/10">
                  RUNNING
                </span>
              </div>

              {/* Floating Terminal Badge */}
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 mascot-float">
                <div className="px-3.5 py-1.5 rounded-full bg-[#242424] border border-[#3ecf8e]/40 shadow-lg shadow-black/40 flex items-center gap-2">
                  <span className="text-[#3ecf8e] text-xs font-mono font-bold">$</span>
                  <span className="font-mono text-xs text-[#fafafa] font-medium">
                    snakeling.run()
                  </span>
                </div>
              </div>

              {/* Mascot Inside Central Frame */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 mt-auto -mb-2 z-20 flex items-end justify-center transition-transform hover:scale-105 duration-300">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC15wsEFDzNp7w8940oMVmwVgJ_Xj7O3GFtiBYlUXRe7hrII_7lAGdeS08Nd9kuYGBnMRMj74zAhZTY5cKr6oOsTPPTb-Hy7-OM9BodvXRCIwjfa_kmoQA3z1E4Alsby3c2xTrutHMYkGwmrIHUduiCffcriWrbbcJbCX6TGHQvlBqLOPcVkSqidzyt5Ao-9dHm9-l98a3eDDpL1a3Yvz2KbzqESSFztCUzIWWLXQnZEv15Vedg1_I1J6oNy8f5D8Y8GQ"
                  alt="snakeling mascot"
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to SVG mascot if external asset fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Terminal Sub-footer Bar */}
              <div className="w-full pt-2 flex items-center justify-between border-t border-[#2e2e2e]/60 text-[11px] font-mono text-[#898989]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" />
                  UTF-8
                </span>
                <span className="text-[#b4b4b4]">Level 1 • Intro</span>
              </div>
            </div>

            <div className="w-64 h-3 bg-black/50 rounded-full blur-md mt-2" />
          </div>

          {/* LEFT SIDE TECH/GAMIFICATION ELEMENTS */}
          {/* 1. Code Snippet Block */}
          <div className="absolute left-2 sm:left-8 md:left-12 bottom-12 sm:bottom-16 z-20 mascot-float">
            <div className="bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl p-3 shadow-xl backdrop-blur max-w-[170px] sm:max-w-[190px]">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#898989]/50" />
                <span className="w-2 h-2 rounded-full bg-[#898989]/50" />
                <span className="font-mono text-[10px] text-[#898989] ml-1">snippet</span>
              </div>
              <p className="font-mono text-xs text-[#3ecf8e] font-medium">def learn():</p>
              <p className="font-mono text-[11px] text-[#b4b4b4] pl-3">xp += 50</p>
              <p className="font-mono text-[11px] text-[#3ecf8e] pl-3">return True</p>
            </div>
          </div>

          {/* 2. Phosphor Gem Floating */}
          <div className="absolute left-16 sm:left-24 bottom-3 sm:bottom-6 z-10 active-ping">
            <div className="w-8 h-8 bg-[#242424] border border-[#3ecf8e]/60 rounded-lg rotate-45 shadow-lg flex items-center justify-center text-[#3ecf8e]">
              <div className="w-2.5 h-2.5 bg-[#3ecf8e] rounded-xs -rotate-45" />
            </div>
          </div>

          {/* 3. Python Token Badges cascade on Left */}
          <div className="absolute left-24 sm:left-36 top-12 sm:top-16 z-20 mascot-float">
            <div className="px-3 py-1 rounded-full bg-[#1c1b1b] border border-[#393939] shadow-md flex items-center gap-1.5 -rotate-6">
              <span className="font-mono text-xs font-bold text-[#3ecf8e]">{'{ py }'}</span>
            </div>
          </div>
          <div className="absolute left-32 sm:left-48 top-28 sm:top-32 z-10">
            <div className="px-2.5 py-1 rounded-full bg-[#242424] border border-[#2e2e2e] shadow-sm flex items-center gap-1.5 -rotate-3">
              <span className="font-mono text-[11px] text-[#b4b4b4]">str("snake")</span>
            </div>
          </div>

          {/* 4. Health / Lightning Badge */}
          <div className="absolute left-[34%] sm:left-[37%] top-6 sm:top-8 z-30">
            <div className="w-10 h-10 bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl -rotate-6 shadow-lg flex items-center justify-center text-[#3ecf8e]">
              <span className="text-base font-bold">⚡</span>
            </div>
          </div>

          {/* RIGHT SIDE TECH/GAMIFICATION ELEMENTS */}
          {/* 5. Streak Flame Tag */}
          <div className="absolute right-[33%] sm:right-[35%] top-8 sm:top-10 z-20">
            <div className="px-3 py-1.5 bg-[#1c1b1b] border border-[#3ecf8e]/50 rounded-full shadow-lg flex items-center gap-1.5 rotate-6">
              <span className="text-[#3ecf8e] text-xs">🔥</span>
              <span className="font-mono text-xs font-bold text-[#fafafa]">7 Hari</span>
            </div>
          </div>

          {/* 6. Syntax Token Cascade on Right */}
          <div className="absolute right-24 sm:right-40 top-32 sm:top-36 z-20 mascot-float">
            <div className="px-3 py-1 bg-[#242424] border border-[#2e2e2e] rounded-full shadow-md flex items-center gap-1.5 rotate-12">
              <span className="font-mono text-xs text-[#3ecf8e]">print()</span>
            </div>
          </div>

          {/* 7. Checkpoint / Node Indicator */}
          <div className="absolute right-6 sm:right-16 md:right-24 bottom-12 sm:bottom-16 z-20 mascot-float">
            <div className="bg-[#1c1b1b] border border-[#2e2e2e] rounded-2xl p-3 shadow-xl backdrop-blur flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e] flex items-center justify-center text-[#3ecf8e]">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#898989]">
                  Syntax OK
                </div>
                <div className="text-xs font-semibold text-[#fafafa]">
                  Unit 1 Passed
                </div>
              </div>
            </div>
          </div>

          {/* 8. Metric Tag */}
          <div className="absolute right-10 sm:right-20 md:right-28 top-10 sm:top-12 z-10">
            <div className="px-3 py-1.5 bg-[#1c1b1b] border border-[#393939] rounded-xl shadow-md rotate-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
              <span className="font-mono text-xs text-[#fafafa] font-medium">+150 XP</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full border-t border-[#2e2e2e] bg-[#0e0e0e] z-10 mt-auto py-6">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
            <p className="text-[#898989] font-medium text-xs tracking-wider font-mono">
              © 2025 snakeling • belajar coding python gratis &amp; seru
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-[#898989]">
            <button onClick={handleStart} className="hover:text-[#3ecf8e] transition">modul</button>
            <button onClick={handleStart} className="hover:text-[#3ecf8e] transition">komunitas</button>
            <button onClick={handleStart} className="hover:text-[#3ecf8e] transition">dokumentasi</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
