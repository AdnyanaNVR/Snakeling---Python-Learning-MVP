import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_SHOP_ITEMS } from '../data/curriculum';
import { ShopItem } from '../types';
import { Shield, Heart, Zap, Sparkles, Glasses, Star, Gem, Flame } from 'lucide-react';
import { SnakelingMascot } from './SnakelingMascot';

export const ShopView: React.FC = () => {
  const { stats, purchaseShopItem, equipCosmetic } = useApp();

  const powerUps = INITIAL_SHOP_ITEMS.filter((i) => i.category === 'powerup');
  const cosmetics = INITIAL_SHOP_ITEMS.filter((i) => i.category === 'cosmetic');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield_flame':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8]/20 via-[#0284c7]/10 to-transparent border border-[#38bdf8]/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Shield className="w-7 h-7 text-[#38bdf8] stroke-[2]" />
            <Flame className="w-4 h-4 text-[#ff9600] fill-[#ff9600] absolute bottom-1 right-1 drop-shadow-[0_0_6px_rgba(255,150,0,0.8)]" />
          </div>
        );
      case 'heart':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#ef4444]/25 via-[#b91c1c]/10 to-transparent border border-[#ef4444]/40 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <Heart className="w-7 h-7 fill-[#ef4444] text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <Sparkles className="w-3 h-3 text-[#fecaca] absolute top-1 right-1" />
          </div>
        );
      case 'lightning':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#facc15]/25 via-[#ca8a04]/10 to-transparent border border-[#facc15]/40 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            <Zap className="w-7 h-7 fill-[#facc15] text-[#facc15] drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
          </div>
        );
      case 'glasses':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8]/20 via-[#06b6d4]/10 to-transparent border border-[#38bdf8]/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Glasses className="w-7 h-7 text-[#38bdf8] stroke-[2]" />
          </div>
        );
      case 'gold':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#fbbf24]/30 via-[#d97706]/15 to-transparent border border-[#fbbf24]/50 flex items-center justify-center shadow-[0_0_18px_rgba(251,191,36,0.4)]">
            <Star className="w-7 h-7 fill-[#fbbf24] text-[#fbbf24] drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
            <Sparkles className="w-3.5 h-3.5 text-white absolute -top-1 -right-1" />
          </div>
        );
      default:
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#3ecf8e]/20 to-transparent border border-[#3ecf8e]/40 flex items-center justify-center shadow-[0_0_12px_rgba(62,207,142,0.25)]">
            <Sparkles className="w-7 h-7 text-[#3ecf8e] stroke-[2]" />
          </div>
        );
    }
  };

  return (
    <section className="flex-1 max-w-[800px] px-4 sm:px-6 lg:px-12 py-8 mx-auto space-y-10" aria-label="Toko Snakeling">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-brand text-2xl sm:text-3xl text-white font-extrabold tracking-tight">
          Toko Snakeling
        </h1>
        <p className="text-sm text-[#898989] max-w-xl">
          Tukarkan Gems yang kamu kumpulkan untuk perlengkapan belajar dan kustomisasi maskot.
        </p>
      </header>

      {/* SECTION 1: KEKUATAN & PEMULIHAN */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
          <div>
            <h2 className="font-brand text-lg text-white font-bold tracking-tight">
              Kekuatan &amp; Pemulihan
            </h2>
            <p className="text-xs text-[#898989]">
              Gunakan item ini untuk menjaga rentetan belajar harian dan latihan tanpa henti.
            </p>
          </div>
          <span className="font-mono text-xs text-[#898989] uppercase tracking-wider">
            MODUL_S1
          </span>
        </div>

        <div className="space-y-3">
          {powerUps.map((item: ShopItem) => {
            const isFreeze = item.id === 'streak_freeze';
            const isHeart = item.id === 'heart_refill';
            const isHeartsFull = isHeart && stats.hearts >= stats.maxHearts;
            const isFreezeFull = isFreeze && stats.streakFreezeCount >= 2;

            return (
              <div
                key={item.id}
                className="bg-[#171717] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all hover:bg-[#1f1e1e] border border-[#2e2e2e]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#242424] flex items-center justify-center shrink-0 border border-[#333333]">
                    {renderIcon(item.icon)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-brand text-sm sm:text-base text-white font-semibold truncate">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#242424] text-[11px] font-mono text-[#3ecf8e]">
                        {isFreeze ? `Dimiliki: ${stats.streakFreezeCount}/2` : isHeart ? `${stats.hearts}/${stats.maxHearts} Nyawa` : item.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-[#898989] max-w-md leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center w-full md:w-auto">
                  {isHeartsFull ? (
                    <button
                      disabled
                      className="tactile-btn-secondary opacity-60 cursor-not-allowed w-full md:w-auto px-5 py-2.5 rounded-xl font-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      NYAWA PENUH
                    </button>
                  ) : isFreezeFull ? (
                    <button
                      disabled
                      className="tactile-btn-secondary opacity-60 cursor-not-allowed w-full md:w-auto px-5 py-2.5 rounded-xl font-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      KAPASITAS PENUH
                    </button>
                  ) : (
                    <button
                      onClick={() => purchaseShopItem(item)}
                      className="tactile-btn-primary w-full md:w-auto px-5 py-2.5 rounded-xl font-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gem className="w-4 h-4 stroke-[2.2] fill-current text-[#0e0e0e]" />
                      <span>{item.costGems} GEMS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: KOLEKSI & KUSTOMISASI MASKOT */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
          <div>
            <h2 className="font-brand text-lg text-white font-bold tracking-tight">
              Koleksi &amp; Kustomisasi Maskot
            </h2>
            <p className="text-xs text-[#898989]">
              Dandani maskot Snakeling dengan aksesori eksklusif.
            </p>
          </div>
          <span className="font-mono text-xs text-[#898989] uppercase tracking-wider">
            EDISI_2025
          </span>
        </div>

        {/* Live Mascot Dressing Room Card */}
        <div className="bg-[#171717] border-2 border-[#2e2e2e] rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#1c1b1b] border border-[#393939] p-2 flex items-center justify-center shrink-0 shadow-inner">
            <SnakelingMascot
              mood="excited"
              size="md"
              equippedCosmetics={stats.equippedCosmetics}
            />
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <span className="text-[10px] font-brand font-black uppercase text-[#3ecf8e] tracking-wider">
              Tampilan Maskot Kamu
            </span>
            <h3 className="text-base sm:text-lg font-brand font-bold text-white">
              Snakeling Custom Edition
            </h3>
            <p className="text-xs text-[#b4b4b4]">
              {stats.equippedCosmetics.length > 0
                ? `${stats.equippedCosmetics.length} aksesori terpasang aktif di maskotmu!`
                : 'Belum ada aksesori terpasang. Dapatkan dan pasang aksesori di bawah untuk mengubah tampilan maskot!'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {cosmetics.map((item: ShopItem) => {
            const isOwned = (stats.inventory[item.id] || 0) > 0;
            const isEquipped = stats.equippedCosmetics.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-[#171717] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all hover:bg-[#1f1e1e] border border-[#2e2e2e]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#242424] flex items-center justify-center shrink-0 border border-[#333333]">
                    {renderIcon(item.icon)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-brand text-sm sm:text-base text-white font-semibold truncate">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#242424] text-[11px] font-mono text-[#38bdf8]">
                        {item.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-[#898989] max-w-md leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center w-full md:w-auto">
                  {isOwned ? (
                    <button
                      onClick={() => equipCosmetic(item.id)}
                      className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isEquipped
                          ? 'tactile-btn-primary'
                          : 'tactile-btn-secondary text-[#3ecf8e]'
                      }`}
                    >
                      {isEquipped ? 'TERPASANG' : 'PASANG'}
                    </button>
                  ) : (
                    <button
                      onClick={() => purchaseShopItem(item)}
                      className="tactile-btn-primary w-full md:w-auto px-5 py-2.5 rounded-xl font-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gem className="w-4 h-4 stroke-[2.2] fill-current text-[#0e0e0e]" />
                      <span>{item.costGems} GEMS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
};
