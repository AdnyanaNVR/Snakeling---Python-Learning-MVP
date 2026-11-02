import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Eye, EyeOff, User, Mail, Lock, AlertCircle, Database, Check, Key } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';

// Helper Modal to easily connect Supabase credentials directly from UI
export const SupabaseSetupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [key, setKey] = useState(currentConfig.anonKey || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim().startsWith('https://')) {
      alert('URL Supabase harus diawali dengan https:// (contoh: https://abcxyz.supabase.co)');
      return;
    }
    if (!key.trim()) {
      alert('Anon Key tidak boleh kosong');
      return;
    }
    setSaving(true);
    saveSupabaseCredentials(url, key);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#898989] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-[#3ecf8e]" />
          <h2 className="font-brand font-bold text-lg text-white">Hubungkan Supabase Cloud</h2>
        </div>

        <p className="text-xs text-[#b4b4b4] mb-5 leading-relaxed">
          Ambil dari dashboard proyek Supabase Anda (seperti <strong className="text-white">snakeling8</strong>) di menu{' '}
          <strong className="text-[#3ecf8e]">Project Settings → API</strong>.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#898989] mb-1">Project URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              required
              className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3ecf8e] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#898989] mb-1">API Key (anon public)</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
              required
              className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3ecf8e] font-mono"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="tactile-btn-primary flex-1 py-2.5 rounded-xl text-xs font-brand font-bold uppercase tracking-wider cursor-pointer"
            >
              {saving ? 'Menyimpan...' : 'Simpan & Hubungkan'}
            </button>
            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={clearSupabaseCredentials}
                className="px-3 py-2 rounded-xl bg-[#2b1416] text-[#ffb4ab] border border-[#ef4444]/30 text-xs font-mono hover:bg-[#381a1d]"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, setShowRegisterModal, loginUser, showToast } = useApp();
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
    if (!identifier.trim() || !password) {
      setErrorMsg('Mohon isi email dan kata sandi!');
      return;
    }
    setLoading(true);
    const ok = await loginUser(identifier.trim(), password);
    setLoading(false);
    if (!ok) {
      setErrorMsg('Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    await loginUser('google_user@gmail.com', 'google_auth');
    setLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
        {/* Top Bar */}
        <header className="w-full px-6 py-6 sm:px-10 flex items-center justify-between">
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-[#b4b4b4] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
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
              <div className="w-full mb-4 p-3 rounded-xl bg-[#2b1416] border border-[#ef4444]/40 text-[#ffb4ab] text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span className="flex-1">{errorMsg}</span>
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

            {/* Divider */}
            <div className="w-full flex items-center my-6">
              <div className="flex-1 border-t border-[#2e2e2e]" />
              <span className="px-3.5 text-[11px] font-brand font-bold text-[#898989] uppercase tracking-widest">
                Atau
              </span>
              <div className="flex-1 border-t border-[#2e2e2e]" />
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#181818] border border-[#393939] hover:border-[#4d4d4d] rounded-xl text-white font-brand font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Masuk Cepat Google</span>
            </button>

            {/* Supabase Connection Helper link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowDbModal(true)}
                className="text-[11px] font-mono text-[#898989] hover:text-[#3ecf8e] flex items-center gap-1.5 mx-auto transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>
                  {isSupabaseConfigured
                    ? '✓ Terhubung ke Supabase Cloud'
                    : 'Pengaturan Database Supabase (snakeling8)'}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <SupabaseSetupModal isOpen={showDbModal} onClose={() => setShowDbModal(false)} />
    </>
  );
};

export const RegisterModal: React.FC = () => {
  const { showRegisterModal, setShowRegisterModal, setShowLoginModal, registerUser, showToast } = useApp();
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
    const ok = await registerUser(username.trim(), email.trim(), password);
    setLoading(false);
    if (!ok) {
      setErrorMsg('Gagal membuat akun. Pastikan email belum terdaftar atau format email valid.');
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrorMsg('');
    await registerUser('SiswaPython', `user_${Date.now()}@gmail.com`, 'google_pass_123');
    setLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
        {/* Top Bar */}
        <header className="w-full px-6 py-6 sm:px-10 flex items-center justify-between">
          <button
            onClick={() => setShowRegisterModal(false)}
            className="text-[#b4b4b4] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
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
              <div className="w-full mb-4 p-3 rounded-xl bg-[#2b1416] border border-[#ef4444]/40 text-[#ffb4ab] text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span className="flex-1">{errorMsg}</span>
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

            {/* Divider */}
            <div className="w-full flex items-center my-5">
              <div className="flex-1 h-px bg-[#2e2e2e]" />
              <span className="px-4 text-[11px] font-brand font-medium text-[#898989] tracking-widest uppercase">
                ATAU
              </span>
              <div className="flex-1 h-px bg-[#2e2e2e]" />
            </div>

            {/* Social Sign up */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full bg-[#1c1b1b] hover:bg-[#242424] active:bg-[#202020] border border-[#2e2e2e] py-3 px-4 rounded-2xl flex items-center justify-center gap-3 transition-colors text-white cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span className="font-brand font-bold text-xs uppercase tracking-wider text-white">
                Daftar Cepat Google
              </span>
            </button>

            {/* Supabase Connection Helper link */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowDbModal(true)}
                className="text-[11px] font-mono text-[#898989] hover:text-[#3ecf8e] flex items-center gap-1.5 mx-auto transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>
                  {isSupabaseConfigured
                    ? '✓ Terhubung ke Supabase Cloud'
                    : 'Pengaturan Database Supabase (snakeling8)'}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <SupabaseSetupModal isOpen={showDbModal} onClose={() => setShowDbModal(false)} />
    </>
  );
};
