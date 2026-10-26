import React from 'react';
import { useApp } from '../context/AppContext';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, user, stats } = useApp();

  return (
    <section className="flex-1 max-w-[560px] mx-auto lg:mx-0 w-full flex flex-col items-center" aria-label="Papan Skor Snakeling">
      <div className="w-full max-w-[560px] mx-auto flex flex-col pt-2 pb-12 px-2">
        {/* Header: Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="font-brand font-extrabold text-2xl text-white tracking-wide">
            Papan Skor
          </h1>
          <p className="text-sm text-[#898989] mt-2 mb-6 max-w-md mx-auto leading-relaxed">
            Lihat peringkat dan perolehan XP pembelajar Python teratas selama ini
          </p>
        </div>

        {/* Leaderboard Standings List */}
        <div className="flex flex-col gap-1 w-full bg-[#171717] border border-[#2e2e2e] rounded-2xl p-3 shadow-xl">
          {leaderboard.map((item) => {
            const isRank1 = item.rank === 1;
            const isRank2 = item.rank === 2;
            const isRank3 = item.rank === 3;

            const rankColor = isRank1
              ? 'text-[#facc15]'
              : isRank2
              ? 'text-[#b4b4b4]'
              : isRank3
              ? 'text-[#ea580c]'
              : 'text-[#898989]';

            const xpColor = isRank1
              ? 'text-[#3ecf8e]'
              : isRank2 || isRank3
              ? 'text-[#b4b4b4]'
              : 'text-[#898989]';

            return (
              <div
                key={item.name}
                className="flex items-center justify-between py-3 px-3.5 rounded-xl hover:bg-[#202020] transition-colors border-b border-[#242424] last:border-b-0"
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-6 text-center font-brand font-extrabold text-sm ${rankColor}`}>
                    {item.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#242424] border border-[#393939] flex items-center justify-center text-sm font-bold text-[#fafafa] shrink-0">
                    {item.initials}
                  </div>
                  <span className="font-medium text-sm text-white tracking-wide">
                    {item.name}
                  </span>
                </div>
                <span className={`font-brand font-bold text-xs ${xpColor}`}>
                  {item.xp} XP
                </span>
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
