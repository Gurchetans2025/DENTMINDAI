export default function ClinicGallery() {
  return (
    <section className="py-24 bg-[#faf6f4]">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-5xl font-bold text-[#2f2948]">
          Clinic Gallery
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-8">

          {[1,2,3,4,5,6].map((i)=>(
            <div
              key={i}
              className="aspect-square rounded-2xl bg-[#ece7f4]"
            />
          ))}

        </div>

      </div>

    </section>
  );
}