import { randomUUID } from "node:crypto";
import multer from "multer";
import { KesalahanInput } from "../utils/kesalahan.js";
import { POLA_NAMA_BERKAS } from "../utils/validasi.js";
import {
    hapusDariStorage,
    unggahKeStorage,
} from "../storage/supabase.js";

// Batas upload tetap sama seperti sebelumnya.
export const UKURAN_MAKS_MB = 5;
export const MAKS_BERKAS_SEKALIGUS = 5;

const TIPE_DIIZINKAN: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

// Sekarang file ditaruh sementara di RAM.
// Setelah lolos validasi, langsung dikirim ke Supabase Storage.
const penyimpanan = multer.memoryStorage();

export const unggah = multer({
    storage: penyimpanan,
    limits: {
        fileSize: UKURAN_MAKS_MB * 1024 * 1024,
        files: MAKS_BERKAS_SEKALIGUS,
    },
    fileFilter: (req, berkas, lanjut) => {
        if (!(berkas.mimetype in TIPE_DIIZINKAN)) {
            lanjut(
                new KesalahanInput(
                    `Tipe berkas ${berkas.mimetype} tidak didukung. Pakai JPG, PNG, WEBP, atau GIF.`
                )
            );
            return;
        }

        lanjut(null, true);
    },
});

function cocokMagicBytes(awal: Buffer, mimetype: string): boolean {
    switch (mimetype) {
        case "image/jpeg":
            return (
                awal[0] === 0xff &&
                awal[1] === 0xd8 &&
                awal[2] === 0xff
            );

        case "image/png":
            return (
                awal[0] === 0x89 &&
                awal[1] === 0x50 &&
                awal[2] === 0x4e &&
                awal[3] === 0x47 &&
                awal[4] === 0x0d &&
                awal[5] === 0x0a &&
                awal[6] === 0x1a &&
                awal[7] === 0x0a
            );

        case "image/gif":
            return awal.subarray(0, 4).toString("latin1") === "GIF8";

        case "image/webp":
            return (
                awal.subarray(0, 4).toString("latin1") === "RIFF" &&
                awal.subarray(8, 12).toString("latin1") === "WEBP"
            );

        default:
            return false;
    }
}

export async function pastikanGambarAsli(
    berkas: Express.Multer.File
): Promise<void> {
    if (!cocokMagicBytes(berkas.buffer.subarray(0, 12), berkas.mimetype)) {
        throw new KesalahanInput(
            `Berkas ${berkas.originalname} bukan gambar yang sah walau tipenya mengaku ${berkas.mimetype}`
        );
    }
}

function buatNamaBerkas(mimetype: string): string {
    const ekstensi = TIPE_DIIZINKAN[mimetype] ?? "";

    if (!ekstensi) {
        throw new KesalahanInput("Tipe gambar tidak didukung");
    }

    return `${randomUUID()}${ekstensi}`;
}

export interface HasilBerkasTersimpan {
    url: string;
    nama_berkas: string;
    ukuran: number;
    tipe: string;
}

export async function simpanBerkas(
    berkas: Express.Multer.File
): Promise<HasilBerkasTersimpan> {
    await pastikanGambarAsli(berkas);

    const namaBerkas = buatNamaBerkas(berkas.mimetype);

    try {
        await unggahKeStorage(
            namaBerkas,
            berkas.buffer,
            berkas.mimetype
        );
    } catch (err) {
        throw err;
    }

    return {
        // Tetap memakai format lama supaya database dan frontend
        // tidak perlu dirombak besar-besaran.
        url: `/upload/${namaBerkas}`,
        nama_berkas: namaBerkas,
        ukuran: berkas.size,
        tipe: berkas.mimetype,
    };
}

export async function hapusBerkas(namaBerkas: string): Promise<void> {
    await hapusDariStorage(namaBerkas);
}

export function pastikanNamaBerkasAman(nama: unknown): string {
    if (
        typeof nama !== "string" ||
        !POLA_NAMA_BERKAS.test(nama)
    ) {
        throw new KesalahanInput("Nama berkas tidak valid");
    }

    return nama;
}

export function namaBerkasDariUrl(
    url: string | null | undefined
): string | null {
    if (
        typeof url !== "string" ||
        !url.startsWith("/upload/")
    ) {
        return null;
    }

    const nama = url.slice("/upload/".length);

    return POLA_NAMA_BERKAS.test(nama) ? nama : null;
}