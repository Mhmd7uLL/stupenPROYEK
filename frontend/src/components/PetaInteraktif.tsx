const KOORDINAT_KANTOR = "-7.1280449,112.4137123";
const URL_PETA = `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${KOORDINAT_KANTOR}!6i17`;

export default function PetaInteraktif() {
  return (
    <div className="mt-6 overflow-hidden rounded-[14px] border border-garis bg-white">
      <div className="flex items-center gap-2 bg-padi/25 px-5 py-3.5">
        <span className="font-heading text-[15px] font-semibold text-padigelap">
          Peta Lokasi Kantor
        </span>
      </div>
      <div>
        <iframe
          src={URL_PETA}
          title="Peta lokasi Kantor Kelurahan Sidoharjo"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="aspect-box w-full border border-garis bg-kabut"
        />
      </div>
    </div>
  );
}
