-- ====================================================================
-- SNAKELING - ALL-TIME REAL ACCOUNTS LEADERBOARD MIGRATION
-- Menghapus akun dummy seed dan mengonfigurasi papan skor agar HANYA
-- menampilkan akun yang pernah dibuat (all-time) berdasarkan perolehan XP.
-- ====================================================================

-- 1. HAPUS DATA SEED DUMMY/BOTS DARI TABEL PROFILES & USER_STATS
DELETE FROM public.user_stats 
WHERE user_id IN (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'
);

DELETE FROM public.profiles 
WHERE id IN (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'
);

-- 2. PASTIKAN RLS MENGIZINKAN BACA UNTUK SEMUA PROFIL & STATISTIK REAL
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "User stats are viewable by everyone" ON public.user_stats;
CREATE POLICY "User stats are viewable by everyone" ON public.user_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert own profile" ON public.profiles;
CREATE POLICY "Allow insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update own profile" ON public.profiles;
CREATE POLICY "Allow update own profile" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (true);

-- 3. HAPUS VIEW LAMA DAHULU (Mencegah PostgreSQL error 42P16 terkait urutan/nama kolom view)
DROP VIEW IF EXISTS public.leaderboard_view CASCADE;

-- 4. BUAT ULANG VIEW PAPAN SKOR ALL-TIME BARU
CREATE VIEW public.leaderboard_view AS
SELECT 
  p.id AS user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.is_pro,
  COALESCE(s.xp, 0) AS xp,
  COALESCE(s.streak, 1) AS streak,
  COALESCE(s.modules_completed, 0) AS modules_completed,
  COALESCE(s.updated_at, p.updated_at) AS updated_at,
  p.created_at
FROM public.profiles p
LEFT JOIN public.user_stats s ON p.id = s.user_id
WHERE p.id NOT IN (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'
)
ORDER BY COALESCE(s.xp, 0) DESC, p.created_at ASC;

-- 5. BERIKAN HAK AKSES SELECT UNTUK ROLE PUBLIK/ANON/AUTHENTICATED
GRANT SELECT ON public.leaderboard_view TO anon, authenticated, service_role;
