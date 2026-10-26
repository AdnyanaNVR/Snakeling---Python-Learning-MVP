import { LessonUnit } from '../types';

export const LESSON_UNITS: LessonUnit[] = [
  {
    id: 'unit1_lesson1',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 1,
    title: 'Perintah print() & Salam Pertama',
    subtitle: 'Mencetak teks ucapan dan menyapa teman di terminal',
    xpReward: 30,
    gemReward: 15,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: 'Fungsi mana yang digunakan di Python untuk mencetak teks ke layar terminal?',
        options: ['print()', 'echo()', 'display()', 'console.log()'],
        correctAnswer: 'print()',
        explanation: 'Di Python, fungsi standar bawaan untuk menampilkan teks ke layar adalah `print()`.'
      },
      {
        id: 'q2',
        type: 'code_predict',
        prompt: 'Perhatikan kode berikut. Apa hasil keluaran yang akan tercetak?',
        codeSnippet: 'print("Silakan minum teh hangat!")',
        options: [
          'Silakan minum teh hangat!',
          '"Silakan minum teh hangat!"',
          'print("Silakan minum teh hangat!")',
          'Error: tanda kutip salah'
        ],
        correctAnswer: 'Silakan minum teh hangat!',
        explanation: 'Fungsi `print()` mencetak isi teks di dalam tanda kutip tanpa tanda kutip itu sendiri.'
      },
      {
        id: 'q3',
        type: 'fill_blank',
        prompt: 'Lengkapi kode berikut agar mencetak "Mau jus jeruk?":',
        codeSnippet: '____("Mau jus jeruk?")',
        options: ['print', 'show', 'write', 'say'],
        correctAnswer: 'print',
        explanation: 'Gunakan kata kunci `print` diikuti tanda kurung untuk memanggil fungsi cetak.'
      },
      {
        id: 'q4',
        type: 'code_order',
        prompt: 'Susun kata-kata berikut agar membentuk baris kode Python yang valid:',
        options: ['print', '(', '"Kopi hangat"', ')'],
        correctAnswer: ['print', '(', '"Kopi hangat"', ')'],
        explanation: 'Urutan pemanggilan fungsi: nama fungsi `print`, buka kurung `(`, teks `"Kopi hangat"`, lalu tutup kurung `)`.'
      }
    ]
  },
  {
    id: 'unit1_lesson2',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 2,
    title: 'Variabel Minuman & Tipe String',
    subtitle: 'Menyimpan nama minuman ke dalam variabel',
    xpReward: 30,
    gemReward: 15,
    questions: [
      {
        id: 'q2_1',
        type: 'multiple_choice',
        prompt: 'Bagaimana cara menyimpan teks "Air Mineral" ke dalam variabel bernama `pesanan`?',
        options: [
          'pesanan = "Air Mineral"',
          'var pesanan = "Air Mineral"',
          'let pesanan = "Air Mineral"',
          'pesanan := "Air Mineral"'
        ],
        correctAnswer: 'pesanan = "Air Mineral"',
        explanation: 'Python tidak memerlukan kata kunci `var` atau `let`. Cukup tulis nama variabel diikuti tanda sama dengan `=`. '
      },
      {
        id: 'q2_2',
        type: 'code_predict',
        prompt: 'Apa keluaran dari baris kode Python berikut?',
        codeSnippet: 'minuman = "Es Kopi Susu"\nprint(minuman)',
        options: [
          'Es Kopi Susu',
          'minuman',
          '"minuman"',
          'None'
        ],
        correctAnswer: 'Es Kopi Susu',
        explanation: 'Karena kita mencetak variabel `minuman` (tanpa tanda kutip), Python akan mengambil nilai di dalamnya: "Es Kopi Susu".'
      },
      {
        id: 'q2_3',
        type: 'fill_blank',
        prompt: 'Lengkapi variabel berikut dengan operator penugasan:',
        codeSnippet: 'gelas __ 3',
        options: ['=', '==', '->', ':'],
        correctAnswer: '=',
        explanation: 'Gunakan operator tunggal `=` untuk menugaskan (assign) nilai ke variabel.'
      }
    ]
  },
  {
    id: 'unit1_lesson3',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 3,
    title: 'Penggabungan String Minuman',
    subtitle: 'Menggabungkan teks pesanan minuman dengan operator +',
    xpReward: 35,
    gemReward: 20,
    questions: [
      {
        id: 'q3_1',
        type: 'code_predict',
        prompt: 'Apa hasil cetak dari penggabungan string berikut?',
        codeSnippet: 'print("Teh" + " " + "Manis")',
        options: ['Teh Manis', 'TehManis', '"Teh" "Manis"', 'Error'],
        correctAnswer: 'Teh Manis',
        explanation: 'Tanda `+` di antara string akan menggabungkan teks. Karena ada spasi `" "`, hasilnya adalah "Teh Manis".'
      },
      {
        id: 'q3_2',
        type: 'multiple_choice',
        prompt: 'Manakah cara penggabungan f-string yang paling modern dan rapi di Python?',
        options: [
          'f"Pesanan: {minuman}"',
          '"Pesanan: %s" % minuman',
          '"Pesanan: " + str(minuman)',
          'format("Pesanan:", minuman)'
        ],
        correctAnswer: 'f"Pesanan: {minuman}"',
        explanation: 'F-string dengan awalan `f"..."` dan kurung kurawal `{}` adalah cara resmi dan paling elegan di Python modern.'
      }
    ]
  }
];

export const INITIAL_LEADERBOARD = [
  { rank: 1, initials: 'AT', name: 'Aris Thorne', xp: 450 },
  { rank: 2, initials: 'BS', name: 'Budi Santoso', xp: 380 },
  { rank: 3, initials: 'DL', name: 'Dewi Lestari', xp: 320 },
  { rank: 4, initials: 'CW', name: 'Cynthia W.', xp: 290 },
  { rank: 5, initials: 'FN', name: 'Fajar Nugraha', xp: 210 },
  { rank: 6, initials: 'GS', name: 'Gita Savitri', xp: 175 },
  { rank: 7, initials: 'HP', name: 'Hendra Pratama', xp: 120 }
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
    id: 'xp_boost',
    name: 'Pengganda XP (15 Menit)',
    category: 'powerup' as const,
    description: 'Dapatkan 2x lipat poin pengalaman (XP) untuk setiap latihan yang diselesaikan dalam 15 menit ke depan.',
    costGems: 150,
    icon: 'lightning',
    badgeText: 'Populer',
    maxQuantity: 5
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
