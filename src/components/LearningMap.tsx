import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LESSON_UNITS } from '../data/curriculum';
import { ListFilter, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const LearningMap: React.FC = () => {
  const { stats, setIsLessonActive, setSelectedLessonId, playSound } = useApp();
  const [showSyllabus, setShowSyllabus] = useState(false);

  const startNextLesson = () => {
    playSound('click');
    const lesson = LESSON_UNITS[0];
    setSelectedLessonId(lesson.id);
    setIsLessonActive(true);
  };

  const handleTileClick = (index: number) => {
    playSound('click');
    if (index === 0) {
      startNextLesson();
    } else {
      const lesson = LESSON_UNITS[Math.min(index, LESSON_UNITS.length - 1)];
      setSelectedLessonId(lesson.id);
      setIsLessonActive(true);
    }
  };

  return (
    <section className="flex-1 max-w-[580px] mx-auto w-full flex flex-col items-center select-none" aria-label="Peta Belajar Python">
      {/* Unit Header Sticky Banner */}
      <header
        className="w-full sticky top-3 z-30 mt-2 mb-3 rounded-2xl border-2 border-[#2e2e2e] shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(62,207,142,0.15)] p-4 sm:p-5 flex items-center justify-between backdrop-blur-md max-w-[480px] mx-auto"
        style={{ backgroundColor: 'rgb(31, 107, 72)' }}
      >
        <div className="space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-brand font-extrabold uppercase tracking-wider text-[#3ecf8e]">
              LEVEL 1, UNIT 1
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-brand font-black text-white tracking-tight">
            Menawarkan dan menerima minuman
          </h1>
        </div>
        <button
          onClick={() => setShowSyllabus(true)}
          className="p-2.5 rounded-xl bg-black/25 hover:bg-black/40 text-white transition-colors"
          title="Buku Panduan Unit"
        >
          <Sparkles className="w-5 h-5 text-[#3ecf8e]" />
        </button>
      </header>

      {/* Winding Stepping Nodes Isometric Canvas */}
      <div className="relative w-full max-w-[480px] mx-auto flex flex-col items-center select-none pt-2 pb-6">
        <div className="relative w-[340px] h-[680px] mx-auto flex items-center justify-center overflow-visible">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 340 680"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="slabTopGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3ecf8e" />
                <stop offset="100%" stopColor="#228258" />
              </linearGradient>
              <linearGradient id="slabTopBright" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#265c52" />
                <stop offset="100%" stopColor="#163b34" />
              </linearGradient>
              <linearGradient id="slabTopMuted" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1f4b43" />
                <stop offset="100%" stopColor="#112925" />
              </linearGradient>
              <linearGradient id="slabTopDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#183a34" />
                <stop offset="100%" stopColor="#0d1e1b" />
              </linearGradient>
              <linearGradient id="sideLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#142e2a" />
                <stop offset="100%" stopColor="#081412" />
              </linearGradient>
              <linearGradient id="sideRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f2421" />
                <stop offset="100%" stopColor="#050c0a" />
              </linearGradient>
              <linearGradient id="glowSideLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1f6e4a" />
                <stop offset="100%" stopColor="#0d3623" />
              </linearGradient>
              <linearGradient id="glowSideRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#175438" />
                <stop offset="100%" stopColor="#092618" />
              </linearGradient>
              <filter id="tileShadow" x="-30%" y="-20%" width="160%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
              </filter>
              <filter id="activeGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#3ecf8e" floodOpacity="0.5" />
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* Tile 11 (Top Peak) */}
            <g filter="url(#tileShadow)" opacity="0.45" className="cursor-pointer" onClick={() => handleTileClick(10)}>
              <path d="M122 34 L170 62 L170 78 L122 50 Z" fill="url(#sideLeft)" />
              <path d="M218 34 L170 62 L170 78 L218 50 Z" fill="url(#sideRight)" />
              <path d="M170 8 C174 8 178 10 216 32 C220 34 220 38 216 40 L174 64 C172 65 168 65 166 64 L124 40 C120 38 120 34 124 32 L164 10 C166 8 168 8 170 8 Z" fill="url(#slabTopDark)" stroke="#2a524a" strokeWidth="1.5" />
            </g>

            {/* Tile 10 */}
            <g filter="url(#tileShadow)" opacity="0.55" className="cursor-pointer" onClick={() => handleTileClick(9)}>
              <path d="M168 90 L216 118 L216 134 L168 106 Z" fill="url(#sideLeft)" />
              <path d="M264 90 L216 118 L216 134 L264 106 Z" fill="url(#sideRight)" />
              <path d="M216 64 C220 64 224 66 262 88 C266 90 266 94 262 96 L220 120 C218 121 214 121 212 120 L170 96 C166 94 166 90 170 88 L210 66 C212 64 214 64 216 64 Z" fill="url(#slabTopDark)" stroke="#2b594f" strokeWidth="1.5" />
            </g>

            {/* Tile 9 */}
            <g filter="url(#tileShadow)" opacity="0.65" className="cursor-pointer" onClick={() => handleTileClick(8)}>
              <path d="M122 146 L170 174 L170 190 L122 162 Z" fill="url(#sideLeft)" />
              <path d="M218 146 L170 174 L170 190 L218 162 Z" fill="url(#sideRight)" />
              <path d="M170 120 C174 120 178 122 216 144 C220 146 220 150 216 152 L174 176 C172 177 168 177 166 176 L124 152 C120 150 120 146 124 144 L164 122 C166 120 168 120 170 120 Z" fill="url(#slabTopMuted)" stroke="#2d5e53" strokeWidth="1.5" />
            </g>

            {/* Tile 8 */}
            <g filter="url(#tileShadow)" opacity="0.72" className="cursor-pointer" onClick={() => handleTileClick(7)}>
              <path d="M76 202 L124 230 L124 246 L76 218 Z" fill="url(#sideLeft)" />
              <path d="M172 202 L124 230 L124 246 L172 218 Z" fill="url(#sideRight)" />
              <path d="M124 176 C128 176 132 178 170 200 C174 202 174 206 170 208 L128 232 C126 233 122 233 120 232 L78 208 C74 206 74 202 78 200 L118 178 C120 176 122 176 124 176 Z" fill="url(#slabTopMuted)" stroke="#31665a" strokeWidth="1.5" />
            </g>

            {/* Tile 7 */}
            <g filter="url(#tileShadow)" opacity="0.78" className="cursor-pointer" onClick={() => handleTileClick(6)}>
              <path d="M122 258 L170 286 L170 302 L122 274 Z" fill="url(#sideLeft)" />
              <path d="M218 258 L170 286 L170 302 L218 274 Z" fill="url(#sideRight)" />
              <path d="M170 232 C174 232 178 234 216 256 C220 258 220 262 216 264 L174 288 C172 289 168 289 166 288 L124 264 C120 262 120 258 124 256 L164 234 C166 232 168 232 170 232 Z" fill="url(#slabTopMuted)" stroke="#336d60" strokeWidth="1.5" />
            </g>

            {/* Tile 6 */}
            <g filter="url(#tileShadow)" opacity="0.83" className="cursor-pointer" onClick={() => handleTileClick(5)}>
              <path d="M168 314 L216 342 L216 358 L168 330 Z" fill="url(#sideLeft)" />
              <path d="M264 314 L216 342 L216 358 L264 330 Z" fill="url(#sideRight)" />
              <path d="M216 288 C220 288 224 290 262 312 C266 314 266 318 262 320 L220 344 C218 345 214 345 212 344 L170 320 C166 318 166 314 170 312 L210 290 C212 288 214 288 216 288 Z" fill="url(#slabTopBright)" stroke="#367366" strokeWidth="1.5" />
            </g>

            {/* Tile 5 */}
            <g filter="url(#tileShadow)" opacity="0.88" className="cursor-pointer" onClick={() => handleTileClick(4)}>
              <path d="M122 370 L170 398 L170 414 L122 386 Z" fill="url(#sideLeft)" />
              <path d="M218 370 L170 398 L170 414 L218 386 Z" fill="url(#sideRight)" />
              <path d="M170 344 C174 344 178 346 216 368 C220 370 220 374 216 376 L174 400 C172 401 168 401 166 400 L124 376 C120 374 120 370 124 368 L164 346 C166 344 168 344 170 344 Z" fill="url(#slabTopBright)" stroke="#39796b" strokeWidth="1.5" />
            </g>

            {/* Tile 4 */}
            <g filter="url(#tileShadow)" opacity="0.92" className="cursor-pointer" onClick={() => handleTileClick(3)}>
              <path d="M76 426 L124 454 L124 470 L76 442 Z" fill="url(#sideLeft)" />
              <path d="M172 426 L124 454 L124 470 L172 442 Z" fill="url(#sideRight)" />
              <path d="M124 400 C128 400 132 402 170 424 C174 426 174 430 170 432 L128 456 C126 457 122 457 120 456 L78 432 C74 430 74 426 78 424 L118 402 C120 400 122 400 124 400 Z" fill="url(#slabTopBright)" stroke="#3d8272" strokeWidth="1.5" />
            </g>

            {/* Tile 3 */}
            <g filter="url(#tileShadow)" opacity="0.95" className="cursor-pointer" onClick={() => handleTileClick(2)}>
              <path d="M122 482 L170 510 L170 526 L122 498 Z" fill="url(#sideLeft)" />
              <path d="M218 482 L170 510 L170 526 L218 498 Z" fill="url(#sideRight)" />
              <path d="M170 456 C174 456 178 458 216 480 C220 482 220 486 216 488 L174 512 C172 513 168 513 166 512 L124 488 C120 486 120 482 124 480 L164 458 C166 456 168 456 170 456 Z" fill="url(#slabTopBright)" stroke="#408d7c" strokeWidth="1.5" />
            </g>

            {/* Tile 2 */}
            <g filter="url(#tileShadow)" className="cursor-pointer" onClick={() => handleTileClick(1)}>
              <path d="M168 538 L216 566 L216 584 L168 556 Z" fill="url(#sideLeft)" />
              <path d="M264 538 L216 566 L216 584 L264 556 Z" fill="url(#sideRight)" />
              <path d="M216 512 C220 512 224 514 262 536 C266 538 266 542 262 544 L220 568 C218 569 214 569 212 568 L170 544 C166 542 166 538 170 536 L210 514 C212 512 214 512 216 512 Z" fill="url(#slabTopBright)" stroke="#469c89" strokeWidth="1.5" />
            </g>

            {/* Tile 1: ACTIVE GLOWING STEP */}
            <g
              filter="url(#activeGlow)"
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleTileClick(0)}
            >
              <path d="M122 594 L170 624 L170 644 L122 614 Z" fill="url(#glowSideLeft)" />
              <path d="M218 594 L170 624 L170 644 L218 614 Z" fill="url(#glowSideRight)" />
              <path
                d="M170 566 C174 566 178 568 218 592 C222 594 222 598 218 600 L174 626 C172 627 168 627 166 626 L122 600 C118 598 118 594 122 592 L164 568 C166 566 168 566 170 566 Z"
                fill="url(#slabTopGlow)"
                stroke="#ffffff"
                strokeOpacity="0.75"
                strokeWidth="1.5"
              />
              <ellipse cx="170" cy="596" rx="18" ry="9" fill="white" fillOpacity="0.4" filter="blur(2px)" />
            </g>
          </svg>

          {/* Bouncing NEXT Indicator Tooltip */}
          <div className="absolute top-[528px] left-[142px] z-30 flex flex-col items-center pointer-events-none animate-bounce">
            <div className="bg-white text-[#0e0e0e] px-3.5 py-1 rounded-xl font-brand font-black text-[11px] tracking-wider uppercase shadow-[0_4px_14px_rgba(62,207,142,0.6)]">
              <span className="font-extrabold">Next</span>
            </div>
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white mx-auto -mt-[1px]" />
          </div>
        </div>

        {/* Bottom Control Bar (Learn To Code + Action Buttons) */}
        <div className="w-full bg-[#171717] border-2 border-[#2e2e2e] rounded-2xl p-4 shadow-xl flex flex-col gap-3 mt-12 mb-4 z-30">
          <div className="flex items-center justify-between px-1">
            <span className="font-brand font-extrabold text-sm uppercase tracking-wider text-white">
              Learn To Code
            </span>
            <span className="text-xs text-[#3ecf8e] font-brand font-bold">
              {stats.completedLessons.length} / 11 Modul
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setShowSyllabus(true);
              }}
              className="w-12 h-12 shrink-0 rounded-xl bg-[#242424] hover:bg-[#2e2e2e] active:translate-y-0.5 border border-[#393939] shadow-[0_3px_0_#121212] flex items-center justify-center text-white transition-all cursor-pointer"
              title="Daftar Pelajaran"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={startNextLesson}
              className="flex-1 h-12 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] active:translate-y-1 font-brand font-black text-sm tracking-wide text-[#0e0e0e] shadow-[0_4px_0_#1b6343] flex items-center justify-center gap-2 transition-all uppercase cursor-pointer"
            >
              <span>Next Lesson</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Syllabus Modal */}
      {showSyllabus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#171717] border border-[#2e2e2e] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
              <div>
                <span className="text-[10px] font-brand font-extrabold uppercase text-[#3ecf8e] tracking-wider">
                  Silabus Pembelajaran
                </span>
                <h3 className="text-lg font-brand font-bold text-white">Unit 1: Menawarkan Minuman</h3>
              </div>
              <button
                onClick={() => setShowSyllabus(false)}
                className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#2e2e2e] flex items-center justify-center text-[#b4b4b4] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {LESSON_UNITS.map((item, idx) => {
                const isCompleted = stats.completedLessons.includes(item.id);
                const isCurrent = idx === 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowSyllabus(false);
                      handleTileClick(idx);
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-[#1f4b37]/30 border-[#3ecf8e] text-white'
                        : isCompleted
                        ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#fafafa]'
                        : 'bg-[#141414] border-[#242424] text-[#898989]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#242424] text-xs font-bold">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#3ecf8e]" />
                        ) : isCurrent ? (
                          <span className="text-[#3ecf8e] font-extrabold">{idx + 1}</span>
                        ) : (
                          <Lock className="w-4 h-4 text-[#898989]" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <p className="text-xs text-[#b4b4b4]">{item.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3ecf8e]">+{item.xpReward} XP</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowSyllabus(false);
                startNextLesson();
              }}
              className="tactile-btn-primary w-full py-3 rounded-xl font-bold text-sm tracking-wide uppercase mt-2"
            >
              Mulai Pelajaran Sekarang
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
