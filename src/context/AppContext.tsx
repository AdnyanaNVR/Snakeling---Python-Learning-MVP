import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserStats, ShopItem, ActiveTab, LeaderboardUser } from '../types';
import { INITIAL_SHOP_ITEMS } from '../data/curriculum';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  stats: UserStats;
  isLoggedIn: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showRegisterModal: boolean;
  setShowRegisterModal: (show: boolean) => void;
  showProModal: boolean;
  setShowProModal: (show: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  playSound: (type: 'correct' | 'wrong' | 'complete' | 'click' | 'purchase') => void;
  purchaseShopItem: (item: ShopItem) => boolean;
  refillHearts: () => boolean;
  loseHeart: () => void;
  finishLesson: (lessonId: string, earnedXp: number, earnedGems: number) => void;
  equipCosmetic: (itemId: string) => void;
  upgradeToPro: () => void;
  loginUser: (emailOrUser: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (username: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  continueWithDemo: (username?: string, email?: string) => void;
  logoutUser: () => void;
  leaderboard: LeaderboardUser[];
  refreshLeaderboard: () => Promise<void>;
  activeLessonModal: boolean;
  setActiveLessonModal: (open: boolean) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  isLessonActive: boolean;
  setIsLessonActive: (active: boolean) => void;
}

const STORAGE_KEY_USER = 'snakeling_user_profile';
const STORAGE_KEY_USER_STATS_PREFIX = 'snakeling_user_stats_';
const STORAGE_KEY_CREATED_ACCOUNTS = 'snakeling_all_registered_accounts';

export const getScopedStatsKey = (userId: string) => `${STORAGE_KEY_USER_STATS_PREFIX}${userId}`;

export const getScopedUserStats = (userId: string): UserStats | null => {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(getScopedStatsKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

export const saveScopedUserStats = (userId: string, userStats: UserStats) => {
  if (!userId) return;
  try {
    localStorage.setItem(getScopedStatsKey(userId), JSON.stringify(userStats));
  } catch {}
};

export interface StoredAccount {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  xp: number;
  streak: number;
  joinedDate: string;
}

const getStoredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREATED_ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
};

const saveAccountToStore = (account: StoredAccount) => {
  try {
    const current = getStoredAccounts();
    const idx = current.findIndex(
      (a) => a.id === account.id || a.username.toLowerCase() === account.username.toLowerCase()
    );
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        ...account,
        xp: account.xp || 0
      };
    } else {
      current.push(account);
    }
    localStorage.setItem(STORAGE_KEY_CREATED_ACCOUNTS, JSON.stringify(current));
  } catch {}
};

const getTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getDayDifference = (dateStr1: string, dateStr2: string): number => {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = d1.getTime() - d2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const createCleanStats = (initialXp = 0): UserStats => ({
  streak: 1,
  gems: 505,
  hearts: 5,
  maxHearts: 5,
  xp: initialXp,
  streakFreezeCount: 1,
  modulesCompleted: 0,
  currentLessonIndex: 0,
  completedLessons: [],
  inventory: {
    streak_freeze: 1
  },
  equippedCosmetics: [],
  activityDates: [getTodayStr()],
  lastActiveDate: getTodayStr()
});

const DEFAULT_USER: UserProfile = {
  id: 'usr_adnyana_default',
  username: 'adnyana_py',
  displayName: 'Adnyana',
  email: 'adnyana@snakeling.app',
  avatarUrl: '/logo_snakepreview.png',
  isPro: false,
  joinedDate: 'Bergabung Februari 2025',
  userCode: 'SNK-9402'
};

const DEFAULT_STATS: UserStats = createCleanStats();

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('belajar');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('snakeling_is_logged_in');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Lesson state
  const [activeLessonModal, setActiveLessonModal] = useState<boolean>(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isLessonActive, setIsLessonActive] = useState<boolean>(false);
  const [dbLeaderboard, setDbLeaderboard] = useState<LeaderboardUser[]>([]);

  // Load user from LocalStorage
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.avatarUrl) {
          parsed.avatarUrl = '/logo_snakepreview.png';
        }
        return parsed;
      }
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Load isolated scoped stats for this specific user
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          const scoped = getScopedUserStats(parsedUser.id);
          if (scoped) return scoped;
        }
      }
      return createCleanStats();
    } catch {
      return createCleanStats();
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('snakeling_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  }, [user, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      saveScopedUserStats(user.id, stats);
    }
  }, [stats, user.id, isLoggedIn]);

  // Sync active user to persistent created accounts
  useEffect(() => {
    if (isLoggedIn && user.username) {
      saveAccountToStore({
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        avatarUrl: user.avatarUrl || '/logo_snakepreview.png',
        xp: stats.xp || 0,
        streak: stats.streak || 1,
        joinedDate: user.joinedDate
      });
    }
  }, [user, stats.xp, stats.streak, isLoggedIn]);

  // Fetch real leaderboard users from Supabase database if configured
  const fetchSupabaseLeaderboard = React.useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: viewData, error: viewError } = await supabase
        .from('leaderboard_view')
        .select('*')
        .order('xp', { ascending: false })
        .limit(50);

      if (!viewError && viewData) {
        // Filter out legacy dummy seeds (starts with a0eebc99)
        const realData = viewData.filter((row: any) => !row.user_id?.startsWith('a0eebc99'));
        const list: LeaderboardUser[] = realData.map((row: any, idx: number) => {
          const name = row.display_name || row.username || 'Siswa Python';
          const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'PY';
          return {
            rank: idx + 1,
            initials,
            name,
            xp: Number(row.xp || 0),
            isCurrentUser: user.id === row.user_id || user.username.toLowerCase() === (row.username || '').toLowerCase(),
            avatarUrl: row.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
          };
        });
        setDbLeaderboard(list);
        return;
      }

      const { data, error } = await supabase
        .from('user_stats')
        .select('xp, streak, user_id, profiles!inner(id, username, display_name, avatar_url)')
        .order('xp', { ascending: false })
        .limit(50);

      if (!error && data) {
        const realData = data.filter((row: any) => !row.user_id?.startsWith('a0eebc99'));
        const list: LeaderboardUser[] = realData.map((row: any, idx: number) => {
          const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
          const name = p?.display_name || p?.username || 'Siswa Python';
          const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'PY';
          return {
            rank: idx + 1,
            initials,
            name,
            xp: Number(row.xp || 0),
            isCurrentUser: user.id === row.user_id || user.username.toLowerCase() === (p?.username || '').toLowerCase(),
            avatarUrl: p?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
          };
        });
        setDbLeaderboard(list);
      }
    } catch {
      // ignore
    }
  }, [user.id, user.username]);

  const refreshLeaderboard = async () => {
    playSound('click');
    if (isSupabaseConfigured && supabase) {
      await fetchSupabaseLeaderboard();
      showToast('Papan skor berhasil disegarkan dari database!', 'info');
    } else {
      showToast('Papan skor all-time diperbarui!', 'info');
    }
  };

  const loadUserProgressFromSupabase = React.useCallback(async (
    userId: string,
    userEmail: string,
    userMetadata?: Record<string, any>
  ): Promise<{ profile: UserProfile; stats: UserStats }> => {
    let profileData: any = null;
    let statsData: any = null;
    let progressData: any[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const [profRes, statsRes, progRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
          supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
          supabase.from('user_progress').select('lesson_id, completed').eq('user_id', userId).eq('completed', true)
        ]);
        profileData = profRes.data;
        statsData = statsRes.data;
        progressData = progRes.data || [];
      } catch (err) {
        console.warn('Gagal memuat data pengguna dari Supabase:', err);
      }
    }

    const scoped = getScopedUserStats(userId);
    const dbCompletedLessons = progressData.map((r) => r.lesson_id).filter(Boolean);
    const completedLessons = dbCompletedLessons.length > 0
      ? Array.from(new Set(dbCompletedLessons))
      : (scoped?.completedLessons || []);

    const loadedStats: UserStats = {
      streak: statsData?.streak ?? scoped?.streak ?? 1,
      gems: statsData?.gems ?? scoped?.gems ?? 505,
      hearts: statsData?.hearts ?? scoped?.hearts ?? 5,
      maxHearts: statsData?.max_hearts ?? scoped?.maxHearts ?? 5,
      xp: statsData?.xp ?? scoped?.xp ?? 0,
      streakFreezeCount: statsData?.streak_freeze_count ?? scoped?.streakFreezeCount ?? 1,
      modulesCompleted: completedLessons.length,
      currentLessonIndex: completedLessons.length,
      completedLessons,
      inventory: scoped?.inventory || { streak_freeze: 1 },
      equippedCosmetics: scoped?.equippedCosmetics || [],
      activityDates: scoped?.activityDates || [getTodayStr()],
      lastActiveDate: statsData?.last_active_date || scoped?.lastActiveDate || getTodayStr()
    };

    const googleAvatar = userMetadata?.avatar_url || userMetadata?.picture;
    const googleName = userMetadata?.full_name || userMetadata?.name;
    const rawUsername = profileData?.username || userMetadata?.user_name || (userEmail.includes('@') ? userEmail.split('@')[0] : userEmail) || 'Siswa';
    const cleanUsername = rawUsername.replace(/\s+/g, '_').toLowerCase();

    const loadedProfile: UserProfile = {
      id: userId,
      username: profileData?.username || cleanUsername,
      displayName: profileData?.display_name || googleName || profileData?.username || cleanUsername,
      email: userEmail,
      avatarUrl: profileData?.avatar_url || googleAvatar || '/logo_snakepreview.png',
      isPro: Boolean(profileData?.is_pro),
      joinedDate: profileData?.created_at
        ? `Bergabung ${new Date(profileData.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
        : 'Bergabung 2025',
      userCode: `SNK-${(profileData?.username || cleanUsername).slice(0, 3).toUpperCase()}`
    };

    // Client-side fallback sync for Google users if profile row not present yet
    if (isSupabaseConfigured && supabase) {
      if (!profileData || (!profileData.avatar_url && googleAvatar)) {
        supabase.from('profiles').upsert({
          id: userId,
          username: loadedProfile.username,
          display_name: loadedProfile.displayName,
          avatar_url: loadedProfile.avatarUrl,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' }).then(({ error }) => {
          if (error) console.warn('Supabase sync profile info:', error.message);
        });
      }
      if (!statsData) {
        supabase.from('user_stats').upsert({
          user_id: userId,
          xp: loadedStats.xp,
          gems: loadedStats.gems,
          hearts: loadedStats.hearts,
          max_hearts: loadedStats.maxHearts,
          streak: loadedStats.streak,
          streak_freeze_count: loadedStats.streakFreezeCount,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }).then(({ error }) => {
          if (error) console.warn('Supabase sync stats info:', error.message);
        });
      }
    }

    return { profile: loadedProfile, stats: loadedStats };
  }, [isSupabaseConfigured]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    fetchSupabaseLeaderboard();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProgressFromSupabase(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata
        ).then(({ profile, stats: loadedStats }) => {
          setUser(profile);
          setStats(loadedStats);
          saveScopedUserStats(session.user.id, loadedStats);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
          localStorage.setItem('snakeling_is_logged_in', 'true');
          setIsLoggedIn(true);
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        loadUserProgressFromSupabase(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata
        ).then(({ profile, stats: loadedStats }) => {
          setUser(profile);
          setStats(loadedStats);
          saveScopedUserStats(session.user.id, loadedStats);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
          localStorage.setItem('snakeling_is_logged_in', 'true');
          setIsLoggedIn(true);
          setShowLoginModal(false);
          setShowRegisterModal(false);
          playSound('correct');
          showToast(`Berhasil masuk! Selamat datang, ${profile.displayName}`);
        });
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(DEFAULT_USER);
        setStats(createCleanStats());
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem('snakeling_is_logged_in');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured, fetchSupabaseLeaderboard, loadUserProgressFromSupabase]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2800);
  };

  // Synthesized Web Audio Sound Generator (Reliable, Zero External Network Dependency)
  const playSound = (type: 'correct' | 'wrong' | 'complete' | 'click' | 'purchase') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'correct') {
        // High upbeat dual chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'wrong') {
        // Low soft buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'complete') {
        // Victory fanfare
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        osc.frequency.setValueAtTime(659.25, now + 0.3);
        osc.frequency.setValueAtTime(880, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'purchase') {
        // Coin cash-register chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // Soft click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // AudioContext unavailable or autoplay blocked
    }
  };

  // Purchase Shop Item
  const purchaseShopItem = (item: ShopItem): boolean => {
    const isDemo = user.username.toLowerCase() === 'demo' || user.id === 'usr_demo_account';

    if (!isDemo && stats.gems < item.costGems) {
      playSound('wrong');
      showToast('Gems kamu tidak cukup untuk item ini!', 'error');
      return false;
    }

    if (item.id === 'streak_freeze') {
      if (stats.streakFreezeCount >= 2) {
        showToast('Kapasitas Streak Freeze sudah penuh (2/2)!', 'error');
        return false;
      }
      setStats((prev) => ({
        ...prev,
        gems: isDemo ? prev.gems : prev.gems - item.costGems,
        streakFreezeCount: prev.streakFreezeCount + 1,
        inventory: {
          ...prev.inventory,
          streak_freeze: (prev.inventory.streak_freeze || 0) + 1
        }
      }));
    } else if (item.id === 'heart_refill') {
      if (stats.hearts >= stats.maxHearts) {
        showToast('Nyawa kamu sudah penuh (5/5)!', 'info');
        return false;
      }
      setStats((prev) => ({
        ...prev,
        gems: isDemo ? prev.gems : prev.gems - item.costGems,
        hearts: prev.maxHearts
      }));
    } else {
      // Cosmetic or boost
      setStats((prev) => {
        const nextInv = { ...prev.inventory, [item.id]: (prev.inventory[item.id] || 0) + 1 };
        const nextCosmetics = item.category === 'cosmetic' && !prev.equippedCosmetics.includes(item.id)
          ? [...prev.equippedCosmetics, item.id]
          : prev.equippedCosmetics;
        return {
          ...prev,
          gems: isDemo ? prev.gems : prev.gems - item.costGems,
          inventory: nextInv,
          equippedCosmetics: nextCosmetics
        };
      });
    }

    playSound('purchase');
    showToast(`Sukses membeli ${item.name}!`);
    return true;
  };

  // Hearts refill
  const refillHearts = (): boolean => {
    if (user.isPro) {
      showToast('Snakeling Pro aktif: Nyawa Anda sudah tak terbatas!', 'info');
      return true;
    }

    const isDemo = user.username.toLowerCase() === 'demo' || user.id === 'usr_demo_account';

    if (stats.hearts >= stats.maxHearts) {
      showToast('Nyawa sudah penuh 5/5!', 'info');
      return false;
    }
    if (!isDemo && stats.gems < 100) {
      showToast('Butuh 100 Gems untuk isi ulang nyawa!', 'error');
      return false;
    }
    setStats((prev) => ({
      ...prev,
      gems: isDemo ? prev.gems : prev.gems - 100,
      hearts: prev.maxHearts
    }));
    playSound('purchase');
    showToast('5 Nyawa berhasil dipulihkan!');
    return true;
  };

  // Lose a heart during quiz
  const loseHeart = () => {
    if (user.isPro) {
      playSound('wrong');
      return;
    }

    setStats((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
    playSound('wrong');
  };

  // Complete a lesson
  const finishLesson = (lessonId: string, earnedXp: number, earnedGems: number) => {
    const today = getTodayStr();
    setStats((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const nextCompleted = alreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const nextActivityDates = prev.activityDates.includes(today) ? prev.activityDates : [...prev.activityDates, today];

      // REAL STREAK CALCULATION
      let nextStreak = prev.streak || 1;
      let nextFreezeCount = prev.streakFreezeCount ?? 1;
      const lastActive = prev.lastActiveDate;

      if (!lastActive) {
        nextStreak = 1;
      } else if (lastActive === today) {
        // Practiced again today, streak already maintained!
        nextStreak = Math.max(1, prev.streak);
      } else {
        const diff = getDayDifference(today, lastActive);
        if (diff === 1) {
          // Exactly consecutive day (yesterday -> today)
          nextStreak = prev.streak + 1;
          setTimeout(() => {
            showToast(`🔥 Streak harian bertambah! Sekarang ${nextStreak} hari berturut-turut!`, 'success');
          }, 600);
        } else if (diff === 2 && nextFreezeCount > 0) {
          // Missed 1 day, streak freeze protects!
          nextFreezeCount = nextFreezeCount - 1;
          nextStreak = prev.streak + 1;
          setTimeout(() => {
            showToast(`🛡️ Streak Freeze otomatis melindungi rentetan belajarmu! Streak naik ke ${nextStreak} hari!`, 'info');
          }, 600);
        } else {
          // Missed more than 1 day or no freeze
          nextStreak = 1;
          setTimeout(() => {
            showToast(`🔥 Streak baru dimulai hari ini (Hari ke-1)!`, 'success');
          }, 600);
        }
      }

      const nextXp = prev.xp + earnedXp;

      if (isSupabaseConfigured && supabase && user.id && !user.id.startsWith('usr_demo')) {
        // Record completed lesson to user_progress
        supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id,lesson_id' })
          .then(({ error: progErr }) => {
            if (progErr) console.warn('Gagal mencatat kemajuan user_progress:', progErr);
          });

        supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            xp: nextXp,
            streak: nextStreak,
            modules_completed: nextCompleted.length,
            lessons_completed: nextCompleted.length,
            updated_at: new Date().toISOString()
          })
          .then(() => fetchSupabaseLeaderboard());
      }

      return {
        ...prev,
        streak: nextStreak,
        streakFreezeCount: nextFreezeCount,
        lastActiveDate: today,
        xp: nextXp,
        gems: prev.gems + earnedGems,
        completedLessons: nextCompleted,
        modulesCompleted: nextCompleted.length,
        currentLessonIndex: nextCompleted.length,
        activityDates: nextActivityDates
      };
    });
    playSound('complete');
  };

  // Toggle equipping cosmetic
  const equipCosmetic = (itemId: string) => {
    setStats((prev) => {
      const isEquipped = prev.equippedCosmetics.includes(itemId);
      const next = isEquipped
        ? prev.equippedCosmetics.filter((id) => id !== itemId)
        : [...prev.equippedCosmetics, itemId];
      return { ...prev, equippedCosmetics: next };
    });
    playSound('click');
    showToast('Tampilan maskot diperbarui!');
  };

  // Upgrade to Pro
  const upgradeToPro = () => {
    setUser((prev) => ({ ...prev, isPro: true }));
    setStats((prev) => ({ ...prev, hearts: 5 }));
    setShowProModal(false);
    playSound('complete');
    showToast('Selamat! Snakeling Pro aktif selama 14 hari.');
  };

  // Auth: Login
  const loginUser = async (emailOrUser: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanIdent = emailOrUser.trim().toLowerCase();
      // Khusus akun demo: nama 'demo' dengan kata sandi kosong atau apa saja
      if (cleanIdent === 'demo' || cleanIdent === 'demo@snakeling.app') {
        const demoUserId = 'usr_demo_account';
        const existingStats = getScopedUserStats(demoUserId);
        const demoStats: UserStats = existingStats || {
          ...createCleanStats(),
          gems: 999999
        };
        const demoProfile: UserProfile = {
          id: demoUserId,
          username: 'demo',
          displayName: 'Akun Demo',
          email: 'demo@snakeling.app',
          avatarUrl: '/logo_snakepreview.png',
          isPro: false,
          joinedDate: 'Bergabung 2025 (Mode Demo)',
          userCode: 'SNK-DEMO'
        };
        setUser(demoProfile);
        setStats(demoStats);
        saveScopedUserStats(demoUserId, demoStats);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(demoProfile));
        setIsLoggedIn(true);
        setShowLoginModal(false);
        playSound('correct');
        showToast('Berhasil masuk dengan akun demo (Gems Tak Terbatas)!');
        return { success: true };
      }

      if (isSupabaseConfigured && supabase) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: emailOrUser,
          password: _pass
        });
        if (error) {
          let msg = error.message;
          const lower = (error.message || '').toLowerCase();
          if (lower.includes('failed to fetch') || (error as { name?: string }).name === 'AuthRetryableFetchError') {
            msg = 'Gagal terhubung ke Supabase (URL tidak dapat dijangkau). Pastikan URL bukan nama proyek (bukan "snakeling8"), melainkan Project URL di menu Project Settings → Data API (format: https://[id-acak].supabase.co). Anda dapat mereset URL atau masuk mode demo.';
          } else if (lower.includes('invalid login credentials')) {
            msg = 'Email atau kata sandi tidak cocok. Silakan periksa kembali.';
          } else if (lower.includes('email not confirmed')) {
            msg = 'Email belum dikonfirmasi! Cek kotak masuk email kamu atau matikan "Confirm email" di dashboard Supabase.';
          }
          showToast(msg, 'error');
          return { success: false, error: msg };
        }

        if (authData?.user) {
          const { profile: loadedUser, stats: loadedStats } = await loadUserProgressFromSupabase(
            authData.user.id,
            authData.user.email || emailOrUser
          );
          setUser(loadedUser);
          setStats(loadedStats);
          saveScopedUserStats(authData.user.id, loadedStats);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loadedUser));
          setIsLoggedIn(true);
          setShowLoginModal(false);
          playSound('correct');
          showToast(`Selamat datang kembali, ${loadedUser.displayName}!`);
          return { success: true };
        }
      }

      // Local state fallback login
      const uname = emailOrUser.includes('@') ? emailOrUser.split('@')[0] : emailOrUser;
      const localUserId = `usr_local_${uname.toLowerCase()}`;
      const existingScoped = getScopedUserStats(localUserId);
      const localStats: UserStats = existingScoped || createCleanStats();

      const localProfile: UserProfile = {
        id: localUserId,
        username: uname,
        displayName: uname,
        email: emailOrUser.includes('@') ? emailOrUser : `${uname.toLowerCase()}@snakeling.app`,
        avatarUrl: '/logo_snakepreview.png',
        isPro: false,
        joinedDate: 'Bergabung 2025 (Akun Lokal)',
        userCode: `SNK-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setUser(localProfile);
      setStats(localStats);
      saveScopedUserStats(localUserId, localStats);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(localProfile));
      setIsLoggedIn(true);
      setShowLoginModal(false);
      playSound('correct');
      showToast(`Selamat datang kembali, ${uname}!`);
      return { success: true };
    } catch (e: unknown) {
      const origMsg = (e as Error).message || '';
      let msg = origMsg;
      if (origMsg.toLowerCase().includes('failed to fetch') || (e as { name?: string }).name === 'AuthRetryableFetchError') {
        msg = 'Gagal terhubung ke Supabase (URL tidak dapat dijangkau). Pastikan URL bukan nama proyek (bukan "snakeling8"), melainkan Project URL di menu Project Settings → Data API (format: https://[id-acak].supabase.co). Anda dapat mereset URL atau masuk mode demo.';
      } else {
        msg = origMsg || 'Gagal masuk';
      }
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Auth: Register
  const registerUser = async (username: string, email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (_pass.length < 6) {
        const msg = 'Kata sandi minimal 6 karakter!';
        showToast(msg, 'error');
        return { success: false, error: msg };
      }

      const freshStats = createCleanStats();

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: _pass,
          options: {
            data: { username, display_name: username }
          }
        });

        if (error) {
          console.error('Supabase Sign Up Error:', error);
          let msg = error.message;
          const lower = (error.message || '').toLowerCase();
          if (lower.includes('failed to fetch') || (error as { name?: string }).name === 'AuthRetryableFetchError') {
            msg = 'Gagal terhubung ke Supabase (URL tidak dapat dijangkau). Pastikan URL bukan nama proyek (bukan "snakeling8"), melainkan Project URL di menu Project Settings → Data API (format: https://[id-acak].supabase.co). Anda dapat mereset URL atau masuk mode demo.';
          } else if (lower.includes('rate limit')) {
            msg = 'Batas pengiriman email Supabase tercapai. Matikan "Confirm email" di menu Authentication > Providers > Email di Supabase.';
          } else if (lower.includes('already registered')) {
            msg = 'Email ini sudah terdaftar. Silakan langsung masuk (Login).';
          } else if (lower.includes('database error')) {
            msg = 'Error database saat menyimpan profil: Pastikan migration SQL sudah dijalankan di Supabase SQL Editor.';
          } else if (lower.includes('valid email')) {
            msg = 'Format alamat email tidak diterima oleh Supabase. Gunakan email aktif (seperti @gmail.com).';
          }
          showToast(msg, 'error');
          return { success: false, error: msg };
        }

        if (data?.user) {
          const newProfile: UserProfile = {
            id: data.user.id,
            username,
            displayName: username,
            email,
            avatarUrl: '/logo_snakepreview.png',
            isPro: false,
            joinedDate: `Bergabung ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
            userCode: `SNK-${Math.floor(1000 + Math.random() * 9000)}`
          };
          setUser(newProfile);
          setStats(freshStats);
          saveScopedUserStats(data.user.id, freshStats);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newProfile));
        }
      } else {
        const localUserId = `usr_local_${username.toLowerCase()}_${Date.now()}`;
        const newProfile: UserProfile = {
          id: localUserId,
          username,
          displayName: username,
          email,
          avatarUrl: DEFAULT_USER.avatarUrl,
          isPro: false,
          joinedDate: `Bergabung ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
          userCode: `SNK-${Math.floor(1000 + Math.random() * 9000)}`
        };
        setUser(newProfile);
        setStats(freshStats);
        saveScopedUserStats(localUserId, freshStats);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newProfile));
      }

      setIsLoggedIn(true);
      setShowRegisterModal(false);
      playSound('complete');
      showToast(`Akun berhasil dibuat! Halo ${username}`);
      return { success: true };
    } catch (e: unknown) {
      const origMsg = (e as Error).message || '';
      let msg = origMsg;
      if (origMsg.toLowerCase().includes('failed to fetch') || (e as { name?: string }).name === 'AuthRetryableFetchError') {
        msg = 'Gagal terhubung ke Supabase (URL tidak dapat dijangkau). Pastikan URL bukan nama proyek (bukan "snakeling8"), melainkan Project URL di menu Project Settings → Data API (format: https://[id-acak].supabase.co). Anda dapat mereset URL atau masuk mode demo.';
      } else {
        msg = origMsg || 'Gagal mendaftar';
      }
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Instant local/demo entry
  const continueWithDemo = (customUsername?: string, customEmail?: string) => {
    const finalUsername = customUsername?.trim() || 'SiswaPython';
    const demoId = `usr_demo_${finalUsername.toLowerCase()}`;
    const existingStats = getScopedUserStats(demoId);
    const demoStats: UserStats = existingStats || {
      ...createCleanStats(),
      gems: 999999
    };
    const demoProfile: UserProfile = {
      id: demoId,
      username: finalUsername,
      displayName: finalUsername,
      email: customEmail?.trim() || `${finalUsername.toLowerCase()}@snakeling.app`,
      avatarUrl: DEFAULT_USER.avatarUrl,
      isPro: false,
      joinedDate: 'Mode Demo',
      userCode: `SNK-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setUser(demoProfile);
    setStats(demoStats);
    saveScopedUserStats(demoId, demoStats);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(demoProfile));
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setShowRegisterModal(false);
    playSound('complete');
    showToast(`Masuk sebagai ${finalUsername} (Mode Demo / Lokal)`);
  };

  // Auth: Logout
  const logoutUser = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setIsLoggedIn(false);
    setUser(DEFAULT_USER);
    setStats(createCleanStats());
    localStorage.setItem('snakeling_is_logged_in', 'false');
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem('snakeling_user_stats');
    showToast('Kamu telah keluar dari akun.', 'info');
  };

  // Build dynamic leaderboard list that contains ONLY real accounts ever created
  const leaderboard: LeaderboardUser[] = React.useMemo(() => {
    // 1. If connected to Supabase and database users are fetched:
    if (isSupabaseConfigured && dbLeaderboard.length > 0) {
      const userExistsInDb = dbLeaderboard.some(
        (u) => u.isCurrentUser || (user.id && u.name.includes(user.displayName)) || u.name.includes(user.username)
      );

      const list = dbLeaderboard.map((item) => {
        const isCurrent = item.isCurrentUser || (user.id && item.name.includes(user.displayName)) || item.name.includes(user.username);
        return {
          ...item,
          name: isCurrent ? `${user.displayName} (Kamu)` : item.name,
          xp: isCurrent ? Math.max(item.xp, stats.xp) : item.xp,
          isCurrentUser: isCurrent
        };
      });

      // If current user is logged in but not yet returned in dbLeaderboard, include current user
      if (isLoggedIn && !userExistsInDb) {
        const userInitials = (user.displayName || user.username || 'U')
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        list.push({
          rank: 0,
          initials: userInitials || 'SN',
          name: `${user.displayName} (Kamu)`,
          xp: stats.xp,
          isCurrentUser: true,
          avatarUrl: user.avatarUrl
        });
      }

      list.sort((a, b) => b.xp - a.xp);
      return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
    }

    // 2. Fallback to local persistent store of accounts ever created:
    const stored = getStoredAccounts();
    // Ensure current user is in stored accounts if logged in
    if (isLoggedIn && user.username) {
      const exists = stored.some(
        (a) => a.id === user.id || a.username.toLowerCase() === user.username.toLowerCase()
      );
      if (!exists) {
        stored.push({
          id: user.id,
          username: user.username,
          displayName: user.displayName || user.username,
          avatarUrl: user.avatarUrl || '/logo_snakepreview.png',
          xp: stats.xp || 0,
          streak: stats.streak || 1,
          joinedDate: user.joinedDate
        });
      }
    }

    const list: LeaderboardUser[] = stored.map((acc) => {
      const isCur = acc.id === user.id || acc.username.toLowerCase() === user.username.toLowerCase();
      const initials = (acc.displayName || acc.username || 'U')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return {
        rank: 0,
        initials,
        name: isCur ? `${acc.displayName} (Kamu)` : acc.displayName,
        xp: isCur ? Math.max(acc.xp, stats.xp) : acc.xp,
        avatarUrl: acc.avatarUrl,
        isCurrentUser: isCur
      };
    });

    list.sort((a, b) => b.xp - a.xp);
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [dbLeaderboard, isSupabaseConfigured, user.id, user.displayName, user.username, user.avatarUrl, stats.xp, isLoggedIn]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        stats,
        isLoggedIn,
        showLoginModal,
        setShowLoginModal,
        showRegisterModal,
        setShowRegisterModal,
        showProModal,
        setShowProModal,
        soundEnabled,
        setSoundEnabled,
        toast,
        showToast,
        playSound,
        purchaseShopItem,
        refillHearts,
        loseHeart,
        finishLesson,
        equipCosmetic,
        upgradeToPro,
        loginUser,
        registerUser,
        continueWithDemo,
        logoutUser,
        leaderboard,
        refreshLeaderboard,
        activeLessonModal,
        setActiveLessonModal,
        selectedLessonId,
        setSelectedLessonId,
        isLessonActive,
        setIsLessonActive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
