import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { BrandLogo } from "@/components/site/BrandLogo";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Welcome to HealthyGrinz! Check your email if confirmation is required.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (res.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (!res.redirected) navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-12">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="w-full max-w-md rounded-3xl glass p-8 shadow-elegant">
        <div className="mb-6">
          <BrandLogo />
        </div>
        <h1 className="text-3xl font-normal tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Access your dashboard & appointments."
            : "Book, track, and get AI-powered guidance."}
        </p>

        <button
          onClick={google}
          className="mt-6 w-full rounded-full border border-input bg-white/70 py-3 text-sm font-medium hover:bg-white transition"
        >
          Continue with Google
        </button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            disabled={loading}
            className="w-full rounded-full bg-primary-gradient text-primary-foreground py-3 font-medium shadow-elegant hover:shadow-glow disabled:opacity-50 transition-all"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="mt-5 text-sm text-center text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-primary font-medium"
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
