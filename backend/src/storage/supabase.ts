import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

function wajib(nama: string): string {
    const nilai = process.env[nama];

    if (!nilai) {
        throw new Error(`Variabel ${nama} belum diisi di backend/.env`);
    }

    return nilai;
}

export const SUPABASE_URL = wajib("SUPABASE_URL");
export const NAMA_BUCKET = wajib("SUPABASE_STORAGE_BUCKET");

export const supabaseAdmin = createClient(
    SUPABASE_URL,
    wajib("SUPABASE_SECRET_KEY"),
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    }
);

export function urlPublikBerkas(namaBerkas: string): string {
    const { data } = supabaseAdmin.storage
        .from(NAMA_BUCKET)
        .getPublicUrl(namaBerkas);

    return data.publicUrl;
}

export async function unggahKeStorage(
    namaBerkas: string,
    isi: Buffer,
    tipe: string
): Promise<string> {
    const { error } = await supabaseAdmin.storage
        .from(NAMA_BUCKET)
        .upload(namaBerkas, isi, {
            contentType: tipe,
            cacheControl: "31536000",
            upsert: false,
        });

    if (error) {
        throw new Error(`Gagal mengunggah berkas: ${error.message}`);
    }

    return urlPublikBerkas(namaBerkas);
}

export async function hapusDariStorage(namaBerkas: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
        .from(NAMA_BUCKET)
        .remove([namaBerkas]);

    if (error) {
        throw new Error(`Gagal menghapus berkas: ${error.message}`);
    }
}