import { useState, type FormEvent } from "react";
import { useVisiMisi } from "../../hooks/useVisiMisi";
import type { JenisVisiMisi } from "../../lib/konten";
import { notifGagalDari, notifSukses } from "../../lib/notifikasi";

// Harus sama dengan MAKS_ISI di backend/src/routes/visiMisi.ts
const MAKS_ISI = 5000;

const JUDUL: Record<JenisVisiMisi, string> = { visi: "Visi", misi: "Misi" };

const PETUNJUK: Record<JenisVisiMisi, string> = {
  visi: "Setiap baris akan tampil sebagai satu paragraf.",
  misi: "Tulis satu butir misi per baris. Nomor urut ditambahkan otomatis.",
};

export default function AdminVisiMisi() {
  const { visiMisi, memuat, error, simpan, hapus } = useVisiMisi();

  if (memuat) {
    return <p className="text-abu">Memuat visi dan misi…</p>;
  }

  // Seperti di AdminPenduduk: form dipasang sekali setelah data tiba, lalu
  // isinya dipegang form itu sendiri
  return (
    <div>
      <h1 className="font-heading text-[clamp(24px,3vw,32px)] leading-[1.1] text-sawah">Visi &amp; Misi</h1>
      <p className="mt-1.5 mb-8 max-w-[52ch] text-abu">
        Isi visi dan misi kelurahan. Perubahan langsung tampil di halaman Visi &amp; Misi.
      </p>

      {error && <p className="mb-4 text-[14px] text-[#b3261e]">{error}</p>}

      <div className="grid max-w-180 gap-6">
        {(["visi", "misi"] as const).map((jenis) => (
          <FormIsi
            key={jenis}
            jenis={jenis}
            tersimpan={visiMisi[jenis]}
            simpan={(isi) => simpan(jenis, isi)}
            hapus={() => hapus(jenis)}
          />
        ))}
      </div>
    </div>
  );
}

function FormIsi({
  jenis,
  tersimpan,
  simpan,
  hapus,
}: {
  jenis: JenisVisiMisi;
  tersimpan: string | null;
  simpan: (isi: string) => Promise<string>;
  hapus: () => Promise<void>;
}) {
  const [isi, setIsi] = useState(tersimpan ?? "");
  const [menyimpan, setMenyimpan] = useState(false);
  const [menghapus, setMenghapus] = useState(false);

  const judul = JUDUL[jenis];
  const sudahAda = tersimpan !== null;
  const sibuk = menyimpan || menghapus;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (isi.trim() === "") return;

    setMenyimpan(true);
    try {
      const hasil = await simpan(isi);
      setIsi(hasil);
      notifSukses(sudahAda ? `${judul} berhasil diubah.` : `${judul} berhasil ditambahkan.`);
    } catch (err) {
      notifGagalDari(err, `Gagal menyimpan ${jenis}.`);
    } finally {
      setMenyimpan(false);
    }
  };

  const hapusIsi = async () => {
    if (!window.confirm(`Hapus ${jenis}? Isinya di halaman publik akan kosong.`)) return;

    setMenghapus(true);
    try {
      await hapus();
      setIsi("");
      notifSukses(`${judul} dihapus.`);
    } catch (err) {
      notifGagalDari(err, `Gagal menghapus ${jenis}.`);
    } finally {
      setMenghapus(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="rounded-lg border border-garis bg-white p-5">
      <label className="block">
        <span className="mb-1 block text-[15px] font-semibold text-tinta">{judul}</span>
        <span className="mb-2 block text-[13px] text-abu">{PETUNJUK[jenis]}</span>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          rows={jenis === "visi" ? 7 : 6}
          maxLength={MAKS_ISI}
          placeholder={sudahAda ? "" : `${judul} belum diisi.`}
          className="w-full resize-y rounded-lg border border-garis px-3.5 py-2.5 text-[14px] leading-[1.6]"
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={sibuk || isi.trim() === ""}
          className="cursor-pointer rounded-md bg-sawah px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-daun disabled:cursor-not-allowed disabled:opacity-60"
        >
          {menyimpan ? "Menyimpan…" : sudahAda ? "Ubah" : "Tambah"}
        </button>
        {sudahAda && (
          <button
            type="button"
            onClick={() => void hapusIsi()}
            disabled={sibuk}
            className="cursor-pointer rounded-md border border-[#b3261e]/30 px-4 py-2.5 text-[14px] font-medium text-[#b3261e] hover:bg-[#b3261e]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {menghapus ? "Menghapus…" : "Hapus"}
          </button>
        )}
      </div>
    </form>
  );
}
