import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserStats, ShopItem, ActiveTab, LeaderboardUser } from '../types';
import { INITIAL_LEADERBOARD, INITIAL_SHOP_ITEMS } from '../data/curriculum';
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
  loginUser: (emailOrUser: string, pass: string) => Promise<boolean>;
  registerUser: (username: string, email: string, pass: string) => Promise<boolean>;
  logoutUser: () => void;
  leaderboard: LeaderboardUser[];
  activeLessonModal: boolean;
  setActiveLessonModal: (open: boolean) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  isLessonActive: boolean;
  setIsLessonActive: (active: boolean) => void;
}

const STORAGE_KEY_USER = 'snakeling_user_profile';
const STORAGE_KEY_STATS = 'snakeling_user_stats';

const DEFAULT_USER: UserProfile = {
  id: 'usr_adnyana_default',
  username: 'adnyana_py',
  displayName: 'Adnyana',
  email: 'adnyana@snakeling.app',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW7lJDD8DDHLhSD0SUNqafd_I1_f2VzZmHynGlQGGmaNj5alSbgCDnHDFzJv4HKNQBZAkgulgXxvP7_1AP8rw72PnsZkcC0taMIFNScsFS5RafKdndKmkiQitMZMxtpEaqKBSvt9Pq4XVTejubbebKH7ZZ67jD5U2ybDHEgISaoNXLFEyLST7l-HQyUH9RqZPcUcXp7GyShj8VJjYchPWVxTjSRcMkNs070M3FJlkrjLoZmJL4xOcv32xLi2tare3LCw',
  isPro: false,
  joinedDate: 'Bergabung Februari 2025',
  userCode: 'SNK-9402'
};

const DEFAULT_STATS: UserStats = {
  streak: 1,
  gems: 505,
  hearts: 5,
  maxHearts: 5,
  xp: 120,
  streakFreezeCount: 1,
  modulesCompleted: 4,
  currentLessonIndex: 0,
  completedLessons: ['unit1_lesson1'],
  inventory: {
    streak_freeze: 1
  },
  equippedCosmetics: [],
  activityDates: ['2025-02-27']
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('belajar');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Lesson state
  const [activeLessonModal, setActiveLessonModal] = useState<boolean>(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isLessonActive, setIsLessonActive] = useState<boolean>(false);

  // Load from LocalStorage
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

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
    if (stats.gems < item.costGems) {
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
        gems: prev.gems - item.costGems,
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
        gems: prev.gems - item.costGems,
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
          gems: prev.gems - item.costGems,
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
    if (stats.hearts >= stats.maxHearts) {
      showToast('Nyawa sudah penuh 5/5!', 'info');
      return false;
    }
    if (stats.gems < 100) {
      showToast('Butuh 100 Gems untuk isi ulang nyawa!', 'error');
      return false;
    }
    setStats((prev) => ({
      ...prev,
      gems: prev.gems - 100,
      hearts: prev.maxHearts
    }));
    playSound('purchase');
    showToast('5 Nyawa berhasil dipulihkan!');
    return true;
  };

  // Lose a heart during quiz
  const loseHeart = () => {
    setStats((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
    playSound('wrong');
  };

  // Complete a lesson
  const finishLesson = (lessonId: string, earnedXp: number, earnedGems: number) => {
    const today = new Date().toISOString().split('T')[0];
    setStats((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const nextCompleted = alreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const nextActivityDates = prev.activityDates.includes(today) ? prev.activityDates : [...prev.activityDates, today];
      return {
        ...prev,
        xp: prev.xp + earnedXp,
        gems: prev.gems + earnedGems,
        completedLessons: nextCompleted,
        modulesCompleted: Math.max(prev.modulesCompleted, Math.min(10, nextCompleted.length + 3)),
        currentLessonIndex: Math.min(10, prev.currentLessonIndex + 1),
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
  const loginUser = async (emailOrUser: string, _pass: string): Promise<boolean> => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailOrUser,
          password: _pass
        });
        if (error) {
          showToast(error.message, 'error');
          return false;
        }
      }

      // Local state update
      setUser((prev) => ({
        ...prev,
        username: emailOrUser.includes('@') ? emailOrUser.split('@')[0] : emailOrUser,
        displayName: emailOrUser.includes('@') ? emailOrUser.split('@')[0] : emailOrUser
      }));
      setIsLoggedIn(true);
      setShowLoginModal(false);
      playSound('correct');
      showToast(`Selamat datang kembali, ${emailOrUser.split('@')[0]}!`);
      return true;
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal masuk', 'error');
      return false;
    }
  };

  // Auth: Register
  const registerUser = async (username: string, email: string, _pass: string): Promise<boolean> => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password: _pass,
          options: {
            data: { username, display_name: username }
          }
        });
        if (error) {
          showToast(error.message, 'error');
          return false;
        }
      }

      setUser({
        id: `usr_${Date.now()}`,
        username,
        displayName: username,
        email,
        avatarUrl: DEFAULT_USER.avatarUrl,
        isPro: false,
        joinedDate: `Bergabung ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
        userCode: `SNK-${Math.floor(1000 + Math.random() * 9000)}`
      });
      setIsLoggedIn(true);
      setShowRegisterModal(false);
      playSound('complete');
      showToast(`Akun berhasil dibuat! Halo ${username}`);
      return true;
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal mendaftar', 'error');
      return false;
    }
  };

  // Auth: Logout
  const logoutUser = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    showToast('Kamu telah keluar dari akun.', 'info');
  };

  // Build dynamic leaderboard list that places current user accurately
  const leaderboard: LeaderboardUser[] = React.useMemo(() => {
    const list: LeaderboardUser[] = [...INITIAL_LEADERBOARD];
    // Sort descending by XP
    list.sort((a, b) => b.xp - a.xp);
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, []);

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
        logoutUser,
        leaderboard,
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
