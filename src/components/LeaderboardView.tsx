import React from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Medal, Award, Zap, Trophy, Sparkles } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, user, stats } = useApp();

  return (
    <section className="flex-1 max-w-[560px] mx-auto lg:mx-0 w-full flex flex-col items-center" aria-label="Papan Skor Snakeling">
      <div className="w-full max-w-[560px] mx-auto flex flex-col pt-2 pb-12 px-2">
        {/* Header: Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#facc15]/25 via-[#eab308]/10 to-transparent border border-[#facc15]/40 flex items-center justify-center text-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.25)]">
            <Trophy className="w-6 h-6 stroke-[2.2] fill-[#facc15]/20" />
          </div>
          <h1 className="font-brand font-extrabold text-2xl text-white tracking-wide">
            Papan Skor Liga
          </h1>
          <p className="text-sm text-[#898989] mt-1.5 mb-6 max-w-md mx-auto leading-relaxed">
            Peringkat dan perolehan XP pembelajar Python teratas minggu ini
          </p>
        </div>

        {/* Leaderboard Standings List */}
        <div className="flex flex-col gap-1 w-full bg-[#171717] border border-[#2e2e2e] rounded-2xl p-3 shadow-xl">
          {leaderboard.map((item) => {
            const isRank1 = item.rank === 1;
            const isRank2 = item.rank === 2;
            const isRank3 = item.rank === 3;

            return (
              <div
                key={item.name}
                className={`flex items-center justify-between py-3 px-3.5 rounded-xl transition-all border-b border-[#242424] last:border-b-0 ${
                  isRank1
                    ? 'bg-[#facc15]/5 hover:bg-[#facc15]/10'
                    : 'hover:bg-[#202020]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 flex items-center justify-center shrink-0 font-brand font-extrabold text-sm">
                    {isRank1 ? (
                      <span className="w-6 h-6 rounded-lg bg-[#facc15]/20 border border-[#facc15]/50 text-[#facc15] flex items-center justify-center shadow-[0_0_8px_rgba(250,204,21,0.4)]">
                        <Crown className="w-3.5 h-3.5 fill-[#facc15]" />
                      </span>
                    ) : isRank2 ? (
                      <span className="w-6 h-6 rounded-lg bg-slate-400/20 border border-slate-300/40 text-slate-200 flex items-center justify-center">
                        <Medal className="w-3.5 h-3.5 fill-slate-300" />
                      </span>
                    ) : isRank3 ? (
                      <span className="w-6 h-6 rounded-lg bg-amber-700/20 border border-amber-600/40 text-amber-500 flex items-center justify-center">
                        <Award className="w-3.5 h-3.5 fill-amber-600" />
                      </span>
                    ) : (
                      <span className="text-[#898989] text-xs">{item.rank}</span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#242424] border border-[#393939] flex items-center justify-center text-sm font-bold text-[#fafafa] shrink-0">
                    {item.initials}
                  </div>
                  <span className="font-medium text-sm text-white tracking-wide">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-brand font-bold text-xs text-[#3ecf8e]">
                  <Zap className="w-3.5 h-3.5 fill-current text-[#facc15]" />
                  <span>{item.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Fixed / Pinned Status Card */}
        <div className="mt-6 bg-[#18261e] border border-[#3ecf8e]/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <span className="w-6 text-center font-brand font-bold text-base text-[#898989]">
              {stats.xp > 0 ? '#' + (leaderboard.filter(l => l.xp > stats.xp).length + 1) : '-'}
            </span>
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#242424] border-2 border-[#3ecf8e] shrink-0 flex items-center justify-center">
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-brand font-bold text-base text-white tracking-wide block">
                {user.displayName}
              </span>
              <span className="text-[11px] text-[#3ecf8e] font-mono">
                @{user.username}
              </span>
            </div>
          </div>
          <span className="font-brand font-bold text-sm text-[#3ecf8e]">
            {stats.xp} XP
          </span>
        </div>
      </div>
    </section>
  );
};
