// Bentuk baris tiap tabel, mengikuti src/db/SCHEMA.sql ditambah src/db/migrations/

export const JENIS_KABAR = ["berita", "pengumuman"] as const;
export type JenisKabar = (typeof JENIS_KABAR)[number];

export interface Kabar {
    id: number;
    jenis: JenisKabar;
    judul: string;
    tanggal_upload: Date;
    gambar_utama: string;
    ringkasan: string | null;
    deskripsi_lengkap: string;
    admin_id: number | null;
    created_at: Date;
    updated_at: Date;
}

export interface KabarGambar {
    id: number;
    kabar_id: number;
    gambar_url: string;
    urutan: number | null;
    created_at: Date;
}

// Tingkat 1 hanya boleh diisi satu orang (Kepala Kelurahan), tingkat 2 dan 3
// boleh lebih dari satu. Lihat migrations/002_tingkat_struktur.sql.
export const TINGKAT_JABATAN = [1, 2, 3] as const;
export type TingkatJabatan = (typeof TINGKAT_JABATAN)[number];

export interface StrukturJabatan {
    id: number;
    foto: string | null;
    nama_jabatan: string;
    nama_pejabat: string;
    nip: string | null;
    tingkat: TingkatJabatan;
    created_at: Date;
    updated_at: Date;
}

// Lihat migrations/005_visi_misi.sql. Satu baris per jenis.
export const JENIS_VISI_MISI = ["visi", "misi"] as const;
export type JenisVisiMisi = (typeof JENIS_VISI_MISI)[number];

export interface VisiMisi {
    jenis: JenisVisiMisi;
    isi: string;
    updated_at: Date;
}

export interface Penduduk {
    id: number;
    laki_laki: number;
    perempuan: number;
    total: number; // dihitung otomatis oleh PostgreSQL, jangan pernah dikirim manual
    updated_at: Date;
}
