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

  // Dynamic filter for skin and mood
  let imageFilter = '';
  if (hasGoldenSkin) {
    imageFilter += ' drop-shadow(0 0 20px rgba(251,191,36,0.85)) sepia(0.85) hue-rotate(35deg) saturate(1.8) brightness(1.1)';
  } else {
    imageFilter += ' drop-shadow(0 8px 18px rgba(0,0,0,0.55))';
  }

  if (mood === 'sad') {
    imageFilter += ' saturate(0.6) brightness(0.9)';
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      {/* Ambient glow when excited or celebrating */}
      {(mood === 'excited' || mood === 'celebrate') && (
        <div className="absolute inset-2 bg-[#3ecf8e]/20 blur-xl rounded-full pointer-events-none -z-10" />
      )}

      {/* Mascot Image */}
      <img
        src="/logo_snakepreview.png"
        alt="Snakeling Maskot"
        className={`w-full h-full object-contain pointer-events-none transition-transform duration-300 ${
          mood === 'thinking' ? '-rotate-6 scale-95' : mood === 'sad' ? 'rotate-3 scale-95' : mood === 'celebrate' ? 'scale-105' : ''
        }`}
        style={{ filter: imageFilter }}
      />

      {/* Mood Overlays & Emotes */}
      {mood === 'thinking' && (
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1c1b1b] border-2 border-[#38bdf8] text-[#38bdf8] flex items-center justify-center font-brand font-black text-xs shadow-lg animate-bounce">
          ?
        </div>
      )}

      {mood === 'sad' && (
        <div
          className="absolute top-[38%] left-[28%] w-2.5 h-3.5 bg-[#38bdf8] opacity-90 animate-pulse shadow-md"
          style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
        />
      )}

      {mood === 'celebrate' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="absolute -top-2 left-2 text-[#facc15] text-sm animate-ping">✦</span>
          <span className="absolute -top-3 right-3 text-[#3ecf8e] text-base animate-bounce">★</span>
          <span className="absolute bottom-2 -left-2 text-[#38bdf8] text-xs">✦</span>
          <span className="absolute bottom-1 -right-2 text-[#ff9600] text-sm animate-pulse">★</span>
        </div>
      )}

      {/* Equipped Accessories */}
      {hasVisor && (
        <div className="absolute top-[32%] left-[28%] w-[44%] h-[12%] bg-[#3ecf8e]/90 border border-white/80 rounded-full shadow-[0_0_12px_#3ecf8e] pointer-events-none transform -rotate-1 flex items-center justify-center overflow-hidden">
          <div className="w-full h-[2px] bg-white opacity-80" />
        </div>
      )}

      {hasGlasses && (
        <div className="absolute top-[31%] left-[26%] w-[48%] h-[15%] pointer-events-none flex items-center justify-between px-0.5">
          <div className="w-[45%] h-full bg-[#121212]/95 border-2 border-[#fbbf24] rounded-md shadow-md" />
          <div className="w-[10%] h-[2px] bg-[#fbbf24]" />
          <div className="w-[45%] h-full bg-[#121212]/95 border-2 border-[#fbbf24] rounded-md shadow-md" />
        </div>
      )}
    </div>
  );
};
