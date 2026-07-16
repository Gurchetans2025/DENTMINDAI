import AboutHero from "./AboutHero";
import DoctorSection from "./DoctorSection";
import Clinic from "./ClinicGallery";
import ClinicStats from "./ClinicStats";
import Technology from "./Technology";
import BookNow from "./BookNow";

export function AboutPage() {
  return (
    <main className="bg-white">
      <AboutHero />
      <DoctorSection />
      <Clinic />
      <ClinicStats />
      <Technology />
      <BookNow />
    </main>
  );
}