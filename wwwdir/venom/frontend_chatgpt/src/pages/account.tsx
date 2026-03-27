import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, KeyRound, UserRound } from "lucide-react";
import { changePassword, listContacts, listPaymentMethods, updateClientProfile } from "@/lib/api";
import { contacts as previewContacts, paymentMethods as previewPaymentMethods } from "@/lib/site";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { useAuthStore } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";
import { Input } from "@/components/ui/input";

export function Profile() {
  const client = useAuthStore((state) => state.client);
  const setClient = useAuthStore((state) => state.setClient);
  const previewMode = useAuthStore((state) => state.previewMode);
  const [firstname, setFirstname] = useState(client?.firstname ?? "");
  const [lastname, setLastname] = useState(client?.lastname ?? "");
  const [companyname, setCompanyname] = useState(client?.company ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = useMutation({
    mutationFn: () => updateClientProfile({ firstname, lastname, companyname }),
    onSuccess: () => {
      if (client) {
        setClient({ ...client, firstname, lastname, company: companyname });
      }
      setError(null);
      setFeedback(previewMode ? "Preview mode updated the local profile state only." : "Profile update submitted to the backend.");
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to update the profile.");
    }
  });

  return (
    <DashboardShell title="Profile" description="A cleaner account identity screen that keeps commercial and operator details easy to review." actions={<Badge tone={previewMode ? "warning" : "success"}>{previewMode ? "Preview mode" : "Live account"}</Badge>}>
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Account identity</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="First name" value={firstname} onChange={(event) => setFirstname(event.target.value)} />
            <Input label="Last name" value={lastname} onChange={(event) => setLastname(event.target.value)} />
          </div>
          <div className="mt-4 grid gap-4">
            <Input label="Company" value={companyname} onChange={(event) => setCompanyname(event.target.value)} />
            <Input label="Email" value={client?.email ?? ""} disabled />
          </div>
          <div className="mt-5 flex gap-3">
            <Button type="button" onClick={() => update.mutate()} disabled={update.isPending}>
              {update.isPending ? "Saving..." : "Save profile"}
            </Button>
            <ButtonLink href="/account/security" variant="outline">Security settings</ButtonLink>
          </div>
          {feedback ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{feedback}</div> : null}
          {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
        </Card>

        <Card className="rounded-[32px] p-6">
          <UserRound className="size-6 text-cyan-400" />
          <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">Profile at a glance</h2>
          <div className="mt-6 space-y-4">
            {[
              ["Account ID", client?.id ?? "—"],
              ["Status", client?.status ?? "—"],
              ["Company", client?.company ?? "—"],
              ["Location", client?.location ?? "—"],
              ["Timezone", client?.timezone ?? "—"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 px-4 py-4 text-sm">
                <span className="text-muted">{label}</span>
                <span className="font-medium text-[var(--foreground)]">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}

export function Contacts() {
  const contactsQuery = usePreviewQuery({
    queryKey: ["contacts"],
    queryFn: listContacts,
    previewData: previewContacts
  });

  const contacts = contactsQuery.data ?? [];

  if (contactsQuery.isLoading) {
    return (
      <DashboardShell title="Contacts" description="Review account contacts and scope boundaries for billing and operational communication.">
        <DataState kind="loading" title="Loading contacts" message="Requesting contact records from the backend." />
      </DashboardShell>
    );
  }

  if (contactsQuery.isError) {
    return (
      <DashboardShell title="Contacts" description="Review account contacts and scope boundaries for billing and operational communication.">
        <DataState kind="error" title="Unable to load contacts" message="The contact list was not returned by the backend." actionLabel="Retry" onAction={() => contactsQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Contacts" description="Shared visibility for operational and finance contacts with clearer scope language and less clutter.">
      <section className="grid gap-5 xl:grid-cols-2">
        {contacts.map((contact) => (
          <Card key={contact.id} className="rounded-[30px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Contact</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{contact.name}</h2>
              </div>
              <Badge>{contact.role}</Badge>
            </div>
            <div className="mt-5 text-sm font-medium text-[var(--foreground)]">{contact.email}</div>
            <p className="mt-4 text-sm leading-7 text-muted">{contact.scope}</p>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

export function Security() {
  const previewMode = useAuthStore((state) => state.previewMode);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      setError(null);
      setFeedback(previewMode ? "Preview mode keeps the action local, but the password-change UI is wired." : "Password change submitted to the backend.");
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to update password.");
    }
  });

  return (
    <DashboardShell title="Security" description="Security pages now feel intentional and premium rather than hidden in generic account forms." actions={<ButtonLink href="/account/profile" variant="outline" size="sm">Back to profile</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Password management</div>
          <div className="mt-6 grid gap-4">
            <Input label="Current password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
            <Input label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </div>
          <div className="mt-5 flex gap-3">
            <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending || !currentPassword || !newPassword}>
              <KeyRound className="size-4" />
              {mutation.isPending ? "Saving..." : "Update password"}
            </Button>
          </div>
          {feedback ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{feedback}</div> : null}
          {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
        </Card>

        <Card className="rounded-[32px] p-6">
          <KeyRound className="size-6 text-cyan-400" />
          <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">Security posture</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <p>Security controls belong primarily to the backend, but the frontend can still make security actions legible, calm, and trustworthy.</p>
            <p>The redesign avoids noisy forms, makes status obvious, and keeps the action path short for high-sensitivity workflows.</p>
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}

export function PaymentMethods() {
  const methodsQuery = usePreviewQuery({
    queryKey: ["paymethods"],
    queryFn: listPaymentMethods,
    previewData: previewPaymentMethods
  });

  const methods = methodsQuery.data ?? [];

  if (methodsQuery.isLoading) {
    return (
      <DashboardShell title="Payment methods" description="Review saved billing instruments and default payment posture.">
        <DataState kind="loading" title="Loading payment methods" message="Requesting payment method records from the backend." />
      </DashboardShell>
    );
  }

  if (methodsQuery.isError) {
    return (
      <DashboardShell title="Payment methods" description="Review saved billing instruments and default payment posture.">
        <DataState kind="error" title="Unable to load payment methods" message="The payment method list was not returned by the backend." actionLabel="Retry" onAction={() => methodsQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Payment methods" description="A more premium, readable presentation of billing instruments and default method state." actions={<ButtonLink href="/billing" variant="outline" size="sm">Back to billing</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-2">
        {methods.map((method) => (
          <Card key={method.id} className="rounded-[30px] p-6">
            <CreditCard className="size-6 text-cyan-400" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">{method.label}</h2>
                <div className="mt-2 text-sm text-muted">{method.type}</div>
              </div>
              {method.isDefault ? <Badge tone="success">Default</Badge> : null}
            </div>
            <div className="mt-6 space-y-4">
              {[
                ["Last four", method.lastFour],
                ["Expires", method.expires]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 px-4 py-4 text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="font-medium text-[var(--foreground)]">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}
