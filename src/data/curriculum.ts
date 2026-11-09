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

export const LESSON_UNITS: LessonUnit[] = [
  convertModuleToLessonUnit(MODULE_CATALOG[0]),
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
  },
  {
    id: 'unit1_lesson4',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 4,
    title: 'Aritmatika Dasar Minuman',
    subtitle: 'Menghitung total harga dan jumlah cangkir kopi',
    xpReward: 35,
    gemReward: 15,
    questions: [
      {
        id: 'q4_1',
        type: 'code_predict',
        prompt: 'Berapakah hasil dari ekspresi perhitungan Python berikut?',
        codeSnippet: 'harga_kopi = 15000\njumlah = 2\ntotal = harga_kopi * jumlah\nprint(total)',
        options: ['30000', '150002', '30000.0', 'Error'],
        correctAnswer: '30000',
        explanation: 'Operator `*` digunakan untuk perkalian antar bilangan integer di Python (15000 * 2 = 30000).'
      },
      {
        id: 'q4_2',
        type: 'fill_blank',
        prompt: 'Lengkapi operator untuk menghitung kembalian uang:',
        codeSnippet: 'kembalian = bayar __ total_belanja',
        options: ['-', '+', '/', '%'],
        correctAnswer: '-',
        explanation: 'Gunakan operator pengurangan `-` untuk menghitung sisa atau kembalian uang.'
      }
    ]
  },
  {
    id: 'unit1_lesson5',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 5,
    title: 'Input Pengguna',
    subtitle: 'Menerima pesanan langsung dari ketikan pengguna',
    xpReward: 40,
    gemReward: 20,
    questions: [
      {
        id: 'q5_1',
        type: 'multiple_choice',
        prompt: 'Fungsi bawaan Python apa yang digunakan untuk menerima masukan teks dari pengguna?',
        options: ['input()', 'read()', 'scan()', 'prompt()'],
        correctAnswer: 'input()',
        explanation: 'Fungsi `input("Pesan...")` meminta input dari keyboard terminal dan mengembalikannya sebagai tipe string.'
      },
      {
        id: 'q5_2',
        type: 'code_order',
        prompt: 'Susun kode untuk meminta nama pemesan minuman:',
        options: ['nama', '=', 'input', '(', '"Nama anda: "', ')'],
        correctAnswer: ['nama', '=', 'input', '(', '"Nama anda: "', ')'],
        explanation: 'Urutan variabel nama, operator penugasan `=`, fungsi input, dan pesan prompt di dalam tanda kurung.'
      }
    ]
  },
  {
    id: 'unit1_lesson6',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 6,
    title: 'Latihan Praktik Terminal',
    subtitle: 'Konversi tipe data input angka dengan int()',
    xpReward: 40,
    gemReward: 20,
    questions: [
      {
        id: 'q6_1',
        type: 'code_predict',
        prompt: 'Fungsi input() selalu menghasilkan tipe teks (string). Apa yang terjadi jika kode berikut dijalankan?',
        codeSnippet: 'jumlah = "3"\ntotal = jumlah * 2\nprint(total)',
        options: ['33', '6', 'Error', 'None'],
        correctAnswer: '33',
        explanation: 'Perkalian string dengan integer di Python akan menduplikasi teks string ("3" * 2 = "33"). Gunakan int() jika ingin operasi matematika!'
      },
      {
        id: 'q6_2',
        type: 'fill_blank',
        prompt: 'Lengkapi konversi teks menjadi bilangan bulat (integer):',
        codeSnippet: 'angka = ____(input("Jumlah cangkir: "))',
        options: ['int', 'str', 'float', 'number'],
        correctAnswer: 'int',
        explanation: 'Fungsi `int()` mengubah teks numerik menjadi tipe bilangan bulat agar dapat dihitung secara aritmatika.'
      }
    ]
  },
  {
    id: 'unit1_lesson7',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 7,
    title: 'Format Teks f-string Lanjutan',
    subtitle: 'Menampilkan ringkasan nota pesanan elegan',
    xpReward: 45,
    gemReward: 25,
    questions: [
      {
        id: 'q7_1',
        type: 'code_predict',
        prompt: 'Apa keluaran dari baris kode f-string berikut?',
        codeSnippet: 'menu = "Kopi Latte"\nharga = 25000\nprint(f"1 {menu} = Rp{harga}")',
        options: [
          '1 Kopi Latte = Rp25000',
          '1 {menu} = Rp{harga}',
          '1 menu = Rpharga',
          'Error: syntax salah'
        ],
        correctAnswer: '1 Kopi Latte = Rp25000',
        explanation: 'Di dalam f-string, ekspresi di dalam kurung kurawal `{menu}` dan `{harga}` akan otomatis diganti dengan nilai variabelnya.'
      }
    ]
  },
  {
    id: 'unit1_lesson8',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 8,
    title: 'Logika Boolean',
    subtitle: 'Mengenal nilai kebenaran True dan False',
    xpReward: 45,
    gemReward: 25,
    questions: [
      {
        id: 'q8_1',
        type: 'multiple_choice',
        prompt: 'Manakah penulisan nilai Boolean yang benar di Python?',
        options: ['True dan False', 'true dan false', 'TRUE dan FALSE', '1 dan 0 saja'],
        correctAnswer: 'True dan False',
        explanation: 'Di Python, tipe data Boolean ditulis dengan huruf kapital di awal: `True` dan `False`.'
      },
      {
        id: 'q8_2',
        type: 'code_predict',
        prompt: 'Apa hasil evaluasi perbandingan berikut?',
        codeSnippet: 'tersedia = True\nprint(tersedia == True)',
        options: ['True', 'False', 'tersedia', 'Error'],
        correctAnswer: 'True',
        explanation: 'Operator kesetaraan `==` membandingkan nilai, dan karena `tersedia` bernilai `True`, hasilnya adalah `True`.'
      }
    ]
  },
  {
    id: 'unit1_lesson9',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 9,
    title: 'Review Cepat Sintaks',
    subtitle: 'Menguji kepekaan sintaks dan indentasi Python',
    xpReward: 50,
    gemReward: 25,
    questions: [
      {
        id: 'q9_1',
        type: 'multiple_choice',
        prompt: 'Simbol apa yang digunakan untuk membuat komentar 1 baris di Python?',
        options: ['#', '//', '/*', '--'],
        correctAnswer: '#',
        explanation: 'Di Python, tanda pagar `#` digunakan untuk menulis komentar satu baris yang diabaikan oleh penerjemah Python.'
      }
    ]
  },
  {
    id: 'unit1_lesson10',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 10,
    title: 'Tantangan Mini Game Kasir',
    subtitle: 'Simulasi pemesanan minuman mini di kafe',
    xpReward: 50,
    gemReward: 30,
    questions: [
      {
        id: 'q10_1',
        type: 'code_predict',
        prompt: 'Perhatikan simulasi mini kasir berikut, berapa total tagihan yang tercetak?',
        codeSnippet: 'pesanan = "Boba"\nharga = 18000\ndiskon = 3000\ntagihan = harga - diskon\nprint(f"Tagihan: Rp{tagihan}")',
        options: ['Tagihan: Rp15000', 'Tagihan: Rp18000', 'Tagihan: Rp21000', 'Error'],
        correctAnswer: 'Tagihan: Rp15000',
        explanation: 'Harga 18.000 dikurangi diskon 3.000 menghasilkan tagihan Rp15.000.'
      }
    ]
  },
  {
    id: 'unit1_lesson11',
    unitNumber: 1,
    unitTitle: 'Menawarkan dan menerima minuman',
    lessonOrder: 11,
    title: 'Ujian Sertifikasi Unit 1',
    subtitle: 'Uji pemahaman komprehensif seluruh materi dasar Python',
    xpReward: 80,
    gemReward: 50,
    questions: [
      {
        id: 'q11_1',
        type: 'multiple_choice',
        prompt: 'Manakah nama variabel yang TIDAK valid di Python?',
        options: ['2minuman', 'minuman_2', '_minuman', 'namaMinuman'],
        correctAnswer: '2minuman',
        explanation: 'Nama variabel di Python tidak boleh diawali dengan angka.'
      },
      {
        id: 'q11_2',
        type: 'code_order',
        prompt: 'Susun kode lengkap menyapa dan menampilkan pesanan pembeli:',
        options: ['nama = "Budi"', 'print(', 'f"Halo {nama}, selamat menikmati!"', ')'],
        correctAnswer: ['nama = "Budi"', 'print(', 'f"Halo {nama}, selamat menikmati!"', ')'],
        explanation: 'Mendefinisikan variabel nama terlebih dahulu sebelum menggunakannya di dalam fungsi print f-string.'
      }
    ]
  },

  // UNIT 2: Logika Kondisi & Percabangan
  {
    id: 'unit2_lesson1',
    unitNumber: 2,
    unitTitle: 'Logika Kondisi & Percabangan',
    lessonOrder: 1,
    title: 'Kondisi if & Logika Dasar',
    subtitle: 'Mengecek syarat kebenaran kondisi dengan perintah if',
    xpReward: 35,
    gemReward: 15,
    questions: [
      {
        id: 'u2_q1_1',
        type: 'code_predict',
        prompt: 'Apa keluaran dari blok kode logika kondisi berikut?',
        codeSnippet: 'umur = 18\nif umur >= 17:\n    print("Bisa pesan kopi espresso")',
        options: ['Bisa pesan kopi espresso', 'Tidak tercetak apapun', 'Error: indentasi salah', 'False'],
        correctAnswer: 'Bisa pesan kopi espresso',
        explanation: 'Karena `18 >= 17` bernilai `True`, blok di dalam `if` akan dieksekusi.'
      },
      {
        id: 'u2_q1_2',
        type: 'multiple_choice',
        prompt: 'Simbol apa yang wajib ditulis di akhir baris pernyataan `if` sebelum blok kode baru?',
        options: [': (titik dua)', '; (titik koma)', '{ (kurung kurawal)', '=> (panah)'],
        correctAnswer: ': (titik dua)',
        explanation: 'Di Python, pernyataan `if`, `else`, dan `elif` harus diakhiri dengan titik dua `:`.'
      }
    ]
  },
  {
    id: 'unit2_lesson2',
    unitNumber: 2,
    unitTitle: 'Logika Kondisi & Percabangan',
    lessonOrder: 2,
    title: 'Percabangan else & Alternatif',
    subtitle: 'Menyediakan jalur alternatif jika kondisi bernilai False',
    xpReward: 35,
    gemReward: 15,
    questions: [
      {
        id: 'u2_q2_1',
        type: 'code_predict',
        prompt: 'Perhatikan kondisi berikut. Teks mana yang akan tercetak?',
        codeSnippet: 'stok = 0\nif stok > 0:\n    print("Minuman Siap!")\nelse:\n    print("Stok Habis!")',
        options: ['Stok Habis!', 'Minuman Siap!', 'Error', 'stok > 0'],
        correctAnswer: 'Stok Habis!',
        explanation: 'Karena `stok > 0` adalah `False` (0 tidak lebih besar dari 0), blok `else` yang akan dijalankan.'
      }
    ]
  },
  {
    id: 'unit2_lesson3',
    unitNumber: 2,
    unitTitle: 'Logika Kondisi & Percabangan',
    lessonOrder: 3,
    title: 'Kondisi Majemuk elif',
    subtitle: 'Memeriksa banyak pilihan cabang keputusan sekaligus',
    xpReward: 40,
    gemReward: 20,
    questions: [
      {
        id: 'u2_q3_1',
        type: 'code_predict',
        prompt: 'Berapa harga yang akan ditampilkan oleh program?',
        codeSnippet: 'ukuran = "L"\nif ukuran == "S":\n    print("15000")\nelif ukuran == "M":\n    print("20000")\nelif ukuran == "L":\n    print("25000")',
        options: ['25000', '20000', '15000', 'None'],
        correctAnswer: '25000',
        explanation: 'Kondisi `ukuran == "L"` cocok, sehingga harga 25000 yang akan dicetak.'
      }
    ]
  },
  {
    id: 'unit2_lesson4',
    unitNumber: 2,
    unitTitle: 'Logika Kondisi & Percabangan',
    lessonOrder: 4,
    title: 'Operator Logika and & or',
    subtitle: 'Menggabungkan beberapa syarat kondisi sekaligus',
    xpReward: 40,
    gemReward: 20,
    questions: [
      {
        id: 'u2_q4_1',
        type: 'multiple_choice',
        prompt: 'Operator logika mana yang membutuhkan KEDUA syarat bernilai True agar bernilai True?',
        options: ['and', 'or', 'not', 'xor'],
        correctAnswer: 'and',
        explanation: 'Operator `and` hanya akan menghasilkan `True` jika seluruh syarat di kiri dan kanannya bernilai `True`.'
      }
    ]
  },
  {
    id: 'unit2_lesson5',
    unitNumber: 2,
    unitTitle: 'Logika Kondisi & Percabangan',
    lessonOrder: 5,
    title: 'Nested if (Kondisi Bersarang)',
    subtitle: 'Membuat kondisi di dalam percabangan kondisi lainnya',
    xpReward: 45,
    gemReward: 20,
    questions: [
      {
        id: 'u2_q5_1',
        type: 'code_predict',
        prompt: 'Apa pesan yang akan ditampilkan?',
        codeSnippet: 'buka = True\nmember = True\nif buka:\n    if member:\n        print("Diskon Member 20%")\n    else:\n        print("Harga Normal")',
        options: ['Diskon Member 20%', 'Harga Normal', 'Toko Tutup', 'Error'],
        correctAnswer: 'Diskon Member 20%',
        explanation: 'Karena `buka` dan `member` keduanya `True`, blok bersarang `print("Diskon Member 20%")` dieksekusi.'
      }
    ]
  },
  {
    id: 'unit2_lesson6',
    unitNumber: 2,
    unitTitle: 'Logika Kondisi & Percabangan',
    lessonOrder: 6,
    title: 'Studi Kasus Menu Restoran',
    subtitle: 'Menerapkan logika percabangan pada aplikasi kasir',
    xpReward: 50,
    gemReward: 25,
    questions: [
      {
        id: 'u2_q6_1',
        type: 'fill_blank',
        prompt: 'Lengkapi kata kunci kondisi alternatif:',
        codeSnippet: 'if poin >= 100:\n    print("Voucher Kopi Gratis")\n____:\n    print("Kumpulkan poin lagi!")',
        options: ['else', 'elif', 'then', 'stop'],
        correctAnswer: 'else',
        explanation: 'Gunakan `else:` untuk menangkap semua kondisi lainnya jika syarat `if` tidak terpenuhi.'
      }
    ]
  },
  {
    id: 'unit2_lesson7',
    unitNumber: 2,
    unitTitle: 'Logika Kondisi & Percabangan',
    lessonOrder: 7,
    title: 'Evaluasi Akhir Unit 2',
    subtitle: 'Ujian komprehensif logika percabangan Python',
    xpReward: 80,
    gemReward: 50,
    questions: [
      {
        id: 'u2_q7_1',
        type: 'code_predict',
        prompt: 'Apa hasil akhir dari evaluasi logika berikut?',
        codeSnippet: 'x = 10\ny = 5\nprint(x > 5 and y < 3)',
        options: ['False', 'True', '10', 'Error'],
        correctAnswer: 'False',
        explanation: '`x > 5` adalah True, tetapi `y < 3` adalah False (5 tidak kurang dari 3). Karena operator `and`, hasilnya `False`.'
      }
    ]
  },

  // UNIT 3: Struktur Data List & Koleksi
  {
    id: 'unit3_lesson1',
    unitNumber: 3,
    unitTitle: 'Struktur Data List & Koleksi',
    lessonOrder: 1,
    title: 'Mengenal List Python []',
    subtitle: 'Menyimpan banyak barang dalam satu variabel',
    xpReward: 35,
    gemReward: 15,
    questions: [
      {
        id: 'u3_q1_1',
        type: 'multiple_choice',
        prompt: 'Simbol kurung apa yang digunakan untuk membuat List di Python?',
        options: ['[ ] (kurung siku)', '( ) (kurung biasa)', '{ } (kurung kurawal)', '< > (kurung sudut)'],
        correctAnswer: '[ ] (kurung siku)',
        explanation: 'List di Python dibuat dengan mengapit elemen-elemen menggunakan kurung siku `[ ]`.'
      }
    ]
  },
  {
    id: 'unit3_lesson2',
    unitNumber: 3,
    unitTitle: 'Struktur Data List & Koleksi',
    lessonOrder: 2,
    title: 'Indeks & Mengakses Elemen',
    subtitle: 'Mengambil item pertama dengan indeks 0',
    xpReward: 35,
    gemReward: 15,
    questions: [
      {
        id: 'u3_q2_1',
        type: 'code_predict',
        prompt: 'Item manakah yang tercetak dari list berikut?',
        codeSnippet: 'menu = ["Teh", "Kopi", "Jus"]\nprint(menu[0])',
        options: ['Teh', 'Kopi', 'Jus', 'menu[0]'],
        correctAnswer: 'Teh',
        explanation: 'Di Python, indeks list dimulai dari angka `0`. Jadi `menu[0]` adalah item pertama: "Teh".'
      }
    ]
  },
  {
    id: 'unit3_lesson3',
    unitNumber: 3,
    unitTitle: 'Struktur Data List & Koleksi',
    lessonOrder: 3,
    title: 'Menambah Data: append()',
    subtitle: 'Menambahkan barang baru ke urutan paling akhir',
    xpReward: 40,
    gemReward: 20,
    questions: [
      {
        id: 'u3_q3_1',
        type: 'fill_blank',
        prompt: 'Lengkapi metode untuk menambahkan item "Susu" ke dalam list:',
        codeSnippet: 'menu.____("Susu")',
        options: ['append', 'add', 'push', 'insert'],
        correctAnswer: 'append',
        explanation: 'Metode `.append(item)` menambahkan elemen baru ke bagian akhir dari List.'
      }
    ]
  },
  {
    id: 'unit3_lesson4',
    unitNumber: 3,
    unitTitle: 'Struktur Data List & Koleksi',
    lessonOrder: 4,
    title: 'Menghapus Data: remove()',
    subtitle: 'Menghapus item tertentu dari daftar koleksi',
    xpReward: 40,
    gemReward: 20,
    questions: [
      {
        id: 'u3_q4_1',
        type: 'code_predict',
        prompt: 'Berapa sisa isi list setelah perintah remove berikut?',
        codeSnippet: 'buah = ["Apel", "Jeruk", "Pisang"]\nbuah.remove("Jeruk")\nprint(len(buah))',
        options: ['2', '3', '1', '0'],
        correctAnswer: '2',
        explanation: 'Setelah "Jeruk" dihapus dengan `.remove()`, sisa elemen di dalam list adalah 2 ("Apel" dan "Pisang").'
      }
    ]
  },
  {
    id: 'unit3_lesson5',
    unitNumber: 3,
    unitTitle: 'Struktur Data List & Koleksi',
    lessonOrder: 5,
    title: 'Panjang List dengan len()',
    subtitle: 'Menghitung total jumlah elemen dalam list',
    xpReward: 45,
    gemReward: 20,
    questions: [
      {
        id: 'u3_q5_1',
        type: 'multiple_choice',
        prompt: 'Fungsi mana yang digunakan untuk mengetahui total jumlah item di dalam List?',
        options: ['len()', 'count()', 'size()', 'length()'],
        correctAnswer: 'len()',
        explanation: 'Fungsi `len(nama_list)` mengembalikan total jumlah elemen di dalam list.'
      }
    ]
  },
  {
    id: 'unit3_lesson6',
    unitNumber: 3,
    unitTitle: 'Struktur Data List & Koleksi',
    lessonOrder: 6,
    title: 'Slicing & Potong List',
    subtitle: 'Mengambil sebagian isi list dengan rentang indeks',
    xpReward: 50,
    gemReward: 25,
    questions: [
      {
        id: 'u3_q6_1',
        type: 'code_predict',
        prompt: 'Apa hasil pemotongan list berikut?',
        codeSnippet: 'angka = [10, 20, 30, 40, 50]\nsub = angka[1:3]\nprint(sub)',
        options: ['[20, 30]', '[10, 20]', '[20, 30, 40]', '[30, 40]'],
        correctAnswer: '[20, 30]',
        explanation: 'Slicing `[1:3]` mengambil elemen dari indeks 1 sampai sebelum indeks 3 (indeks 1 dan 2, yaitu 20 dan 30).'
      }
    ]
  },
  {
    id: 'unit3_lesson7',
    unitNumber: 3,
    unitTitle: 'Struktur Data List & Koleksi',
    lessonOrder: 7,
    title: 'Master Sertifikasi List',
    subtitle: 'Ujian kelulusan materi struktur data List Python',
    xpReward: 100,
    gemReward: 50,
    questions: [
      {
        id: 'u3_q7_1',
        type: 'code_order',
        prompt: 'Susun kode lengkap membuat list dan menambahkan elemen baru:',
        options: ['kopi = ["Espresso"]', 'kopi.append("Latte")', 'print(len(kopi))'],
        correctAnswer: ['kopi = ["Espresso"]', 'kopi.append("Latte")', 'print(len(kopi))'],
        explanation: 'Membuat list awal, menambah elemen "Latte", lalu mencetak panjang total list.'
      }
    ]
  }
];

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
