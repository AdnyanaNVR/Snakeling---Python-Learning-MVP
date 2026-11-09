-- ====================================================================
-- SNAKELING - RESET & CLEAR ALL ACCOUNTS IN SUPABASE DATABASE
-- Jalankan query ini di Supabase Dashboard -> SQL Editor -> RUN
-- PERINGATAN: Seluruh data akun pengguna, statistik XP, dan riwayat
-- belajar akan dihapus bersih (reset ke kondisi awal).
-- ====================================================================

-- 1. Hapus data relasi anak terlebih dahulu (user_progress, inventory, logs, stats)
TRUNCATE TABLE public.user_progress CASCADE;
TRUNCATE TABLE public.user_inventory CASCADE;
TRUNCATE TABLE public.activity_logs CASCADE;
TRUNCATE TABLE public.user_stats CASCADE;

-- 2. Hapus seluruh data profil pengguna
TRUNCATE TABLE public.profiles CASCADE;

-- 3. Hapus seluruh akun dari sistem autentikasi Supabase
DELETE FROM auth.users;
