import { Link } from "@tanstack/react-router";

export default function BookNow() {
  return (
    <section className="py-28 bg-[#2f2948]">

      <div className="mx-auto max-w-5xl text-center px-6">

        <h2 className="text-5xl font-bold text-white">
          Ready for your healthiest smile?
        </h2>

        <p className="mt-6 text-xl text-gray-200">
          Book an appointment with HealthyGrinz today.
        </p>

        <Link to="/appointment">

          <button className="mt-10 rounded-full bg-[#7de2b3] px-10 py-4 text-xl font-semibold text-[#2f2948] hover:scale-105 transition">

            Book Appointment

          </button>

        </Link>

      </div>

    </section>
  );
}