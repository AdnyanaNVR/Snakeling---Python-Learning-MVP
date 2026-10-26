import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_SHOP_ITEMS } from '../data/curriculum';
import { ShopItem } from '../types';
import { Shield, Heart, Zap, Sparkles, Glasses, Star } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { stats, purchaseShopItem, equipCosmetic } = useApp();

  const powerUps = INITIAL_SHOP_ITEMS.filter((i) => i.category === 'powerup');
  const cosmetics = INITIAL_SHOP_ITEMS.filter((i) => i.category === 'cosmetic');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield_flame':
        return (
          <div className="relative">
            <Shield className="w-8 h-8 text-[#38bdf8]" />
            <div className="absolute -bottom-1 -right-1 text-[#ff9600]">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
          </div>
        );
      case 'heart':
        return <Heart className="w-8 h-8 fill-current text-[#ef4444]" />;
      case 'lightning':
        return <Zap className="w-8 h-8 fill-current text-[#facc15]" />;
      case 'glasses':
        return <Glasses className="w-8 h-8 text-[#38bdf8]" />;
      case 'gold':
        return <Star className="w-8 h-8 fill-current text-[#facc15]" />;
      default:
        return <Sparkles className="w-8 h-8 text-[#3ecf8e]" />;
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
                      <svg className="w-4 h-4 fill-current text-[#0e0e0e]" viewBox="0 0 24 24">
                        <path d="M12 2L3.5 8.5L12 22L20.5 8.5L12 2Z" />
                      </svg>
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
                      <svg className="w-4 h-4 fill-current text-[#0e0e0e]" viewBox="0 0 24 24">
                        <path d="M12 2L3.5 8.5L12 22L20.5 8.5L12 2Z" />
                      </svg>
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
