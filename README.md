# Information System of Gov

Website profil dan informasi resmi untuk kebutuhan publik yang mencakup layanan, struktur organisasi, data wilayah, dan konten berita yang dikelola melalui panel admin.

## Deskripsi Singkat

Sistem Informasi Kelurahan adalah proyek web yang dibuat untuk menghadirkan informasi yang lebih mudah diakses oleh masyarakat, mulai dari profil lembaga, visi misi, kondisi geografis, struktur organisasi, hingga layanan dan berita terbaru. Proyek ini juga dilengkapi dengan fitur admin untuk mengelola konten berita dan data terkait secara lebih praktis.

## Fitur

1. Public User:
- Landing page yang informatif dan modern
- Halaman profil, informasi geografis & wilayah, berita & pengumuman masyarakat, struktur jabatan
- Halaman berita/kabar dengan detail artikel

2. Admin Dashboard:
- Mengelola Berita & pengumuman, Visi & Misi, Struktur Jabatan
- Mengelola sandi & email admin (CRUD)

## Tech Stack

1. Language: TypeScript
2. Frontend: React, Tailwind CSS
3. Backend: Node + Express
4. Database: PostgreSQL
5. Tools: Git, npm, ESLint, Typescript Compiler

## Cara Menjalankan Frontend dan Backend

Pastikan sistem sudah memiliki Node.js dan npm terinstall.

### 1. Clone repository

```bash
git clone https://github.com/your-username/stupenPROYEK.git
cd stupenPROYEK
```

### 2. Install dependency Frontend

```bash
cd frontend
npm install
```

### 3. Jalankan Frontend

```bash
npm run dev
```

Frontend akan berjalan di:

```text
http://localhost:5173
```

### 4. Install dependency Backend

```bash
cd ../backend
npm install
```

### 5. Jalankan Backend

```bash
npm run dev
```

Backend akan berjalan di:

```text
http://localhost:5000
```

> Langkah di atas untuk menjalankan di komputer sendiri. Untuk memasang ke server yang bisa diakses publik, ikuti [DEPLOY.md](DEPLOY.md) — ada beberapa setelan yang kalau terlewat membuat situs tidak berfungsi atau terbuka celah keamanan.

## Cara Kontribusi

1. Fork project ini ke akun GitHub Anda.
2. Clone repository hasil fork.
3. Buat branch baru untuk fitur atau perbaikan yang akan dikerjakan.
4. Lakukan perubahan dengan format commit yang jelas.
5. Jalankan aplikasi secara lokal sebelum membuat pull request.
6. Buat pull request dengan menjelaskan perubahan yang dilakukan dan tujuan fitur/bug fix yang ditangani.

Contoh:

```bash
git switch -C feature/nama-fitur
git add .
git commit -m "feat: menambahkan fitur X"
git push origin feature/nama-fitur
```

## Lisensi

Proyek ini dibuat untuk kebutuhan pengembangan aplikasi website informasi dan administrasi yang bersifat internal/kolaboratif. Silakan sesuaikan lisensi jika proyek ini akan digunakan secara publik.
