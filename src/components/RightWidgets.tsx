import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Gem, Heart, Crown, Trophy, CheckCircle2, Sparkles, Zap } from 'lucide-react';

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
      className="w-full lg:w-[330px] xl:w-[360px] shrink-0 h-full overflow-y-auto pr-1 flex flex-col gap-5 pt-1 [scrollbar-width:none]"
      aria-label="Statistik dan Widget"
    >
      {/* Top Stats Row */}
      <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#171717] border border-[#2e2e2e] shadow-sm">
        {/* Streak Stat */}
        <div
          onClick={() => setActiveTab('profil')}
          className="flex items-center gap-2.5 font-brand font-bold text-sm text-[#ff9600] cursor-pointer hover:opacity-90 transition-opacity px-2.5 py-1.5 rounded-xl hover:bg-[#201c16]"
          title={`${stats.streak} Hari Streak`}
        >
          <div className="relative flex items-center justify-center">
            <Flame className="w-5 h-5 text-[#ff9600] fill-[#ff9600]" />
          </div>
          <span className="tracking-tight text-white font-extrabold">{stats.streak}</span>
        </div>

        {/* Gems Stat */}
        <div
          onClick={() => setActiveTab('toko')}
          className="flex items-center gap-2.5 font-brand font-bold text-sm text-[#38bdf8] cursor-pointer hover:opacity-90 transition-opacity px-2.5 py-1.5 rounded-xl hover:bg-[#162025]"
          title={`${stats.gems} Gems Tersedia`}
        >
          <div className="relative flex items-center justify-center">
            <Gem className="w-5 h-5 text-[#38bdf8] fill-[#38bdf8]/20" />
          </div>
          <span className="tracking-tight text-white font-extrabold">{stats.gems}</span>
        </div>

        {/* Hearts Stat */}
        <div
          onClick={handleHeartClick}
          className="flex items-center gap-2.5 font-brand font-bold text-sm text-[#ef4444] cursor-pointer hover:opacity-90 transition-opacity px-2.5 py-1.5 rounded-xl hover:bg-[#251717]"
          title={`${stats.hearts}/${stats.maxHearts} Nyawa (Klik untuk isi ulang)`}
        >
          <div className="relative flex items-center justify-center">
            <Heart className="w-5 h-5 text-[#ef4444] fill-[#ef4444]" />
          </div>
          <span className="tracking-tight text-white font-extrabold">{user.isPro ? '∞' : stats.hearts}</span>
        </div>
      </div>

      {/* Widget 1: Promo Snakeling Pro */}
      <article className="rounded-2xl border-2 border-[#3ecf8e]/80 bg-[#171717] p-4 shadow-[0_0_20px_rgba(62,207,142,0.15)] relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#3ecf8e]/25 to-[#10b981]/10 border border-[#3ecf8e]/60 text-[#3ecf8e] flex items-center justify-center shadow-[0_0_10px_rgba(62,207,142,0.3)]">
              <Crown className="w-4 h-4 stroke-[2.2] fill-[#3ecf8e]/20" />
            </span>
            <span className="text-xs font-brand font-black uppercase tracking-wider text-[#3ecf8e]">
              SNAKELING PRO
            </span>
          </div>
          <span className="text-[10px] font-brand font-extrabold px-2.5 py-0.5 rounded-full bg-[#3ecf8e]/15 text-[#3ecf8e] border border-[#3ecf8e]/80 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            PRO
          </span>
        </div>

        <h3 className="font-brand font-extrabold text-base text-white tracking-tight mb-2">
          Tingkatkan Skill Coding Lebih Cepat
        </h3>

        <ul className="space-y-2 mb-4 text-xs font-medium text-[#b4b4b4]">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#3ecf8e] shrink-0" />
            <span><strong className="text-white font-bold">Bebas Iklan:</strong> Belajar tanpa gangguan</span>
          </li>
          <li className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[#facc15] shrink-0 fill-[#facc15]/30" />
            <span><strong className="text-white font-bold">Latihan Khusus:</strong> Review &amp; modul adaptif</span>
          </li>
          <li className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-[#ef4444] shrink-0 fill-[#ef4444]/40" />
            <span><strong className="text-white font-bold">Nyawa Tak Terbatas:</strong> Latihan tanpa henti</span>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            setShowProModal(true);
          }}
          className="tactile-btn-primary w-full py-2.5 px-4 rounded-xl font-brand font-black text-xs uppercase tracking-wider text-[#0e0e0e] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Crown className="w-4 h-4 stroke-[2.5]" />
          <span>{user.isPro ? 'STATUS PRO AKTIF' : 'COBA 2 MINGGU GRATIS'}</span>
        </button>
      </article>

      {/* Widget 2: Buka Papan Skor! */}
      <article
        onClick={() => {
          playSound('click');
          setActiveTab('papan_skor');
        }}
        className="rounded-2xl border-2 border-[#2e2e2e] bg-[#171717] p-4 cursor-pointer hover:border-[#facc15]/60 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] transition-all group"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-brand font-extrabold text-base text-white group-hover:text-[#facc15] transition-colors">
            Buka Papan Skor!
          </h2>
          <Trophy className="w-4 h-4 text-[#facc15] opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-14 rounded-2xl bg-gradient-to-br from-[#facc15]/20 to-[#ca8a04]/5 border border-[#facc15]/30 flex items-center justify-center shrink-0 text-[#facc15] shadow-[0_0_12px_rgba(250,204,21,0.2)]">
            <Trophy className="w-6 h-6 stroke-[2.2] fill-[#facc15]/20" />
          </div>
          <p className="text-xs text-[#b4b4b4] leading-relaxed font-medium">
            {stats.completedLessons.length >= 2
              ? `Kamu berada di peringkat kompetisi dengan ${stats.xp} XP!`
              : 'Selesaikan 2 pelajaran lagi untuk mulai berkompetisi'}
          </p>
        </div>
      </article>
    </aside>
  );
};
