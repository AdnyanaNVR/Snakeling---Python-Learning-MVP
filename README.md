# Snakeling - Aplikasi Belajar Pemrograman Python (Duolingo-Style)

Aplikasi gamifikasi belajar bahasa pemrograman Python interaktif dengan desain Obsidian Phosphor (`#121212` Obsidian & `#3ecf8e` Phosphor Green), peta belajar isometrik 3D, kuis interaktif dengan umpan balik taktil, papan skor kompetisi, toko perlengkapan, dan profil kemajuan pengguna.

---

## 🚀 Panduan Deploy ke Vercel & Supabase

Aplikasi ini sudah dipersiapkan sepenuhnya untuk dideploy langsung ke **Vercel** dengan backend database & autentikasi **Supabase**.

### 1. Menyiapkan Database Supabase
1. Buka [supabase.com](https://supabase.com) dan buat proyek baru (New Project).
2. Di dashboard proyek Supabase, buka menu **SQL Editor** pada navigasi sebelah kiri.
3. Buka file migrasi yang telah disediakan di proyek ini:
   ```
   supabase/migrations/20250101000000_create_snakeling_schema.sql
   ```
4. Salin seluruh isi SQL script tersebut, tempelkan ke SQL Editor Supabase, lalu klik **Run**.
5. Script ini akan secara otomatis:
   - Membuat tabel: `profiles`, `user_stats`, `lessons`, `user_progress`, `shop_items`, `user_inventory`, `activity_logs`.
   - Mengaktifkan **Row Level Security (RLS)** dengan kebijakan keamanan yang ketat.
   - Mengatur **Database Trigger** `on_auth_user_created` agar setiap pengguna baru yang mendaftar via Email atau Google OAuth otomatis mendapatkan profil dan statistik awal (505 Gems, 5 Nyawa, 1 Streak).
   - Memasukkan data awal (seed data) untuk materi Unit 1 dan item toko.

### 2. Mengambil Kunci API Supabase
1. Masuk ke **Project Settings** > **API**.
2. Salin:
   - **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - **anon / public key** (kunci publik anonim)

### 3. Deploy ke Vercel
1. Hubungkan repositori GitHub ini ke [vercel.com](https://vercel.com).
2. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = `<URL Proyek Supabase Anda>`
   - `VITE_SUPABASE_ANON_KEY` = `<Anon Public Key Supabase Anda>`
3. Klik **Deploy**.
4. Vercel akan otomatis menjalankan `npm run build` dan mempublikasikan aplikasi Anda dengan performa tinggi!

---

## 🧩 Fitur Aplikasi yang Tersedia

1. **Halaman Depan (Landing Page)**:
   - Hero bertema terminal dengan kartu IDE `main.py`, badge floating `$ snakeling.run()`, dan token syntax Python.
   - Tombol "MULAI BELAJAR" dan "SUDAH PUNYA AKUN?".

2. **Peta Belajar Isometrik (Learning Map)**:
   - Header Unit 1: "Menawarkan dan menerima minuman".
   - Lintasan 11 lempeng batu isometrik dengan efek 3D dan indikator aktif "NEXT" beranimasi.
   - Kontrol bawah dengan silabus dan tombol "NEXT LESSON >".

3. **Sesi Kuis & Latihan Interaktif**:
   - Pilihan ganda, prediksi output terminal, melengkapi kode, dan menyusun kata kunci Python.
   - Generator suara Web Audio sintetis (tanpa ketergantungan file audio eksternal yang rentan).
   - Indikator nyawa berkurang saat salah, umpan balik taktil hijau/merah dengan penjelasan.
   - Layar kemenangan dengan partikel konfeti (`canvas-confetti`) dan penambahan XP serta Gems.

4. **Papan Skor (Leaderboard)**:
   - Medali emas (#1), perak (#2), perunggu (#3), dan daftar pembelajar teratas.
   - Kartu status pengguna tersemat di bagian bawah yang diperbarui secara dinamis.

5. **Toko Snakeling (Shop)**:
   - Item Kekuatan: Bekukan Streak (Streak Freeze), Isi Ulang Nyawa Instan (Heart Refill), Pengganda XP 15 Menit.
   - Item Kustomisasi: Cyber Coder Visor, Kacamata Retro, Sisik Emas.
   - Notifikasi toast saat pembelian berhasil atau saldo gems kurang.

6. **Profil & Kalender Riwayat Aktivitas**:
   - Kartu profil maskot dengan tanda centang verifikasi dan ID pengguna.
   - Kartu ringkasan Streak Harian, Total XP, dan Pelajaran.
   - Kalender aktivitas interaktif dengan sorotan hari aktif (`27 🔥`).

7. **Autentikasi (Masuk & Daftar)**:
   - Form pendaftaran dengan ikon input, toggle sandi (tampil/sembunyi), dan tombol Google OAuth.
   - Terintegrasi langsung dengan Supabase Auth atau fallback offline di mode lokal.
