
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import TreatmentFinder from "@/components/site/TreatmentFinder";

export const Route = createFileRoute("/treatment-finder")({
  component: TreatmentFinderPage,
});

function TreatmentFinderPage() {
  return (
    <>
      <Nav />
      <TreatmentFinder />
      <Footer />
    </>
  );
}