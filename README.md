# Begarlist 16 🎬

Website video streaming minimalis berbasis YouTube embed — tanpa upload, tanpa server.

## ✨ Fitur
- 🎥 Embed video dari YouTube (tanpa fitur upload)
- 🏷️ Kategori video (Teknologi, Musik, Edukasi, Gaming, Film, Travel, Kuliner)
- 🔍 Fitur search real-time
- 🌙 Dark mode / Light mode (tersimpan di browser)
- 📱 Responsive untuk mobile & desktop
- ⚡ Ringan, tanpa backend / database

## 🚀 Deploy ke GitHub Pages

1. **Fork / clone** repo ini ke akun GitHub kamu
2. Buka **Settings** → **Pages**
3. Di bagian **Source**, pilih branch `main` dan folder `/ (root)`
4. Klik **Save** — website akan live di `https://username.github.io/nama-repo/`

## 📝 Cara Menambah Video

Edit file `js/data.js`, tambahkan objek video baru ke array `VIDEOS`:

```js
{
  id: 22,                        // ID unik (angka)
  title: "Judul Video",
  channel: "Nama Channel YouTube",
  category: "teknologi",         // Pilih: teknologi | musik | edukasi | gaming | film | travel | kuliner
  youtubeId: "dQw4w9WgXcQ",     // ID dari URL: youtube.com/watch?v=ID_INI
  duration: "3:32",
  description: "Deskripsi singkat video."
}
```

> **Cara dapat YouTube ID:** Buka video di YouTube → salin bagian setelah `?v=` di URL.  
> Contoh: `https://youtube.com/watch?v=dQw4w9WgXcQ` → ID-nya adalah `dQw4w9WgXcQ`

## 📁 Struktur File

```
begarlist16/
├── index.html        ← Halaman utama
├── css/
│   └── style.css     ← Semua styling
├── js/
│   ├── data.js       ← Data video (edit di sini!)
│   └── app.js        ← Logic aplikasi
└── README.md
```

## 🎨 Kustomisasi

Edit variabel CSS di `css/style.css` bagian `:root` untuk mengubah warna:

```css
--accent: #e8ff47;   /* Warna aksen (default: kuning-hijau) */
```

---
Dibuat dengan ♥ — Video dari YouTube, hosting di GitHub Pages.
