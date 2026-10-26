import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { LESSON_UNITS } from '../data/curriculum';
import { Lock, ChevronDown, CheckCircle2 } from 'lucide-react';

interface TileData {
  id: number;
  unit: number;
  stepNumber: number;
  title: string;
  cx: number;
  cy: number;
  status: 'active' | 'completed' | 'locked';
}

export const LearningMap: React.FC = () => {
  const { stats, setIsLessonActive, setSelectedLessonId, playSound, showToast } = useApp();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const roadmapScrollRef = useRef<HTMLDivElement>(null);

  // Generate multi-unit winding staircase steps
  const tiles: TileData[] = [
    // UNIT 1: Menawarkan dan menerima minuman (Steps 1 to 11)
    { id: 1, unit: 1, stepNumber: 1, title: 'Perintah print() & Salam Pertama', cx: 170, cy: 1720, status: 'active' },
    { id: 2, unit: 1, stepNumber: 2, title: 'Variabel & Tipe String', cx: 216, cy: 1664, status: 'locked' },
    { id: 3, unit: 1, stepNumber: 3, title: 'Penggabungan String', cx: 170, cy: 1608, status: 'locked' },
    { id: 4, unit: 1, stepNumber: 4, title: 'Aritmatika Dasar Minuman', cx: 124, cy: 1552, status: 'locked' },
    { id: 5, unit: 1, stepNumber: 5, title: 'Input Pengguna', cx: 170, cy: 1496, status: 'locked' },
    { id: 6, unit: 1, stepNumber: 6, title: 'Latihan Praktik Terminal', cx: 216, cy: 1440, status: 'locked' },
    { id: 7, unit: 1, stepNumber: 7, title: 'Format Teks f-string', cx: 170, cy: 1384, status: 'locked' },
    { id: 8, unit: 1, stepNumber: 8, title: 'Logika Boolean', cx: 124, cy: 1328, status: 'locked' },
    { id: 9, unit: 1, stepNumber: 9, title: 'Review Cepat Sintaks', cx: 170, cy: 1272, status: 'locked' },
    { id: 10, unit: 1, stepNumber: 10, title: 'Tantangan Mini Game', cx: 216, cy: 1216, status: 'locked' },
    { id: 11, unit: 1, stepNumber: 11, title: 'Ujian Sertifikasi Unit 1', cx: 170, cy: 1160, status: 'locked' },

    // UNIT 2: Logika Kondisi & Percabangan (Steps 12 to 18)
    { id: 12, unit: 2, stepNumber: 12, title: 'Kondisi if & Logika Dasar', cx: 124, cy: 980, status: 'locked' },
    { id: 13, unit: 2, stepNumber: 13, title: 'Percabangan else & Alternatif', cx: 170, cy: 924, status: 'locked' },
    { id: 14, unit: 2, stepNumber: 14, title: 'Kondisi Majemuk elif', cx: 216, cy: 868, status: 'locked' },
    { id: 15, unit: 2, stepNumber: 15, title: 'Operator Logika and & or', cx: 170, cy: 812, status: 'locked' },
    { id: 16, unit: 2, stepNumber: 16, title: 'Nested if (Kondisi Bersarang)', cx: 124, cy: 756, status: 'locked' },
    { id: 17, unit: 2, stepNumber: 17, title: 'Studi Kasus Menu Restoran', cx: 170, cy: 700, status: 'locked' },
    { id: 18, unit: 2, stepNumber: 18, title: 'Evaluasi Akhir Unit 2', cx: 216, cy: 644, status: 'locked' },

    // UNIT 3: Struktur Data List & Koleksi (Steps 19 to 25)
    { id: 19, unit: 3, stepNumber: 19, title: 'Mengenal List Python []', cx: 170, cy: 460, status: 'locked' },
    { id: 20, unit: 3, stepNumber: 20, title: 'Indeks & Mengakses Elemen', cx: 124, cy: 404, status: 'locked' },
    { id: 21, unit: 3, stepNumber: 21, title: 'Menambah Data: append()', cx: 170, cy: 348, status: 'locked' },
    { id: 22, unit: 3, stepNumber: 22, title: 'Menghapus Data: remove()', cx: 216, cy: 292, status: 'locked' },
    { id: 23, unit: 3, stepNumber: 23, title: 'Panjang List dengan len()', cx: 170, cy: 236, status: 'locked' },
    { id: 24, unit: 3, stepNumber: 24, title: 'Slicing & Potong List', cx: 124, cy: 180, status: 'locked' },
    { id: 25, unit: 3, stepNumber: 25, title: 'Master Sertifikasi List', cx: 170, cy: 124, status: 'locked' }
  ];

  // Auto-scroll the roadmap container down to Step 1 on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (roadmapScrollRef.current) {
        roadmapScrollRef.current.scrollTop = roadmapScrollRef.current.scrollHeight;
      }
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  // Track roadmap scroll position to show quick "Jump to Active Step" button
  const handleRoadmapScroll = () => {
    if (!roadmapScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = roadmapScrollRef.current;
    // Scrolled up more than 150px from bottom
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsScrolledUp(distanceFromBottom > 150);
  };

  const scrollToActiveStep = () => {
    playSound('click');
    if (roadmapScrollRef.current) {
      roadmapScrollRef.current.scrollTo({
        top: roadmapScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const startNextLesson = () => {
    playSound('click');
    const lesson = LESSON_UNITS[0];
    setSelectedLessonId(lesson.id);
    setIsLessonActive(true);
  };

  const handleTileClick = (tile: TileData) => {
    playSound('click');
    if (tile.id === 1) {
      startNextLesson();
    } else {
      showToast(`Unit ${tile.unit} • Langkah ${tile.stepNumber}: ${tile.title}. Selesaikan langkah sebelumnya terlebih dahulu!`, 'info');
    }
  };

  return (
    <section
      className="flex-1 w-full lg:max-w-[640px] xl:max-w-[680px] mx-auto relative h-[calc(100vh-2rem)] select-none overflow-hidden"
      aria-label="Peta Belajar Python"
    >
      {/* LEARN TO CODE: SELALU DITENGAH SECARA RELATIF TERHADAP SECTION ROADMAP TENGAH */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-[440px] bg-[#171717] border-2 border-[#2e2e2e] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between px-1">
          <span className="font-brand font-extrabold text-sm uppercase tracking-wider text-white">
            LEARN TO CODE
          </span>
          <span className="text-[11px] font-mono text-[#3ecf8e]">
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
            title="Daftar Pelajaran / Silabus"
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
            <span>NEXT LESSON</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Button "Ke Langkah Aktif" when user scrolls roadmap up */}
      {isScrolledUp && (
        <button
          onClick={scrollToActiveStep}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 px-3.5 py-2 rounded-full bg-[#1c1b1b]/95 hover:bg-[#242424] border border-[#3ecf8e] text-xs font-brand font-bold text-[#3ecf8e] shadow-2xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
        >
          <ChevronDown className="w-4 h-4" />
          <span>Ke Langkah Aktif</span>
        </button>
      )}

      {/* SCROLLABLE ROADMAP CONTAINER (HANYA INI YANG BERGERAK SAAT SCROLL) */}
      <div
        ref={roadmapScrollRef}
        onScroll={handleRoadmapScroll}
        className="w-full h-full overflow-y-auto overflow-x-hidden pt-6 pb-36 scroll-smooth select-none flex flex-col items-center"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2e2e2e transparent' }}
      >
        {/* ISOMETRIC ROADMAP SVG (SCROLLS SMOOTHLY IN CENTER) */}
        <div className="relative w-full flex items-center justify-center py-2 select-none">
          <div className="relative w-[340px] h-[1840px] flex items-center justify-center overflow-visible">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 340 1840"
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
                <linearGradient id="slabTopLocked" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#111111" />
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

              {/* 1. RENDER BACKGROUND TILES IN ISOMETRIC ORDER (TOP TO BOTTOM) */}
              {tiles
                .filter((tile) => tile.status !== 'active')
                .sort((a, b) => a.cy - b.cy)
                .map((tile) => {
                  const { id, cx, cy } = tile;
                  const isUnit1 = tile.unit === 1;
                  const fillPattern = isUnit1
                    ? tile.id > 6
                      ? 'url(#slabTopBright)'
                      : 'url(#slabTopMuted)'
                    : 'url(#slabTopLocked)';
                  const strokeColor = isUnit1 ? '#336d60' : '#2a2a2a';
                  const opacity = isUnit1 ? 0.85 : 0.55;

                  return (
                    <g
                      key={id}
                      className="roadmap-tile-group"
                      onClick={() => handleTileClick(tile)}
                    >
                      {/* Static Hit Target */}
                      <rect
                        x={cx - 56}
                        y={cy - 10}
                        width={112}
                        height={100}
                        fill="transparent"
                        style={{ pointerEvents: 'all' }}
                      />
                      {/* Visual Slab: Moves down smoothly on hover without dribble */}
                      <g className="roadmap-tile-slab" filter="url(#tileShadow)" opacity={opacity}>
                        <path d={`M${cx - 48} ${cy + 26} L${cx} ${cy + 54} L${cx} ${cy + 70} L${cx - 48} ${cy + 42} Z`} fill="url(#sideLeft)" />
                        <path d={`M${cx + 48} ${cy + 26} L${cx} ${cy + 54} L${cx} ${cy + 70} L${cx + 48} ${cy + 42} Z`} fill="url(#sideRight)" />
                        <path
                          d={`M${cx} ${cy} C${cx + 4} ${cy} ${cx + 8} ${cy + 2} ${cx + 46} ${cy + 24} C${cx + 50} ${cy + 26} ${cx + 50} ${cy + 30} ${cx + 46} ${cy + 32} L${cx + 4} ${cy + 56} C${cx + 2} ${cy + 57} ${cx - 2} ${cy + 57} ${cx - 4} ${cy + 56} L${cx - 46} ${cy + 32} C${cx - 50} ${cy + 30} ${cx - 50} ${cy + 26} ${cx - 46} ${cy + 24} L${cx - 6} ${cy + 2} C${cx - 4} ${cy} ${cx - 2} ${cy} ${cx} ${cy} Z`}
                          fill={fillPattern}
                          stroke={strokeColor}
                          strokeWidth="1.5"
                        />
                        {!isUnit1 && (
                          <circle cx={cx} cy={cy + 28} r="6" fill="#0e0e0e" fillOpacity="0.6" />
                        )}
                      </g>
                    </g>
                  );
                })}

              {/* 2. RENDER ACTIVE TILE + NEXT INDICATOR ON TOP LAYER (PALING ATAS AGAR TIDAK OVERLAP) */}
              {(() => {
                const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
                const { id, cx, cy } = activeTile;
                return (
                  <g
                    key={id}
                    className="roadmap-tile-group"
                    onClick={() => handleTileClick(activeTile)}
                  >
                    {/* Static Hit Target: Covers badge & slab, stays stationary so hover is never lost */}
                    <rect
                      x={cx - 56}
                      y={cy - 52}
                      width={112}
                      height={144}
                      fill="transparent"
                      style={{ pointerEvents: 'all' }}
                    />
                    {/* Visual Slab: Moves down smoothly on hover without dribble */}
                    <g className="roadmap-tile-slab" filter="url(#activeGlow)">
                      {/* Active glowing slab geometry */}
                      <path d={`M${cx - 48} ${cy + 28} L${cx} ${cy + 58} L${cx} ${cy + 78} L${cx - 48} ${cy + 48} Z`} fill="url(#glowSideLeft)" />
                      <path d={`M${cx + 48} ${cy + 28} L${cx} ${cy + 58} L${cx} ${cy + 78} L${cx + 48} ${cy + 48} Z`} fill="url(#glowSideRight)" />
                      <path
                        d={`M${cx} ${cy} C${cx + 4} ${cy} ${cx + 8} ${cy + 2} ${cx + 48} ${cy + 26} C${cx + 52} ${cy + 28} ${cx + 52} ${cy + 32} ${cx + 48} ${cy + 34} L${cx + 4} ${cy + 60} C${cx + 2} ${cy + 61} ${cx - 2} ${cy + 61} ${cx - 4} ${cy + 60} L${cx - 48} ${cy + 34} C${cx - 52} ${cy + 32} ${cx - 52} ${cy + 28} ${cx - 48} ${cy + 26} L${cx - 6} ${cy + 2} C${cx - 4} ${cy} ${cx - 2} ${cy} ${cx} ${cy} Z`}
                        fill="url(#slabTopGlow)"
                        stroke="#ffffff"
                        strokeOpacity="0.85"
                        strokeWidth="1.5"
                      />
                      <ellipse cx={cx} cy={cy + 30} rx="18" ry="9" fill="white" fillOpacity="0.4" filter="blur(2px)" />

                      {/* NEXT Indicator Badge (PALING ATAS: Digambar di atas slab aktif & di layer paling depan) */}
                      <g transform={`translate(${cx - 28}, ${cy - 44})`}>
                        {/* Glow halo */}
                        <rect x="-2" y="-2" width="60" height="28" rx="14" fill="#3ecf8e" fillOpacity="0.3" filter="blur(3px)" />
                        {/* White pill */}
                        <rect x="0" y="0" width="56" height="24" rx="12" fill="#ffffff" filter="drop-shadow(0 4px 12px rgba(62,207,142,0.8))" />
                        {/* Downward triangle pointer */}
                        <polygon points="22,24 34,24 28,30" fill="#ffffff" />
                        {/* Bold NEXT label */}
                        <text
                          x="28"
                          y="16"
                          textAnchor="middle"
                          fill="#0e0e0e"
                          fontFamily="Montserrat, sans-serif"
                          fontWeight="900"
                          fontSize="11"
                          letterSpacing="1.2"
                        >
                          NEXT
                        </text>
                      </g>
                    </g>
                  </g>
                );
              })()}

              {/* MILESTONE TROPHIES ON THE PATH */}
              {/* Unit 1 Trophy Milestone (Above step 11) */}
              <g transform="translate(150, 1070)" className="cursor-pointer">
                <circle cx="20" cy="20" r="18" fill="#171717" stroke="#facc15" strokeWidth="2" />
                <path d="M14 12 h12 v6 c0 3.3 -2.7 6 -6 6 s-6 -2.7 -6 -6 v-6 z" fill="#facc15" />
                <path d="M12 14 h-2 c-1.1 0 -2 .9 -2 2 v1 c0 1.7 1.3 3 3 3 h1" fill="none" stroke="#facc15" strokeWidth="1.5" />
                <path d="M28 14 h2 c1.1 0 2 .9 2 2 v1 c0 1.7 -1.3 3 -3 3 h-1" fill="none" stroke="#facc15" strokeWidth="1.5" />
                <line x1="20" y1="24" x2="20" y2="28" stroke="#facc15" strokeWidth="2" />
                <line x1="16" y1="28" x2="24" y2="28" stroke="#facc15" strokeWidth="2" />
              </g>

              {/* Unit 2 Trophy Milestone (Above step 18) */}
              <g transform="translate(150, 560)" className="cursor-pointer opacity-70">
                <circle cx="20" cy="20" r="18" fill="#171717" stroke="#38bdf8" strokeWidth="2" />
                <path d="M14 12 h12 v6 c0 3.3 -2.7 6 -6 6 s-6 -2.7 -6 -6 v-6 z" fill="#38bdf8" />
                <line x1="20" y1="24" x2="20" y2="28" stroke="#38bdf8" strokeWidth="2" />
                <line x1="16" y1="28" x2="24" y2="28" stroke="#38bdf8" strokeWidth="2" />
              </g>
            </svg>
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
                <h3 className="text-lg font-brand font-bold text-white">Materi Pembelajaran Python</h3>
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
                      handleTileClick(tiles[idx]);
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
