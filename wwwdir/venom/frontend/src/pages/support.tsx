import { useState, useMemo } from "react";
import {
  useGetTickets,
  useGetTicket,
  useCreateTicket,
  useReplyToTicket,
  useCloseTicket,
  useGetTicketDepartments,
} from "@workspace/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  TicketIcon,
  Plus,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
  User,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Paperclip,
  ArrowUpDown,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";

// ── Status / Priority helpers ────────────────────────────────────────────────

function ticketStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "open") return "bg-green-500/15 text-green-400 border border-green-500/30";
  if (s === "answered") return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
  if (s === "customer-reply" || s === "customer reply") return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
  if (s === "closed") return "bg-white/10 text-white/40 border border-white/10";
  if (s === "in progress") return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
  return "bg-white/10 text-white/60 border border-white/10";
}

function ticketStatusIcon(status: string) {
  const s = status.toLowerCase();
  if (s === "open") return <CheckCircle2 className="w-3 h-3" />;
  if (s === "answered") return <MessageSquare className="w-3 h-3" />;
  if (s === "customer-reply" || s === "customer reply") return <RefreshCw className="w-3 h-3" />;
  if (s === "closed") return <XCircle className="w-3 h-3" />;
  if (s === "in progress") return <Clock className="w-3 h-3" />;
  return <AlertCircle className="w-3 h-3" />;
}

function priorityWeight(priority: string) {
  const p = priority.toLowerCase();
  if (p === "high") return 3;
  if (p === "medium") return 2;
  if (p === "low") return 1;
  return 0;
}

function priorityStyle(priority: string) {
  const p = priority.toLowerCase();
  if (p === "high") return "bg-red-500/15 text-red-400 border border-red-500/30";
  if (p === "medium") return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
  if (p === "low") return "bg-green-500/15 text-green-400 border border-green-500/30";
  return "bg-white/10 text-white/60 border border-white/10";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${ticketStatusStyle(status)}`}>
      {ticketStatusIcon(status)}
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${priorityStyle(priority)}`}>
      {priority}
    </span>
  );
}

// ── Sortable column header ───────────────────────────────────────────────────

type SortField = "lastUpdated" | "priority";
type SortDir = "asc" | "desc";

function SortHeader({
  field, label, current, dir, onChange,
}: {
  field: SortField;
  label: string;
  current: SortField;
  dir: SortDir;
  onChange: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <th
      className="px-6 py-4 cursor-pointer select-none group"
      onClick={() => onChange(field)}
    >
      <span className="flex items-center gap-1 whitespace-nowrap">
        {label}
        {active ? (
          dir === "asc" ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDownIcon className="w-3 h-3 text-primary" />
        ) : (
          <ArrowUpDown className="w-3 h-3 text-white/30 group-hover:text-white/60" />
        )}
      </span>
    </th>
  );
}

// ── Tickets List ─────────────────────────────────────────────────────────────

type StatusFilter = "All" | "Open" | "Answered" | "Customer-Reply" | "Closed" | "In Progress";
const STATUS_FILTERS: StatusFilter[] = ["All", "Open", "Answered", "Customer-Reply", "Closed", "In Progress"];

