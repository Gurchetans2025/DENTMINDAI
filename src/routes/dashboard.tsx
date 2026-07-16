import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, HeartPulse, FileText, DollarSign, Brain, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BrandLogo } from "@/components/site/BrandLogo";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type Appt = {
  id: string;
  patient_name: string;
  preferred_date: string;
  preferred_time: string;
  treatment_type: string;
  preferred_doctor: string | null;
  status: string;
};

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUser({ email: data.user.email });
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      setIsAdmin(!!role?.some((r) => r.role === "admin"));
      const { data: rows } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", data.user.id)
        .order("preferred_date", { ascending: true });
      setAppts((rows || []) as Appt[]);
    })();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" aria-label="Healthy Grins home">
            <BrandLogo compact />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-full bg-primary-gradient text-primary-foreground"
              >
                Admin
              </Link>
            )}
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link to="/" className="text-sm text-muted-foreground inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <h1 className="mt-4 text-4xl font-normal tracking-tight">
          Welcome back<span className="text-primary-gradient italic">.</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{user?.email}</p>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Stat icon={HeartPulse} label="Oral Health Score" value="-" hint="no live score yet" />
          <Stat icon={Calendar} label="Upcoming" value={String(appts.length)} hint="appointments" />
          <Stat icon={DollarSign} label="Balance" value="-" hint="no live billing yet" />
          <Stat icon={FileText} label="Reports" value="-" hint="no live reports yet" />
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Your appointments</h2>
              <a href="/#booking" className="text-sm text-primary">
                + New
              </a>
            </div>
            <div className="mt-4 space-y-3">
              {appts.length === 0 && (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  No appointments yet. Book one from the home page.
                </div>
              )}
              {appts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-2xl bg-secondary/50 p-4"
                >
                  <div>
                    <div className="font-medium">{a.treatment_type}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.preferred_date} · {a.preferred_time} · {a.preferred_doctor}
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-teal/20 text-teal-foreground capitalize">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-primary-gradient text-primary-foreground shadow-elegant p-6">
            <Brain className="h-8 w-8" />
            <h3 className="mt-4 font-display text-2xl">AI Recommendation</h3>
            <p className="mt-2 text-sm opacity-90">
              AI recommendations will appear after your dentist adds live clinical notes, reports,
              or treatment history.
            </p>
            <button className="mt-4 rounded-full bg-white text-primary px-4 py-2 text-sm font-medium">
              View plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl glass p-5 shadow-card">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
      <div className="mt-1 text-3xl font-display">{value}</div>
      <div className="text-xs text-teal-foreground">{hint}</div>
    </div>
  );
}
