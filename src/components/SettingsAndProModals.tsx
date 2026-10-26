import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { X, Volume2, VolumeX, Sparkles, Check, Database, RotateCcw, LogOut } from 'lucide-react';

export const ProModal: React.FC = () => {
  const { showProModal, setShowProModal, upgradeToPro, user } = useApp();

  if (!showProModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#171717] border-2 border-[#3ecf8e]/50 rounded-3xl p-7 relative shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#3ecf8e]/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => setShowProModal(false)}
          className="absolute top-5 right-5 text-[#898989] hover:text-white p-1 rounded-lg"
          aria-label="Tutup Modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#3ecf8e]/15 border border-[#3ecf8e] text-[#3ecf8e] flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-current" />
            </span>
            <span className="font-brand font-black text-sm uppercase tracking-wider text-[#3ecf8e]">
              SNAKELING PRO
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-brand font-extrabold text-white tracking-tight">
              Kuasai Python 3x Lebih Cepat
            </h2>
            <p className="text-xs text-[#b4b4b4] mt-1">
              Buka potensi penuh pembelajaran dengan fitur eksklusif tanpa batasan.
            </p>
          </div>

          <div className="space-y-3 py-2">
            {[
              { title: 'Nyawa Tak Terbatas (Unlimited Hearts)', desc: 'Belajar dan coba latihan berulang tanpa takut kehabisan nyawa.' },
              { title: 'Bebas Iklan & Distraksi', desc: 'Fokus penuh pada materi pemrograman tanpa gangguan.' },
              { title: 'Review Modul Cerdas & Kesalahan', desc: 'Sistem mengenali kelemahan kodemu dan memberi latihan perbaikan.' },
              { title: 'Aksesori Maskot Eksklusif Emas', desc: 'Dapatkan lencana Pro dan skin eksklusif untuk profilmu.' }
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#3ecf8e]/20 text-[#3ecf8e] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{f.title}</h4>
                  <p className="text-[11px] text-[#898989]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={upgradeToPro}
            className="tactile-btn-primary w-full py-4 rounded-2xl font-brand font-black text-xs uppercase tracking-wider text-[#0e0e0e] cursor-pointer mt-2"
          >
            {user.isPro ? 'PRO SUDAH AKTIF' : 'MULAI COBA 2 MINGGU GRATIS'}
          </button>

          <p className="text-[10px] text-center text-[#898989]">
            Gratis 14 hari pertama, batalkan kapan saja tanpa biaya komitmen.
          </p>
        </div>
      </div>
    </div>
  );
};

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { user, soundEnabled, setSoundEnabled, logoutUser, showToast } = useApp();
  const [displayName, setDisplayName] = useState(user.displayName);

  if (!isOpen) return null;

  const handleResetProgress = () => {
    if (confirm('Yakin ingin mereset progress belajar ke awal?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#171717] border border-[#2e2e2e] rounded-3xl p-6 sm:p-7 relative shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
          <h2 className="text-lg font-brand font-bold text-white tracking-wide">
            Pengaturan Aplikasi
          </h2>
          <button
            onClick={onClose}
            className="text-[#898989] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1c1b1b] border border-[#2e2e2e]">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-[#3ecf8e]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#898989]" />
            )}
            <div>
              <h4 className="text-sm font-semibold text-white">Efek Suara</h4>
              <p className="text-xs text-[#898989]">Suara interaksi dan notifikasi jawaban</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
              soundEnabled ? 'bg-[#3ecf8e]' : 'bg-[#333333]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                soundEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Supabase Status Info */}
        <div className="p-3.5 rounded-2xl bg-[#1c1b1b] border border-[#2e2e2e] space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#38bdf8]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Status Database Supabase
            </h4>
          </div>
          <p className="text-xs text-[#898989]">
            {isSupabaseConfigured ? (
              <span className="text-[#3ecf8e] font-semibold">
                ✓ Terhubung ke Supabase Cloud Database
              </span>
            ) : (
              <span className="text-[#ff9600]">
                Mode Offline / LocalStorage (Siap deploy ke Vercel + Supabase)
              </span>
            )}
          </p>
        </div>

        {/* Reset progress */}
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={handleResetProgress}
            className="w-full py-3 px-4 rounded-xl bg-[#242424] hover:bg-[#2e2e2e] text-xs font-brand font-bold text-[#ef4444] border border-[#393939] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Kemajuan Belajar</span>
          </button>

          <button
            onClick={() => {
              logoutUser();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#1c1b1b] hover:bg-[#242424] text-xs font-brand font-bold text-[#898989] hover:text-white border border-[#2e2e2e] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
