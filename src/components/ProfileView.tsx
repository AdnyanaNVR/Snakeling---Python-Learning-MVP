import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Flame, Zap, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { SnakelingMascot } from './SnakelingMascot';

interface ProfileViewProps {
  onOpenSettings: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenSettings }) => {
  const { user, stats, playSound } = useApp();

  // Days in February 2025
  const calendarRows = [
    [
      { day: 26, isPrevMonth: true, active: false },
      { day: 27, isPrevMonth: true, active: false },
      { day: 28, isPrevMonth: true, active: false },
      { day: 29, isPrevMonth: true, active: false },
      { day: 30, isPrevMonth: true, active: false },
      { day: 31, isPrevMonth: true, active: false },
      { day: 1, isPrevMonth: false, active: false }
    ],
    [
      { day: 2, isPrevMonth: false, active: false },
      { day: 3, isPrevMonth: false, active: false },
      { day: 4, isPrevMonth: false, active: false },
      { day: 5, isPrevMonth: false, active: false },
      { day: 6, isPrevMonth: false, active: false },
      { day: 7, isPrevMonth: false, active: false },
      { day: 8, isPrevMonth: false, active: false }
    ],
    [
      { day: 9, isPrevMonth: false, active: false },
      { day: 10, isPrevMonth: false, active: false },
      { day: 11, isPrevMonth: false, active: false },
      { day: 12, isPrevMonth: false, active: false },
      { day: 13, isPrevMonth: false, active: false },
      { day: 14, isPrevMonth: false, active: false },
      { day: 15, isPrevMonth: false, active: false }
    ],
    [
      { day: 16, isPrevMonth: false, active: false },
      { day: 17, isPrevMonth: false, active: false },
      { day: 18, isPrevMonth: false, active: false },
      { day: 19, isPrevMonth: false, active: false },
      { day: 20, isPrevMonth: false, active: false },
      { day: 21, isPrevMonth: false, active: false },
      { day: 22, isPrevMonth: false, active: false }
    ],
    [
      { day: 23, isPrevMonth: false, active: false },
      { day: 24, isPrevMonth: false, active: false },
      { day: 25, isPrevMonth: false, active: false },
      { day: 26, isPrevMonth: false, active: false },
      { day: 27, isPrevMonth: false, active: true, hasStreak: true },
      { day: 28, isPrevMonth: false, active: false },
      { day: 1, isNextMonth: true, active: false }
    ]
  ];

  return (
    <section className="flex-1 max-w-[760px] px-4 sm:px-6 py-6 mx-auto space-y-6" aria-label="Profil Pengguna">
      {/* Top Profile Card */}
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl">
        {/* Avatar with Verified Badge */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1c1b1b] border-2 border-[#3ecf8e] p-1 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(62,207,142,0.2)]">
            <SnakelingMascot
              mood="happy"
              size="md"
              equippedCosmetics={stats.equippedCosmetics}
              className="scale-110"
            />
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#3ecf8e] text-[#0e0e0e] flex items-center justify-center ring-2 ring-[#171717]">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-brand font-extrabold text-white tracking-tight">
                {user.displayName}
              </h1>
              <p className="text-sm font-mono text-[#898989]">
                @{user.username}
              </p>
            </div>
            {user.isPro && (
              <span className="self-center sm:self-start px-3 py-1 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e] text-xs font-brand font-bold text-[#3ecf8e] uppercase tracking-wider">
                PRO MEMBER
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#898989] pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{user.joinedDate}</span>
            </span>
            <span>·</span>
            <span className="font-mono text-[#3ecf8e]">
              ID: #{user.userCode}
            </span>
          </div>
        </div>
      </div>

      {/* Stats 3-Box Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Streak Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider">
              STREAK HARIAN
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#242424] text-[#ff9600] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-brand font-extrabold text-white tracking-tight">
              {stats.streak} Hari
            </h3>
            <p className="text-xs text-[#898989] mt-0.5">Konsistensi aktif</p>
          </div>
        </div>

        {/* Total XP Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider">
              TOTAL XP
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#242424] text-[#3ecf8e] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-brand font-extrabold text-white tracking-tight">
              {stats.xp} XP
            </h3>
            <p className="text-xs text-[#898989] mt-0.5">Level 2 Calon Coder</p>
          </div>
        </div>

        {/* Modules Completed Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider">
              PELAJARAN
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#242424] text-[#38bdf8] flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-brand font-extrabold text-white tracking-tight">
              {stats.modulesCompleted} Modul
            </h3>
            <p className="text-xs text-[#898989] mt-0.5">Syntax, Variables</p>
          </div>
        </div>
      </div>

      {/* Activity & Streak Calendar Heatmap */}
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3ecf8e]" />
            <h2 className="font-brand font-bold text-base text-white tracking-wide">
              Riwayat Aktivitas &amp; Streak
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#898989]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#242424] border border-[#333333]" />
              <span>Tidak Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#3ecf8e]" />
              <span>Aktif Belajar</span>
            </div>
          </div>
        </div>

        {/* Month Header and Streak Badge */}
        <div className="flex items-center justify-between">
          <h3 className="font-brand font-extrabold text-base text-white">
            Februari 2025
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#3ecf8e] font-brand font-bold">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span>Hari ini aktif (1 hari streak)</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="w-full space-y-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider py-1">
            <span>MIN</span>
            <span>SEN</span>
            <span>SEL</span>
            <span>RAB</span>
            <span>KAM</span>
            <span>JUM</span>
            <span>SAB</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="space-y-1.5 sm:space-y-2">
            {calendarRows.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {week.map((cell, cIdx) => {
                  const isStreakDay = cell.hasStreak;
                  const isDimmed = cell.isPrevMonth || cell.isNextMonth;

                  return (
                    <div
                      key={cIdx}
                      className={`h-11 sm:h-12 rounded-xl border flex items-center justify-center font-brand text-xs font-semibold transition-all relative ${
                        isStreakDay
                          ? 'bg-[#3ecf8e] border-[#3ecf8e] text-[#0e0e0e] shadow-[0_0_15px_rgba(62,207,142,0.4)] font-black'
                          : isDimmed
                          ? 'bg-[#141414] border-[#1e1e1e] text-[#444444]'
                          : 'bg-[#1c1b1b] border-[#292929] text-[#b4b4b4] hover:bg-[#242424] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {cell.day}
                        {isStreakDay && <Flame className="w-3.5 h-3.5 fill-current" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
