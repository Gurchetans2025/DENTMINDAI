import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { BrandLogo } from "@/components/site/BrandLogo";
import {
  CLINIC_ADMIN_EMAIL,
  isDoctorAdminEmail,
  isTemporaryAdminCredentials,
  setTemporaryAdminSession,
} from "@/lib/admin-access";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const redirectTo = safeRedirect(params.get("redirect"));
  const isAdminRedirect = redirectTo === "/admin";

  useEffect(() => {
    if (params.get("mode") === "signup") setMode("signup");
    if (isAdminRedirect) setEmail(CLINIC_ADMIN_EMAIL);

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.href = redirectTo;
    });
  }, [isAdminRedirect, redirectTo]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin" && isTemporaryAdminCredentials(email, password)) {
        setTemporaryAdminSession(email);
        toast.success("Temporary admin access enabled.");
        window.location.href = "/admin";
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTo}`,
            data: { full_name: name },
          },
        });
        if (error) throw error;

        if (!data.session) {
          toast.success("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
          return;
        }

        toast.success(isDoctorAdminEmail(email) ? "Doctor account created." : "Welcome to HealthyGrinz!");
        window.location.href = redirectTo;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        window.location.href = redirectTo;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Auth failed";
      if (mode === "signin" && isDoctorAdminEmail(email) && message.includes("Email not confirmed")) {
        setTemporaryAdminSession(email);
        toast.success("Email is not confirmed yet. Temporary admin access enabled.");
        window.location.href = "/admin";
        return;
      }
      if (mode === "signin" && message.includes("Invalid login")) {
        setMode("signup");
        toast.error("No account found for this email or the password is wrong. Create the account first if this is your first login.");
        return;
      }
      toast.error(message);
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
    if (!res.redirected) window.location.href = redirectTo;
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
          {mode === "signin"
            ? isAdminRedirect
              ? "Doctor sign in"
              : "Welcome back"
            : isAdminRedirect
              ? "Create doctor account"
              : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAdminRedirect
            ? "Use the clinic doctor email and password to access admin."
            : mode === "signin"
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

function safeRedirect(value: string | null) {
  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
