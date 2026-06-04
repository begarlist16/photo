// ============================================================
//  Begarlist 16 — Data Foto
//  Format setiap entri:
//  {
//    id: (angka unik),
//    title: "Judul / deskripsi foto",
//    category: "Moments" | "Bali" | "Jogja" | "Pose" | "BTS" | "Staff & Guru",
//    src: "URL Google Photos atau gambar lain",
//    description: "Deskripsi singkat untuk fitur pencarian"
//  }
// ============================================================

const PHOTOS = [

  // ── 10 IPS 3 → Moments ─────────────────────────────────────
  {
    id: 1,
    title: "Momen Kelas Bareng",
    category: "Moments",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    description: "Foto bersama seluruh kelas 10 IPS 3, penuh tawa dan kebersamaan."
  },
  {
    id: 2,
    title: "Istirahat Siang",
    category: "Moments",
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    description: "Momen santai di jam istirahat bersama teman-teman."
  },
  {
    id: 3,
    title: "Tugas Kelompok",
    category: "Moments",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    description: "Sesi kerja kelompok yang seru dan penuh semangat."
  },
  {
    id: 4,
    title: "Senyum Pagi",
    category: "Moments",
    src: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80",
    description: "Energi pagi hari yang selalu menyenangkan di kelas."
  },
  {
    id: 5,
    title: "Candid Koridor",
    category: "Moments",
    src: "https://images.unsplash.com/photo-1547623641-d2c56c03e2a7?w=800&q=80",
    description: "Tangkapan candid di koridor sekolah."
  },
  {
    id: 6,
    title: "Gosip Santai",
    category: "Moments",
    src: "https://images.unsplash.com/photo-1536321115970-5dfa13356211?w=800&q=80",
    description: "Obrolan seru antar teman di sudut kelas."
  },

  // ── 10 IPS 3 → Bali ────────────────────────────────────────
  {
    id: 7,
    title: "Pantai Bali",
    category: "Bali",
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    description: "Keindahan pantai Bali yang memukau saat study trip."
  },
  {
    id: 8,
    title: "Pura Tanah Lot",
    category: "Bali",
    src: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    description: "Mengunjungi Pura Tanah Lot yang ikonik di tepi laut."
  },
  {
    id: 9,
    title: "Sawah Tegalalang",
    category: "Bali",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    description: "Pemandangan sawah terasering Tegalalang yang hijau dan indah."
  },
  {
    id: 10,
    title: "Sunset Kuta",
    category: "Bali",
    src: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80",
    description: "Sunset memukau di Pantai Kuta bersama seluruh rombongan."
  },
  {
    id: 11,
    title: "Ubud Village",
    category: "Bali",
    src: "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80",
    description: "Menjelajahi desa Ubud yang asri dan penuh budaya."
  },
  {
    id: 12,
    title: "Tari Kecak",
    category: "Bali",
    src: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    description: "Menyaksikan pertunjukan Tari Kecak yang memukau di Uluwatu."
  },

  // ── 10 IPS 3 → Jogja ───────────────────────────────────────
  {
    id: 13,
    title: "Borobudur Pagi",
    category: "Jogja",
    src: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80",
    description: "Kunjungan ke Candi Borobudur di pagi hari yang sejuk."
  },
  {
    id: 14,
    title: "Malioboro",
    category: "Jogja",
    src: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80",
    description: "Berjalan-jalan di Jalan Malioboro yang ramai dan penuh warna."
  },
  {
    id: 15,
    title: "Prambanan Sore",
    category: "Jogja",
    src: "https://images.unsplash.com/photo-1617543199016-4dc26a0ac05b?w=800&q=80",
    description: "Candi Prambanan yang megah saat sore hari."
  },
  {
    id: 16,
    title: "Keraton Yogyakarta",
    category: "Jogja",
    src: "https://images.unsplash.com/photo-1582711012124-a56cf82307a0?w=800&q=80",
    description: "Mengunjungi Keraton Yogyakarta dan belajar budaya Jawa."
  },
  {
    id: 17,
    title: "Gudeg Jogja",
    category: "Jogja",
    src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    description: "Menikmati gudeg khas Jogja yang lezat bersama teman."
  },
  {
    id: 18,
    title: "Pantai Parangtritis",
    category: "Jogja",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "Foto bersama di tepi Pantai Parangtritis yang legendaris."
  },

  // ── Buku Tahunan → Pose ─────────────────────────────────────
  {
    id: 19,
    title: "Foto Formal Kelas",
    category: "Pose",
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
    description: "Sesi foto formal kelas untuk buku tahunan."
  },
  {
    id: 20,
    title: "Pose Individu",
    category: "Pose",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    description: "Foto individu terbaik untuk halaman buku tahunan."
  },
  {
    id: 21,
    title: "Geng Squad",
    category: "Pose",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    description: "Pose kece bersama squad terbaik."
  },
  {
    id: 22,
    title: "Foto Wisuda",
    category: "Pose",
    src: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80",
    description: "Momen wisuda yang penuh kebanggaan."
  },
  {
    id: 23,
    title: "Creative Shot",
    category: "Pose",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    description: "Sesi foto kreatif dengan berbagai gaya pose unik."
  },
  {
    id: 24,
    title: "Foto Terbaik Kelas",
    category: "Pose",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    description: "Koleksi foto terbaik yang dipilih untuk buku tahunan."
  },

  // ── Buku Tahunan → BTS ──────────────────────────────────────
  {
    id: 25,
    title: "Behind The Scenes Foto",
    category: "BTS",
    src: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    description: "Di balik layar sesi pemotretan buku tahunan."
  },
  {
    id: 26,
    title: "Setup Kamera",
    category: "BTS",
    src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    description: "Tim fotografer mempersiapkan peralatan sebelum sesi foto."
  },
  {
    id: 27,
    title: "Persiapan Makeup",
    category: "BTS",
    src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    description: "Momen persiapan sebelum tampil di depan kamera."
  },
  {
    id: 28,
    title: "Candid BTS",
    category: "BTS",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    description: "Foto candid saat proses pembuatan buku tahunan berlangsung."
  },
  {
    id: 29,
    title: "Nunggu Giliran",
    category: "BTS",
    src: "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&q=80",
    description: "Momen santai sambil menunggu giliran foto."
  },
  {
    id: 30,
    title: "Tim Kreatif",
    category: "BTS",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    description: "Tim kreatif buku tahunan sedang berkoordinasi."
  },

  // ── Buku Tahunan → Staff & Guru ─────────────────────────────
  {
    id: 31,
    title: "Foto Guru Favorit",
    category: "Staff & Guru",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    description: "Potret para guru yang penuh dedikasi mendidik kami."
  },
  {
    id: 32,
    title: "Wali Kelas Tercinta",
    category: "Staff & Guru",
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    description: "Foto bersama wali kelas yang selalu sabar dan inspiratif."
  },
  {
    id: 33,
    title: "Staff Tata Usaha",
    category: "Staff & Guru",
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    description: "Tim staff tata usaha yang selalu membantu kegiatan sekolah."
  },
  {
    id: 34,
    title: "Kepala Sekolah",
    category: "Staff & Guru",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    description: "Foto bersama kepala sekolah yang kami hormati."
  },
  {
    id: 35,
    title: "Guru Mapel",
    category: "Staff & Guru",
    src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
    description: "Para guru mata pelajaran yang mengajar dengan penuh semangat."
  },
  {
    id: 36,
    title: "Tim BK",
    category: "Staff & Guru",
    src: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80",
    description: "Tim Bimbingan Konseling yang selalu siap membantu siswa."
  }
];
