import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Eye, EyeOff, User, Mail, Lock, AlertCircle, Database, Check, Key } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';

// Helper Modal - Disabled for privacy and security
export const SupabaseSetupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = () => {
  return null;
};

// Secret Easter Egg: Alternating toggle clicks between Masuk and Daftar 20 times unlocks Demo Account
let demoToggleCount = 0;
let lastToggleAction: 'to_register' | 'to_login' | null = null;
let lastToggleTime = 0;

export const resetDemoToggleCount = () => {
  demoToggleCount = 0;
  lastToggleAction = null;
};

const handleAlternateAuthToggle = (
  target: 'to_register' | 'to_login',
  setShowLoginModal: (show: boolean) => void,
  setShowRegisterModal: (show: boolean) => void,
  continueWithDemo: (username?: string, email?: string) => void,
  playSound: (type: any) => void,
  showToast: (msg: string, type?: any) => void
) => {
  playSound('click');
  const now = Date.now();

  // Reset counter if user paused for more than 25 seconds
  if (now - lastToggleTime > 25000) {
    demoToggleCount = 0;
    lastToggleAction = null;
  }
  lastToggleTime = now;

  // Track alternate clicks
  if (lastToggleAction !== target) {
    demoToggleCount += 1;
    lastToggleAction = target;
  } else {
    demoToggleCount = 1;
    lastToggleAction = target;
  }

  // Trigger secret demo login when count reaches 20 alternating clicks!
  if (demoToggleCount >= 20) {
    demoToggleCount = 0;
    lastToggleAction = null;
    setShowLoginModal(false);
    setShowRegisterModal(false);
    playSound('celebrate');
    showToast('✨ Mode Rahasia Terbuka: Masuk sebagai Akun Demo (Infinite Gems)!', 'success');
    continueWithDemo('demo', 'demo@snakeling.app');
    return;
  }

  // Regular modal toggle
  if (target === 'to_register') {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  } else {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  }
};

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, setShowRegisterModal, loginUser, continueWithDemo, showToast, playSound } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDbModal, setShowDbModal] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanId = identifier.trim().toLowerCase();
    const isDemo = cleanId === 'demo' || cleanId === 'demo@snakeling.app';
    if (!identifier.trim()) {
      setErrorMsg('Mohon isi email atau nama pengguna!');
      return;
    }
    if (!isDemo && !password) {
      setErrorMsg('Mohon isi kata sandi!');
      return;
    }
    setLoading(true);
    const res = await loginUser(identifier.trim(), password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
        {/* Top Bar */}
        <header className="w-full px-6 py-6 sm:px-10 flex items-center justify-between">
          <button
            onClick={() => {
              resetDemoToggleCount();
              setShowLoginModal(false);
            }}
            className="text-[#b4b4b4] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              handleAlternateAuthToggle(
                'to_register',
                setShowLoginModal,
                setShowRegisterModal,
                continueWithDemo,
                playSound,
                showToast
              );
            }}
            className="px-6 py-2 rounded-full border border-[#393939] text-xs font-brand font-bold tracking-wider text-white hover:bg-white/[0.06] transition-all uppercase cursor-pointer"
          >
            DAFTAR
          </button>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-[420px] mx-auto flex flex-col items-center">
            <h1 className="text-3xl font-brand font-bold text-white text-center tracking-tight mb-2">
              Masuk
            </h1>
            <p className="text-xs text-[#898989] mb-6 text-center">
              Lanjutkan petualangan belajar Python kamu
            </p>

            {/* Error Message banner */}
            {errorMsg && (
              <div className="w-full mb-4 p-3.5 rounded-xl bg-[#2b1416] border border-[#ef4444]/40 text-[#ffb4ab] text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
              <div className="w-full relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan email atau nama"
                  required
                  className="w-full px-4 py-3.5 bg-[#151515] text-[#fafafa] text-sm placeholder:text-[#898989] border border-[#393939] rounded-xl focus:outline-none focus:border-[#3ecf8e] transition-colors shadow-inner"
                />
              </div>

              <div className="w-full relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan kata sandi"
                  required
                  className="w-full pl-4 pr-20 py-3.5 bg-[#151515] text-[#fafafa] text-sm placeholder:text-[#898989] border border-[#393939] rounded-xl focus:outline-none focus:border-[#3ecf8e] transition-colors shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[11px] font-brand font-bold tracking-wider text-[#898989] hover:text-[#3ecf8e] uppercase transition-colors"
                >
                  {showPassword ? 'TUTUP' : 'LIHAT'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="tactile-btn-primary w-full mt-2.5 py-3.5 px-6 font-brand font-bold text-sm uppercase tracking-wider rounded-xl cursor-pointer"
              >
                {loading ? 'MEMPROSES...' : 'MASUK'}
              </button>
            </form>
          </div>
        </main>
      </div>

      <SupabaseSetupModal isOpen={showDbModal} onClose={() => setShowDbModal(false)} />
    </>
  );
};

export const RegisterModal: React.FC = () => {
  const { showRegisterModal, setShowRegisterModal, setShowLoginModal, registerUser, continueWithDemo, showToast, playSound } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDbModal, setShowDbModal] = useState(false);

  if (!showRegisterModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !email.trim() || !password) {
      setErrorMsg('Mohon lengkapi semua kolom pendaftaran!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi harus minimal 6 karakter!');
      return;
    }

    setLoading(true);
    const res = await registerUser(username.trim(), email.trim(), password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Gagal membuat akun.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
        {/* Top Bar */}
        <header className="w-full px-6 py-6 sm:px-10 flex items-center justify-between">
          <button
            onClick={() => {
              resetDemoToggleCount();
              setShowRegisterModal(false);
            }}
            className="text-[#b4b4b4] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              handleAlternateAuthToggle(
                'to_login',
                setShowLoginModal,
                setShowRegisterModal,
                continueWithDemo,
                playSound,
                showToast
              );
            }}
            className="px-5 py-2 rounded-2xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-white font-brand text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
          >
            MASUK
          </button>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-14">
          <div className="w-full max-w-[440px] flex flex-col items-center">
            <div className="w-full text-center mb-6">
              <h1 className="font-brand text-3xl text-white font-bold tracking-tight">
                Buat Profil Baru
              </h1>
              <p className="text-xs text-[#898989] mt-1">
                Daftar gratis untuk mulai petualangan coding Python
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="w-full mb-4 p-3.5 rounded-xl bg-[#2b1416] border border-[#ef4444]/40 text-[#ffb4ab] text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
              {/* Username */}
              <div className="w-full relative">
                <label className="sr-only" htmlFor="reg-username">Nama pengguna</label>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#869489] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan nama"
                  required
                  className="w-full bg-[#181818] text-white placeholder-[#777777] text-sm pl-10 pr-4 py-3 rounded-xl border border-[#333333] focus:outline-none focus:border-[#3ecf8e] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="w-full relative">
                <label className="sr-only" htmlFor="reg-email">Email</label>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#869489] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan email"
                  required
                  className="w-full bg-[#181818] text-white placeholder-[#777777] text-sm pl-10 pr-4 py-3 rounded-xl border border-[#333333] focus:outline-none focus:border-[#3ecf8e] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="w-full relative">
                <label className="sr-only" htmlFor="reg-pass">Kata sandi</label>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#869489] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan kata sandi"
                  minLength={6}
                  required
                  className="w-full bg-[#181818] text-white placeholder-[#777777] text-sm pl-10 pr-11 py-3 rounded-xl border border-[#333333] focus:outline-none focus:border-[#3ecf8e] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#869489] hover:text-white transition-colors p-1"
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="tactile-btn-primary w-full mt-2 font-brand font-bold text-sm uppercase tracking-wider py-3.5 px-4 rounded-2xl cursor-pointer"
              >
                {loading ? 'MEMBUAT AKUN...' : 'BUAT AKUN'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};
