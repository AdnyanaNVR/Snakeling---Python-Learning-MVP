export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
  proExpiresAt?: string;
  joinedDate: string;
  userCode: string;
}

export interface UserStats {
  streak: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  xp: number;
  streakFreezeCount: number;
  modulesCompleted: number;
  currentLessonIndex: number;
  completedLessons: string[];
  inventory: Record<string, number>;
  equippedCosmetics: string[];
  activityDates: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'powerup' | 'cosmetic' | 'subscription';
  description: string;
  costGems: number;
  icon: string;
  badgeText?: string;
  maxQuantity?: number;
}

export interface LeaderboardUser {
  rank: number;
  initials: string;
  name: string;
  xp: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

export type QuestionType = 'multiple_choice' | 'fill_blank' | 'code_order' | 'code_predict';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
}

export interface LessonUnit {
  id: string;
  unitNumber: number;
  unitTitle: string;
  lessonOrder: number;
  title: string;
  subtitle: string;
  xpReward: number;
  gemReward: number;
  questions: QuizQuestion[];
}

export type ActiveTab = 'belajar' | 'papan_skor' | 'toko' | 'profil';
