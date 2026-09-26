import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Kabar from "../components/Kabar";
import StatistikPenduduk from "../components/StatistikPenduduk";
import StrukturJabatan from "../components/StrukturJabatan";
import PetaInteraktif from "../components/PetaInteraktif";

export default function Landing() {
  return (
    <>
      <Hero />
      <main className="wrap py-18">
        <div className="grid grid-cols-[4fr_1fr] gap-8 max-[860px]:grid-cols-1">
          <section aria-label="Berita">
            <Kabar />
          </section>
          <section aria-label="Struktur jabatan dan statistik penduduk">
            <StrukturJabatan />
            <StatistikPenduduk />
            <p className="text-[10px] w-full text-end">
              *Data ini bersifat sementara
            </p>
            <PetaInteraktif />
            <Link
              to={"/kondisiGeografis"}
            >
              <p className="font-medium text-daun text-[10px] text-end underline underline-offset-2">Cek lebih jelasnya disini →</p>
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
