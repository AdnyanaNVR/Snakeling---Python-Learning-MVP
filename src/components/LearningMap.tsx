import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { LESSON_UNITS } from '../data/curriculum';
import { Lock, ChevronDown, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface TileData {
  id: number;
  unit: number;
  stepNumber: number;
  lessonId: string;
  title: string;
  iconType: string;
  cx: number;
  cy: number;
  status: 'active' | 'completed' | 'locked';
}

// Enlarged 3D Isometric Rounded Rhombus Slab (Width: 108px, Height: 58px, Depth: 16px)
// Symmetrically constructed around (cx, cy)
const getSlabTopPath = (cx: number, cy: number, hw = 54, hh = 29, r = 10) => {
  const k = (hh / hw); // 29 / 54 ≈ 0.537
  return `M ${cx - r} ${cy - hh + r * k} 
    Q ${cx} ${cy - hh} ${cx + r} ${cy - hh + r * k} 
    L ${cx + hw - r} ${cy - r * k} 
    Q ${cx + hw} ${cy} ${cx + hw - r} ${cy + r * k} 
    L ${cx + r} ${cy + hh - r * k} 
    Q ${cx} ${cy + hh} ${cx - r} ${cy + hh - r * k} 
    L ${cx - hw + r} ${cy + r * k} 
    Q ${cx - hw} ${cy} ${cx - hw + r} ${cy - r * k} Z`;
};

// Left 3D drop side (depth: 16px)
const getSlabLeftSidePath = (cx: number, cy: number, hw = 54, hh = 29, depth = 16, r = 10) => {
  const k = (hh / hw);
  return `M ${cx - hw + r} ${cy + r * k} 
    L ${cx - r} ${cy + hh - r * k} 
    Q ${cx} ${cy + hh} ${cx} ${cy + hh} 
    L ${cx} ${cy + hh + depth} 
    L ${cx - r} ${cy + hh + depth - r * k} 
    L ${cx - hw + r} ${cy + depth + r * k} 
    Q ${cx - hw} ${cy + depth} ${cx - hw} ${cy + depth - r * k} 
    L ${cx - hw} ${cy} 
    Q ${cx - hw} ${cy} ${cx - hw + r} ${cy - r * k} Z`;
};

// Right 3D drop side (depth: 16px)
const getSlabRightSidePath = (cx: number, cy: number, hw = 54, hh = 29, depth = 16, r = 10) => {
  const k = (hh / hw);
  return `M ${cx} ${cy + hh} 
    Q ${cx} ${cy + hh} ${cx + r} ${cy + hh - r * k} 
    L ${cx + hw - r} ${cy + r * k} 
    Q ${cx + hw} ${cy} ${cx + hw} ${cy} 
    L ${cx + hw} ${cy + depth} 
    Q ${cx + hw} ${cy + depth} ${cx + hw - r} ${cy + depth + r * k} 
    L ${cx + r} ${cy + hh + depth - r * k} 
    L ${cx} ${cy + hh + depth} Z`;
};

// Circular 3D dais for milestone tiles (enlarged: rx = 48, ry = 26)
const getRoundTopPath = (cx: number, cy: number, rx = 48, ry = 26) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

const getRoundSidePath = (cx: number, cy: number, depth = 16, rx = 48, ry = 26) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L ${cx + rx} ${cy + depth} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy + depth} Z`;

// Render embossed SVG icons on the surface of each tile, scaled proportionally for the larger slab
const renderEmbossedIcon = (iconType: string, isBright: boolean) => {
  const fill = isBright ? '#ffffff' : '#2f766f';
  const stroke = isBright ? '#ffffff' : '#28625b';

  switch (iconType) {
    case 'king':
      return (
        <g fill={fill} transform="translate(-13, -14) scale(1.3)">
          <path d="M4 17h14v2H4z" />
          <path d="M5 15h12l1-6-4 3-3-5-3 5-4-3 1 6z" />
          <path d="M10 2h2v4h-2z" />
          <path d="M9 3h4v1.5H9z" />
        </g>
      );
    case 'queen':
      return (
        <g fill={fill} transform="translate(-13, -13) scale(1.25)">
          <path d="M4 18h14v2H4z" />
          <path d="M4.5 16h13l1.5-8-4 3-4-6-4 6-4-3 1.5 8z" />
          <circle cx="4" cy="7" r="1.5" />
          <circle cx="8.5" cy="4" r="1.5" />
          <circle cx="11" cy="2" r="1.5" />
          <circle cx="13.5" cy="4" r="1.5" />
          <circle cx="18" cy="7" r="1.5" />
        </g>
      );
    case 'rook':
      return (
        <g fill={fill} transform="translate(-12, -13) scale(1.25)">
          <path d="M4 18h12v2H4z" />
          <path d="M5 16h10l-1-7h1V5h-2.5v2h-2V5h-2v2h-2V5H4v4h1l-1 7z" />
        </g>
      );
    case 'bishop':
      return (
        <g fill={fill} stroke={stroke} strokeWidth="0.5" transform="translate(-12, -14) scale(1.25)">
          <path d="M5 18h10v2H5z" />
          <path d="M6 16h8c0-3-1-6-4-8-3 2-4 5-4 8z" />
          <circle cx="10" cy="6.5" r="1.5" />
          <path d="M10 10l2 2" stroke="#133634" strokeWidth="1.2" />
        </g>
      );
    case 'knight':
      return (
        <g fill={fill} transform="translate(-12, -14) scale(1.25)">
          <path d="M4 18h12v2H4z" />
          <path d="M5 16h10c0-4-2-7-5-9l-2 1-3 2v3l3-1c0 2-1 3-3 4z" />
        </g>
      );
    case 'pawn':
      return (
        <g fill={fill} transform="translate(-11, -13) scale(1.25)">
          <path d="M4 17h10v2H4z" />
          <path d="M5 15h8l-1.5-6h-5L5 15z" />
          <circle cx="9" cy="6" r="3" />
        </g>
      );
    case 'graduation':
      return (
        <g fill={fill} stroke={stroke} strokeWidth="0.5" transform="translate(-15, -12) scale(1.3)">
          <path d="M11 3L1 8l10 5 10-5-10-5z" />
          <path d="M5 10.5v5c0 2.5 3 4.5 6 4.5s6-2 6-4.5v-5" fill="none" stroke={stroke} strokeWidth="1.8" />
          <path d="M21 8.5v6" fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="21" cy="15" r="1" />
        </g>
      );
    case 'plus':
      return (
        <g fill={fill} transform="translate(-9, -9) scale(1.25)">
          <rect x="5" y="0" width="4" height="14" rx="1.5" />
          <rect x="0" y="5" width="14" height="4" rx="1.5" />
        </g>
      );
    case 'lightning':
      return (
        <g fill={fill} transform="translate(-9, -12) scale(1.25)">
          <polygon points="8,0 1,9 7,9 5,16 13,7 7,7" />
        </g>
      );
    case 'hash':
      return (
        <g stroke={fill} strokeWidth="2.6" strokeLinecap="round" transform="translate(-9, -9) scale(1.25)">
          <line x1="4" y1="0" x2="2" y2="14" />
          <line x1="10" y1="0" x2="8" y2="14" />
          <line x1="0" y1="4" x2="14" y2="4" />
          <line x1="0" y1="10" x2="14" y2="10" />
        </g>
      );
    case 'castling':
      return (
        <g fill={fill} transform="translate(-14, -10) scale(1.25)">
          <path d="M2 14h6v2H2zM14 14h6v2h-6z" />
          <path d="M3 12h4l-.5-5h.5V5H5v1H4V5H2v2h.5l.5 5z" />
          <path d="M15 12h4l-.5-5h.5V5H17v1h-1V5h-2v2h.5l.5 5z" />
          <path d="M8 9h6v2H8z" opacity="0.6" />
        </g>
      );
    case 'brackets':
      return (
        <g stroke={fill} strokeWidth="2.4" strokeLinecap="round" fill="none" transform="translate(-11, -10) scale(1.25)">
          <path d="M4 1c-2 0-3 1.5-3 3.5v2c0 1.5-1 2-1 2s1 .5 1 2v2c0 2 1 3.5 3 3.5" />
          <path d="M14 1c2 0 3 1.5 3 3.5v2c0 1.5 1 2 1 2s-1 .5-1 2v2c0 2-1 3.5-3 3.5" />
        </g>
      );
    default:
      return (
        <g fill={fill} transform="translate(-9, -9) scale(1.25)">
          <polygon points="7,1 9,5 13,6 10,9 11,13 7,11 3,13 4,9 1,6 5,5" />
        </g>
      );
  }
};

export const LearningMap: React.FC = () => {
  const { stats, setIsLessonActive, setSelectedLessonId, playSound, showToast } = useApp();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const roadmapScrollRef = useRef<HTMLDivElement>(null);

  // Perfectly symmetrical 4-tile diagonal leg around midline X = 210 in viewBox 0 0 420:
  // Col 0: 114 | Col 1: 178 | Col 2: 242 | Col 3: 306
  // (114 + 306)/2 = 210, (178 + 242)/2 = 210 (100% symmetric!)
  // 4 steps up-right: [114, 178, 242, 306], then 4 steps up-left: [306, 242, 178, 114]
  const cxPattern = [114, 178, 242, 306, 242, 178];
  const startCy = 2150;
  const dyStep = 74; // Generous vertical step matching enlarged tile proportion

  const tileMetaData = [
    // UNIT 1: DASAR PYTHON
    { id: 1, unit: 1, stepNumber: 1, lessonId: 'module-01', title: 'Hello World & print', iconType: 'king' },
    { id: 2, unit: 1, stepNumber: 2, lessonId: 'module-02', title: 'Sintaks & Komentar (#)', iconType: 'queen' },
    { id: 3, unit: 1, stepNumber: 3, lessonId: 'module-03', title: 'Variabel & Penamaan', iconType: 'rook' },

    // UNIT 2: TIPE DATA
    { id: 4, unit: 2, stepNumber: 4, lessonId: 'module-04', title: 'Integer & Float', iconType: 'bishop' },
    { id: 5, unit: 2, stepNumber: 5, lessonId: 'module-05', title: 'String & Boolean', iconType: 'knight' },
    { id: 6, unit: 2, stepNumber: 6, lessonId: 'module-06', title: 'type() & Konversi Data', iconType: 'pawn' },

    // UNIT 3: OPERATOR PYTHON
    { id: 7, unit: 3, stepNumber: 7, lessonId: 'module-07', title: 'Operator Aritmatika', iconType: 'plus' },
    { id: 8, unit: 3, stepNumber: 8, lessonId: 'module-08', title: 'Perbandingan & Logika', iconType: 'lightning' },

    // UNIT 4: INPUT & OUTPUT
    { id: 9, unit: 4, stepNumber: 9, lessonId: 'module-09', title: 'Input Pengguna input()', iconType: 'hash' },
    { id: 10, unit: 4, stepNumber: 10, lessonId: 'module-10', title: 'Format Teks f-string', iconType: 'castling' },

    // MILESTONE 1: EVALUASI SERTIFIKASI TINGKAT DASAR
    { id: 11, unit: 4, stepNumber: 11, lessonId: 'module-11', title: 'Ujian Sertifikasi Dasar', iconType: 'graduation' },

    // UNIT 5: PERCABANGAN
    { id: 12, unit: 5, stepNumber: 12, lessonId: 'module-12', title: 'Kondisi if & else', iconType: 'king' },
    { id: 13, unit: 5, stepNumber: 13, lessonId: 'module-13', title: 'Kondisi elif & Nested', iconType: 'queen' },

    // UNIT 6: PERULANGAN
    { id: 14, unit: 6, stepNumber: 14, lessonId: 'module-14', title: 'For Loop & range()', iconType: 'bishop' },
    { id: 15, unit: 6, stepNumber: 15, lessonId: 'module-15', title: 'While, break, continue', iconType: 'knight' },

    // UNIT 7: STRUKTUR DATA
    { id: 16, unit: 7, stepNumber: 16, lessonId: 'module-16', title: 'List & Indeks Elemen', iconType: 'brackets' },
    { id: 17, unit: 7, stepNumber: 17, lessonId: 'module-17', title: 'Manipulasi List Methods', iconType: 'plus' },
    { id: 18, unit: 7, stepNumber: 18, lessonId: 'module-18', title: 'Dictionary, Tuple, Set', iconType: 'hash' },

    // UNIT 8: MANIPULASI STRING
    { id: 19, unit: 8, stepNumber: 19, lessonId: 'module-19', title: 'String Slicing & Methods', iconType: 'pawn' },

    // MILESTONE 2: TANTANGAN STRUKTUR DATA & ALGORITMA
    { id: 20, unit: 8, stepNumber: 20, lessonId: 'module-20', title: 'Tantangan Algoritma', iconType: 'graduation' },

    // UNIT 9: FUNCTION
    { id: 21, unit: 9, stepNumber: 21, lessonId: 'module-21', title: 'Function: def & return', iconType: 'rook' },

    // UNIT 10: ERROR HANDLING
    { id: 22, unit: 10, stepNumber: 22, lessonId: 'module-22', title: 'try, except, finally', iconType: 'lightning' },

    // UNIT 11: FILE HANDLING
    { id: 23, unit: 11, stepNumber: 23, lessonId: 'module-23', title: 'File Handling: with open', iconType: 'castling' },

    // UNIT 12 & 13: OOP & PYTHON LANJUTAN
    { id: 24, unit: 12, stepNumber: 24, lessonId: 'module-24', title: 'OOP & Comprehension', iconType: 'queen' },

    // UNIT 14: PRAKTIK PROYEK & KELULUSAN
    { id: 25, unit: 14, stepNumber: 25, lessonId: 'module-25', title: 'Kelulusan Python Master', iconType: 'king' }
  ];

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

  // Auto-scroll the roadmap container to active step
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
      if (activeTile && roadmapScrollRef.current) {
        const targetScrollTop = Math.max(0, activeTile.cy - 340);
        roadmapScrollRef.current.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [stats.completedLessons.length]);

  const handleRoadmapScroll = () => {
    if (!roadmapScrollRef.current) return;
    const { scrollTop } = roadmapScrollRef.current;
    const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
    const targetScrollTop = Math.max(0, activeTile.cy - 340);
    const isFarFromActive = Math.abs(scrollTop - targetScrollTop) > 160;
    setIsScrolledUp(isFarFromActive);
  };

  const scrollToActiveStep = () => {
    playSound('click');
    const activeTile = tiles.find((t) => t.status === 'active') || tiles[0];
    if (roadmapScrollRef.current) {
      const targetScrollTop = Math.max(0, activeTile.cy - 340);
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
      {/* Floating Bottom Action Card (Always Centered) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-[440px] bg-[#171717] border-2 border-[#2e2e2e] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between px-1">
          <span className="font-brand font-extrabold text-sm uppercase tracking-wider text-white">
            LEARN TO CODE
          </span>
          <span className="text-xs font-mono font-bold text-[#3ecf8e]">
            {stats.completedLessons.length} / 25 Selesai
          </span>
        </div>

        <button
          onClick={startNextLesson}
          className="tactile-btn-primary w-full py-3.5 px-6 rounded-xl font-brand font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <span>NEXT LESSON</span>
          <ArrowRight className="w-4 h-4 stroke-[2.8]" />
        </button>
      </div>

      {/* Floating "Lompat ke Langkah Aktif" button if scrolled away */}
      {isScrolledUp && (
        <button
          onClick={scrollToActiveStep}
          className="absolute bottom-28 right-6 z-20 px-3.5 py-2 rounded-full bg-[#1c1b1b] border border-[#3ecf8e]/50 text-[#3ecf8e] text-xs font-bold shadow-xl flex items-center gap-1.5 hover:bg-[#252525] transition-all cursor-pointer animate-bounce"
        >
          <ChevronDown className="w-4 h-4" />
          <span>Langkah Aktif</span>
        </button>
      )}

      {/* Scrollable Map Container - Clean dark background without checkerboard/chess pieces */}
      <div
        ref={roadmapScrollRef}
        onScroll={handleRoadmapScroll}
        className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center pt-8 pb-36 relative custom-scrollbar scroll-smooth"
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[420px] flex justify-center relative">
            <svg
              viewBox="0 0 420 2360"
              className="w-full h-auto overflow-visible select-none"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.7))' }}
            >
              <defs>
                {/* 1. Inactive / Normal Tile Shading (Deep Dark Teal Slab) */}
                <linearGradient id="tileTopDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e4d49" />
                  <stop offset="100%" stopColor="#133634" />
                </linearGradient>
                <linearGradient id="tileSideLeftDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f2927" />
                  <stop offset="100%" stopColor="#081816" />
                </linearGradient>
                <linearGradient id="tileSideRightDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0c2321" />
                  <stop offset="100%" stopColor="#051210" />
                </linearGradient>

                {/* 2. Active Glowing Tile Shading (Radiant Seafoam Mint) */}
                <linearGradient id="tileTopActive" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3ff3a9" />
                  <stop offset="100%" stopColor="#1ecb85" />
                </linearGradient>
                <linearGradient id="tileSideLeftActive" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#128362" />
                  <stop offset="100%" stopColor="#0b543e" />
                </linearGradient>
                <linearGradient id="tileSideRightActive" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d6b4f" />
                  <stop offset="100%" stopColor="#073a2b" />
                </linearGradient>

                {/* 3. Completed Tile Shading */}
                <linearGradient id="tileTopCompleted" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>

                {/* Drop shadow filters */}
                <filter id="tileShadow" x="-30%" y="-20%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="10" stdDeviation="6" floodColor="#000000" floodOpacity="0.75" />
                </filter>
                <filter id="activeNeonGlow" x="-60%" y="-50%" width="220%" height="220%">
                  <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#3ff3a9" floodOpacity="0.75" />
                  <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#000000" floodOpacity="0.85" />
                </filter>
              </defs>

              {/* Top Section Header & Gate (Next Section: Beginner / Lanjutan) */}
              <g transform="translate(210, 160)" textAnchor="middle">
                <text
                  y="-18"
                  fill="#718096"
                  fontFamily="Montserrat, sans-serif"
                  fontWeight="800"
                  fontSize="11"
                  letterSpacing="1.8"
                >
                  NEXT SECTION
                </text>
                <text
                  y="6"
                  fill="#cbd5e1"
                  fontFamily="Montserrat, sans-serif"
                  fontWeight="900"
                  fontSize="22"
                  letterSpacing="0.5"
                >
                  Beginner
                </text>

                {/* Next Section Gateway Tile */}
                <g transform="translate(0, 56)" filter="url(#tileShadow)">
                  <path d={getSlabLeftSidePath(0, 0)} fill="url(#tileSideLeftDark)" />
                  <path d={getSlabRightSidePath(0, 0)} fill="url(#tileSideRightDark)" />
                  <path d={getSlabTopPath(0, 0)} fill="url(#tileTopDark)" stroke="#2a635d" strokeWidth="1.5" />
                  {renderEmbossedIcon('graduation', false)}
                </g>
              </g>

              {/* Render Inactive and Completed Tiles (Top to Bottom order) */}
              {tiles
                .filter((tile) => tile.status !== 'active')
                .sort((a, b) => a.cy - b.cy)
                .map((tile) => {
                  const { id, cx, cy, status, iconType } = tile;
                  const isCompleted = status === 'completed';
                  const isRoundMilestone = tile.id === 11 || tile.id === 20 || tile.id === 25;

                  if (isRoundMilestone) {
                    return (
                      <g key={id} className="roadmap-tile-group cursor-pointer" onClick={() => handleTileClick(tile)}>
                        <rect x={cx - 56} y={cy - 30} width={112} height={80} fill="transparent" style={{ pointerEvents: 'all' }} />
                        <g className="roadmap-tile-slab" filter="url(#tileShadow)">
                          <path d={getRoundSidePath(cx, cy)} fill="url(#tileSideLeftDark)" />
                          <path d={getRoundTopPath(cx, cy)} fill="url(#tileTopDark)" stroke="#2a635d" strokeWidth="1.5" />
                          <g transform={`translate(${cx}, ${cy})`}>
                            {renderEmbossedIcon(iconType, isCompleted)}
                          </g>
                        </g>
                      </g>
                    );
                  }

                  if (isCompleted) {
                    return (
                      <g key={id} className="roadmap-tile-group cursor-pointer" onClick={() => handleTileClick(tile)}>
                        <rect x={cx - 56} y={cy - 30} width={112} height={80} fill="transparent" style={{ pointerEvents: 'all' }} />
                        <g className="roadmap-tile-slab" filter="url(#tileShadow)">
                          <path d={getSlabLeftSidePath(cx, cy)} fill="url(#tileSideLeftActive)" />
                          <path d={getSlabRightSidePath(cx, cy)} fill="url(#tileSideRightActive)" />
                          <path d={getSlabTopPath(cx, cy)} fill="url(#tileTopCompleted)" stroke="#a7f3d0" strokeWidth="1.8" />
                          <g transform={`translate(${cx}, ${cy})`}>
                            {renderEmbossedIcon(iconType, true)}
                          </g>
                          <g transform={`translate(${cx + 24}, ${cy - 14})`}>
                            <circle cx="0" cy="0" r="8" fill="#14532d" stroke="#ffffff" strokeWidth="1.4" />
                            <path d="M-3.5 0 L-1 2.5 L3.5 -2" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </g>
                        </g>
                      </g>
                    );
                  }

                  // Normal Inactive / Locked Tile (Enlarged Deep Teal Slab with Embossed Icon)
                  return (
                    <g key={id} className="roadmap-tile-group cursor-pointer" onClick={() => handleTileClick(tile)}>
                      <rect x={cx - 56} y={cy - 30} width={112} height={80} fill="transparent" style={{ pointerEvents: 'all' }} />
                      <g className="roadmap-tile-slab" filter="url(#tileShadow)">
                        <path d={getSlabLeftSidePath(cx, cy)} fill="url(#tileSideLeftDark)" />
                        <path d={getSlabRightSidePath(cx, cy)} fill="url(#tileSideRightDark)" />
                        <path d={getSlabTopPath(cx, cy)} fill="url(#tileTopDark)" stroke="#2a635d" strokeWidth="1.5" />
                        <g transform={`translate(${cx}, ${cy})`}>
                          {renderEmbossedIcon(iconType, false)}
                        </g>
                      </g>
                    </g>
                  );
                })}

              {/* Render Active Tile with Glowing Mint Slab (Label "Next" REMOVED as requested) */}
              {(() => {
                const activeTile = tiles.find((t) => t.status === 'active');
                if (!activeTile) return null;
                const { id, cx, cy, iconType } = activeTile;

                return (
                  <g key={id} className="roadmap-tile-group cursor-pointer" onClick={() => handleTileClick(activeTile)}>
                    {/* Hit Target */}
                    <rect x={cx - 60} y={cy - 34} width={120} height={90} fill="transparent" style={{ pointerEvents: 'all' }} />

                    {/* Glowing Mint 3D Slab without any speech bubble / "Next" label on top */}
                    <g className="roadmap-tile-slab" filter="url(#activeNeonGlow)">
                      <path d={getSlabLeftSidePath(cx, cy)} fill="url(#tileSideLeftActive)" />
                      <path d={getSlabRightSidePath(cx, cy)} fill="url(#tileSideRightActive)" />
                      <path d={getSlabTopPath(cx, cy)} fill="url(#tileTopActive)" stroke="#ffffff" strokeWidth="2" />

                      {/* White Embossed Icon inside Active Tile */}
                      <g transform={`translate(${cx}, ${cy})`}>
                        {renderEmbossedIcon(iconType, true)}
                      </g>
                    </g>
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
