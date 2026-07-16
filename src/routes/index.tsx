import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Calendar,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Baby,
  Smile,
  ArrowRight,
  Check,
  MapPin,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  ChevronDown,
  Activity,
  Brain,
  Camera,
  FileText,
  Mic,
  HeartPulse,
  Menu,
  UserCircle,
  X,
  DollarSign,
  CalendarClock,
  Search,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/site/Navbar";
import { AIChat } from "@/components/site/AIChat";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { referenceSmileBackgroundImg, referenceSmileImg } from "@/lib/assets";

const heroImg =
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=80";
const aiVisual =
  "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format& fit=crop&w=1200&q=80";
const smile1 =
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80";
const doctorLishaImg =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=90";

export const Route = createFileRoute("/")({ component: HomePage });

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <ReferenceHero />
      <TrustBar />
      <About />
      <Dentists />
      <Services />
      <AIFeatures />
      <Gallery />
      <Testimonials />
      <Booking />
      <DashboardPreview />
      <Blog />
      <FAQ />
      <Contact />
      <Footer />
      <AIChat />
    </div>
  );
}

function ReferenceHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuLinks = [
    { label: "Home", href: "#" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Grins Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#c1bcd5] text-primary">
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${referenceSmileBackgroundImg}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#c1bcd5]/90 from-[0%] via-[#c1bcd5]/78 via-[44%] to-[#c1bcd5]/0 to-[68%]" />
      </div>

      <div className="absolute right-6 top-6 z-20 flex items-center gap-8 text-primary sm:right-[9.4vw] sm:top-10">
        <Link to="/auth" className="flex items-center gap-2 text-base font-medium">
          <UserCircle className="h-7 w-7" />
          Log In
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle menu"
          className="p-1"
        >
          {menuOpen ? <X className="h-9 w-9" /> : <Menu className="h-9 w-9" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-8 top-24 z-30 w-64 rounded-3xl glass p-6 shadow-elegant">
          <nav className="flex flex-col gap-4 text-lg font-semibold">
            {menuLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              Patient Dashboard
            </Link>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Doctor/Admin
            </Link>
          </nav>
        </div>
      )}

      <div className="relative z-10 min-h-screen px-6 pb-16 pt-5 sm:px-[9.4vw]">
        <motion.div {...fadeUp} className="max-w-[620px]">
          <BrandLogo className="w-[128px] sm:w-[136px]" />

          <div className="mt-40 sm:mt-52 lg:mt-[220px]">
            <div>
              <h1 className="font-sans text-[clamp(3rem,4vw,4.75rem)] font-extrabold uppercase leading-none tracking-normal">
                Healthy Grins
              </h1>
              <p className="mt-2 font-sans text-[clamp(2.2rem,3vw,4rem)] font-bold leading-none tracking-normal">
                Dental Clinic
              </p>
            </div>

            <p className="mt-24 font-display text-[clamp(2rem,2.4vw,3rem)] italic leading-tight">
              Crafting Radiant Smiles with Care
            </p>

            <a
              href="#booking"
              className="mt-20 inline-flex h-[60px] w-[240px] items-center justify-center bg-primary text-xl font-bold text-primary-foreground shadow-soft transition hover:shadow-elegant"
            >
              Book Now
            </a>
            <a href={referenceSmileImg} target="_blank" rel="noreferrer" className="sr-only">
              Smile gallery source
            </a>
          </div>
        </motion.div>

        <div className="h-14 lg:hidden" />
      </div>
    </section>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-hero-gradient overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-40 h-96 w-96 rounded-full bg-teal/20 blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl animate-float [animation-delay:2s]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Dental Experience
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight">
            Healthy Smiles Begin at{" "}
            <span className="text-primary-gradient italic">HealthyGrinz</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Advanced, painless, AI-assisted dental care for families, kids, and adults. Expert
            dentists, modern technology, and a smarter patient experience — all under one roof.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#booking"
              className="group inline-flex items-center gap-2 rounded-full bg-primary-gradient px-6 py-3.5 text-primary-foreground shadow-elegant hover:shadow-glow transition-all"
            >
              <Calendar className="h-4 w-4" /> Book Appointment
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#ai"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 shadow-soft hover:shadow-card transition"
            >
              <MessageSquare className="h-4 w-4" /> Talk to AI Assistant
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-destructive/95 px-6 py-3.5 text-destructive-foreground shadow-soft hover:opacity-95 transition"
            >
              <Phone className="h-4 w-4" /> Emergency Care
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal" /> 15+ Years
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal" /> Live Bookings
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal" /> 4.9★ Rated
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.15 }} className="relative">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-elegant">
            <img
              src={heroImg}
              alt="Patient smiling in modern dental clinic"
              width={1600}
              height={1200}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute -left-4 lg:-left-10 bottom-8 glass rounded-2xl p-4 shadow-elegant max-w-[240px]"
          >
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-teal-gradient text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Oral Health Score</div>
                <div className="text-xl font-semibold">
                  92 <span className="text-xs text-teal">Excellent</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute -right-2 lg:-right-8 top-10 glass rounded-2xl p-4 shadow-elegant"
          >
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-teal animate-pulse" />
              AI Assistant Online
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    "ADA Certified",
    "Sterilized Environment",
    "Zero-Pain Techniques",
    "24/7 AI Support",
    "Insurance Accepted",
  ];
  return (
    <div className="border-y border-border/60 bg-white/50">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-widest text-muted-foreground">
        {items.map((i) => (
          <span key={i} className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-teal" />
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============ ABOUT ============ */
function About() {
  const pillars = [
    {
      icon: Stethoscope,
      title: "Modern Equipment",
      desc: "Digital X-rays, intraoral scanners, laser dentistry, and AI-assisted diagnostics.",
    },
    {
      icon: ShieldCheck,
      title: "Sterilized Environment",
      desc: "Hospital-grade sterilization protocols and single-use instruments.",
    },
    {
      icon: Smile,
      title: "Patient-First Approach",
      desc: "Painless techniques, transparent pricing, and warm, unhurried care.",
    },
    {
      icon: Sparkles,
      title: "Experienced Dentists",
      desc: "Board-certified specialists across cosmetic, pediatric, and surgical dentistry.",
    },
  ];
  return (
    <section id="about" className="py-24 lg:py-32 bg-background text-black">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-black font-medium">
            About HealthyGrinz
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-normal tracking-tight">
            Where <em>expert dentistry</em> meets artificial intelligence.
          </h2>
          <p className="mt-6 text-lg text-black leading-relaxed">
            Our mission is simple — make world-class dental care{" "}
            <em>calmer, smarter, and more accessible</em> for every generation. From a child's first
            checkup to a senior's implant, HealthyGrinz combines clinical excellence with AI to
            guide you every step of the way.
          </p>
        </motion.div>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group rounded-3xl bg-card p-6 shadow-card hover:shadow-elegant transition-all"
            >
              <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary-gradient text-white shadow-soft mb-4 group-hover:scale-110 transition-transform">
                <p.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-xl mb-2">{p.title}</div>
              <p className="text-sm text-black leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ DENTISTS ============ */
function Dentists() {
  return (
    <section
      id="dentists"
      className="relative overflow-hidden bg-white py-20 text-[#2f2948] lg:py-28"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-36 h-px origin-center bg-gradient-to-r from-transparent via-[#5a4f79]/35 to-transparent"
        animate={{ opacity: [0.25, 0.8, 0.25], scaleX: [0.78, 1, 0.78] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-10 h-28 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 34px, rgba(90,79,121,0.08) 34px 36px)",
          backgroundSize: "160px 160px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "160px 0px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.h2
          {...fadeUp}
          className="text-center text-5xl font-extrabold leading-tight tracking-normal sm:text-6xl"
        >
          Our Doctor
        </motion.h2>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative mx-auto mt-56 max-w-6xl bg-[#f6dfd2] px-6 pb-14 pt-52 text-center shadow-soft transition-shadow hover:shadow-elegant sm:mt-60 sm:px-12 sm:pb-16 sm:pt-56 lg:pb-20"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.55) 42%, transparent 54%)",
              backgroundSize: "240% 100%",
            }}
            animate={{ backgroundPosition: ["120% 0%", "-120% 0%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute right-6 top-6 hidden items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold shadow-soft sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#5a4f79] animate-pulse" />
            Available for consultations
          </div>

          <div className="absolute left-1/2 top-0 z-10 w-[min(82vw,360px)] -translate-x-1/2 -translate-y-1/2 bg-white p-2 shadow-soft">
            <img
              src={doctorLishaImg}
              alt="Dr. Lisha"
              loading="lazy"
              className="aspect-[4/5] h-auto w-full object-contain object-center"
            />
          </div>

          <div className="relative mx-auto max-w-md">
            <motion.h3
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl font-extrabold tracking-normal sm:text-4xl"
            >
              Dr. Lisha
            </motion.h3>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-2 text-2xl font-light"
            >
              Dental Surgeon, BDS
            </motion.p>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 text-left text-base leading-7 text-[#3f3759]"
            >
              She has Completed her Bachelors in Dental Surgery from Sudha Rustagi Dental College,
              Faridabad (Haryana) and is having an Experience of over 6years in providing high
              quality Dental Care and Aesthetics treatments.
            </motion.p>
            <Link to="/about">
             <motion.button
              type="button"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-24 inline-flex bg-primary px-8 py-3 text-lg font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 hover:shadow-elegant"
              >
                More About Us
              </motion.button>
           
              </Link>


            
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ SERVICES ============ */
function Services() {
  const services = [
    {
      icon: Stethoscope,
      name: "General Dentistry",
      desc: "Comprehensive exams and preventive care.",
    },
    { icon: Sparkles, name: "Teeth Cleaning", desc: "Ultrasonic scaling and polishing." },
    { icon: Smile, name: "Teeth Whitening", desc: "Zoom-grade whitening in a single visit." },
    { icon: ShieldCheck, name: "Dental Implants", desc: "Titanium implants that last a lifetime." },
    { icon: Activity, name: "Root Canal Treatment", desc: "Painless single-sitting endodontics." },
    { icon: Zap, name: "Braces & Aligners", desc: "Metal, ceramic, and clear aligners." },
    { icon: Stethoscope, name: "Tooth Extraction", desc: "Atraumatic and surgical extractions." },
    { icon: Baby, name: "Pediatric Dentistry", desc: "Gentle care for growing smiles." },
    { icon: Smile, name: "Cosmetic Dentistry", desc: "Bespoke smile design and makeovers." },
    { icon: ShieldCheck, name: "Crowns & Bridges", desc: "Zirconia and porcelain restorations." },
    { icon: Sparkles, name: "Veneers", desc: "Ultra-thin porcelain smile transformation." },
    { icon: HeartPulse, name: "Gum Treatment", desc: "Advanced periodontal therapy." },
  ];
  return (
    <section id="services" className="relative overflow-hidden bg-white py-24 lg:py-32 text-black">
      <img
        src="/dental-tools-reference.jpg"
        alt=""
        aria-hidden
        className="absolute right-0 top-0 hidden h-80 w-[42%] object-cover opacity-90 lg:block"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-black font-medium">
            Dental Services
          </div>
          <h2 className="mt-3 text-5xl font-extrabold leading-tight tracking-normal sm:text-6xl">
            Our
            <br />
            Services
          </h2>
        </motion.div>
        <div className="mt-12 rounded-none bg-[#ddf6e6] p-8 shadow-soft lg:max-w-[74%]">
          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-8">
            {services.map((s, i) => (
              <motion.div
                key={s.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                className="group transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-primary text-white shrink-0">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold">{s.name}</div>
                    <p className="mt-1 text-sm text-black leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#booking"
              className="inline-flex bg-primary px-6 py-3 text-lg font-bold text-primary-foreground"
            >
              Make an Appointment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ AI FEATURES ============ */
function AIFeatures() {
  const [activeTool, setActiveTool] = useState("assistant");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["tooth pain"]);
  const [treatmentGoal, setTreatmentGoal] = useState("brighter smile");
  const [appointmentNeed, setAppointmentNeed] = useState("General Checkup");
  const [costProcedure, setCostProcedure] = useState("Teeth Cleaning");
  const [uploadedSmile, setUploadedSmile] = useState("");
  const [uploadedReport, setUploadedReport] = useState("");
  const [healthHabits, setHealthHabits] = useState<string[]>(["brush"]);
  const [faqQuery, setFaqQuery] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [emergencyType, setEmergencyType] = useState("Severe tooth pain");

  const features = [
    {
      key: "assistant",
      icon: MessageSquare,
      title: "AI Dental Assistant",
      desc: "24/7 chatbot for tooth pain, bleeding gums, braces, whitening, implants, pricing & appointments.",
    },
    {
      key: "symptoms",
      icon: Search,
      title: "AI Symptom Checker",
      desc: "Select symptoms — AI suggests possible causes, urgency level, and next steps.",
    },
    {
      key: "treatment",
      icon: Brain,
      title: "Treatment Recommendation",
      desc: "Answer a few questions and receive personalized treatment guidance.",
    },
    {
      key: "scheduler",
      icon: CalendarClock,
      title: "AI Appointment Scheduler",
      desc: "Suggests slots, matches you with the right dentist, and confirms instantly.",
    },
    {
      key: "cost",
      icon: DollarSign,
      title: "AI Cost Estimator",
      desc: "Estimated cost, visits, and treatment duration based on selected procedures.",
    },
    {
      key: "smile",
      icon: Camera,
      title: "AI Smile Analysis",
      desc: "Upload a smile photo — AI reviews alignment, discoloration, and cosmetic potential.",
    },
    {
      key: "report",
      icon: FileText,
      title: "AI Report Explainer",
      desc: "Upload X-rays or reports — AI translates medical terms and treatment plans.",
    },
    {
      key: "score",
      icon: HeartPulse,
      title: "Oral Health Score",
      desc: "Lifestyle-based score (0–100) with personalized improvement tips.",
    },
    {
      key: "faq",
      icon: Search,
      title: "AI FAQ Search",
      desc: "Ask questions in natural language instead of scrolling through FAQs.",
    },
    {
      key: "voice",
      icon: Mic,
      title: "AI Voice Assistant",
      desc: 'Say "Book an appointment tomorrow" and we handle the rest.',
    },
    {
      key: "emergency",
      icon: Zap,
      title: "Emergency AI Guidance",
      desc: "First-aid steps for knocked-out teeth, severe pain, bleeding, and more.",
    },
  ];

  const symptomOptions = ["tooth pain", "bleeding gums", "swelling", "sensitivity", "broken tooth"];
  const treatmentOptions = ["brighter smile", "missing tooth", "crooked teeth", "tooth pain"];
  const appointmentOptions = [
    "General Checkup",
    "Teeth Cleaning",
    "Whitening",
    "Root Canal",
    "Emergency",
  ];
  const costMap: Record<string, { range: string; visits: string; duration: string }> = {
    "Teeth Cleaning": { range: "$90 - $180", visits: "1 visit", duration: "45-60 minutes" },
    Whitening: { range: "$250 - $650", visits: "1 visit", duration: "60-90 minutes" },
    "Root Canal": { range: "$700 - $1,500", visits: "1-2 visits", duration: "60-120 minutes" },
    Implant: { range: "$2,500 - $5,500", visits: "3-5 visits", duration: "3-6 months" },
    Veneers: { range: "$900 - $2,200 per tooth", visits: "2-3 visits", duration: "2-4 weeks" },
  };
  const habitOptions = [
    { key: "brush", label: "Brush twice daily", points: 25 },
    { key: "floss", label: "Floss daily", points: 20 },
    { key: "sugar", label: "Low sugar intake", points: 20 },
    { key: "checkup", label: "Dental checkup this year", points: 20 },
    { key: "smoke", label: "No smoking", points: 15 },
  ];
  const faqs = [
    "Dental treatment is designed to be gentle and numbing is available for most procedures.",
    "Most major dental insurance plans are accepted.",
    "Children are welcome for checkups, cleaning, preventive care, and pediatric visits.",
    "Emergency care is available for severe pain, swelling, broken teeth, and knocked-out teeth.",
    "Smile analysis is informational and a dentist confirms the final treatment plan.",
  ];
  const emergencySteps: Record<string, string[]> = {
    "Severe tooth pain": [
      "Rinse with warm salt water.",
      "Use a cold compress if swelling is present.",
      "Book an emergency visit as soon as possible.",
    ],
    "Knocked-out tooth": [
      "Hold the tooth by the crown, not the root.",
      "Place it in milk or saliva.",
      "Reach a dentist within 30-60 minutes.",
    ],
    "Bleeding gums": [
      "Apply gentle pressure with clean gauze.",
      "Avoid aggressive brushing today.",
      "Schedule a gum evaluation if bleeding continues.",
    ],
    "Broken tooth": [
      "Save any broken pieces.",
      "Avoid chewing on that side.",
      "Book urgent restorative care.",
    ],
  };

  const activeFeature = features.find((feature) => feature.key === activeTool) ?? features[0];
  const ActiveIcon = activeFeature.icon;
  const symptomUrgency = selectedSymptoms.some((symptom) =>
    ["swelling", "broken tooth"].includes(symptom),
  )
    ? "High priority"
    : selectedSymptoms.includes("tooth pain")
      ? "Moderate priority"
      : "Routine priority";
  const healthScore = habitOptions
    .filter((habit) => healthHabits.includes(habit.key))
    .reduce((total, habit) => total + habit.points, 20);
  const filteredFaqs = faqs.filter((faq) =>
    faq.toLowerCase().includes(faqQuery.trim().toLowerCase()),
  );

  const toggleValue = (value: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <section
      id="ai"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-secondary/40 via-background to-secondary/30 overflow-hidden text-black"
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={aiVisual}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute right-0 top-20 w-[600px] opacity-25"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-black shadow-soft">
            <Brain className="h-3.5 w-3.5" /> AI Smart Features
          </div>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight">
            Smarter care, powered by <span className="text-primary-gradient italic">AI</span>.
          </h2>
          <p className="mt-6 text-lg text-black leading-relaxed">
            From symptom checks to smile analysis, our AI tools help you understand your oral health
            and make confident decisions — anytime, anywhere.
          </p>
        </motion.div>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.button
              key={f.title}
              {...fadeUp}
              type="button"
              onClick={() => setActiveTool(f.key)}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              className={`group relative rounded-3xl glass p-6 text-left shadow-card transition-all hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                activeTool === f.key ? "ring-2 ring-primary/50" : ""
              }`}
            >
              <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary-gradient text-white shadow-soft mb-4">
                <f.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-xl">{f.title}</div>
              <p className="mt-2 text-sm text-black leading-relaxed">{f.desc}</p>
            </motion.button>
          ))}
        </div>

        <motion.div
          {...fadeUp}
          className="mt-10 rounded-3xl glass p-6 shadow-elegant"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-gradient text-primary-foreground">
              <ActiveIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-3xl">{activeFeature.title}</h3>
              <p className="text-sm text-black">{activeFeature.desc}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/45 p-5 shadow-card">
            {activeTool === "assistant" && (
              <div className="space-y-4">
                <p className="text-sm text-black">
                  Use the chat button at the bottom-left to ask about symptoms, treatments, pricing,
                  or booking. The assistant stays available while you browse.
                </p>
                <a
                  href="#booking"
                  className="inline-flex rounded-full bg-primary-gradient px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Book from assistant guidance
                </a>
              </div>
            )}

            {activeTool === "symptoms" && (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleValue(symptom, selectedSymptoms, setSelectedSymptoms)}
                      className={`rounded-full border px-4 py-2 text-sm capitalize ${
                        selectedSymptoms.includes(symptom)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white/60"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <ToolResult
                  title={symptomUrgency}
                  lines={[
                    selectedSymptoms.length
                      ? `Selected: ${selectedSymptoms.join(", ")}.`
                      : "Select one or more symptoms to generate guidance.",
                    "Possible next step: schedule an exam so a dentist can confirm the cause.",
                    "Seek urgent care for swelling, fever, trauma, or uncontrolled bleeding.",
                  ]}
                />
              </div>
            )}

            {activeTool === "treatment" && (
              <div className="space-y-5">
                <ToolSelect
                  label="Primary goal"
                  value={treatmentGoal}
                  options={treatmentOptions}
                  onChange={setTreatmentGoal}
                />
                <ToolResult
                  title="Suggested treatment path"
                  lines={[
                    treatmentGoal === "brighter smile"
                      ? "Start with cleaning and whitening consultation."
                      : treatmentGoal === "missing tooth"
                        ? "Implant or bridge consultation is recommended."
                        : treatmentGoal === "crooked teeth"
                          ? "Clear aligners or braces consultation is recommended."
                          : "Pain-focused exam with X-ray is recommended.",
                    "A dentist will confirm suitability after clinical examination.",
                  ]}
                />
              </div>
            )}

            {activeTool === "scheduler" && (
              <div className="space-y-5">
                <ToolSelect
                  label="Visit reason"
                  value={appointmentNeed}
                  options={appointmentOptions}
                  onChange={setAppointmentNeed}
                />
                <ToolResult
                  title="Recommended appointment"
                  lines={[
                    appointmentNeed === "Emergency"
                      ? "Priority slot: today or next available emergency opening."
                      : "Suggested slot: tomorrow morning or the next available afternoon.",
                    appointmentNeed === "Whitening" || appointmentNeed === "Root Canal"
                      ? "Best matched with an available specialist after live schedule review."
                      : "Any available dentist can start this visit.",
                  ]}
                />
                <a
                  href="#booking"
                  className="inline-flex rounded-full bg-primary-gradient px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Fill booking form
                </a>
              </div>
            )}

            {activeTool === "cost" && (
              <div className="space-y-5">
                <ToolSelect
                  label="Procedure"
                  value={costProcedure}
                  options={Object.keys(costMap)}
                  onChange={setCostProcedure}
                />
                <ToolResult
                  title={costMap[costProcedure].range}
                  lines={[
                    `Typical visits: ${costMap[costProcedure].visits}.`,
                    `Estimated treatment time: ${costMap[costProcedure].duration}.`,
                    "Final pricing depends on exam findings, materials, and insurance.",
                  ]}
                />
              </div>
            )}

            {activeTool === "smile" && (
              <UploadTool
                label="Upload smile photo"
                fileName={uploadedSmile}
                onChange={setUploadedSmile}
                resultTitle="Smile preview"
                resultLines={[
                  uploadedSmile
                    ? `${uploadedSmile} is ready for cosmetic review.`
                    : "Choose a photo to generate a preview.",
                  "The review checks discoloration, symmetry, spacing, and alignment.",
                  "A cosmetic dentist confirms the final smile plan.",
                ]}
              />
            )}

            {activeTool === "report" && (
              <UploadTool
                label="Upload report or X-ray"
                fileName={uploadedReport}
                onChange={setUploadedReport}
                resultTitle="Report explainer"
                resultLines={[
                  uploadedReport
                    ? `${uploadedReport} is ready to explain in plain language.`
                    : "Choose a report file to prepare an explanation.",
                  "The tool summarizes terms, possible findings, and questions for your dentist.",
                  "It does not replace diagnosis from a licensed clinician.",
                ]}
              />
            )}

            {activeTool === "score" && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-2">
                  {habitOptions.map((habit) => (
                    <label
                      key={habit.key}
                      className="flex items-center gap-3 rounded-2xl bg-white/60 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={healthHabits.includes(habit.key)}
                        onChange={() => toggleValue(habit.key, healthHabits, setHealthHabits)}
                      />
                      <span className="text-sm">{habit.label}</span>
                    </label>
                  ))}
                </div>
                <ToolResult
                  title={`${Math.min(100, healthScore)} / 100`}
                  lines={[
                    healthScore >= 80
                      ? "Excellent routine. Keep your preventive care consistent."
                      : "Good start. Add daily flossing and routine checkups to improve your score.",
                    "This score is lifestyle-based and informational only.",
                  ]}
                />
              </div>
            )}

            {activeTool === "faq" && (
              <div className="space-y-5">
                <input
                  value={faqQuery}
                  onChange={(event) => setFaqQuery(event.target.value)}
                  placeholder="Search insurance, kids, pain, emergency..."
                  className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <ToolResult
                  title="Matching answers"
                  lines={(faqQuery ? filteredFaqs : faqs).slice(0, 3)}
                />
              </div>
            )}

            {activeTool === "voice" && (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => setVoiceText("Book an appointment tomorrow for a cleaning.")}
                  className="rounded-full bg-primary-gradient px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Simulate voice command
                </button>
                <ToolResult
                  title={voiceText || "Ready for command"}
                  lines={[
                    voiceText
                      ? "Understood. Suggested action: open the booking form with Cleaning selected."
                      : 'Try: "Book an appointment tomorrow".',
                    "Browser microphone permissions can be added for live dictation later.",
                  ]}
                />
              </div>
            )}

            {activeTool === "emergency" && (
              <div className="space-y-5">
                <ToolSelect
                  label="Emergency type"
                  value={emergencyType}
                  options={Object.keys(emergencySteps)}
                  onChange={setEmergencyType}
                />
                <ToolResult title="First-aid guidance" lines={emergencySteps[emergencyType]} />
                <a
                  href="#contact"
                  className="inline-flex rounded-full bg-primary-gradient px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Contact emergency care
                </a>
              </div>
            )}
          </div>
        </motion.div>
        <motion.p
          {...fadeUp}
          className="mt-10 text-xs text-center text-black max-w-2xl mx-auto italic"
        >
          This AI analysis is for informational purposes only and does not replace professional
          dental diagnosis.
        </motion.p>
      </div>
    </section>
  );
}

function ToolSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-black">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ToolResult({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white/60 p-4">
      <div className="font-display text-2xl">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-black">
        {lines.length ? (
          lines.map((line) => <li key={line}>{line}</li>)
        ) : (
          <li>No matching answers yet. Try a different question.</li>
        )}
      </ul>
    </div>
  );
}

function UploadTool({
  label,
  fileName,
  onChange,
  resultTitle,
  resultLines,
}: {
  label: string;
  fileName: string;
  onChange: (name: string) => void;
  resultTitle: string;
  resultLines: string[];
}) {
  return (
    <div className="space-y-5">
      <label className="block rounded-2xl border border-dashed border-primary/40 bg-white/50 p-5">
        <span className="text-sm font-medium">{label}</span>
        <input
          type="file"
          className="mt-3 block w-full text-sm"
          onChange={(event) => onChange(event.target.files?.[0]?.name ?? "")}
        />
      </label>
      <ToolResult title={resultTitle} lines={resultLines} />
    </div>
  );
}

/* ============ GALLERY ============ */
function Gallery() {
  return (
    <section id="gallery" className="py-24 lg:py-32 text-black">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-black font-semibold">
            Smile Gallery
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-normal tracking-tight">
            Real transformations. <em>Real confidence.</em>
          </h2>
        </motion.div>
        <motion.a
          {...fadeUp}
          href={referenceSmileImg}
          target="_blank"
          rel="noreferrer"
          className="group mx-auto mt-16 block max-w-3xl overflow-hidden rounded-3xl bg-card shadow-card transition-all hover:shadow-elegant"
        >
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={smile1}
              alt="Healthy Grins smile gallery"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="font-display text-2xl">Open live smile gallery</div>
            <p className="mt-2 text-sm text-black">
              Use your connected gallery source for real patient transformations.
            </p>
          </div>
        </motion.a>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {([] as number[]).map((_, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card hover:shadow-elegant transition-all"
            >
              <img
                src={smile1}
                alt={`Smile transformation ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-xs uppercase tracking-wider opacity-80">Before → After</div>
                <div className="font-display text-xl">Smile Transformation</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TESTIMONIALS ============ */
function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/40 text-black">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-black font-semibold">
            Patient Stories
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-normal tracking-tight">
            Real stories from <em>real patients</em>.
          </h2>
        </motion.div>
        <motion.div
          {...fadeUp}
          className="mx-auto mt-16 max-w-2xl rounded-3xl bg-card p-8 text-center shadow-card"
        >
          <MessageSquare className="mx-auto h-10 w-10 text-primary" />
          <h3 className="mt-4 font-display text-2xl">Live patient stories coming soon</h3>
          <p className="mt-3 text-sm leading-relaxed text-black">
            Connect approved reviews or a testimonials table to publish real patient feedback here.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ BOOKING ============ */
function Booking() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patient_name: "",
    phone: "",
    email: "",
    preferred_doctor: "Dr. Lisha",
    preferred_date: "",
    preferred_time: "",
    treatment_type: "General Checkup",
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) {
        toast.error("Please sign in first to book an appointment.");
        window.location.href = "/auth?redirect=/#booking";
        return;
      }
      const { error } = await supabase.from("appointments").insert({
        user_id: userRes.user.id,
        ...form,
      });
      if (error) throw error;
      toast.success("Appointment requested! We'll confirm shortly.");
      setForm({ ...form, notes: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to book";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const treatments = [
    "General Checkup",
    "Teeth Cleaning",
    "Whitening",
    "Braces Consultation",
    "Implant Consultation",
    "Root Canal",
    "Emergency",
    "Cosmetic Consultation",
  ];
  const doctors = ["Dr. Lisha", "Any available dentist"];

  return (
    <section id="booking" className="py-24 lg:py-32 text-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center rounded-[2.5rem] overflow-hidden shadow-elegant bg-card">
          <div className="p-10 lg:p-14 bg-primary-gradient text-primary-foreground">
            <div className="text-xs uppercase tracking-widest opacity-80">Book Appointment</div>
            <h2 className="mt-3 text-4xl lg:text-5xl font-normal tracking-tight text-white">
              Your best smile is <em>one visit away</em>.
            </h2>
            <p className="mt-6 opacity-90 leading-relaxed">
              Fill in the form and our team will confirm your slot within 30 minutes. Prefer AI
              booking? Ask our assistant "book me an appointment tomorrow".
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4" /> Mon–Sat · 9am–8pm · Sun 10am–4pm
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" /> +91 9821127942
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4" /> Most insurances accepted
              </div>
            </div>
          </div>
          <form onSubmit={submit} className="p-10 lg:p-14 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={form.patient_name}
                onChange={(v) => setForm({ ...form, patient_name: v })}
                required
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Doctor"
                value={form.preferred_doctor}
                onChange={(v) => setForm({ ...form, preferred_doctor: v })}
                options={doctors}
              />
              <Select
                label="Treatment"
                value={form.treatment_type}
                onChange={(v) => setForm({ ...form, treatment_type: v })}
                options={treatments}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Preferred Date"
                type="date"
                value={form.preferred_date}
                onChange={(v) => setForm({ ...form, preferred_date: v })}
                required
              />
              <Input
                label="Preferred Time"
                type="time"
                value={form.preferred_time}
                onChange={(v) => setForm({ ...form, preferred_time: v })}
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-black">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-2xl border border-input bg-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              disabled={loading}
              className="w-full rounded-full bg-primary-gradient text-primary-foreground py-3.5 font-medium shadow-elegant hover:shadow-glow disabled:opacity-50 transition-all"
            >
              {loading ? "Booking…" : "Request Appointment"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-black">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-input bg-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-black">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-input bg-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ============ DASHBOARD PREVIEW ============ */
function DashboardPreview() {
  const features = [
    { icon: Calendar, label: "Upcoming Appointments" },
    { icon: FileText, label: "Treatment History" },
    { icon: DollarSign, label: "Bills & Invoices" },
    { icon: Stethoscope, label: "Prescriptions" },
    { icon: Brain, label: "AI Recommendations" },
    { icon: HeartPulse, label: "Oral Health Score" },
    { icon: FileText, label: "Downloadable Reports" },
    { icon: MessageSquare, label: "Chat with your Dentist" },
  ];
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/40 text-black">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp}>
          <div className="text-xs uppercase tracking-widest text-black font-semibold">
            Patient Dashboard
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-normal tracking-tight">
            Your whole dental life, <em>in one dashboard.</em>
          </h2>
          <p className="mt-6 text-lg text-black leading-relaxed">
            Track appointments, view treatment history, download reports, and get AI-powered
            recommendations — all secure and beautifully organized.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-gradient px-6 py-3.5 text-primary-foreground shadow-elegant hover:shadow-glow transition-all"
          >
            Open your dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="rounded-3xl glass p-6 shadow-elegant"
        >
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.label} className="rounded-2xl bg-white/70 p-4 shadow-soft">
                <f.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 text-sm font-medium">{f.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ BLOG ============ */
function Blog() {
  const posts = [
    {
      tag: "Hygiene",
      title: "The 2-minute rule that saves your teeth",
      desc: "The science behind brushing time, technique, and timing.",
    },
    {
      tag: "Whitening",
      title: "In-clinic vs. at-home whitening",
      desc: "What actually works — and what damages enamel.",
    },
    {
      tag: "Kids",
      title: "Your child's first dental visit",
      desc: "A stress-free checklist for parents.",
    },
  ];
  return (
    <section className="py-24 lg:py-32 text-black">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-black font-semibold">Blog</div>
            <h2 className="mt-3 text-4xl sm:text-5xl font-normal tracking-tight">
              Dental wisdom, <em>simplified.</em>
            </h2>
          </div>
          <a href="#" className="text-sm text-black hover:underline">
            View all articles →
          </a>
        </motion.div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.title}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group rounded-3xl bg-card overflow-hidden shadow-card hover:shadow-elegant transition-all"
            >
              <div className="aspect-[16/10] bg-primary-gradient" />
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-black font-semibold">
                  {p.tag}
                </div>
                <h3 className="mt-2 font-display text-2xl text-black transition-colors">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-black leading-relaxed">{p.desc}</p>
                <div className="mt-4 text-sm text-black inline-flex items-center gap-1">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FAQ ============ */
function FAQ() {
  const items = [
    {
      q: "Is dental treatment painful at HealthyGrinz?",
      a: "We use advanced painless techniques including topical numbing and laser dentistry. Most patients report zero discomfort.",
    },
    {
      q: "Do you accept insurance?",
      a: "Yes — we accept most major dental insurance plans and offer flexible payment options.",
    },
    {
      q: "Can I book an appointment with the AI Assistant?",
      a: "Absolutely. Chat with our AI Assistant or use voice commands like 'book an appointment tomorrow'.",
    },
    {
      q: "Is the AI Smile Analysis a replacement for a dentist?",
      a: "No. It's informational and helps you understand your options — a professional diagnosis is always required.",
    },
    {
      q: "Do you treat children?",
      a: "Yes, we provide pediatric dentistry with a warm, kid-friendly approach.",
    },
    {
      q: "What should I do in a dental emergency?",
      a: "Call our emergency line, or use the AI Emergency Guidance for immediate first-aid steps.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 lg:py-32 bg-secondary/40 text-black">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div {...fadeUp} className="text-center">
          <div className="text-xs uppercase tracking-widest text-black font-semibold">
            Questions
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-normal tracking-tight">
            Frequently asked.
          </h2>
        </motion.div>
        <div className="mt-14 space-y-3">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl bg-card shadow-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium">{it.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-black transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-black leading-relaxed">{it.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32 text-black">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10">
        <motion.div {...fadeUp}>
          <div className="text-xs uppercase tracking-widest text-black font-semibold">
            Contact Us
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-normal tracking-tight">
            Visit our <em>flagship clinic</em>.
          </h2>
          <div className="mt-10 space-y-5 text-sm">
            <Row icon={MapPin} title="Address">
              128 Willow Avenue, Suite 400 · Downtown, CA 90210
            </Row>
            <Row icon={Phone} title="Phone">
              +91 9821127942
            </Row>
            <Row icon={Mail} title="Email">
              care@healthygrinz.com
            </Row>
            <Row icon={Clock} title="Working Hours">
              Mon–Sat 9am–8pm · Sun 10am–4pm
            </Row>
            <Row icon={HeartPulse} title="24/7 Emergency">
              +91 9821127942
            </Row>
          </div>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="rounded-3xl overflow-hidden shadow-elegant aspect-[4/3] lg:aspect-auto"
        >
          <iframe
            title="HealthyGrinz location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-118.42%2C34.06%2C-118.36%2C34.09&layer=mapnik"
            className="w-full h-full min-h-[400px] border-0"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
function Row({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid place-items-center h-10 w-10 rounded-2xl bg-teal-gradient text-white shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-black">{title}</div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

/* ============ FOOTER ============ */
function Footer() {
  const siteLinks = [
    { label: "Home", href: "#" },
    { label: "Grins Gallery", href: "#gallery" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
    { label: "Blog", href: "#blog" },
  ];

  return (
    <footer className="bg-[#f6dfd2] text-[#12173d]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_1.35fr_1.2fr]">
        <div className="md:border-r md:border-[#12173d] md:pr-12">
          <div className="mb-10 text-lg">Site Links</div>
          <ul className="space-y-4 text-xl font-bold">
            {siteLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition hover:text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:px-10">
          <h2 className="text-3xl font-extrabold leading-tight tracking-normal">
            Healthy Grins
            <br />
            Dental Clinic
          </h2>

          <div className="mt-14">
            <h3 className="text-xl font-bold">Clinic Hours</h3>
            <div className="mt-3 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-lg">
              <span>Mon-Sat:</span>
              <span>10am to 02pm</span>
              <span />
              <span>05pm to 08pm</span>
              <span>Sun:</span>
              <span>By Appointment Only</span>
            </div>
          </div>

          <div className="mt-9 space-y-2 text-lg">
            <a href="tel:+919821127942" className="flex items-center gap-2 hover:underline">
              <Phone className="h-5 w-5" /> +91 9821127942
            </a>
            <a
              href="https://wa.me/919821127942"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 underline"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#27d367] text-xs font-black text-white">
                W
              </span>
              Chat with us
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          <BrandLogo className="w-72 max-w-full" />
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Twitter, label: "Twitter" },
              { icon: Instagram, label: "Instagram" },
              { icon: Mail, label: "Email" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href={label === "Email" ? "mailto:care@healthygrinz.com" : "#"}
                aria-label={label}
                className="grid h-7 w-7 place-items-center rounded-full bg-black text-white transition hover:bg-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-sm">
          © {new Date().getFullYear()} by Healthy Grins. Powered and secured by Healthy Grins.
        </div>
      </div>
    </footer>
  );
}
