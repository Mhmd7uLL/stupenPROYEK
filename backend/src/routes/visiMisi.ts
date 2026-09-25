import { Router } from "express";
import pool from "../db/pool.js";
import { wajibLogin } from "../middleware/autentikasi.js";
import type { JenisVisiMisi } from "../types.js";
import { ambilBody, ambilJenisVisiMisi, teksWajib } from "../utils/validasi.js";

const router = Router();

// Harus sama dengan CHECK di db/migrations/005_visi_misi.sql
const MAKS_ISI = 5000;

// Tabel visi_misi paling banyak berisi dua baris, satu per jenis, jadi jenis
// dipakai langsung sebagai pengenal di URL (/api/visi-misi/visi), bukan id.

// GET /api/visi-misi  -> { visi, misi }, null berarti belum diisi
router.get("/", async (req, res) => {
    const hasil = await pool.query<{ jenis: JenisVisiMisi; isi: string }>(
        "SELECT jenis, isi FROM visi_misi"
    );

    const data: Record<JenisVisiMisi, string | null> = { visi: null, misi: null };
    for (const baris of hasil.rows) data[baris.jenis] = baris.isi;
    res.json(data);
});

function ambilIsi(body: Record<string, unknown>): string {
    return teksWajib(body.isi, "isi", MAKS_ISI);
}

// POST /api/visi-misi/:jenis  -> tombol "Tambah"
router.post("/:jenis", wajibLogin, async (req, res) => {
    const jenis = ambilJenisVisiMisi(req.params.jenis);
    const isi = ambilIsi(ambilBody(req.body));

    // ON CONFLICT supaya "sudah ada" dijawab dengan pesan yang jelas, bukan
    // pesan umum pelanggaran unique dari penangananError
    const hasil = await pool.query<{ jenis: JenisVisiMisi; isi: string }>(
        `INSERT INTO visi_misi (jenis, isi)
         VALUES ($1, $2)
         ON CONFLICT (jenis) DO NOTHING
         RETURNING jenis, isi`,
        [jenis, isi]
    );

    const baris = hasil.rows[0];
    if (!baris) {
        res.status(409).json({ pesan: `Isi ${jenis} sudah ada, gunakan Ubah untuk menggantinya` });
        return;
    }
    res.status(201).json(baris);
});

// PUT /api/visi-misi/:jenis  -> tombol "Ubah", menimpa isi lama
router.put("/:jenis", wajibLogin, async (req, res) => {
    const jenis = ambilJenisVisiMisi(req.params.jenis);
    const isi = ambilIsi(ambilBody(req.body));

    const hasil = await pool.query<{ jenis: JenisVisiMisi; isi: string }>(
        `UPDATE visi_misi
         SET isi = $1
         WHERE jenis = $2
         RETURNING jenis, isi`,
        [isi, jenis]
    );

    const baris = hasil.rows[0];
    if (!baris) {
        res.status(404).json({ pesan: `Isi ${jenis} belum ada, gunakan Tambah terlebih dahulu` });
        return;
    }
    res.json(baris);
});

// DELETE /api/visi-misi/:jenis  -> tombol "Hapus"
router.delete("/:jenis", wajibLogin, async (req, res) => {
    const jenis = ambilJenisVisiMisi(req.params.jenis);
    const hasil = await pool.query("DELETE FROM visi_misi WHERE jenis = $1", [jenis]);

    if (hasil.rowCount === 0) {
        res.status(404).json({ pesan: `Isi ${jenis} tidak ditemukan` });
        return;
    }
    res.status(204).send();
});

export default router;
