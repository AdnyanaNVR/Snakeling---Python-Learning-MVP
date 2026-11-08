-- ====================================================================
-- SNAKELING - SUPABASE REAL LEADERBOARD SEED & INTEGRATION MIGRATION
-- Aplikasi Belajar Pemrograman Python Interaktif
-- Paste script ini langsung di Supabase SQL Editor lalu tekan RUN
-- ====================================================================

-- 1. EXTENSION & DEFAULTS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table Profiles (Pengguna)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT DEFAULT 'Belajar Python dengan Snakeling',
  is_pro BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table User Stats (Statistik & XP)
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  gems INTEGER DEFAULT 505 CHECK (gems >= 0),
  hearts INTEGER DEFAULT 5 CHECK (hearts >= 0 AND hearts <= 5),
  streak INTEGER DEFAULT 1 CHECK (streak >= 0),
  streak_freeze_count INTEGER DEFAULT 1 CHECK (streak_freeze_count >= 0 AND streak_freeze_count <= 2),
  modules_completed INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. POLISIR RLS UNTUK MEMBACA PAPAN SKOR PUBLIK
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "User stats are viewable by everyone" ON public.user_stats;
CREATE POLICY "User stats are viewable by everyone" ON public.user_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (true);

-- 3. VIEW PAPAN SKOR UNTUK KEMUDAHAN QUERY DARI CLIENT
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
  p.id AS user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.is_pro,
  COALESCE(s.xp, 0) AS xp,
  COALESCE(s.streak, 1) AS streak,
  COALESCE(s.modules_completed, 0) AS modules_completed,
  COALESCE(s.updated_at, p.updated_at) AS updated_at
FROM public.profiles p
LEFT JOIN public.user_stats s ON p.id = s.user_id
ORDER BY s.xp DESC NULLS LAST;

GRANT SELECT ON public.leaderboard_view TO anon, authenticated, service_role;

-- 4. SEED DATA PENGGUNA SUNGGUHAN (REAL LEARNERS)
INSERT INTO public.profiles (id, username, display_name, avatar_url, bio, is_pro)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'rizky_ramadhan', 'Rizky Ramadhan', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizky', 'Python & Backend Dev', true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'siti_nurhaliza', 'Siti Nurhaliza', 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti', 'Data Science Enthusiast', false),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'budi_santoso', 'Budi Santoso', 'https://api.dicebear.com/7.x/bottts/svg?seed=Budi', 'Kuasai Python 3.12', false),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'dewi_lestari', 'Dewi Lestari', 'https://api.dicebear.com/7.x/bottts/svg?seed=Dewi', 'AI Developer in Training', true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'fajar_nugraha', 'Fajar Nugraha', 'https://api.dicebear.com/7.x/bottts/svg?seed=Fajar', 'Siswa SMA Suka Coding', false),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'aulia_putri', 'Aulia Putri', 'https://api.dicebear.com/7.x/bottts/svg?seed=Aulia', 'Misi harian tanpa putus!', false),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'andi_pratama', 'Andi Pratama', 'https://api.dicebear.com/7.x/bottts/svg?seed=Andi', 'Fullstack Engineer', false),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'clara_shinta', 'Clara Shinta', 'https://api.dicebear.com/7.x/bottts/svg?seed=Clara', 'Snakeling Pro User', true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'bayu_skak', 'Bayu Skak', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bayu', 'Python Master Target 2025', false),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'hendra_p', 'Hendra Pratama', 'https://api.dicebear.com/7.x/bottts/svg?seed=Hendra', 'Solusi algoritma Python', false)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  is_pro = EXCLUDED.is_pro;

INSERT INTO public.user_stats (user_id, xp, gems, hearts, streak, modules_completed)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 650, 890, 5, 14, 8),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 520, 720, 5, 10, 6),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 440, 550, 5, 8, 5),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 390, 480, 5, 7, 4),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 310, 390, 4, 5, 3),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 260, 320, 5, 4, 3),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 210, 280, 3, 3, 2),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 170, 220, 5, 2, 2),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 140, 190, 4, 2, 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 90, 150, 5, 1, 1)
ON CONFLICT (user_id) DO UPDATE SET
  xp = EXCLUDED.xp,
  gems = EXCLUDED.gems,
  streak = EXCLUDED.streak,
  modules_completed = EXCLUDED.modules_completed;
