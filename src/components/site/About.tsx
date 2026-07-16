import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AboutPage } from "@/components/site/AboutPage";

export const Route = createFileRoute("/about")({
  component: AboutRoute,
});

function AboutRoute() {
  return (
    <>
      <Nav />
      <AboutPage />
      <Footer />
    </>
  );
}