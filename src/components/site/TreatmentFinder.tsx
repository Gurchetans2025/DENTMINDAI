import { useState } from "react";

const concerns = [
  "Yellow Teeth",
  "Crooked Teeth",
  "Tooth Pain",
  "Bleeding Gums",
  "Missing Tooth",
  "Bad Breath",
  "Sensitive Teeth",
  "Broken Tooth",
];

export default function TreatmentFinder() {
  const [selected, setSelected] = useState("");

  return (
    <section className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-10 shadow-lg">

        <h1 className="text-center text-4xl font-bold">
          AI Treatment Finder
        </h1>

        <p className="mt-4 text-center text-gray-500">
          Choose your dental concern.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-5">

          {concerns.map((item) => (

            <button
              key={item}
              onClick={() => setSelected(item)}
              className={`rounded-lg border p-5 text-lg transition
              ${
                selected === item
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        <button
          className="mt-10 w-full rounded-lg bg-blue-600 py-4 text-xl font-semibold text-white"
        >
          Next
        </button>

      </div>
    </section>
  );
}