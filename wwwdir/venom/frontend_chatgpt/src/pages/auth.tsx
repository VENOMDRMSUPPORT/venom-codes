import { useMemo, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { forgotPasswordRequest, loginRequest, registerRequest } from "@/lib/api";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hooks/use-auth";

function AuthScaffold({
  title,
  body,
  asideTitle,
  asideBody,
  children,
  footer
}: {
  title: string;
  body: string;
  asideTitle: string;
  asideBody: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="shell grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
        <Card className="hidden rounded-[34px] p-8 lg:block">
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-400">Premium operator portal</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)]">{asideTitle}</h1>
          <p className="mt-4 max-w-lg text-base leading-8 text-muted">{asideBody}</p>

          <div className="mt-10 space-y-4">
            {[
              { icon: ShieldCheck, title: "Backend-safe workflow", text: "The frontend handles experience while privileged WHMCS logic remains on the server boundary." },
              { icon: Lock, title: "Operational clarity", text: "Services, billing, domains, support, and account actions are structured like a modern SaaS workspace." },
              { icon: Mail, title: "Preview mode included", text: "Explore the full portal immediately without pretending the preview is a live session." }
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-[24px] p-5">
                <div className="flex items-start gap-3">
                  <item.icon className="mt-0.5 size-5 text-cyan-400" />
                  <div>
                    <div className="text-base font-medium text-[var(--foreground)]">{item.title}</div>
                    <p className="mt-1 text-sm leading-7 text-muted">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[34px] p-6 sm:p-8 lg:p-10">
          <div className="max-w-lg space-y-6">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-400">Secure access</div>
              <h2 className="text-4xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h2>
              <p className="text-base leading-8 text-muted">{body}</p>
            </div>
            {children}
            {footer}
          </div>
        </Card>
      </main>
      <MarketingFooter />
    </div>
  );
}

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-400">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function Login() {
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const startPreview = useAuthStore((state) => state.startPreview);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = useMutation({
    mutationFn: () => loginRequest({ email, password }),
    onSuccess: (result) => {
      if (!result.token) {
        setError("The login endpoint did not return a token. Please verify the backend response contract.");
        return;
      }
      setAuth(result.token, result.client);
      setLocation("/dashboard");
    },
    onError: (mutationError) => {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to complete sign in.");
    }
  });

  return (
    <AuthScaffold
      title="Sign in to your control portal"
      body="Access services, invoices, tickets, domains, and account workflows through a refined interface built for clarity under pressure."
      asideTitle="A client area rebuilt like a premium product experience."
      asideBody="The new frontend keeps the commercial and operational narrative consistent from the public landing page to the authenticated workspace."
      footer={
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>New to VENOM CODES?</span>
          <ButtonLink href="/register" variant="ghost" className="h-auto px-0 py-0 hover:bg-transparent">
            Create an account
          </ButtonLink>
          <span>•</span>
          <ButtonLink href="/forgot-password" variant="ghost" className="h-auto px-0 py-0 hover:bg-transparent">
            Reset password
          </ButtonLink>
        </div>
      }
    >
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="operator@company.com" />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" className="justify-center" onClick={() => login.mutate()} disabled={login.isPending || !email || !password}>
          {login.isPending ? "Signing in..." : "Sign in"}
          <ArrowRight className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            startPreview();
            setLocation("/dashboard");
          }}
        >
          Explore preview mode
        </Button>
      </div>
    </AuthScaffold>
  );
}

export function Register() {
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const planHint = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("plan");
  }, []);

  const register = useMutation({
    mutationFn: () => registerRequest({ firstname, lastname, companyname, email, password }),
    onSuccess: (result) => {
      if (!result.token) {
        setError("The register endpoint did not return a token. Please verify the backend response contract.");
        return;
      }
      setAuth(result.token, result.client);
      setLocation("/dashboard");
    },
    onError: (mutationError) => {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to create the account.");
    }
  });

  return (
    <AuthScaffold
      title="Create your VENOM CODES workspace"
      body="Set up your portal identity, establish the commercial account, and move into a product experience designed around rollout clarity."
      asideTitle="Registration that feels aligned with the product you are buying."
      asideBody="Instead of dropping users into a generic hosting template, the new experience keeps the visual and narrative quality intact during onboarding."
      footer={
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>Already have access?</span>
          <ButtonLink href="/login" variant="ghost" className="h-auto px-0 py-0 hover:bg-transparent">
            Sign in
          </ButtonLink>
        </div>
      }
    >
      {planHint ? (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
          You arrived from the <span className="font-semibold capitalize">{planHint}</span> plan. The selected commercial tier can be confirmed after account creation.
        </div>
      ) : null}
      <ErrorMessage message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" value={firstname} onChange={(event) => setFirstname(event.target.value)} placeholder="Nadia" />
        <Input label="Last name" value={lastname} onChange={(event) => setLastname(event.target.value)} placeholder="Amin" />
      </div>
      <Input label="Company" value={companyname} onChange={(event) => setCompanyname(event.target.value)} placeholder="Atlas Broadcast Group" />
      <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="operator@company.com" />
      <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Choose a strong password" />
      <Button type="button" className="w-full justify-center" onClick={() => register.mutate()} disabled={register.isPending || !firstname || !lastname || !email || !password}>
        {register.isPending ? "Creating account..." : "Create account"}
        <ArrowRight className="size-4" />
      </Button>
    </AuthScaffold>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgot = useMutation({
    mutationFn: () => forgotPasswordRequest(email),
    onSuccess: () => {
      setError(null);
      setSuccess("If the address exists in the system, reset instructions have been sent.");
    },
    onError: (mutationError) => {
      setSuccess(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to request a reset email.");
    }
  });

  return (
    <AuthScaffold
      title="Recover access"
      body="Request a secure password reset without leaving the premium portal experience."
      asideTitle="Keep account recovery polished and trustworthy."
      asideBody="Authentication flows deserve the same level of design care as the rest of the product because trust is built in the edge cases too."
      footer={
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <ButtonLink href="/login" variant="ghost" className="h-auto px-0 py-0 hover:bg-transparent">
            Back to sign in
          </ButtonLink>
        </div>
      }
    >
      <ErrorMessage message={error} />
      {success ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{success}</div> : null}
      <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="operator@company.com" />
      <Button type="button" className="w-full justify-center" onClick={() => forgot.mutate()} disabled={forgot.isPending || !email}>
        {forgot.isPending ? "Sending reset email..." : "Send reset instructions"}
      </Button>
    </AuthScaffold>
  );
}
