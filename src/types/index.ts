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
  lastActiveDate?: string;
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

export type QuestionType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'code_order'
  | 'code_predict'
  | 'mc'
  | 'fb'
  | 'ro'
  | 'sb';

export interface LessonTipSection {
  heading: string;
  explanation: string;
  codeSnippet?: string;
  outputSnippet?: string;
}

export interface LessonTip {
  title: string;
  body: string;
  codeExample: string;
  outputExample?: string;
  sections?: LessonTipSection[];
  notes?: string[];
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  code?: string;
  codeWithBlank?: string;
  options?: string[];
  correctAnswer?: string | string[];
  answerIndex?: number;
  acceptedAnswers?: string[];
  lines?: string[];
  distractors?: string[];
  buggyLineIndex?: number;
  fixedLine?: string;
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
  tip?: LessonTip;
  questions: QuizQuestion[];
}

export type ActiveTab = 'belajar' | 'papan_skor' | 'toko' | 'profil';
