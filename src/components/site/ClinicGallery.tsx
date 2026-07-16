import { useQuery } from "@tanstack/react-query";

import { fetchPublishedClinicGallery } from "@/lib/clinic-gallery";

export default function ClinicGallery() {
  const { data: images = [] } = useQuery({
    queryKey: ["clinic-gallery-images"],
    queryFn: fetchPublishedClinicGallery,
    staleTime: 1000 * 60 * 5,
  });
  const placeholders = Array.from({ length: 6 }, (_, index) => index + 1);

  return (
    <section id="clinic-gallery" className="py-24 bg-[#faf6f4]">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-5xl font-bold text-[#2f2948]">
          Clinic Gallery
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-8">

          {images.length > 0
            ? images.map((image) => (
                <figure
                  key={image.id}
                  className="overflow-hidden rounded-2xl bg-[#ece7f4] shadow-sm"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="sr-only">{image.title}</figcaption>
                </figure>
              ))
            : placeholders.map((i) => (
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
