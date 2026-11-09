import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { LESSON_UNITS } from '../data/curriculum';
import { Lock, ChevronDown, CheckCircle2, BookOpen, ArrowRight, X, Sparkles } from 'lucide-react';

interface TileData {
  id: number;
  unit: number;
  stepNumber: number;
  lessonId: string;
  title: string;
  cx: number;
  cy: number;
  status: 'active' | 'completed' | 'locked';
}

// Mathematically symmetric 3D isometric rounded squircle slab paths matching reference
const getTopSlabPath = (cx: number, cy: number) =>
  `M ${cx - 8} ${cy - 20} Q ${cx} ${cy - 24} ${cx + 8} ${cy - 20} L ${cx + 34} ${cy - 4} Q ${cx + 42} ${cy} ${cx + 34} ${cy + 4} L ${cx + 8} ${cy + 20} Q ${cx} ${cy + 24} ${cx - 8} ${cy + 20} L ${cx - 34} ${cy + 4} Q ${cx - 42} ${cy} ${cx - 34} ${cy - 4} Z`;

const getLeftSidePath = (cx: number, cy: number) =>
  `M ${cx - 42} ${cy} Q ${cx - 42} ${cy + 4} ${cx - 34} ${cy + 4} L ${cx - 8} ${cy + 20} Q ${cx} ${cy + 24} ${cx} ${cy + 24} L ${cx} ${cy + 39} Q ${cx} ${cy + 39} ${cx - 8} ${cy + 35} L ${cx - 34} ${cy + 19} Q ${cx - 42} ${cy + 19} ${cx - 42} ${cy + 15} Z`;

const getRightSidePath = (cx: number, cy: number) =>
  `M ${cx} ${cy + 24} Q ${cx} ${cy + 24} ${cx + 8} ${cy + 20} L ${cx + 34} ${cy + 4} Q ${cx + 42} ${cy + 4} ${cx + 42} ${cy} L ${cx + 42} ${cy + 15} Q ${cx + 42} ${cy + 19} ${cx + 34} ${cy + 19} L ${cx + 8} ${cy + 35} Q ${cx} ${cy + 39} ${cx} ${cy + 39} Z`;