export function TicketsList() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: deptData } = useGetTicketDepartments();
  const departments = deptData?.departments ?? [];

  const apiStatus = statusFilter === "All" ? undefined : statusFilter;
  const apiDeptId = deptFilter === "all" ? undefined : deptFilter;
  const { data, isLoading, isError } = useGetTickets({ status: apiStatus, deptid: apiDeptId });

  const tickets = useMemo(() => {
    const raw = data?.tickets ?? [];
    return [...raw].sort((a, b) => {
      let av = 0; let bv = 0;
      if (sortField === "priority") {
        av = priorityWeight(a.priority ?? "");
        bv = priorityWeight(b.priority ?? "");
      } else {
        av = new Date(a.lastUpdated ?? "").getTime() || 0;
        bv = new Date(b.lastUpdated ?? "").getTime() || 0;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [data?.tickets, sortField, sortDir]);

  function handleSort(f: SortField) {
    if (sortField === f) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(f); setSortDir("desc"); }
  }

  return (
    <DashboardLayout title="Support Tickets">
      {/* Filters row */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === f
                    ? "bg-primary text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Link href="/support/tickets/new">
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Open Ticket
            </Button>
          </Link>
        </div>

        {departments.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-white/40 font-medium">Department:</span>
            <button
              onClick={() => setDeptFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                deptFilter === "all"
                  ? "bg-white/15 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              All
            </button>
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setDeptFilter(d.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  deptFilter === d.id
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="glass rounded-2xl flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
          <span className="text-white/60">Loading tickets…</span>
        </div>
      )}

      {isError && !isLoading && (
        <div className="glass rounded-2xl flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-white/60">Failed to load tickets. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && tickets.length === 0 && (
        <div className="glass rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
          <TicketIcon className="w-10 h-10 text-white/20" />
          <p className="text-white/50 text-lg">No tickets found</p>
          <Link href="/support/tickets/new">
            <Button variant="outline" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Open your first ticket
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && tickets.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 border-b border-white/5 uppercase text-muted-foreground text-xs">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <SortHeader field="priority" label="Priority" current={sortField} dir={sortDir} onChange={handleSort} />
                <SortHeader field="lastUpdated" label="Last Updated" current={sortField} dir={sortDir} onChange={handleSort} />
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white/40 font-mono text-xs">#{t.id}</td>
                  <td className="px-6 py-4 font-medium text-white">
                    <Link href={`/support/tickets/${t.id}`} className="hover:text-primary transition-colors">
                      {t.subject}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-white/60">{t.department || "—"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="px-6 py-4 text-white/50 text-xs">{t.lastUpdated || "—"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

// ── New Ticket Form ──────────────────────────────────────────────────────────

interface NewTicketFormValues {
  departmentId: string;
  priority: string;
  subject: string;
  message: string;
}

export function NewTicket() {
  const { data: deptData, isLoading: deptsLoading, isError: deptsError } = useGetTicketDepartments();
  const departments = deptData?.departments ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewTicketFormValues>({
    defaultValues: { departmentId: "", priority: "Medium", subject: "", message: "" },
  });

  const mutation = useCreateTicket();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const onSubmit = async (values: NewTicketFormValues) => {
    try {
      await mutation.mutateAsync({ data: values });
      toast({ title: "Ticket opened", description: "We'll get back to you soon." });
      navigate("/support/tickets");
    } catch {
      toast({ title: "Failed to open ticket", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Open a Ticket">
      <div className="max-w-2xl">
        <Link href="/support/tickets" className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to tickets
        </Link>

        <div className="glass p-8 rounded-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Department</Label>
              {deptsLoading && (
                <div className="h-10 bg-white/5 rounded-md animate-pulse" />
              )}
              {deptsError && !deptsLoading && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">Failed to load departments. Please refresh and try again.</p>
                </div>
              )}
              {!deptsLoading && !deptsError && (
                <select
                  {...register("departmentId", { required: "Department is required" })}
                  className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" className="bg-zinc-900">Select a department…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id} className="bg-zinc-900">
                      {d.name}
                    </option>
                  ))}
                  {departments.length === 0 && (
                    <option value="1" className="bg-zinc-900">General Support</option>
                  )}
                </select>
              )}
              {errors.departmentId && (
                <p className="text-xs text-red-400">{errors.departmentId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <select
                {...register("priority")}
                className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Low" className="bg-zinc-900">Low</option>
                <option value="Medium" className="bg-zinc-900">Medium</option>
                <option value="High" className="bg-zinc-900">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                {...register("subject", { required: "Subject is required" })}
                className="bg-black/20"
                placeholder="Brief description of your issue"
              />
              {errors.subject && (
                <p className="text-xs text-red-400">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                {...register("message", {
                  required: "Message is required",
                  minLength: { value: 10, message: "Please provide more detail" },
                })}
                className="bg-black/20 min-h-[160px]"
                placeholder="Describe your issue in detail…"
              />
              {errors.message && (
                <p className="text-xs text-red-400">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || mutation.isPending} className="w-full">
              {isSubmitting || mutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</>
              ) : (
                <><TicketIcon className="w-4 h-4 mr-2" /> Submit Ticket</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ── Ticket Detail ────────────────────────────────────────────────────────────

interface ReplyFormValues {
  message: string;
}

export function TicketDetail() {
  const [, params] = useRoute("/support/tickets/:id");
  const [, navigate] = useLocation();
  const id = params?.id ?? "";

  const { data: t, isLoading, isError, refetch } = useGetTicket(id);
  const replyMut = useReplyToTicket();
  const closeMut = useCloseTicket();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReplyFormValues>({ defaultValues: { message: "" } });

  const onReply = async (values: ReplyFormValues) => {
    try {
      await replyMut.mutateAsync({ ticketId: id, data: { message: values.message } });
      toast({ title: "Reply sent" });
      reset();
      refetch();
    } catch {
      toast({ title: "Failed to send reply", variant: "destructive" });
    }
  };

  const handleClose = async () => {
    try {
      await closeMut.mutateAsync({ ticketId: id });
      toast({ title: "Ticket closed" });
      refetch();
    } catch {
      toast({ title: "Failed to close ticket", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Support Ticket">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
          <span className="text-white/60">Loading ticket…</span>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !t) {
    return (
      <DashboardLayout title="Support Ticket">
        <div className="glass rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-white/60">Ticket not found or access denied.</p>
          <Button variant="outline" onClick={() => navigate("/support/tickets")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to tickets
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isClosed = t.status.toLowerCase() === "closed";

  return (
    <DashboardLayout title={`Ticket #${t.id}`}>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <Link href="/support/tickets" className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All tickets
            </Link>
            <h2 className="text-xl font-bold text-white">{t.subject}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-white/50">
              <span>#{t.id}</span>
              <span>·</span>
              <span>{t.department || "General"}</span>
              <span>·</span>
              <span>Opened {t.createdAt}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={t.status} />
            <PriorityBadge priority={t.priority} />
            {!isClosed && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                onClick={handleClose}
                disabled={closeMut.isPending}
              >
                {closeMut.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                Close ticket
              </Button>
            )}
          </div>
        </div>

        {/* Thread */}
        <div className="space-y-4">
          {/* Original message — always shown as first entry */}
          {t.message && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl mr-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
                    <User className="w-4 h-4 text-white/60" />
                  </div>
                  <span className="font-semibold text-sm text-white">You</span>
                  <span className="ml-1 text-xs text-white/40 font-medium">Original message</span>
                </div>
                <span className="text-xs text-white/40">{t.createdAt}</span>
              </div>
              <p className="text-white/85 whitespace-pre-wrap leading-relaxed text-sm">{t.message}</p>
            </motion.div>
          )}

          {(!t.replies || t.replies.length === 0) && !t.message && (
            <div className="glass rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
              <MessageSquare className="w-8 h-8 text-white/20" />
              <p className="text-white/40">No replies yet</p>
            </div>
          )}
          {t.replies?.map((reply, i) => (
            <motion.div
              key={reply.id || String(i)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`p-6 rounded-2xl ${
                reply.isStaff
                  ? "bg-primary/10 border border-primary/20 ml-6"
                  : "glass mr-6"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${reply.isStaff ? "bg-primary/20" : "bg-white/10"}`}>
                    {reply.isStaff
                      ? <ShieldCheck className="w-4 h-4 text-primary" />
                      : <User className="w-4 h-4 text-white/60" />
                    }
                  </div>
                  <div>
                    <span className={`font-semibold text-sm ${reply.isStaff ? "text-primary" : "text-white"}`}>
                      {reply.authorName || (reply.isStaff ? "Support Team" : "You")}
                    </span>
                    {reply.isStaff && (
                      <span className="ml-2 text-xs text-primary/60 font-medium">Staff</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-white/40">{reply.createdAt}</span>
              </div>
              <p className="text-white/85 whitespace-pre-wrap leading-relaxed text-sm">{reply.message}</p>

              {/* Attachments */}
              {reply.attachments && reply.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" />
                    Attachments
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reply.attachments.map((att, ai) => (
                      <div key={ai} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                        <Paperclip className="w-3 h-3 text-white/40 flex-shrink-0" />
                        {att.url ? (
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline truncate max-w-[200px]"
                          >
                            {att.filename}
                          </a>
                        ) : (
                          <span className="text-xs text-white/60 truncate max-w-[200px]">{att.filename}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Reply Form */}
        {!isClosed && (
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Add a Reply
            </h3>
            <form onSubmit={handleSubmit(onReply)} className="space-y-4">
              <Textarea
                {...register("message", { required: true, minLength: 5 })}
                className="bg-black/20 min-h-[120px]"
                placeholder="Type your reply here…"
              />
              <Button type="submit" disabled={isSubmitting || replyMut.isPending}>
                {isSubmitting || replyMut.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  <><MessageSquare className="w-4 h-4 mr-2" /> Post Reply</>
                )}
              </Button>
            </form>
          </div>
        )}

        {isClosed && (
          <div className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-3 text-white/50">
            <XCircle className="w-5 h-5 text-white/30 flex-shrink-0" />
            <p className="text-sm">This ticket is closed. To reopen it, please submit a new ticket.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
