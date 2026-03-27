import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Headphones, LifeBuoy, MessagesSquare } from "lucide-react";
import { createTicket, getTicket, listTicketDepartments, listTickets, replyToTicket } from "@/lib/api";
import { tickets as previewTickets } from "@/lib/site";
import { formatDateTime, statusTone } from "@/lib/utils";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { useAuthStore } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TicketsList() {
  const ticketsQuery = usePreviewQuery({
    queryKey: ["tickets"],
    queryFn: listTickets,
    previewData: previewTickets
  });

  const tickets = ticketsQuery.data ?? [];
  const openTickets = tickets.filter((ticket) => !["resolved", "closed"].includes(ticket.status.toLowerCase()));

  if (ticketsQuery.isLoading) {
    return (
      <DashboardShell title="Support" description="A structured support workspace for tickets, escalations, and threaded communication.">
        <DataState kind="loading" title="Loading support tickets" message="Requesting ticket summaries from the backend." />
      </DashboardShell>
    );
  }

  if (ticketsQuery.isError) {
    return (
      <DashboardShell title="Support" description="A structured support workspace for tickets, escalations, and threaded communication.">
        <DataState kind="error" title="Unable to load tickets" message="The ticket list was not returned by the backend." actionLabel="Retry" onAction={() => ticketsQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Support" description="Ticket flows that feel aligned with a premium SaaS experience while still fitting the operational reality of a WHMCS-connected support backend." actions={<ButtonLink href="/support/new" size="sm">Open new ticket</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[30px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Queue snapshot</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { icon: Headphones, label: "Open queue", value: String(openTickets.length).padStart(2, "0"), detail: "Tickets still moving through action or confirmation." },
              { icon: MessagesSquare, label: "All tickets", value: String(tickets.length).padStart(2, "0"), detail: "Total support conversations tied to the account." },
              { icon: LifeBuoy, label: "Escalation path", value: "Ready", detail: "Structured routing remains available through the connected backend." }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/8 px-4 py-4">
                <item.icon className="size-5 text-cyan-400" />
                <div className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">{item.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{item.value}</div>
                <p className="mt-2 text-sm leading-7 text-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[30px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Ticket list</div>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Recent conversations</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="glass-card rounded-[24px] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-[var(--foreground)]">{ticket.subject}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{ticket.department} • {ticket.priority}</div>
                  </div>
                  <Badge tone={statusTone(ticket.status)}>{ticket.status}</Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{ticket.excerpt}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="text-sm text-muted">Updated {formatDateTime(ticket.updatedAt)}</div>
                  <ButtonLink href={`/support/${ticket.id}`} variant="outline" size="sm">
                    Ticket detail
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}

export function NewTicket() {
  const previewMode = useAuthStore((state) => state.previewMode);
  const departmentsQuery = usePreviewQuery({
    queryKey: ["ticket-departments"],
    queryFn: listTicketDepartments,
    previewData: ["Streaming operations", "Billing", "Infrastructure", "General support"]
  });

  const departments = departmentsQuery.data ?? [];
  const [department, setDepartment] = useState(departments[0] ?? "");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () => createTicket({ department, subject, priority, message }),
    onSuccess: () => {
      setError(null);
      setFeedback(previewMode ? "Preview mode keeps the action local, but the create-ticket UI is fully wired." : "Ticket successfully submitted to the backend.");
      setSubject("");
      setMessage("");
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to submit the ticket.");
    }
  });

  return (
    <DashboardShell title="New ticket" description="Open a support conversation through a cleaner, more deliberate support flow." actions={<ButtonLink href="/support" variant="outline" size="sm">Back to tickets</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Open a support request</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-soft">
              <span className="font-medium">Department</span>
              <select className="glass-card h-12 rounded-2xl border px-4 text-sm text-[var(--foreground)] outline-none focus:border-venom-400/40 focus:ring-2 focus:ring-[var(--ring)]" value={department} onChange={(event) => setDepartment(event.target.value)}>
                {departments.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-soft">
              <span className="font-medium">Priority</span>
              <select className="glass-card h-12 rounded-2xl border px-4 text-sm text-[var(--foreground)] outline-none focus:border-venom-400/40 focus:ring-2 focus:ring-[var(--ring)]" value={priority} onChange={(event) => setPriority(event.target.value)}>
                {[
                  "Low",
                  "Medium",
                  "High"
                ].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-4">
            <Input label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Describe the issue briefly" />
            <Textarea label="Message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share the operational context, timing, and requested outcome." />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" onClick={() => create.mutate()} disabled={create.isPending || !department || !subject || !message}>
              {create.isPending ? "Submitting..." : "Submit ticket"}
            </Button>
            <ButtonLink href="/support" variant="outline">Cancel</ButtonLink>
          </div>
          {feedback ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{feedback}</div> : null}
          {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
        </Card>

        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Support guidance</div>
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <p>Use ticket subjects that describe the operational outcome you need, not only the symptom.</p>
            <p>Include dates, regions, affected packages, and whether the issue is live, intermittent, or already reproduced.</p>
            <p>This page is intentionally focused on communication quality while the actual routing and permissions remain anchored to the backend support system.</p>
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}

export function TicketDetail({ ticketId }: { ticketId: string }) {
  const previewMode = useAuthStore((state) => state.previewMode);
  const previewData = previewTickets.find((ticket) => ticket.id === ticketId) ?? previewTickets[0];
  const ticketQuery = usePreviewQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicket(ticketId),
    previewData
  });
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reply = useMutation({
    mutationFn: () => replyToTicket(ticketId, message),
    onSuccess: () => {
      setError(null);
      setFeedback(previewMode ? "Preview mode does not submit the reply, but the interaction is wired." : "Reply submitted to the backend.");
      setMessage("");
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to submit the reply.");
    }
  });

  const ticket = ticketQuery.data;
  const timeline = useMemo(() => ticket?.messages ?? [], [ticket?.messages]);

  if (ticketQuery.isLoading) {
    return (
      <DashboardShell title="Ticket detail" description="Read the full support thread and continue the conversation.">
        <DataState kind="loading" title="Loading ticket" message="Requesting the selected ticket thread from the backend." />
      </DashboardShell>
    );
  }

  if (ticketQuery.isError || !ticket) {
    return (
      <DashboardShell title="Ticket detail" description="Read the full support thread and continue the conversation.">
        <DataState kind="error" title="Unable to load ticket" message="The selected ticket was not returned by the backend." actionLabel="Retry" onAction={() => ticketQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={ticket.subject} description="Threaded support communication with clearer hierarchy, timestamps, and next-action space." actions={<ButtonLink href="/support" variant="outline" size="sm">Back to tickets</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">{ticket.id}</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{ticket.subject}</h2>
              <div className="mt-3 text-sm text-muted">{ticket.department} • {ticket.priority}</div>
            </div>
            <Badge tone={statusTone(ticket.status)}>{ticket.status}</Badge>
          </div>

          <div className="mt-8 space-y-4">
            {timeline.map((entry, index) => (
              <div key={`${entry.timestamp}-${index}`} className="glass-card rounded-[24px] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{entry.author}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{entry.role}</div>
                  </div>
                  <div className="text-sm text-muted">{formatDateTime(entry.timestamp)}</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{entry.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Reply</div>
          <Textarea label="Message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add the latest operational update or requested change." />
          <div className="mt-5 flex gap-3">
            <Button type="button" onClick={() => reply.mutate()} disabled={reply.isPending || !message}>
              {reply.isPending ? "Sending..." : "Send reply"}
            </Button>
            <ButtonLink href="/support/new" variant="outline">Open another ticket</ButtonLink>
          </div>
          {feedback ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{feedback}</div> : null}
          {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
        </Card>
      </section>
    </DashboardShell>
  );
}