export const LearningMap: React.FC = () => {
  const { stats, setIsLessonActive, setSelectedLessonId, playSound, showToast } = useApp();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const roadmapScrollRef = useRef<HTMLDivElement>(null);

  // Perfectly symmetrical zigzag around midline X=190: [109, 163, 217, 271, 217, 163]
  // 190 - 109 = 81, 271 - 190 = 81 | 190 - 163 = 27, 217 - 190 = 27
  const cxPattern = [109, 163, 217, 271, 217, 163];
  const startCy = 2920;
  const dyStep = 115; // Generous breathing room between stairs to prevent crowding

  const tileMetaData = [
    // UNIT 1: Menawarkan dan menerima minuman (Steps 1 to 11)
    { id: 1, unit: 1, stepNumber: 1, lessonId: 'module-01', title: 'Hello World & print' },
    { id: 2, unit: 1, stepNumber: 2, lessonId: 'unit1_lesson2', title: 'Variabel & Tipe String' },
    { id: 3, unit: 1, stepNumber: 3, lessonId: 'unit1_lesson3', title: 'Penggabungan String' },
    { id: 4, unit: 1, stepNumber: 4, lessonId: 'unit1_lesson4', title: 'Aritmatika Dasar Minuman' },
    { id: 5, unit: 1, stepNumber: 5, lessonId: 'unit1_lesson5', title: 'Input Pengguna' },
    { id: 6, unit: 1, stepNumber: 6, lessonId: 'unit1_lesson6', title: 'Latihan Praktik Terminal' },
    { id: 7, unit: 1, stepNumber: 7, lessonId: 'unit1_lesson7', title: 'Format Teks f-string' },
    { id: 8, unit: 1, stepNumber: 8, lessonId: 'unit1_lesson8', title: 'Logika Boolean' },
    { id: 9, unit: 1, stepNumber: 9, lessonId: 'unit1_lesson9', title: 'Review Cepat Sintaks' },
    { id: 10, unit: 1, stepNumber: 10, lessonId: 'unit1_lesson10', title: 'Tantangan Mini Game' },
    { id: 11, unit: 1, stepNumber: 11, lessonId: 'unit1_lesson11', title: 'Ujian Sertifikasi Unit 1' },

    // UNIT 2: Logika Kondisi & Percabangan (Steps 12 to 18)
    { id: 12, unit: 2, stepNumber: 12, lessonId: 'unit2_lesson1', title: 'Kondisi if & Logika Dasar' },
    { id: 13, unit: 2, stepNumber: 13, lessonId: 'unit2_lesson2', title: 'Percabangan else & Alternatif' },
    { id: 14, unit: 2, stepNumber: 14, lessonId: 'unit2_lesson3', title: 'Kondisi Majemuk elif' },
    { id: 15, unit: 2, stepNumber: 15, lessonId: 'unit2_lesson4', title: 'Operator Logika and & or' },
    { id: 16, unit: 2, stepNumber: 16, lessonId: 'unit2_lesson5', title: 'Nested if (Kondisi Bersarang)' },
    { id: 17, unit: 2, stepNumber: 17, lessonId: 'unit2_lesson6', title: 'Studi Kasus Menu Restoran' },
    { id: 18, unit: 2, stepNumber: 18, lessonId: 'unit2_lesson7', title: 'Evaluasi Akhir Unit 2' },

    // UNIT 3: Struktur Data List & Koleksi (Steps 19 to 25)
    { id: 19, unit: 3, stepNumber: 19, lessonId: 'unit3_lesson1', title: 'Mengenal List Python []' },
    { id: 20, unit: 3, stepNumber: 20, lessonId: 'unit3_lesson2', title: 'Indeks & Mengakses Elemen' },
    { id: 21, unit: 3, stepNumber: 21, lessonId: 'unit3_lesson3', title: 'Menambah Data: append()' },
    { id: 22, unit: 3, stepNumber: 22, lessonId: 'unit3_lesson4', title: 'Menghapus Data: remove()' },
    { id: 23, unit: 3, stepNumber: 23, lessonId: 'unit3_lesson5', title: 'Panjang List dengan len()' },
    { id: 24, unit: 3, stepNumber: 24, lessonId: 'unit3_lesson6', title: 'Slicing & Potong List' },
    { id: 25, unit: 3, stepNumber: 25, lessonId: 'unit3_lesson7', title: 'Master Sertifikasi List' }
  ];

  const completedCount = stats.completedLessons.length;

  const isLessonCompleted = (lId: string) => {
    return (
      stats.completedLessons.includes(lId) ||
      (lId === 'module-01' && stats.completedLessons.includes('unit1_lesson1')) ||
      (lId === 'unit1_lesson1' && stats.completedLessons.includes('module-01'))
    );
  };

  const tiles: TileData[] = tileMetaData.map((meta, i) => {
    let status: 'completed' | 'active' | 'locked' = 'locked';
    if (isLessonCompleted(meta.lessonId)) {
      status = 'completed';
    } else if (i === 0 || (i > 0 && isLessonCompleted(tileMetaData[i - 1]?.lessonId))) {
      status = 'active';
    }

    return {
      ...meta,
      status,
      cx: cxPattern[i % 6],
      cy: startCy - i * dyStep
    };
  });

  // Auto-scroll the roadmap container to the active step on initial load & lesson updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
      if (activeTile && roadmapScrollRef.current) {
        const targetScrollTop = Math.max(0, activeTile.cy - 300);
        roadmapScrollRef.current.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [stats.completedLessons.length]);

  // Track roadmap scroll position to show quick "Jump to Active Step" button
  const handleRoadmapScroll = () => {
    if (!roadmapScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = roadmapScrollRef.current;
    const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
    const targetScrollTop = Math.max(0, activeTile.cy - 300);
    const isFarFromActive = Math.abs(scrollTop - targetScrollTop) > 150;
    setIsScrolledUp(isFarFromActive);
  };

  const scrollToActiveStep = () => {
    playSound('click');
    const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
    if (roadmapScrollRef.current) {
      const targetScrollTop = Math.max(0, activeTile.cy - 300);
      roadmapScrollRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  };

  const findLessonUnit = (lId: string) => {
    return (
      LESSON_UNITS.find(
        (u) =>
          u.id === lId ||
          (lId === 'module-01' && u.id === 'unit1_lesson1') ||
          (lId === 'unit1_lesson1' && u.id === 'module-01')
      ) || LESSON_UNITS[0]
    );
  };

  const startNextLesson = () => {
    playSound('click');
    const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
    const lesson = findLessonUnit(activeTile.lessonId);
    setSelectedLessonId(lesson.id);
    setIsLessonActive(true);
  };

  const handleTileClick = (tile: TileData) => {
    playSound('click');
    if (tile.status === 'active' || tile.status === 'completed') {
      const lesson = findLessonUnit(tile.lessonId);
      setSelectedLessonId(lesson.id);
      setIsLessonActive(true);
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
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSyllabus(true)}
            className="w-12 h-12 shrink-0 rounded-xl bg-[#242424] hover:bg-[#2e2e2e] border border-[#393939] flex items-center justify-center text-[#3ecf8e] hover:text-white transition-all cursor-pointer"
            title="Daftar Pelajaran / Silabus"
          >
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={startNextLesson}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#3ecf8e] to-[#2fb778] hover:from-[#3ecf8e] hover:to-[#38c985] active:translate-y-1 font-brand font-black text-sm tracking-wide text-[#0e0e0e] shadow-[0_4px_0_#1b6343] flex items-center justify-center gap-2 transition-all uppercase cursor-pointer group"
          >
            <span>NEXT LESSON ({stats.completedLessons.length}/{LESSON_UNITS.length})</span>
            <ArrowRight className="w-4 h-4 stroke-[2.8] transition-transform group-hover:translate-x-0.5" />
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
          <div className="relative w-[360px] sm:w-[380px] h-[3150px] flex items-center justify-center overflow-visible">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 380 3150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Active glowing emerald slab top */}
                <linearGradient id="slabTopActive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3ecf8e" />
                  <stop offset="100%" stopColor="#1ea672" />
                </linearGradient>

                {/* Completed emerald slab top */}
                <linearGradient id="slabTopCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#228258" />
                  <stop offset="100%" stopColor="#15583b" />
                </linearGradient>

                {/* Dark teal-slate default/locked slab top matching reference screenshot */}
                <linearGradient id="slabTopDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3d36" />
                  <stop offset="100%" stopColor="#0e1f1c" />
                </linearGradient>

                {/* 3D Side extrusion facets for normal tiles */}
                <linearGradient id="sideLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#102621" />
                  <stop offset="100%" stopColor="#081412" />
                </linearGradient>
                <linearGradient id="sideRight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d201c" />
                  <stop offset="100%" stopColor="#050e0c" />
                </linearGradient>

                {/* 3D Side extrusion facets for active/completed tiles */}
                <linearGradient id="activeSideLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#165e3d" />
                  <stop offset="100%" stopColor="#0b3320" />
                </linearGradient>
                <linearGradient id="activeSideRight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#124f33" />
                  <stop offset="100%" stopColor="#072416" />
                </linearGradient>

                <filter id="tileShadow" x="-30%" y="-20%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.65" />
                </filter>
                <filter id="activeNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#3ecf8e" floodOpacity="0.6" />
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.75" />
                </filter>
                <filter id="completedGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#3ecf8e" floodOpacity="0.4" />
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.65" />
                </filter>
              </defs>

              {/* 1. RENDER BACKGROUND TILES IN ISOMETRIC ORDER (TOP TO BOTTOM) */}
              {tiles
                .filter((tile) => tile.status !== 'active')
                .sort((a, b) => a.cy - b.cy)
                .map((tile) => {
                  const { id, cx, cy, status } = tile;
                  const isCompleted = status === 'completed';
                  const isUnit1 = tile.unit === 1;

                  if (isCompleted) {
                    // TANGGA SELESAI: BERSINAR & MEMILIKI ICON CENTANG HIJAU
                    return (
                      <g
                        key={id}
                        className="roadmap-tile-group cursor-pointer"
                        onClick={() => handleTileClick(tile)}
                      >
                        {/* Static Hit Target */}
                        <rect
                          x={cx - 48}
                          y={cy - 26}
                          width={96}
                          height={74}
                          fill="transparent"
                          style={{ pointerEvents: 'all' }}
                        />
                        {/* Glowing Completed Slab */}
                        <g className="roadmap-tile-slab" filter="url(#completedGlow)">
                          <path d={getLeftSidePath(cx, cy)} fill="url(#activeSideLeft)" />
                          <path d={getRightSidePath(cx, cy)} fill="url(#activeSideRight)" />
                          <path
                            d={getTopSlabPath(cx, cy)}
                            fill="url(#slabTopCompleted)"
                            stroke="#3ecf8e"
                            strokeOpacity="0.9"
                            strokeWidth="1.5"
                          />
                          <ellipse cx={cx} cy={cy} rx="16" ry="8" fill="white" fillOpacity="0.3" filter="blur(2px)" />

                          {/* Completed Checkmark Emblem */}
                          <g transform={`translate(${cx - 8}, ${cy - 8})`}>
                            <circle cx="8" cy="8" r="8" fill="#14532d" fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.2" />
                            <path
                              d="M4.5 8 L7 10.5 L11.5 5.5"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </g>
                      </g>
                    );
                  }

                  // TANGGA TERKUNCI / NORMAL (SESUAI DENGAN GAMBAR REFERENSI PENGGUNA)
                  return (
                    <g
                      key={id}
                      className="roadmap-tile-group cursor-pointer"
                      onClick={() => handleTileClick(tile)}
                    >
                      {/* Static Hit Target */}
                      <rect
                        x={cx - 48}
                        y={cy - 26}
                        width={96}
                        height={74}
                        fill="transparent"
                        style={{ pointerEvents: 'all' }}
                      />
                      {/* Visual Slab: Moves down smoothly on hover without dribble */}
                      <g className="roadmap-tile-slab" filter="url(#tileShadow)" opacity={isUnit1 ? 0.95 : 0.65}>
                        <path d={getLeftSidePath(cx, cy)} fill="url(#sideLeft)" />
                        <path d={getRightSidePath(cx, cy)} fill="url(#sideRight)" />
                        <path
                          d={getTopSlabPath(cx, cy)}
                          fill="url(#slabTopDark)"
                          stroke="#2e584f"
                          strokeWidth="1.4"
                        />
                      </g>
                    </g>
                  );
                })}

              {/* 2. RENDER ACTIVE TILE + NEXT INDICATOR ON TOP LAYER */}
              {(() => {
                const activeTile = tiles.find((t) => t.status === 'active');
                if (!activeTile) return null;
                const { id, cx, cy } = activeTile;
                return (
                  <g
                    key={id}
                    className="roadmap-tile-group cursor-pointer"
                    onClick={() => handleTileClick(activeTile)}
                  >
                    {/* Static Hit Target: Covers badge & slab */}
                    <rect
                      x={cx - 48}
                      y={cy - 56}
                      width={96}
                      height={104}
                      fill="transparent"
                      style={{ pointerEvents: 'all' }}
                    />
                    {/* Visual Slab: Moves down smoothly on hover without dribble */}
                    <g className="roadmap-tile-slab" filter="url(#activeNeonGlow)">
                      {/* Active glowing slab geometry */}
                      <path d={getLeftSidePath(cx, cy)} fill="url(#activeSideLeft)" />
                      <path d={getRightSidePath(cx, cy)} fill="url(#activeSideRight)" />
                      <path
                        d={getTopSlabPath(cx, cy)}
                        fill="url(#slabTopActive)"
                        stroke="#ffffff"
                        strokeOpacity="0.95"
                        strokeWidth="1.8"
                      />
                      <ellipse cx={cx} cy={cy} rx="16" ry="8" fill="white" fillOpacity="0.45" filter="blur(2px)" />

                      {/* NEXT Indicator Speech Bubble Badge (Persis seperti gambar referensi) */}
                      <g transform={`translate(${cx}, ${cy - 46})`}>
                        {/* Glow halo */}
                        <rect x="-31" y="-14" width="62" height="28" rx="14" fill="#3ecf8e" fillOpacity="0.4" filter="blur(4px)" />
                        {/* White speech bubble */}
                        <rect x="-29" y="-12" width="58" height="24" rx="12" fill="#ffffff" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.45))" />
                        {/* Downward triangle pointer */}
                        <polygon points="-6,12 6,12 0,18" fill="#ffffff" />
                        {/* Bold NEXT label */}
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#0c1a16"
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
              {(() => {
                const u1End = tiles.find((t) => t.id === 11) || tiles[10];
                return (
                  <g transform={`translate(${u1End.cx - 20}, ${u1End.cy - 68})`} className="cursor-pointer">
                    <circle cx="20" cy="20" r="18" fill="#171717" stroke="#facc15" strokeWidth="2" />
                    <path d="M14 12 h12 v6 c0 3.3 -2.7 6 -6 6 s-6 -2.7 -6 -6 v-6 z" fill="#facc15" />
                    <path d="M12 14 h-2 c-1.1 0 -2 .9 -2 2 v1 c0 1.7 1.3 3 3 3 h1" fill="none" stroke="#facc15" strokeWidth="1.5" />
                    <path d="M28 14 h2 c1.1 0 2 .9 2 2 v1 c0 1.7 -1.3 3 -3 3 h-1" fill="none" stroke="#facc15" strokeWidth="1.5" />
                    <line x1="20" y1="24" x2="20" y2="28" stroke="#facc15" strokeWidth="2" />
                    <line x1="16" y1="28" x2="24" y2="28" stroke="#facc15" strokeWidth="2" />
                  </g>
                );
              })()}

              {/* Unit 2 Trophy Milestone (Above step 18) */}
              {(() => {
                const u2End = tiles.find((t) => t.id === 18) || tiles[17];
                return (
                  <g transform={`translate(${u2End.cx - 20}, ${u2End.cy - 68})`} className="cursor-pointer opacity-70">
                    <circle cx="20" cy="20" r="18" fill="#171717" stroke="#38bdf8" strokeWidth="2" />
                    <path d="M14 12 h12 v6 c0 3.3 -2.7 6 -6 6 s-6 -2.7 -6 -6 v-6 z" fill="#38bdf8" />
                    <line x1="20" y1="24" x2="20" y2="28" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="16" y1="28" x2="24" y2="28" stroke="#38bdf8" strokeWidth="2" />
                  </g>
                );
              })()}

              {/* Unit 3 Trophy Milestone (Above step 25 - Course Summit) */}
              {(() => {
                const u3End = tiles.find((t) => t.id === 25) || tiles[24];
                return (
                  <g transform={`translate(${u3End.cx - 20}, ${u3End.cy - 68})`} className="cursor-pointer">
                    <circle cx="20" cy="20" r="18" fill="#171717" stroke="#a855f7" strokeWidth="2" />
                    <path d="M14 12 h12 v6 c0 3.3 -2.7 6 -6 6 s-6 -2.7 -6 -6 v-6 z" fill="#a855f7" />
                    <path d="M12 14 h-2 c-1.1 0 -2 .9 -2 2 v1 c0 1.7 1.3 3 3 3 h1" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    <path d="M28 14 h2 c1.1 0 2 .9 2 2 v1 c0 1.7 -1.3 3 -3 3 h-1" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    <line x1="20" y1="24" x2="20" y2="28" stroke="#a855f7" strokeWidth="2" />
                    <line x1="16" y1="28" x2="24" y2="28" stroke="#a855f7" strokeWidth="2" />
                  </g>
                );
              })()}
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
                className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#2e2e2e] flex items-center justify-center text-[#b4b4b4] hover:text-white transition-colors"
                title="Tutup"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            <div className="space-y-2.5">
              {LESSON_UNITS.map((item, idx) => {
                const isCompleted = stats.completedLessons.includes(item.id);
                const isCurrent = !isCompleted && (idx === 0 || stats.completedLessons.includes(LESSON_UNITS[idx - 1]?.id));
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
