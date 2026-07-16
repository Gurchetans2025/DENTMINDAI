import doctor from "@/assets/lisha.avif";

export default function DoctorSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-20 items-center">

        <img
          src={doctor}
          className="rounded-2xl shadow-xl"
          alt="Dr.Lisha"
        />

        <div>

          <h2 className="text-5xl font-bold text-[#2f2948]">
            Dr. Lisha
          </h2>

          <p className="mt-4 text-2xl text-[#6d6584]">
            Dental Surgeon, BDS
          </p>

          <p className="mt-10 text-lg leading-9 text-[#4d4760]">
            Dr. Lisha has over six years of experience in Cosmetic Dentistry,
            Smile Design, Root Canal Therapy, Dental Implants and Pediatric
            Dentistry.
          </p>

        </div>

      </div>
    </section>
  );
}