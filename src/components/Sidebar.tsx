import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { Terminal, Trophy, ShoppingBag, SlidersHorizontal, Lock } from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const { activeTab, setActiveTab, user, stats, playSound } = useApp();

  const isLeaderboardUnlocked = stats.completedLessons.length >= 2;

  const handleNavClick = (tab: ActiveTab) => {
    playSound('click');
    setActiveTab(tab);
  };

  const navItems = [
    {
      id: 'belajar' as ActiveTab,
      label: 'BELAJAR',
      icon: <Terminal className="w-6 h-6 stroke-[2.2] text-[#3ecf8e]" />
    },
    {
      id: 'papan_skor' as ActiveTab,
      label: 'PAPAN SKOR',
      icon: <Trophy className="w-6 h-6 stroke-[2.2] text-[#facc15]" />,
      isLocked: !isLeaderboardUnlocked
    },
    {
      id: 'toko' as ActiveTab,
      label: 'TOKO',
      icon: <ShoppingBag className="w-6 h-6 stroke-[2.2] text-[#f43f5e]" />
    },
    {
      id: 'profil' as ActiveTab,
      label: 'PROFIL',
      icon: (
        <div className="w-6 h-6 rounded-full overflow-hidden border border-[#38bdf8]/60">
          <img
            src={user.avatarUrl}
            alt="Profil Mascot"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )
    }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (>= 1024px) */}
      <aside
        className="hidden lg:flex w-[250px] xl:w-[270px] h-screen sticky top-0 shrink-0 border-r border-[#2e2e2e] bg-[#121212] flex-col justify-between py-6 px-4 z-40"
        aria-label="Sidebar Menu"
      >
        <div>
          {/* Brand Wordmark */}
          <button
            onClick={() => handleNavClick('belajar')}
            className="flex items-center px-3 mb-8 group text-left w-full focus:outline-none cursor-pointer"
            aria-label="Snakeling Home"
          >
            <span className="font-brand font-extrabold text-2xl tracking-tight text-[#fafafa] group-hover:text-[#3ecf8e] transition-colors">
              snakeling
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Menu Utama">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-brand font-bold text-sm tracking-wide transition-all text-left ${
                    isActive
                      ? 'bg-[#3ecf8e]/10 border-2 border-[#3ecf8e]/80 text-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.15)]'
                      : 'text-[#b4b4b4] hover:text-white hover:bg-[#1c1b1b] border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 flex items-center justify-center shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.isLocked && (
                    <span title="Terkunci - Selesaikan 2 Pelajaran">
                      <Lock className="w-3.5 h-3.5 text-[#898989] shrink-0" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings Button */}
        <div className="pt-4 border-t border-[#242424]">
          <button
            onClick={() => {
              playSound('click');
              onOpenSettings();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#898989] hover:text-[#fafafa] hover:bg-[#1c1b1b] font-brand font-semibold text-xs tracking-wider transition-colors uppercase text-left group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1f1f1f] border border-[#333] flex items-center justify-center text-[#898989] group-hover:text-[#3ecf8e] group-hover:border-[#3ecf8e]/50 transition-all">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <span>PENGATURAN</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (< 1024px) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-t border-[#2e2e2e] px-4 py-2 flex items-center justify-around shadow-2xl"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
        aria-label="Navigasi Bawah Mobile"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#3ecf8e] font-bold'
                  : 'text-[#898989] hover:text-white font-medium'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center mb-1">
                {item.id === 'profil' ? (
                  <div className={`w-6 h-6 rounded-full overflow-hidden ring-1 ${isActive ? 'ring-[#3ecf8e]' : 'ring-[#393939]'}`}>
                    <img
                      src={user.avatarUrl}
                      alt="Profil"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  item.icon
                )}
              </div>
              <span className="text-[10px] tracking-wider uppercase font-brand">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
