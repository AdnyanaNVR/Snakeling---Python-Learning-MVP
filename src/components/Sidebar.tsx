import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { BookOpen, Trophy, ShoppingBag, Settings } from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const { activeTab, setActiveTab, user, playSound } = useApp();

  const handleNavClick = (tab: ActiveTab) => {
    playSound('click');
    setActiveTab(tab);
  };

  const navItems = [
    {
      id: 'belajar' as ActiveTab,
      label: 'BELAJAR',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        </svg>
      )
    },
    {
      id: 'papan_skor' as ActiveTab,
      label: 'PAPAN SKOR',
      icon: (
        <svg className="w-6 h-6 fill-current text-[#facc15]" viewBox="0 0 24 24">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
      )
    },
    {
      id: 'toko' as ActiveTab,
      label: 'TOKO',
      icon: (
        <svg className="w-6 h-6 fill-current text-[#f43f5e]" viewBox="0 0 24 24">
          <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
        </svg>
      )
    },
    {
      id: 'profil' as ActiveTab,
      label: 'PROFIL',
      icon: (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3ecf8e] to-[#1f6b48] flex items-center justify-center ring-2 ring-[#2e2e2e] overflow-hidden shrink-0">
          <img
            src={user.avatarUrl}
            alt="Profil Mascot"
            className="w-full h-full object-cover scale-110"
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
            className="flex items-center gap-2.5 px-3 mb-8 group text-left w-full focus:outline-none"
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
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-brand font-bold text-sm tracking-wide transition-all text-left ${
                    isActive
                      ? 'bg-[#3ecf8e]/10 border-2 border-[#3ecf8e]/80 text-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.15)]'
                      : 'text-[#b4b4b4] hover:text-white hover:bg-[#1c1b1b] border-2 border-transparent'
                  }`}
                >
                  <span className="w-7 h-7 flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#898989] hover:text-[#fafafa] hover:bg-[#1c1b1b] font-brand font-semibold text-xs tracking-wider transition-colors uppercase text-left"
          >
            <Settings className="w-4 h-4" />
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
