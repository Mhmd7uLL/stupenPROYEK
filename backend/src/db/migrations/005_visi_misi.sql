-- =========================================================
-- Tabel visi dan misi kelurahan
-- =========================================================
-- Isinya diatur admin lewat dashboard. Judul "Visi" dan "Misi" di halaman
-- publik tetap ditulis di kode, yang disimpan di sini hanya isinya.
--
-- Satu baris per jenis, jadi jenis sekaligus jadi primary key: paling banyak
-- ada dua baris ('visi' dan 'misi'). Baris yang tidak ada berarti isinya
-- memang belum diisi, dan dashboard menampilkan tombol "Tambah".
--
-- Isi misi disimpan sebagai teks biasa, satu butir per baris. Halaman publik
-- memecahnya menjadi daftar bernomor.
--
-- Batas panjang harus sama dengan MAKS_ISI di src/routes/visiMisi.ts.

CREATE TABLE IF NOT EXISTS visi_misi (
    jenis VARCHAR(10) PRIMARY KEY CHECK (jenis IN ('visi', 'misi')),
    isi TEXT NOT NULL CHECK (length(trim(isi)) > 0 AND length(isi) <= 5000),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_visi_misi_updated_at ON visi_misi;

CREATE TRIGGER trg_visi_misi_updated_at
BEFORE UPDATE ON visi_misi
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Isi awal disalin dari teks yang sebelumnya ditulis langsung di halaman
-- VisiMisi.tsx, supaya halaman publik tidak mendadak kosong setelah migrasi.
-- Admin tetap bisa mengubah atau menghapusnya dari dashboard.
INSERT INTO visi_misi (jenis, isi) VALUES
(
    'visi',
    'Karena OPD Kelurahan Sidoharjo merupakan unit kerja dari Pemerintah Kabupaten Lamongan, maka visi Kelurahan Sidoharjo tetap mengacu dan disandarkan pada Visi Kabupaten Lamongan, yaitu:' || E'\n' ||
    '"Terwujudnya Kemajuan Lamongan yang Berkesinambungan"' || E'\n' ||
    'Secara filosofis, visi tersebut dapat dijelaskan melalui makna yang terkandung di dalamnya, yaitu menggambarkan cita-cita besar Pemerintah Kabupaten Lamongan khususnya Kelurahan Sidoharjo untuk menciptakan pembangunan yang tidak hanya berorientasi pada kemajuan fisik dan ekonomi, tapi juga berorientasi pada keberlanjutan, kesejahteraan sosial serta kelestarian lingkungan hidup.'
),
(
    'misi',
    'Mengoptimalkan kualitas penyelenggaraan reformasi birokrasi melalui pelayanan publik yang berorientasi pada kepuasan masyarakat.' || E'\n' ||
    'Mewujudkan tata kelola pemerintahan yang adaptif dan inovatif serta menghadirkan pelayanan publik yang berkualitas.' || E'\n' ||
    'Mendorong terbangunnya reformasi birokrasi yang terdampak nyata.'
)
ON CONFLICT (jenis) DO NOTHING;
