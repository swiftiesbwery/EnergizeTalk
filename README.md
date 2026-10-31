# Energize Talk

Website pendaftaran untuk acara **Energize Talk**, talk show dari Anargya ITS (ITS Formula EV Team), Institut Teknologi Sepuluh Nopember, Surabaya.

- Website: https://its.id/m/EnergizeTalkMiniTask
- Google Sheets (data pendaftar): (https://docs.google.com/spreadsheets/d/1aCsPpPRaEJOnF6DANE7Dy28cxdGeRTmLOaz85f87GBQ/edit?gid=0#gid=0)
- Source code: https://github.com/swiftiesbwery/EnergizeTalk
- Halaman registrasi: `/#/registration`
- Halaman admin: `/#/admin` (pakai password)
- Password admin: anargya2026

## Tentang project

Energize Talk adalah talk show yang membahas pertemuan antara teknik, inovasi, dan keberlanjutan. Website ini dibuat untuk tiga hal:

1. Mengenalkan acara lewat landing page.
2. Menerima pendaftaran peserta lewat form online.
3. Membantu panitia melihat daftar peserta lewat halaman admin.

Website ini berupa single page application (SPA) dengan backend serverless. Tidak ada server yang perlu disewa atau dirawat. Data pendaftar disimpan di Google Sheets lewat Google Apps Script.

## Fitur

Halaman utama:
- Galeri foto interaktif dengan efek 3D yang bereaksi terhadap mouse.
- Bagian Benefits dengan kartu yang ganti foto saat di-hover.
- Banner "Skills Unlocked" dengan gambar yang keluar dari bingkai.
- Navbar yang menempel di atas, berubah gelap dan blur saat di-scroll, dan punya menu hamburger di HP.
- Animasi fade in dan fade out saat scroll.
- Tampilan responsif.

Halaman registrasi:
- Form terpisah dari halaman utama.
- Isian: Full Name, Email, Institution / University, Major, dan WhatsApp Number.
- Semua isian wajib diisi. Kalau ada yang kosong, muncul peringatan merah di bawah kolomnya.
- Satu email hanya bisa mendaftar sekali.
- Setelah berhasil daftar, muncul layar sukses satu layar penuh.

Halaman admin:
- Dilindungi password.
- Menampilkan semua pendaftar, yang terbaru di atas.
- Ada pencarian, tombol Refresh, dan Export ke CSV.

## Teknologi yang dipakai

| Bagian | Teknologi |
|---|---|
| Bahasa | JavaScript (JSX) |
| Framework frontend | React 18 |
| Build tool dan dev server | Vite |
| Styling | CSS biasa (`style.css`) |
| Routing | Hash router buatan sendiri, tanpa library tambahan |
| Backend | Google Apps Script (Web App) |
| Database | Google Sheets |
| Package manager | npm |
| Version control | Git dan GitHub |
| Hosting | Static hosting, misalnya Netlify atau Vercel |
| Editor | Visual Studio Code |

API bawaan browser yang dipakai: `fetch`, `IntersectionObserver`, `sessionStorage`, `Blob` untuk export CSV, dan Pointer Events untuk galeri.

## Cara kerja sistem

Alur pendaftaran:

1. Pengunjung mengisi form. Frontend mengecek semua isian.
2. Frontend mengirim data (JSON) ke URL Apps Script lewat `POST`.
3. Script mengecek ulang datanya, memastikan emailnya belum terdaftar, lalu menambahkan satu baris ke Google Sheets.
4. Script membalas `{ ok: true }`, lalu frontend menampilkan layar sukses.

Alur admin:

1. Admin memasukkan password di `/#/admin`.
2. Frontend mengirim `{ action: "list", key: <password> }` ke script.
3. Script membandingkan key itu dengan `ADMIN_KEY` yang tersimpan di dalam Apps Script. Kalau cocok, daftar pendaftar dikirim balik.

## Frontend

Seluruh frontend ada di `src/main.jsx`, ditambah `style.css` dan `logo.js`. Komponen utamanya:

- `Navbar`: header, logo, menu navigasi, dan menu HP.
- `Gallery`: galeri foto 3D dengan judul "Energize Talk" dan deskripsi acara.
- `Benefits`: kartu benefit dengan foto yang berganti saat di-hover.
- `Unlocked`: banner "Skills Unlocked" dan tombol daftar.
- `RegistrationForm`: form, validasi, pengiriman data, dan layar sukses.
- `AdminPanel`: login, tabel pendaftar, pencarian, dan export CSV.
- `Contact`: footer berisi kontak dan link kecil ke halaman admin.
- `Hero` dan `ParallaxScene`: komponen hero dan ilustrasi SVG mobil Formula Student. Keduanya ada di kode tapi tidak ditampilkan di halaman utama saat ini.

Ada dua custom hook:

- `useRoute()` membaca perubahan hash di URL dan menentukan halaman mana yang tampil (`home`, `registration`, atau `admin`).
- `useReveal()` memantau elemen ber-class `reveal` dan menambahkan class `visible` saat elemen masuk atau keluar layar.

Efek 3D di galeri dikendalikan lewat CSS variable (`--p`, `--z`, `--max-p`, `--max-z`) yang diubah oleh React dari event pointer. Warna utama website adalah hitam dan hijau (`#29d270`) mengikuti identitas Anargya ITS. Foto diambil dari `public/images/`, dan kalau filenya belum ada, yang tampil adalah blok gradient sebagai pengganti.

## Backend (Google Apps Script)

Backend hanya satu file, `Code.gs`, yang di-deploy sebagai Web App (Execute as: Me, Who has access: Anyone). Semua request masuk ke satu URL berakhiran `/exec`.

| Method | Isi request | Fungsi |
|---|---|---|
| GET | tidak ada | Cek apakah script sudah jalan |
| POST | `{ name, email, institution, major, whatsapp }` | Mendaftarkan peserta |
| POST | `{ action: "list", key }` | Mengambil semua data pendaftar (khusus admin) |

Kemungkinan balasan dari script:

- `{ ok: true }`: pendaftaran tersimpan.
- `{ ok: true, rows: [...] }`: daftar pendaftar untuk admin.
- `{ ok: false, error: "duplicate" }`: email sudah terdaftar.
- `{ ok: false, error: "missing_fields" }`: ada isian yang kosong.
- `{ ok: false, error: "invalid_email" }`: format email salah.
- `{ ok: false, error: "unauthorized" }`: password admin salah.
- `{ ok: false, error: "bad_request" }`: request tidak valid.

Pengaman di sisi server:

- Semua isian dipotong spasinya, wajib diisi, dan dibatasi maksimal 200 karakter. Email dicek dengan regular expression.
- `LockService` dipakai supaya dua orang yang mendaftar bersamaan tidak saling menimpa atau lolos dari pengecekan email ganda.
- Kolom di sheet diformat sebagai teks biasa, supaya nomor WhatsApp tidak kehilangan angka 0 di depan dan isian seperti `=SUM(...)` tidak dijalankan sebagai rumus.
- Frontend mengirim JSON dengan `Content-Type: text/plain`. Ini dilakukan karena Apps Script tidak bisa menjawab preflight request (`OPTIONS`) dari browser, sedangkan request dengan `text/plain` tidak memicu preflight.

## Database (Google Sheets)

Data disimpan di tab bernama `Registrations`. Tab ini dibuat otomatis saat ada request pertama.

| Kolom | Isi |
|---|---|
| A, Timestamp | Waktu pendaftaran (format ISO 8601) |
| B, Name | Nama lengkap |
| C, Email | Alamat email (tidak boleh sama, huruf besar kecil dianggap sama) |
| D, Institution | Instansi atau universitas |
| E, Major | Jurusan |
| F, WhatsApp | Nomor WhatsApp (disimpan sebagai teks) |

Google Sheets dipilih karena gratis, tidak butuh server, dan panitia bisa langsung membuka, mengurutkan, mengedit, atau menghapus data dengan tools yang sudah biasa mereka pakai.

## Routing

Website memakai hash routing, jadi bisa jalan di static hosting mana pun tanpa pengaturan redirect.

| URL | Halaman |
|---|---|
| `/` atau `/#home` | Halaman utama (Gallery, Benefits, Skills Unlocked) |
| `/#/registration` | Form registrasi |
| `/#/admin` | Panel admin |
| `/#contact` | Scroll ke footer |

Form registrasi sengaja dipisah dari halaman utama. Tombol "Register now for free" dan menu "Registration Form" di navbar sama-sama membuka halaman registrasi.

## Validasi form

Validasi dilakukan dua lapis.

Di frontend:
- Semua kolom wajib diisi, dan isian yang hanya berisi spasi ditolak.
- Format email dicek.
- Peringatan merah muncul di bawah kolom yang bermasalah, misalnya "Major is required."
- Peringatan muncul saat pengguna meninggalkan kolom kosong atau menekan tombol Register Now, dan hilang begitu pengguna mulai mengetik.
- Kursor otomatis pindah ke kolom pertama yang bermasalah.
- Pop-up validasi bawaan browser dimatikan (`noValidate`) supaya yang tampil adalah peringatan buatan sendiri.

Di backend:
- Apps Script mengecek ulang semua isian, karena validasi di frontend bisa dilewati.
- Email yang sudah terdaftar ditolak, lalu pesannya ditampilkan di bawah kolom email.

## Panel admin

Panel admin dibuka lewat `/#/admin` atau link kecil "Admin" di footer.

- Login: password dicek oleh Apps Script (`ADMIN_KEY`), bukan oleh kode website.
- Sesi: setelah login, password disimpan di `sessionStorage` hanya untuk tab yang sedang dipakai. Data itu hilang saat Logout atau saat tab ditutup.
- Tabel berisi Full Name, Email, Institution, Major, WhatsApp, dan waktu daftar.
- Fitur: pencarian di semua kolom, Refresh (data tidak realtime), dan Export CSV (UTF-8 dengan BOM, jadi terbaca benar di Excel).
- Mengedit atau menghapus data dilakukan langsung di Google Sheets. Panel ini sengaja dibuat hanya untuk melihat supaya data tidak terhapus tanpa sengaja.

## Keamanan

- Password admin hanya ada di Apps Script, tidak ada di repository maupun di hasil build website.
- Data pendaftar hanya bisa dibaca kalau mengirim password admin yang benar.
- Validasi dilakukan di frontend dan backend.
- Kolom sheet diformat teks biasa untuk mencegah formula injection.
- `.gitignore` mengecualikan `node_modules`, `dist`, dan `.env`.
- URL Apps Script terlihat di kode frontend dan itu tidak bisa dihindari untuk aplikasi sisi klien. Artinya siapa pun bisa mengirim pendaftaran, tapi tidak ada yang bisa membaca data tanpa password admin.
- Sheet berisi nama, email, dan nomor telepon peserta, jadi bagikan hanya ke orang yang perlu dan sebaiknya dengan akses lihat saja (view only).

## Struktur folder

```
energize-talk/
├── public/
│   └── images/
│       ├── gallery/              # 1.jpg sampai 7.jpg
│       ├── benefits/             # 1.jpg, 1-hover.jpg, 2.jpg, 2-hover.jpg, 3.jpg, 3-hover.jpg
│       ├── unlocked.jpg
│       ├── unlocked-monitor.png
│       └── unlocked-head.png
├── src/
│   ├── main.jsx                  # semua komponen, routing, form, dan panel admin
│   ├── style.css                 # semua styling
│   └── logo.js                   # logo (sudah tertanam)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

`Code.gs` tidak disimpan di repository ini karena dipasang langsung di Google Apps Script.

## Environment dan kebutuhan

- Node.js, disarankan versi 20 atau lebih baru (minimal 18 untuk Vite versi lama).
- npm (sudah termasuk di Node.js).
- Git, untuk clone dan push ke GitHub.
- Akun Google, untuk membuat spreadsheet dan Apps Script.
- Browser modern seperti Chrome, Edge, Firefox, atau Safari.

Project ini tidak memakai file `.env` karena tidak ada kunci rahasia di frontend. Pengaturan yang perlu diisi hanya:

| Lokasi | Pengaturan | Fungsi |
|---|---|---|
| `src/main.jsx` | `SHEETS_URL` | URL Web App Apps Script (berakhiran `/exec`) |
| `Code.gs` | `ADMIN_KEY` | Password admin (ganti dari nilai bawaan sebelum deploy) |
| `Code.gs` | `SHEET_NAME` | Nama tab penyimpan data (bawaan: `Registrations`) |

Ada dua environment:
- Development: `npm run dev`, dibuka di `http://localhost:5173`, ada hot reload.
- Production: `npm run build` menghasilkan file statis di folder `dist/` yang bisa ditaruh di static hosting mana pun.

## Menjalankan di komputer sendiri

```bash
git clone https://github.com/swiftiesbwery/EnergizeTalk.git
cd EnergizeTalk
npm install
npm run dev
```

Lalu buka `http://localhost:5173`.

Perintah yang tersedia:

- `npm run dev`: menjalankan server development.
- `npm run build`: membuat build produksi di folder `dist/`.
- `npm run preview`: melihat hasil build secara lokal.

## Setup backend (Google Sheets dan Apps Script)

1. Buat Google Sheets baru.
2. Buka Extensions, lalu Apps Script.
3. Hapus kode bawaan dan tempel isi `Code.gs`.
4. Ganti `ADMIN_KEY` dengan password admin sendiri, lalu simpan.
5. Klik Deploy, New deployment, lalu pilih tipe Web app. Isi Execute as dengan Me dan Who has access dengan Anyone.
6. Beri izin akses (Advanced, Go to project, Allow).
7. Salin Web app URL yang berakhiran `/exec`. Kalau dibuka di browser, harusnya muncul `{"ok":true,"message":"Registration endpoint is running."}`.
8. Tempel URL itu ke `SHEETS_URL` di `src/main.jsx`.

Kalau `Code.gs` diubah setelah di-deploy, buat versi baru lewat Deploy, Manage deployments, ikon pensil, Version: New version, lalu Deploy. Menyimpan saja tidak mengubah web app yang sedang berjalan.

## Build dan deploy

Website ini statis, jadi bisa di-hosting gratis.

Cara 1, otomatis dari GitHub:
1. Push kode ke GitHub.
2. Di Netlify atau Vercel, pilih Import from Git dan pilih repository ini.
3. Pakai preset Vite: build command `npm run build`, output directory `dist`.
4. Setiap `git push` ke branch `main` akan otomatis memperbarui website.

Cara 2, manual:
1. Jalankan `npm run build`.
2. Seret folder `dist/` ke app.netlify.com/drop.

Karena routing memakai `#/...`, tidak perlu pengaturan redirect di hosting.

