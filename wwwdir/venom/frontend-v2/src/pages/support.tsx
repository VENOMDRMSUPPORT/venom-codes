import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  useGetTickets,
  useGetTicketDetail,
  useCreateTicket,
  useReplyTicket,
} from "@/api/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Ticket as TicketIcon, Search, AlertCircle, ChevronRight, Plus, Send, Paperclip, ArrowLeft, User, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";

function getTicketBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "open") return "default";
  if (s === "answered") return "secondary";
  if (s === "customer-reply") return "warning";
  if (s === "closed") return "outline";
  return "secondary";
}

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  priority: z.enum(["Low", "Medium", "High", "Emergency"]),
});

export function TicketsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { data, isLoading, isError } = useGetTickets({ status: statusFilter === "All" ? undefined : statusFilter });

  const filtered = (data?.tickets ?? []).filter(
    (t) =>
      !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toString().includes(search)
  );

  return (
    <DashboardLayout title="Support Tickets">
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border focus-visible:ring-primary h-11 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Open", "Answered", "Closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                statusFilter === s
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <Link href="/support/tickets/new" className="sm:ml-auto">
          <Button className="h-11 rounded-xl shrink-0 gap-2 shadow-lg shadow-primary/10">
            <Plus className="w-4 h-4" /> New Ticket
          </Button>
        </Link>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load tickets. Please try again.</p>
        </div>
      )}

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 border-b border-border text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Ticket #</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Priority</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Last Update</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[15, 40, 25, 20, 20, 25, 15].map((w, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${w}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              filtered.map((ticket) => (
                <tr key={ticket.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">#{ticket.id}</td>
                  <td className="px-6 py-4 text-foreground">{ticket.subject}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ticket.department ?? "—"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={ticket.priority === "High" || ticket.priority === "Emergency" ? "destructive" : "secondary"}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getTicketBadge(ticket.status) as any}>{ticket.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{ticket.lastUpdated ?? "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/support/tickets/${ticket.id}`}>
                      <Button variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-primary/10 gap-1">
                        <ChevronRight className="w-3 h-3" /> View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-14 text-muted-foreground">
                  <TicketIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No tickets found</p>
                  <Link href="/support/tickets/new">
                    <Button size="sm" className="mt-2 rounded-xl gap-2">
                      <Plus className="w-4 h-4" /> Create a ticket
                    </Button>
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export function NewTicket() {
  const { toast } = useToast();
  const createMutation = useCreateTicket();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit = async (data: z.infer<typeof ticketSchema>) => {
    try {
      await createMutation.mutateAsync({
        data: {
          subject: data.subject,
          message: data.message,
          priority: data.priority,
        },
      });
      setSubmitted(true);
      toast({ title: "Ticket created", description: "Your support ticket has been submitted." });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create ticket",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <DashboardLayout title="New Ticket">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ticket Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your support ticket has been created. Our team will respond shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/support/tickets">
              <Button variant="outline" className="rounded-xl">
                View All Tickets
              </Button>
            </Link>
            <Button
              onClick={() => setSubmitted(false)}
              className="rounded-xl"
            >
              Create Another
            </Button>
          </div>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="New Ticket">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <Link
          href="/support/tickets"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          ← Back to Tickets
        </Link>

        <div className="rounded-2xl bg-card border border-border p-6">
          <h2 className="text-lg font-bold mb-6">Create Support Ticket</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                placeholder="Brief description of your issue"
                {...register("subject")}
                className="bg-background border-border focus-visible:ring-primary h-12 rounded-xl"
              />
              {errors.subject && (
                <p className="text-xs text-rose-500">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {(["Low", "Medium", "High", "Emergency"] as const).map((p) => (
                  <label
                    key={p}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all text-sm font-medium",
                      "border-border hover:bg-secondary/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={p}
                      {...register("priority")}
                      className="sr-only"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder="Describe your issue in detail..."
                {...register("message")}
                className="min-h-[150px] bg-background border-border focus-visible:ring-primary rounded-xl"
              />
              {errors.message && (
                <p className="text-xs text-rose-500">{errors.message.message}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-12 rounded-xl gap-2 shadow-lg shadow-primary/10"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

const replySchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: ticket, isLoading, isError, refetch } = useGetTicketDetail(id ?? "");
  const replyMutation = useReplyTicket();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
  });

  const onSubmitReply = async (data: z.infer<typeof replySchema>) => {
    if (!id) return;
    try {
      await replyMutation.mutateAsync({
        ticketId: id,
        message: data.message,
      });
      reset();
      refetch();
      toast({ title: "Reply sent", description: "Your response has been added to the ticket." });
    } catch (error: any) {
      toast({ title: "Reply failed", description: error?.message || "Unable to send reply", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title={`Ticket #${id}`}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !ticket) {
    return (
      <DashboardLayout title={`Ticket #${id}`}>
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load ticket details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
    open: "default",
    answered: "secondary",
    "customer-reply": "warning",
    closed: "secondary",
  };

  const priorityColors: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
    low: "secondary",
    medium: "default",
    high: "destructive",
    emergency: "destructive",
  };

  return (
    <DashboardLayout title={`Ticket #${ticket.id}`}>
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/support/tickets">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </Button>
        </Link>

        {/* Ticket Header */}
        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold">{ticket.subject}</h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Badge variant={statusColors[ticket.status.toLowerCase()] || "secondary"}>{ticket.status}</Badge>
                    <Badge variant={priorityColors[ticket.priority.toLowerCase()] || "secondary"}>
                      {ticket.priority} Priority
                    </Badge>
                    {ticket.department && (
                      <span className="text-sm text-muted-foreground">{ticket.department}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                {ticket.createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Created: {ticket.createdAt}
                  </div>
                )}
                {ticket.lastUpdated && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Last updated: {ticket.lastUpdated}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversation</h3>
            <div className="space-y-4">
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl border",
                      msg.userId ? "bg-primary/5 border-primary/20" : "bg-secondary/30 border-border/60"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        msg.userId ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      )}>
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{msg.name || (msg.userId ? "You" : "Support")}</span>
                          {msg.createdAt && (
                            <span className="text-xs text-muted-foreground">{msg.createdAt}</span>
                          )}
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap break-words">{msg.message}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.attachments.map((attachment, idx) => (
                              <a
                                key={idx}
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                              >
                                <Paperclip className="w-3 h-3" />
                                Attachment {idx + 1}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        {ticket.status?.toLowerCase() !== "closed" && (
          <Card className="border-border/70 bg-card/80">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Reply</h3>
              <form onSubmit={handleSubmit(onSubmitReply)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reply">Message</Label>
                  <Textarea
                    id="reply"
                    placeholder="Type your reply here..."
                    {...register("message")}
                    className="min-h-[120px] bg-background border-border focus-visible:ring-primary rounded-xl"
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-500">{errors.message.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={replyMutation.isPending}
                    className="h-11 rounded-xl gap-2 shadow-lg shadow-primary/10"
                  >
                    {replyMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reply
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach File
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
