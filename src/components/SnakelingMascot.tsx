import React from 'react';

export type MascotMood = 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrate';

interface MascotProps {
  mood?: MascotMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAccessories?: boolean;
  equippedCosmetics?: string[];
}

export const SnakelingMascot: React.FC<MascotProps> = ({
  mood = 'happy',
  className = '',
  size = 'md',
  showAccessories = true,
  equippedCosmetics = []
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48 sm:w-56 sm:h-56'
  };

  const hasVisor = showAccessories && equippedCosmetics.includes('visor_cyber');
  const hasGlasses = showAccessories && equippedCosmetics.includes('retro_shades');
  const hasGoldenSkin = showAccessories && equippedCosmetics.includes('golden_skin');

  const bodyGradientStart = hasGoldenSkin ? '#fbbf24' : '#3ecf8e';
  const bodyGradientEnd = hasGoldenSkin ? '#d97706' : '#1b6343';
  const bellyColor = hasGoldenSkin ? '#fef08a' : '#a7f3d0';

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`snakeBody-${mood}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bodyGradientStart} />
            <stop offset="100%" stopColor={bodyGradientEnd} />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Coiled Tail Base */}
        <path
          d="M 60,170 C 40,165 30,145 45,130 C 60,115 110,140 140,150 C 165,158 175,178 150,185 C 120,192 75,188 60,170 Z"
          fill={`url(#snakeBody-${mood})`}
          stroke="#155237"
          strokeWidth="3"
        />

        {/* Upright Neck / Torso */}
        <path
          d="M 85,150 C 75,115 80,85 100,75 C 120,65 130,105 125,145 C 115,160 95,160 85,150 Z"
          fill={`url(#snakeBody-${mood})`}
          stroke="#155237"
          strokeWidth="3"
        />

        {/* Yellow/Green Belly Scutes */}
        <path
          d="M 90,145 C 92,120 95,95 106,85 C 112,87 116,110 112,145 C 103,150 96,148 90,145 Z"
          fill={bellyColor}
          opacity="0.85"
        />
        <line x1="93" y1="105" x2="111" y2="105" stroke="#155237" strokeWidth="1.5" opacity="0.4" />
        <line x1="91" y1="122" x2="113" y2="122" stroke="#155237" strokeWidth="1.5" opacity="0.4" />
        <line x1="90" y1="138" x2="113" y2="138" stroke="#155237" strokeWidth="1.5" opacity="0.4" />

        {/* Cute Snake Head */}
        <ellipse
          cx="100"
          cy="68"
          rx="38"
          ry="32"
          fill={`url(#snakeBody-${mood})`}
          stroke="#155237"
          strokeWidth="3"
        />

        {/* Cheeks blush */}
        <circle cx="75" cy="78" r="6" fill="#f43f5e" opacity={mood === 'excited' ? '0.45' : '0.25'} />
        <circle cx="125" cy="78" r="6" fill="#f43f5e" opacity={mood === 'excited' ? '0.45' : '0.25'} />

        {/* Eyes based on Mood */}
        {mood === 'sad' ? (
          <g>
            {/* Sad Eyes */}
            <circle cx="82" cy="62" r="7" fill="#0e0e0e" />
            <circle cx="118" cy="62" r="7" fill="#0e0e0e" />
            <circle cx="84" cy="60" r="2.5" fill="#ffffff" />
            <circle cx="120" cy="60" r="2.5" fill="#ffffff" />
            {/* Droopy brow */}
            <path d="M 75,54 Q 82,59 89,56" stroke="#155237" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 125,54 Q 118,59 111,56" stroke="#155237" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Tear */}
            <path d="M 73,70 C 70,75 75,80 77,75 Z" fill="#38bdf8" opacity="0.8" />
          </g>
        ) : mood === 'thinking' ? (
          <g>
            {/* Thinking Eyes - looking up/side */}
            <circle cx="82" cy="60" r="8" fill="#ffffff" />
            <circle cx="84" cy="56" r="4.5" fill="#0e0e0e" />
            <circle cx="85" cy="54" r="1.5" fill="#ffffff" />

            <circle cx="118" cy="60" r="8" fill="#ffffff" />
            <circle cx="120" cy="56" r="4.5" fill="#0e0e0e" />
            <circle cx="121" cy="54" r="1.5" fill="#ffffff" />

            {/* Inquisitive eyebrow */}
            <path d="M 74,52 Q 82,48 90,53" stroke="#155237" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 112,54 Q 120,53 126,51" stroke="#155237" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            {/* Happy / Excited Big Cartoon Eyes */}
            <circle cx="80" cy="62" r="9" fill="#ffffff" />
            <circle cx="81" cy="63" r="6" fill="#0e0e0e" />
            <circle cx="84" cy="60" r="2.5" fill="#ffffff" />
            <circle cx="78" cy="65" r="1.2" fill="#ffffff" />

            <circle cx="120" cy="62" r="9" fill="#ffffff" />
            <circle cx="119" cy="63" r="6" fill="#0e0e0e" />
            <circle cx="122" cy="60" r="2.5" fill="#ffffff" />
            <circle cx="116" cy="65" r="1.2" fill="#ffffff" />

            {/* Friendly Eyebrows */}
            <path d="M 72,50 Q 80,45 88,50" stroke="#155237" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 112,50 Q 120,45 128,50" stroke="#155237" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* Mouth based on Mood */}
        {mood === 'sad' ? (
          <path
            d="M 88,88 Q 100,78 112,88"
            stroke="#155237"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        ) : mood === 'excited' || mood === 'celebrate' ? (
          <g>
            {/* Open Happy Mouth */}
            <path
              d="M 88,78 Q 100,98 112,78 Z"
              fill="#991b1b"
              stroke="#155237"
              strokeWidth="2.5"
            />
            {/* Cute pink tongue */}
            <path
              d="M 94,86 Q 100,94 106,86 Z"
              fill="#f43f5e"
            />
          </g>
        ) : (
          <g>
            {/* Gentle Smile */}
            <path
              d="M 90,78 Q 100,88 110,78"
              stroke="#155237"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tongue flicker for snake charm */}
            <path
              d="M 100,83 L 100,92 L 96,96 M 100,92 L 104,96"
              stroke="#f43f5e"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Nostrils */}
        <circle cx="94" cy="72" r="1" fill="#155237" />
        <circle cx="106" cy="72" r="1" fill="#155237" />

        {/* Accessories if equipped */}
        {hasVisor && (
          <g>
            <path
              d="M 64,58 Q 100,50 136,58 L 138,68 Q 100,60 62,68 Z"
              fill="#3ecf8e"
              opacity="0.85"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <line x1="68" y1="62" x2="132" y2="62" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          </g>
        )}

        {hasGlasses && (
          <g>
            <rect x="68" y="56" width="26" height="14" rx="3" fill="#171717" stroke="#fbbf24" strokeWidth="2" />
            <rect x="106" y="56" width="26" height="14" rx="3" fill="#171717" stroke="#fbbf24" strokeWidth="2" />
            <line x1="94" y1="63" x2="106" y2="63" stroke="#fbbf24" strokeWidth="2" />
          </g>
        )}

        {/* Celebration sparkles */}
        {mood === 'celebrate' && (
          <g>
            <path d="M 40,50 L 45,55 L 40,60 L 35,55 Z" fill="#facc15" />
            <path d="M 160,40 L 165,45 L 160,50 L 155,45 Z" fill="#3ecf8e" />
            <circle cx="150" cy="70" r="3" fill="#38bdf8" />
            <circle cx="50" cy="80" r="3" fill="#f43f5e" />
          </g>
        )}
      </svg>
    </div>
  );
};
