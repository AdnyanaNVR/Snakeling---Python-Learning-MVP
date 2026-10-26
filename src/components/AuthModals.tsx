import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, setShowRegisterModal, loginUser, showToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast('Mohon isi email dan kata sandi!', 'error');
      return;
    }
    setLoading(true);
    await loginUser(identifier, password);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginUser('google_user@gmail.com', 'google_auth');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Bar */}
      <header className="w-full px-6 py-6 sm:px-10 flex items-center justify-between">
        <button
          onClick={() => setShowLoginModal(false)}
          className="text-[#b4b4b4] hover:text-white p-2 rounded-lg transition-colors"
          aria-label="Tutup"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          className="px-6 py-2 rounded-full border border-[#393939] text-xs font-brand font-bold tracking-wider text-white hover:bg-white/[0.06] transition-all uppercase"
        >
          DAFTAR
        </button>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[420px] mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-brand font-bold text-white text-center tracking-tight mb-7">
            Masuk
          </h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
            <div className="w-full relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email atau nama pengguna"
                required
                className="w-full px-4 py-3.5 bg-[#151515] text-[#fafafa] text-sm placeholder:text-[#898989] border border-[#393939] rounded-xl focus:outline-none focus:border-[#3ecf8e] transition-colors shadow-inner"
              />
            </div>

            <div className="w-full relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
                required
                className="w-full pl-4 pr-20 py-3.5 bg-[#151515] text-[#fafafa] text-sm placeholder:text-[#898989] border border-[#393939] rounded-xl focus:outline-none focus:border-[#3ecf8e] transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={() => showToast('Gunakan email terdaftar atau masuk langsung via Google.', 'info')}
                className="absolute right-3.5 text-[11px] font-brand font-bold tracking-wider text-[#898989] hover:text-[#3ecf8e] uppercase transition-colors"
              >
                LUPA?
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
            <span>Masuk dengan Google</span>
          </button>

          {/* Legal Footer */}
          <footer className="w-full mt-10 text-center px-2">
            <p className="text-xs text-[#898989] leading-relaxed">
              Dengan masuk ke Snakeling, kamu menyetujui{' '}
              <a href="#" className="text-white hover:text-[#3ecf8e] underline underline-offset-2">Ketentuan</a>
              {' '}dan{' '}
              <a href="#" className="text-white hover:text-[#3ecf8e] underline underline-offset-2">Kebijakan Privasi</a> kami.
            </p>
          </footer>
        </div>
      </main>

      <div className="h-6 w-full pointer-events-none" />
    </div>
  );
};

export const RegisterModal: React.FC = () => {
  const { showRegisterModal, setShowRegisterModal, setShowLoginModal, registerUser, showToast } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!showRegisterModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      showToast('Mohon lengkapi semua kolom pendaftaran!', 'error');
      return;
    }
    setLoading(true);
    await registerUser(username, email, password);
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    await registerUser('SiswaPython', 'user_google@gmail.com', 'google_pass');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Bar */}
      <header className="w-full px-6 py-6 sm:px-10 flex items-center justify-between">
        <button
          onClick={() => setShowRegisterModal(false)}
          className="text-[#b4b4b4] hover:text-white p-2 rounded-lg transition-colors"
          aria-label="Tutup"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          className="px-5 py-2 rounded-2xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-white font-brand text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
        >
          MASUK
        </button>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-14">
        <div className="w-full max-w-[440px] flex flex-col items-center">
          <div className="w-full text-center mb-8">
            <h1 className="font-brand text-3xl text-white font-bold tracking-tight">
              Buat profilmu
            </h1>
          </div>

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
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nama pengguna"
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
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
          <div className="w-full flex items-center my-6">
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
              Daftar dengan Google
            </span>
          </button>

          <div className="w-full mt-8 text-center px-2">
            <p className="text-xs text-[#898989] leading-relaxed">
              Dengan mendaftar ke Snakeling, kamu menyetujui{' '}
              <a href="#" className="text-white hover:underline underline-offset-2">Ketentuan</a>
              {' '}dan{' '}
              <a href="#" className="text-white hover:underline underline-offset-2">Kebijakan Privasi</a> kami.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
