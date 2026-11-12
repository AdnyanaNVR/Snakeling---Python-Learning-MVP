import { LessonUnit } from '../types';
import { MODULE_CATALOG } from './modules';

export const convertModuleToLessonUnit = (mod: any): LessonUnit => ({
  id: mod.id,
  unitNumber: mod.unit,
  unitTitle: mod.unitTitle,
  lessonOrder: mod.moduleNumber,
  title: mod.title,
  subtitle: mod.subtitle,
  xpReward: mod.xpReward,
  gemReward: mod.gemReward,
  tip: mod.tip,
  questions: mod.quizzes.map((q: any) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    code: q.code,
    codeSnippet: q.code || q.codeSnippet,
    codeWithBlank: q.codeWithBlank,
    options: q.options,
    answerIndex: q.answerIndex,
    acceptedAnswers: q.acceptedAnswers,
    correctAnswer: typeof q.answerIndex === 'number' && q.options ? q.options[q.answerIndex] : q.correctAnswer,
    lines: q.lines,
    distractors: q.distractors,
    buggyLineIndex: q.buggyLineIndex,
    fixedLine: q.fixedLine,
    explanation: q.explanation,
    hint: q.hint
  }))
});

export const LESSON_UNITS: LessonUnit[] = MODULE_CATALOG.map(convertModuleToLessonUnit);


export const INITIAL_LEADERBOARD = [
  { rank: 1, initials: 'RR', name: 'Rizky Ramadhan', xp: 650, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizky' },
  { rank: 2, initials: 'SN', name: 'Siti Nurhaliza', xp: 520, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti' },
  { rank: 3, initials: 'BS', name: 'Budi Santoso', xp: 440, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Budi' },
  { rank: 4, initials: 'DL', name: 'Dewi Lestari', xp: 390, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dewi' },
  { rank: 5, initials: 'FN', name: 'Fajar Nugraha', xp: 310, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Fajar' },
  { rank: 6, initials: 'AP', name: 'Aulia Putri', xp: 260, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aulia' },
  { rank: 7, initials: 'AN', name: 'Andi Pratama', xp: 210, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Andi' },
  { rank: 8, initials: 'CS', name: 'Clara Shinta', xp: 170, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Clara' },
  { rank: 9, initials: 'BS', name: 'Bayu Skak', xp: 140, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bayu' },
  { rank: 10, initials: 'HP', name: 'Hendra Pratama', xp: 90, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hendra' }
];

export const INITIAL_SHOP_ITEMS = [
  {
    id: 'streak_freeze',
    name: 'Bekukan Streak (Streak Freeze)',
    category: 'powerup' as const,
    description: 'Melindungi Streak harianmu agar tidak putus jika terlewat satu hari coding. Otomatis terpasang saat absen.',
    costGems: 200,
    icon: 'shield_flame',
    badgeText: 'Dimiliki: 1/2',
    maxQuantity: 2
  },
  {
    id: 'heart_refill',
    name: 'Isi Ulang Nyawa Instan',
    category: 'powerup' as const,
    description: 'Kembalikan 5 nyawa penuh secara kilat tanpa harus menunggu regenerasi waktu belajar 30 menit per hati.',
    costGems: 100,
    icon: 'heart',
    badgeText: 'Penuh 5/5',
    maxQuantity: 1
  },
  {
    id: 'visor_cyber',
    name: 'Cyber Coder Visor',
    category: 'cosmetic' as const,
    description: 'Aksesori kacamata visor hijau neon holografik untuk maskot Snakeling kamu.',
    costGems: 250,
    icon: 'visor',
    badgeText: 'Edisi Terbatas',
    maxQuantity: 1
  },
  {
    id: 'retro_shades',
    name: 'Kacamata Hitam Retro',
    category: 'cosmetic' as const,
    description: 'Gaya klasik programmer retro 90-an untuk tampilan maskot yang lebih santai.',
    costGems: 180,
    icon: 'glasses',
    badgeText: 'Baru',
    maxQuantity: 1
  },
  {
    id: 'golden_skin',
    name: 'Sisik Emas (Golden Scale)',
    category: 'cosmetic' as const,
    description: 'Kostum legendaris dengan aura partikel bercahaya keemasan.',
    costGems: 500,
    icon: 'gold',
    badgeText: 'Legendaris',
    maxQuantity: 1
  }
];
