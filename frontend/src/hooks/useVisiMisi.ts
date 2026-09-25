import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  hapusVisiMisiApi,
  muatVisiMisi,
  simpanVisiMisi,
  VISI_MISI_KOSONG,
  type DataVisiMisi,
  type JenisVisiMisi,
} from "../lib/konten";
import { buatSumberData } from "../lib/store";

// Isi visi dan misi dari tabel visi_misi lewat /api/visi-misi. Judul
// "Visi" dan "Misi" di halaman publik tetap ditulis di kode.
const sumber = buatSumberData<DataVisiMisi>(VISI_MISI_KOSONG, muatVisiMisi);

export function useVisiMisi() {
  const keadaan = useSyncExternalStore(sumber.langgan, sumber.baca);

  useEffect(() => {
    sumber.pastikanDimuat();
  }, []);

  // Tambah (POST) atau ubah (PUT) tergantung isinya sudah ada atau belum
  const simpan = useCallback(async (jenis: JenisVisiMisi, isi: string) => {
    const sekarang = sumber.baca().data;
    const tersimpan = await simpanVisiMisi(jenis, isi, sekarang[jenis] !== null);
    sumber.ganti({ ...sumber.baca().data, [jenis]: tersimpan });
    return tersimpan;
  }, []);

  const hapus = useCallback(async (jenis: JenisVisiMisi) => {
    await hapusVisiMisiApi(jenis);
    sumber.ganti({ ...sumber.baca().data, [jenis]: null });
  }, []);

  return {
    visiMisi: keadaan.data,
    memuat: keadaan.memuat,
    error: keadaan.error,
    simpan,
    hapus,
  };
}
