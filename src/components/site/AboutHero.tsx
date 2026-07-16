import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-r from-[#fdf7f3] to-[#f8ded0] py-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-[#2f2948]"
        >
          About HealthyGrinz
        </motion.h1>

        <p className="mt-8 text-xl leading-9 text-[#5f5775] max-w-3xl mx-auto">
          Combining modern dentistry with Artificial Intelligence to create a
          smarter, painless and personalized dental experience.
        </p>
      </div>
    </section>
  );
}