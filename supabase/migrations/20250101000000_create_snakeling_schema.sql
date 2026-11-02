-- ====================================================================
-- SNAKELING - SUPABASE DATABASE MIGRATION SCRIPT
-- Gamified Python Learning Application
-- Designed for deployment on Vercel + Supabase
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT DEFAULT 'Belajar Python dengan Snakeling',
  is_pro BOOLEAN DEFAULT false,
  pro_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER STATS TABLE
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  gems INTEGER DEFAULT 505 CHECK (gems >= 0),
  hearts INTEGER DEFAULT 5 CHECK (hearts >= 0 AND hearts <= 5),
  max_hearts INTEGER DEFAULT 5,
  streak INTEGER DEFAULT 1 CHECK (streak >= 0),
  streak_freeze_count INTEGER DEFAULT 1 CHECK (streak_freeze_count >= 0 AND streak_freeze_count <= 2),
  last_active_date DATE DEFAULT CURRENT_DATE,
  modules_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  unit_number INTEGER NOT NULL,
  lesson_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  xp_reward INTEGER DEFAULT 30,
  gem_reward INTEGER DEFAULT 15,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT true,
  score INTEGER DEFAULT 100,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 6. SHOP ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.shop_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('powerup', 'cosmetic', 'subscription')),
  description TEXT NOT NULL,
  cost_gems INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  badge_text TEXT,
  max_quantity INTEGER DEFAULT 1
);

-- 7. USER INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  is_equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- 8. ACTIVITY LOGS (For Streak & Calendar Heatmap)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_earned INTEGER DEFAULT 0,
  lessons_done INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles, user can only update their own
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Stats: Public read for leaderboard, owner update
CREATE POLICY "User stats are viewable by everyone" 
  ON public.user_stats FOR SELECT USING (true);

CREATE POLICY "Users can update own stats" 
  ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" 
  ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lessons & Shop Items: Public read
CREATE POLICY "Lessons viewable by everyone" 
  ON public.lessons FOR SELECT USING (true);

CREATE POLICY "Shop items viewable by everyone" 
  ON public.shop_items FOR SELECT USING (true);

-- User Progress: Only owner can view & insert/update
CREATE POLICY "Users can view own progress" 
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can record own progress" 
  ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Inventory: Only owner can view & update
CREATE POLICY "Users can view own inventory" 
  ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own inventory" 
  ON public.user_inventory FOR ALL USING (auth.uid() = user_id);

-- Activity Logs: Owner view & insert
CREATE POLICY "Users can view own activity logs" 
  ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can record own activity" 
  ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. AUTH TRIGGER (Auto-create Profile and Initial Stats upon Sign Up)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_username TEXT;
BEGIN
  extracted_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1),
    'coder_' || SUBSTRING(NEW.id::text, 1, 6)
  );

  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    extracted_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', extracted_username),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/logo_snakepreview.png')
  );

  INSERT INTO public.user_stats (user_id, xp, gems, hearts, streak, streak_freeze_count)
  VALUES (NEW.id, 0, 505, 5, 1, 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. INITIAL SEED DATA
-- Default Shop Items
INSERT INTO public.shop_items (id, name, category, description, cost_gems, icon, badge_text, max_quantity)
VALUES
  ('streak_freeze', 'Bekukan Streak (Streak Freeze)', 'powerup', 'Melindungi Streak harianmu agar tidak putus jika terlewat satu hari coding. Otomatis terpasang saat absen.', 200, 'flame_shield', '1/2', 2),
  ('heart_refill', 'Isi Ulang Nyawa Instan', 'powerup', 'Kembalikan 5 nyawa penuh secara kilat tanpa harus menunggu regenerasi waktu belajar 30 menit per hati.', 100, 'heart', 'Penuh 5/5', 1),
  ('xp_boost', 'Pengganda XP 15 Menit', 'powerup', 'Dapatkan 2x lipat poin pengalaman (XP) untuk setiap latihan yang diselesaikan dalam 15 menit ke depan.', 150, 'bolt', 'Populer', 5),
  ('visor_cyber', 'Cyber Coder Visor', 'cosmetic', 'Aksesori kacamata visor hijau neon holografik untuk maskot Snakeling kamu.', 250, 'sparkles', 'Edisi Terbatas', 1),
  ('retro_shades', 'Kacamata Hitam Retro', 'cosmetic', 'Gaya klasik programmer retro 90-an untuk tampilan maskot yang lebih santai.', 180, 'sparkles', 'Baru', 1),
  ('golden_skin', 'Sisik Emas (Golden Scale)', 'cosmetic', 'Kostum legendaris dengan aura partikel bercahaya keemasan.', 500, 'star', 'Legendaris', 1)
ON CONFLICT (id) DO NOTHING;

-- Default Lessons
INSERT INTO public.lessons (id, unit_number, lesson_order, title, subtitle, xp_reward, gem_reward)
VALUES
  ('unit1_lesson1', 1, 1, 'Perintah print() & Salam Pertama', 'Mengenal fungsi cetak teks di Python', 30, 15),
  ('unit1_lesson2', 1, 2, 'Variabel & Tipe Data Dasar', 'Menyimpan teks dan angka ke variabel', 30, 15),
  ('unit1_lesson3', 1, 3, 'Operasi Aritmatika & Angka', 'Perhitungan matematika sederhana', 30, 15),
  ('unit1_lesson4', 1, 4, 'Penggabungan String (Teks)', 'Menggabungkan beberapa kata menjadi kalimat', 30, 15),
  ('unit1_lesson5', 1, 5, 'Input Pengguna & Interaksi', 'Menerima masukan dari keyboard', 30, 15),
  ('unit1_lesson6', 1, 6, 'Kondisi Logika: if & else', 'Membuat alur keputusan program', 30, 15),
  ('unit1_lesson7', 1, 7, 'List: Menyimpan Koleksi Data', 'Kumpulan item dalam satu tempat', 30, 15),
  ('unit1_lesson8', 1, 8, 'Perulangan: for loop', 'Mengulang perintah berkali-kali secara otomatis', 30, 15),
  ('unit1_lesson9', 1, 9, 'Fungsi Kustom: def()', 'Mengelompokkan kode agar mudah digunakan lagi', 30, 15),
  ('unit1_lesson10', 1, 10, 'Tantangan Mini: Game Tebak Angka', 'Menerapkan logika dalam sebuah permainan kecil', 40, 25),
  ('unit1_lesson11', 1, 11, 'Evaluasi Akhir Unit 1', 'Ujian sertifikasi fondasi dasar Python', 50, 30)
ON CONFLICT (id) DO NOTHING;
