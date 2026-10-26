import React from 'react';
import { useApp } from '../context/AppContext';

export const RightWidgets: React.FC = () => {
  const { stats, user, setShowProModal, refillHearts, playSound, setActiveTab } = useApp();

  const handleHeartClick = () => {
    playSound('click');
    if (stats.hearts < stats.maxHearts) {
      refillHearts();
    }
  };

  return (
    <aside
      className="w-full lg:w-[330px] xl:w-[360px] shrink-0 flex flex-col gap-5 pt-1"
      aria-label="Statistik dan Widget"
    >
      {/* Top Stats Row */}
      <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#171717] border border-[#2e2e2e]">
        {/* Streak Stat */}
        <div
          onClick={() => setActiveTab('profil')}
          className="flex items-center gap-2 font-brand font-bold text-sm text-[#ff9600] cursor-pointer hover:opacity-85 transition-opacity px-2 py-1 rounded-xl"
          title={`${stats.streak} Hari Streak`}
        >
          <svg className="w-5 h-5 fill-current animate-pulse text-[#ff9600]" viewBox="0 0 24 24">
            <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9 .69 0 1.35.08 2 .23C12.87 6.8 12.3 8.8 12.3 11c0 2.21 1.79 4 4 4 .65 0 1.26-.16 1.8-.44.59 1.14.9 2.45.9 3.84 0 2.51-1.03 4.8-2.7 6.43-1.12.75-2.45 1.17-3.9 1.17h-.4zM13.5 2.1c-.32 1.4-1.12 2.61-2.26 3.42-.51.36-.74.99-.57 1.58.17.6.72.99 1.33.99.39 0 .78-.11 1.12-.34 1.46-.99 2.47-2.55 2.76-4.32.06-.39-.14-.77-.49-.95-.36-.18-.79-.11-1.07.16l-.82.66z" />
          </svg>
          <span className="tracking-tight text-white font-extrabold">{stats.streak}</span>
        </div>

        {/* Gems Stat */}
        <div
          onClick={() => setActiveTab('toko')}
          className="flex items-center gap-2 font-brand font-bold text-sm text-[#38bdf8] cursor-pointer hover:opacity-85 transition-opacity px-2 py-1 rounded-xl"
          title={`${stats.gems} Gems Tersedia`}
        >
          <svg className="w-5 h-5 fill-current text-[#38bdf8]" viewBox="0 0 24 24">
            <path d="M6 3h12l4 6-10 12L2 9l4-6zm.85 2L4.2 8.5h4.65L7.5 5h-.65zm3.15 0l1.35 3.5h3.3L13.5 5H10zm4.5 0l-1.35 3.5h4.65L16.5 5h-2zm-7.65 5L12 17.5 7.15 10H6.85zm3.15 0l2 6.5 2-6.5h-4zm5.15 0L12 17.5 16.85 10h-.7z" />
          </svg>
          <span className="tracking-tight text-white font-extrabold">{stats.gems}</span>
        </div>

        {/* Hearts Stat */}
        <div
          onClick={handleHeartClick}
          className="flex items-center gap-2 font-brand font-bold text-sm text-[#ef4444] cursor-pointer hover:opacity-85 transition-opacity px-2 py-1 rounded-xl"
          title={`${stats.hearts}/${stats.maxHearts} Nyawa (Klik untuk isi ulang)`}
        >
          <svg className="w-5 h-5 fill-current text-[#ef4444]" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="tracking-tight text-white font-extrabold">{user.isPro ? '∞' : stats.hearts}</span>
        </div>
      </div>

      {/* Widget 1: Promo Snakeling Pro */}
      <article className="rounded-2xl border-2 border-[#3ecf8e]/80 bg-[#171717] p-4 shadow-[0_0_20px_rgba(62,207,142,0.15)] relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#3ecf8e]/10 border border-[#3ecf8e]/80 text-[#3ecf8e] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </span>
            <span className="text-xs font-brand font-black uppercase tracking-wider text-[#3ecf8e]">
              SNAKELING PRO
            </span>
          </div>
          <span className="text-[10px] font-brand font-extrabold px-2 py-0.5 rounded-full bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/80 uppercase">
            PRO
          </span>
        </div>

        <h3 className="font-brand font-extrabold text-base text-white tracking-tight mb-2">
          Tingkatkan Skill Coding Lebih Cepat
        </h3>

        <ul className="space-y-2 mb-4 text-xs font-medium text-[#b4b4b4]">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#3ecf8e] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span><strong className="text-white font-bold">Bebas Iklan:</strong> Belajar tanpa gangguan</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#3ecf8e] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span><strong className="text-white font-bold">Latihan Khusus:</strong> Review &amp; modul adaptif</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#3ecf8e] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span><strong className="text-white font-bold">Nyawa Tak Terbatas:</strong> Latihan tanpa henti</span>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            setShowProModal(true);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] active:translate-y-1 font-brand font-black text-xs uppercase tracking-wider text-[#0e0e0e] shadow-[0_4px_0_#1b6343] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{user.isPro ? 'STATUS PRO AKTIF' : 'COBA 2 MINGGU GRATIS'}</span>
        </button>
      </article>

      {/* Widget 2: Buka Papan Skor! */}
      <article
        onClick={() => {
          playSound('click');
          setActiveTab('papan_skor');
        }}
        className="rounded-2xl border-2 border-[#2e2e2e] bg-[#171717] p-4 cursor-pointer hover:border-[#393939] transition-colors"
      >
        <h2 className="font-brand font-extrabold text-base text-white mb-3">
          Buka Papan Skor!
        </h2>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-14 rounded-xl bg-[#242424] border border-[#393939] flex items-center justify-center shrink-0 text-[#b4b4b4]">
            <svg className="w-7 h-7 fill-current opacity-70" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.66 0 3 1.34 3 3v1h1v5H8v-5h1v-1c0-1.66 1.34-3 3-3zm0 2c-.55 0-1 .45-1 1v1h2v-1c0-.55-.45-1-1-1z" />
            </svg>
          </div>
          <p className="text-xs text-[#b4b4b4] leading-relaxed font-medium">
            {stats.completedLessons.length >= 2
              ? `Kamu berada di peringkat kompetisi dengan ${stats.xp} XP!`
              : 'Selesaikan 2 pelajaran lagi untuk mulai berkompetisi'}
          </p>
        </div>
      </article>

      {/* Footer Links */}
      <footer className="pt-2 px-1 text-[11px] font-brand font-bold text-[#898989]/80 uppercase tracking-wider leading-relaxed">
        <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center lg:justify-start">
          <button onClick={() => setActiveTab('belajar')} className="hover:text-[#b4b4b4] transition-colors">TENTANG</button>
          <button onClick={() => setActiveTab('toko')} className="hover:text-[#b4b4b4] transition-colors">TOKO</button>
          <button onClick={() => setActiveTab('belajar')} className="hover:text-[#b4b4b4] transition-colors">EFIKASI</button>
          <button onClick={() => setActiveTab('belajar')} className="hover:text-[#b4b4b4] transition-colors">KARIER</button>
          <button onClick={() => setActiveTab('belajar')} className="hover:text-[#b4b4b4] transition-colors">INVESTOR</button>
          <button onClick={() => setActiveTab('belajar')} className="hover:text-[#b4b4b4] transition-colors">KETENTUAN</button>
          <button onClick={() => setActiveTab('belajar')} className="hover:text-[#b4b4b4] transition-colors">PRIVASI</button>
        </div>
        <div className="mt-2 text-center lg:text-left text-[10px] text-[#898989]/50 lowercase">
          © 2025 snakeling inc. obsidian phosphor edition
        </div>
      </footer>
    </aside>
  );
};
