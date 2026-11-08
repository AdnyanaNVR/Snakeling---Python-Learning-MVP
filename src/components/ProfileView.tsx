import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Check,
  Flame,
  Zap,
  CheckCircle,
  Calendar as CalendarIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  BookOpen
} from 'lucide-react';
import { SnakelingMascot } from './SnakelingMascot';

interface ProfileViewProps {
  onOpenSettings: () => void;
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenSettings }) => {
  const { user, stats, playSound, setActiveTab } = useApp();

  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  const handlePrevMonth = () => {
    playSound('click');
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    playSound('click');
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleGoToToday = () => {
    playSound('click');
    setViewDate(new Date());
    setSelectedDateStr(todayStr);
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  interface CalendarCell {
    day: number;
    month: number;
    year: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasStreak: boolean;
  }

  const cells: CalendarCell[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      day,
      month: prevMonthIdx,
      year: prevYear,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      hasStreak: stats.activityDates.includes(dateStr)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      day,
      month: currentMonth,
      year: currentYear,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      hasStreak: stats.activityDates.includes(dateStr)
    });
  }

  // Next month leading days to complete week rows
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      day,
      month: nextMonthIdx,
      year: nextYear,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      hasStreak: stats.activityDates.includes(dateStr)
    });
  }

  // Split into weeks of 7 days
  const calendarRows: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    calendarRows.push(cells.slice(i, i + 7));
  }

  const isTodayActive = stats.activityDates.includes(todayStr);

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
              <CalendarIcon className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span>{user.joinedDate}</span>
            </span>
            <span className="text-[#393939]">•</span>
            <span className="text-[#3ecf8e] font-mono font-medium">
              ID: {user.userCode}
            </span>
          </div>
        </div>
      </div>

      {/* Stats 3-Box Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Streak Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#ff9600]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider">
              STREAK HARIAN
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff9600]/25 to-[#ff9600]/5 border border-[#ff9600]/40 text-[#ff9600] flex items-center justify-center shadow-[0_0_12px_rgba(255,150,0,0.25)]">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-brand font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{stats.streak} Hari</span>
              {isTodayActive && (
                <span className="text-[10px] font-brand px-2 py-0.5 rounded-full bg-[#ff9600]/20 text-[#ff9600] border border-[#ff9600]/40 font-bold">
                  AKTIF
                </span>
              )}
            </h3>
            <p className="text-[11px] text-[#898989] mt-0.5">
              {isTodayActive ? 'Target hari ini tercapai!' : 'Latihan hari ini untuk menjaga streak'}
            </p>
          </div>
        </div>

        {/* Total XP Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#3ecf8e]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider">
              TOTAL XP
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3ecf8e]/25 to-[#3ecf8e]/5 border border-[#3ecf8e]/40 text-[#3ecf8e] flex items-center justify-center shadow-[0_0_12px_rgba(62,207,142,0.25)]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-brand font-extrabold text-white tracking-tight">
              {stats.xp} XP
            </h3>
            <p className="text-[11px] text-[#898989] mt-0.5">
              Tingkat kemahiran kode Python
            </p>
          </div>
        </div>

        {/* Modules Completed Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#38bdf8]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider">
              MODUL SELESAI
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38bdf8]/25 to-[#38bdf8]/5 border border-[#38bdf8]/40 text-[#38bdf8] flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <CheckCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-brand font-extrabold text-white tracking-tight">
              {stats.completedLessons.length} Pelajaran
            </h3>
            <p className="text-[11px] text-[#898989] mt-0.5">
              Dari 11 langkah dasar Unit 1
            </p>
          </div>
        </div>
      </div>

      {/* Activity & Streak Calendar Heatmap (REAL DYNAMIC CALENDAR) */}
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#242424]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3ecf8e]/15 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-brand font-bold text-base text-white tracking-wide">
                Riwayat Aktivitas &amp; Kalender Streak
              </h2>
              <p className="text-xs text-[#898989]">
                Merekam setiap hari Anda menyelesaikan misi pemrograman Python
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-[#898989] shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#1c1b1b] border border-[#2e2e2e]" />
              <span>Tidak Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#3ecf8e] text-[#0e0e0e] flex items-center justify-center">
                <Flame className="w-2.5 h-2.5 fill-current" />
              </div>
              <span className="text-[#3ecf8e] font-semibold">Streak Aktif</span>
            </div>
          </div>
        </div>

        {/* Month Navigation & Controls */}
        <div className="flex items-center justify-between bg-[#151515] p-3 rounded-2xl border border-[#262626]">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-[#202020] hover:bg-[#2a2a2a] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer border border-[#2e2e2e]"
              aria-label="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-brand font-black text-base sm:text-lg text-white px-2">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-[#202020] hover:bg-[#2a2a2a] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer border border-[#2e2e2e]"
              aria-label="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGoToToday}
              className="px-3.5 py-1.5 rounded-xl bg-[#242424] hover:bg-[#2e2e2e] text-xs font-brand font-bold text-white border border-[#393939] transition-all cursor-pointer"
            >
              Hari Ini
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="w-full space-y-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[11px] font-brand font-bold text-[#898989] uppercase tracking-wider py-1">
            <span className="text-[#ef4444]">MIN</span>
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
                  const isDimmed = !cell.isCurrentMonth;
                  const isToday = cell.isToday;
                  const isSelected = selectedDateStr === cell.dateStr;

                  return (
                    <button
                      type="button"
                      key={cIdx}
                      onClick={() => {
                        playSound('click');
                        setSelectedDateStr(cell.dateStr);
                      }}
                      className={`h-11 sm:h-12 rounded-xl border flex flex-col items-center justify-center font-brand text-xs font-semibold transition-all relative cursor-pointer select-none ${
                        isStreakDay
                          ? 'bg-[#3ecf8e] border-[#3ecf8e] text-[#0e0e0e] shadow-[0_0_12px_rgba(62,207,142,0.35)] font-black hover:brightness-110'
                          : isDimmed
                          ? 'bg-[#121212]/50 border-[#1c1c1c] text-[#444444] hover:text-[#777777]'
                          : isToday
                          ? 'bg-[#1f2922] border-[#3ecf8e]/80 text-[#fafafa] shadow-[0_0_8px_rgba(62,207,142,0.2)]'
                          : 'bg-[#1a1a1a] border-[#292929] text-[#b4b4b4] hover:bg-[#242424] hover:text-white'
                      } ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#171717] scale-105 z-10' : ''}`}
                    >
                      <span className="flex items-center gap-1">
                        {cell.day}
                        {isStreakDay && <Flame className="w-3.5 h-3.5 fill-current shrink-0" />}
                      </span>
                      {isToday && !isStreakDay && (
                        <span className="text-[9px] font-mono text-[#3ecf8e] -mt-0.5 leading-tight">
                          Hari ini
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Inspector Banner */}
        {selectedDateStr && (
          <div className="p-4 rounded-2xl bg-[#1d1d1d] border border-[#333333] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-brand font-bold text-[#b4b4b4] uppercase tracking-wider block">
                Detail Tanggal: {selectedDateStr}
              </span>
              <p className="text-sm font-medium text-white flex items-center gap-2">
                {stats.activityDates.includes(selectedDateStr) ? (
                  <>
                    <Flame className="w-4 h-4 text-[#ff9600] fill-[#ff9600]" />
                    <span className="text-[#3ecf8e] font-bold">
                      Aktivitas Tercatat: Menyelesaikan latihan modul Python!
                    </span>
                  </>
                ) : (
                  <span className="text-[#898989]">
                    Tidak ada catatan aktivitas belajar pada tanggal ini.
                  </span>
                )}
              </p>
            </div>
            {!stats.activityDates.includes(selectedDateStr) && selectedDateStr === todayStr && (
              <button
                onClick={() => {
                  playSound('click');
                  setActiveTab('belajar');
                }}
                className="tactile-btn-primary px-4 py-2 rounded-xl font-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Belajar Hari Ini</span>
              </button>
            )}
          </div>
        )}

        {/* Streak Protection Status Info */}
        <div className="p-4 rounded-2xl bg-[#141d18] border border-[#3ecf8e]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3ecf8e]/20 border border-[#3ecf8e]/40 flex items-center justify-center text-[#3ecf8e] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Perlindungan Streak Freeze
              </h4>
              <p className="text-xs text-[#898989]">
                Tersedia {stats.streakFreezeCount}/2 pelindung streak aktif.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('toko');
            }}
            className="text-xs font-brand font-bold text-[#3ecf8e] hover:underline cursor-pointer uppercase"
          >
            Beli di Toko &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
