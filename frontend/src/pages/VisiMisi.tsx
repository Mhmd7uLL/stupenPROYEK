import { useVisiMisi } from "../hooks/useVisiMisi";

// Isi disimpan sebagai teks biasa dari dashboard admin: setiap baris jadi
// satu paragraf (visi) atau satu butir daftar (misi). Baris kosong dibuang.
function pecahBaris(isi: string): string[] {
  return isi
    .split("\n")
    .map((b) => b.trim())
    .filter((b) => b !== "");
}

function Keterangan({ teks }: { teks: string }) {
  return <p className="mb-5 text-lg font-medium text-abu">{teks}</p>;
}

export default function VisiMisi() {
  const { visiMisi, memuat, error } = useVisiMisi();

  const kosong = memuat ? "Memuat…" : error ? "Gagal memuat data." : "Belum diisi.";

  return (
    <main className="wrap py-18">
      <h1 className="font-heading mb-7 text-[clamp(28px,4vw,40px)] leading-[1.1] text-sawah">
        Visi &amp; Misi Kelurahan Sidoharjo
      </h1>
      <div className="max-w-[65ch]">
        <h2 className="mb-2.5 text-[25px] font-bold text-sawah">Visi</h2>
        {visiMisi.visi ? (
          pecahBaris(visiMisi.visi).map((paragraf, i) => (
            <p key={i} className="font-medium text-justify text-lg mb-5">
              {paragraf}
            </p>
          ))
        ) : (
          <Keterangan teks={kosong} />
        )}

        <h2 className="mb-2.5 text-[25px] font-bold text-sawah">Misi</h2>
        {visiMisi.misi ? (
          <ol className="m-0 list-decimal text-justify pl-5 text-black font-medium">
            {pecahBaris(visiMisi.misi).map((butir, i) => (
              <li key={i} className="mb-2 text-lg">
                {butir}
              </li>
            ))}
          </ol>
        ) : (
          <Keterangan teks={kosong} />
        )}
      </div>
    </main>
  );
}
