import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/site/BrandLogo";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<null | { id: string }>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    supabase.auth.getUser().then(({ data }) => setUser(data.user ? { id: data.user.id } : null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setUser(s?.user ? { id: s.user.id } : null),
    );
    return () => {
      window.removeEventListener("scroll", onScroll);
      sub.subscription.unsubscribe();
    };
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#ai", label: "AI Features" },
    { href: "#dentists", label: "Dentists" },
    { href: "#gallery", label: "Smiles" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all ${scrolled ? "" : ""}`}>
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all ${scrolled ? "glass shadow-card" : ""}`}
        >
          <Link to="/" className="flex items-center shrink-0" aria-label="Healthy Grins home">
            <BrandLogo compact />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="text-sm px-4 py-2 rounded-full hover:bg-muted transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="text-sm px-4 py-2 rounded-full hover:bg-muted transition">
                Sign in
              </Link>
            )}
            <a
              href="/#booking"
              className="text-sm px-5 py-2.5 rounded-full bg-primary-gradient text-primary-foreground shadow-soft hover:shadow-elegant transition-all"
            >
              Book Appointment
            </a>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden glass mt-2 rounded-3xl p-6 shadow-elegant animate-fade-in">
            <div className="flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground/80"
                >
                  {l.label}
                </a>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/dashboard" });
                  }}
                  className="text-left"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/auth" });
                  }}
                  className="text-left"
                >
                  Sign in
                </button>
              )}
              <a
                href="/#booking"
                onClick={() => setOpen(false)}
                className="text-center py-3 rounded-full bg-primary-gradient text-primary-foreground"
              >
                Book Appointment
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
