import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Medal, Award, Zap, Trophy, Lock, ArrowRight, Sparkles, RotateCw, Database, Users } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, user, stats, setActiveTab, setSelectedLessonId, setIsLessonActive, playSound, refreshLeaderboard } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isUnlocked = stats.completedLessons.length >= 2;
  const completedCount = stats.completedLessons.length;
  const remainingCount = Math.max(0, 2 - completedCount);

  const handleStartLesson = () => {
    playSound('click');
    setActiveTab('belajar');
    setIsLessonActive(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLeaderboard();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // LOCKED STATE (Less than 2 lessons completed)
  if (!isUnlocked) {
    return (
      <section className="flex-1 w-full lg:max-w-[640px] xl:max-w-[680px] mx-auto flex flex-col items-center justify-center py-8 px-4 select-none" aria-label="Papan Skor Terkunci">
        <div className="w-full max-w-[500px] mx-auto flex flex-col items-center">
          {/* Main Locked Card */}
          <div className="w-full bg-[#171717] border-2 border-[#2e2e2e] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#facc15]/25 via-[#eab308]/10 to-transparent border border-[#facc15]/40 flex items-center justify-center text-[#facc15] shadow-[0_0_30px_rgba(250,204,21,0.25)]">
              <Trophy className="w-10 h-10 stroke-[2.2] fill-[#facc15]/20" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#121212] border-2 border-[#facc15] flex items-center justify-center text-[#facc15] shadow-md">
                <Lock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-brand font-extrabold text-2xl text-white tracking-wide">
                Buka Papan Skor All-Time!
              </h1>
              <p className="text-sm text-[#b4b4b4] leading-relaxed max-w-sm mx-auto">
                Selesaikan <strong className="text-white font-bold">{remainingCount} pelajaran lagi</strong> ({completedCount}/2 diselesaikan) untuk membuka Papan Skor dan mulai berkompetisi dengan seluruh akun yang pernah dibuat!
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="bg-[#1c1b1b] border border-[#2e2e2e] rounded-2xl p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs font-brand font-bold">
                <span className="text-[#898989] uppercase tracking-wider">Syarat Pembukaan</span>
                <span className="text-[#facc15]">{completedCount} / 2 Pelajaran</span>
              </div>
              <div className="w-full h-3 bg-[#242424] rounded-full overflow-hidden p-0.5 border border-[#333]">
                <div
                  className="h-full bg-gradient-to-r from-[#facc15] to-[#eab308] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.4)]"
                  style={{ width: `${Math.min(100, (completedCount / 2) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleStartLesson}
              className="tactile-btn-primary w-full py-4 rounded-xl font-brand font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>LANJUTKAN BELAJAR ({completedCount}/2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Locked Teaser Preview */}
          <div className="w-full mt-6 opacity-40 pointer-events-none relative blur-[1px] select-none">
            <div className="text-center mb-3">
              <span className="text-xs font-mono text-[#898989]">Pratinjau Papan Skor All-Time</span>
            </div>
            <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-3 space-y-2">
              {leaderboard.slice(0, 3).map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-[#202020]">
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-bold text-xs text-[#facc15]">#{item.rank}</span>
                    <span className="text-sm font-medium text-white">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#3ecf8e]">{item.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // UNLOCKED STATE (At least 2 lessons completed)
  return (
    <section className="flex-1 w-full lg:max-w-[640px] xl:max-w-[680px] mx-auto flex flex-col items-center" aria-label="Papan Skor Snakeling">
      <div className="w-full max-w-[560px] mx-auto flex flex-col pt-2 pb-12 px-2">
        {/* Header: Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#facc15]/25 via-[#eab308]/10 to-transparent border border-[#facc15]/40 flex items-center justify-center text-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.25)]">
            <Trophy className="w-6 h-6 stroke-[2.2] fill-[#facc15]/20" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="font-brand font-extrabold text-2xl text-white tracking-wide">
              Papan Skor All-Time
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] text-[#898989] hover:text-[#3ecf8e] transition-colors cursor-pointer"
              title="Segarkan Papan Skor dari Database"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#3ecf8e]' : ''}`} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-[#898989] mt-1 mb-3 max-w-md mx-auto leading-relaxed">
            Peringkat akumulasi XP seluruh akun terdaftar yang pernah dibuat
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18261e] border border-[#3ecf8e]/30 text-[11px] font-mono text-[#3ecf8e]">
            <Database className="w-3 h-3" />
            <span>Terhubung ke Database • {leaderboard.length} Akun Terdaftar</span>
          </div>
        </div>

        {/* Callout if only current user is registered */}
        {leaderboard.length === 1 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#1c1b1b] border border-[#2e2e2e] text-xs text-[#b4b4b4] flex items-center gap-3">
            <span className="text-lg">👑</span>
            <div className="flex-1">
              <strong className="text-white block mb-0.5">Kamu memimpin peringkat all-time!</strong>
              <span>Hanya akun yang pernah dibuat yang tampil di papan skor. Buat akun baru atau ajak teman belajar untuk bersaing secara langsung.</span>
            </div>
          </div>
        )}

        {/* Leaderboard Standings List */}
        {leaderboard.length === 0 ? (
          <div className="w-full bg-[#171717] border border-[#2e2e2e] rounded-2xl p-8 text-center space-y-3">
            <Users className="w-10 h-10 text-[#898989] mx-auto opacity-50" />
            <h3 className="font-brand font-bold text-base text-white">Belum Ada Akun Terdaftar</h3>
            <p className="text-xs text-[#898989] max-w-xs mx-auto">
              Akun yang pernah dibuat akan otomatis tampil di sini dan diperingkatkan berdasarkan perolehan XP all-time.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full bg-[#171717] border border-[#2e2e2e] rounded-2xl p-3 shadow-xl">
            {leaderboard.map((item) => {
            const isRank1 = item.rank === 1;
            const isRank2 = item.rank === 2;
            const isRank3 = item.rank === 3;

            return (
              <div
                key={item.name}
                className={`flex items-center justify-between py-3 px-3.5 rounded-xl transition-all border-b border-[#242424] last:border-b-0 ${
                  item.isCurrentUser
                    ? 'bg-[#18261e] border-2 border-[#3ecf8e]/60 shadow-[0_0_12px_rgba(62,207,142,0.2)]'
                    : isRank1
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
                      <span className={`text-xs ${item.isCurrentUser ? 'text-[#3ecf8e] font-extrabold' : 'text-[#898989]'}`}>
                        #{item.rank}
                      </span>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-full border overflow-hidden flex items-center justify-center text-sm font-bold shrink-0 ${
                    item.isCurrentUser
                      ? 'bg-[#3ecf8e]/20 border-[#3ecf8e] text-[#3ecf8e]'
                      : 'bg-[#242424] border-[#393939] text-[#fafafa]'
                  }`}>
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      item.initials
                    )}
                  </div>
                  <div>
                    <span className={`font-medium text-sm tracking-wide block ${
                      item.isCurrentUser ? 'text-[#3ecf8e] font-bold' : 'text-white'
                    }`}>
                      {item.name}
                    </span>
                    {item.isCurrentUser && (
                      <span className="text-[10px] text-[#898989] font-mono">
                        Peringkat Anda saat ini
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-brand font-bold text-xs text-[#3ecf8e]">
                  <Zap className="w-3.5 h-3.5 fill-current text-[#facc15]" />
                  <span>{item.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* User Fixed / Pinned Status Card */}
        <div className="mt-6 bg-[#18261e] border border-[#3ecf8e]/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <span className="w-6 text-center font-brand font-bold text-base text-[#3ecf8e]">
              #{leaderboard.find((l) => l.isCurrentUser)?.rank || 1}
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
