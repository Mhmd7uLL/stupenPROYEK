import { Router } from "express";
import { wajibLogin } from "../middleware/autentikasi.js";
import {
  hapusBerkas,
  MAKS_BERKAS_SEKALIGUS,
  pastikanNamaBerkasAman,
  UKURAN_MAKS_MB,
  unggah,
  simpanBerkas,
} from "../middleware/unggah.js";
import { berkasSedangDipakai } from "../utils/berkas.js";
import { KesalahanInput } from "../utils/kesalahan.js";

const router = Router();

router.use(wajibLogin);

// POST /api/unggah
router.post("/", unggah.single("gambar"), async (req, res) => {
  if (!req.file) {
    throw new KesalahanInput(
      "Tidak ada berkas terkirim. Pakai field bernama 'gambar'.",
    );
  }

  const hasil = await simpanBerkas(req.file);

  res.status(201).json(hasil);
});

// POST /api/unggah/banyak
router.post(
  "/banyak",
  unggah.array("gambar", MAKS_BERKAS_SEKALIGUS),
  async (req, res) => {
    const berkas = Array.isArray(req.files) ? req.files : [];

    if (berkas.length === 0) {
      throw new KesalahanInput(
        "Tidak ada berkas terkirim. Pakai field bernama 'gambar'.",
      );
    }

    const tersimpan: string[] = [];

    try {
      // Validasi + upload satu per satu.
      const hasil = [];

      for (const satu of berkas) {
        const disimpan = await simpanBerkas(satu);

        tersimpan.push(disimpan.nama_berkas);
        hasil.push(disimpan);
      }

      res.status(201).json({
        berkas: hasil,
      });
    } catch (err) {
      // Kalau upload ke-3 gagal setelah upload ke-1 dan ke-2
      // berhasil, bersihkan yang sudah terlanjur masuk storage.
      await Promise.allSettled(tersimpan.map((nama) => hapusBerkas(nama)));

      throw err;
    }
  },
);

// DELETE /api/unggah/:namaBerkas
router.delete("/:namaBerkas", async (req, res) => {
  const nama = pastikanNamaBerkasAman(req.params.namaBerkas);

  if (await berkasSedangDipakai(`/upload/${nama}`)) {
    res.status(409).json({
      pesan:
        "Berkas ini sedang dipakai berita atau struktur jabatan. Hapus dulu data yang memakainya.",
    });

    return;
  }

  await hapusBerkas(nama);

  res.status(204).send();
});

// GET /api/unggah/batas
router.get("/batas", (req, res) => {
  res.json({
    ukuran_maks_mb: UKURAN_MAKS_MB,
    maks_berkas_sekaligus: MAKS_BERKAS_SEKALIGUS,
    tipe_didukung: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });
});

export default router;
