import { useState } from "react";
import { Link, useParams } from "wouter";
import { useGetDomains, useGetDomainDetail, useUpdateDomainNameservers } from "@/api/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Globe, Search, AlertCircle, ChevronRight, ExternalLink, RefreshCw, ArrowLeft, Calendar, Server, Shield, Loader2, Power } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

function getDomainBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "active") return "success";
  if (s === "pending") return "warning";
  if (s === "expired") return "destructive";
  return "secondary";
}

export function DomainsList() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useGetDomains();

  const filtered = (data?.domains ?? []).filter(
    (d) =>
      !search ||
      d.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Domains">
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border focus-visible:ring-primary h-11 rounded-xl"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="h-11 rounded-xl gap-2 border-border"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load domains. Please try again.</p>
        </div>
      )}

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 border-b border-border text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Domain</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Registration Date</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Next Due Date</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[50, 30, 30, 20, 20].map((w, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${w}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              filtered.map((domain) => (
                <tr key={domain.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground font-mono">{domain.domain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{domain.regDate ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{domain.nextDueDate ?? "—"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getDomainBadge(domain.status) as any}>{domain.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/domains/${domain.id}`}>
                      <Button variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-primary/10 gap-1">
                        Manage <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-14 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No domains found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export function DomainDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: domain, isLoading, isError, refetch } = useGetDomainDetail(id ?? "");
  const updateNameserversMutation = useUpdateDomainNameservers();

  const [editingNameservers, setEditingNameservers] = useState(false);
  const [nameservers, setNameservers] = useState<string[]>(["", "", "", ""]);

  if (isLoading) {
    return (
      <DashboardLayout title={`Domain Details`}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !domain) {
    return (
      <DashboardLayout title={`Domain Details`}>
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load domain details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
    active: "success",
    pending: "warning",
    expired: "destructive",
    cancelled: "secondary",
    transferred: "secondary",
  };

  const handleSaveNameservers = async () => {
    if (!id) return;
    try {
      await updateNameserversMutation.mutateAsync({
        domainId: id,
        nameservers: nameservers.filter((ns) => ns.trim() !== ""),
      });
      setEditingNameservers(false);
      refetch();
      toast({ title: "Nameservers updated", description: "Your nameservers have been updated successfully." });
    } catch (error: any) {
      toast({ title: "Update failed", description: error?.message || "Unable to update nameservers", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title={domain.domain}>
      <div className="space-y-6">
        <Link href="/domains">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Domains
          </Button>
        </Link>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">{domain.domain}</h2>
                  <Badge variant={statusColors[domain.status.toLowerCase()] || "secondary"} className="mt-1">
                    {domain.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  WHOIS
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Visit Site
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/70 bg-card/80">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Important Dates
              </h3>
              <div className="space-y-4">
                {domain.regDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Date</p>
                    <p className="font-medium text-foreground">{domain.regDate}</p>
                  </div>
                )}
                {domain.nextDueDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Next Due Date</p>
                    <p className="font-medium text-foreground">{domain.nextDueDate}</p>
                  </div>
                )}
                {domain.expiryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium text-foreground">{domain.expiryDate}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Auto-Renewal
              </h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Auto-Renew</p>
                  <p className="text-sm text-muted-foreground">
                    {domain.autorenew ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                  domain.autorenew ? "bg-primary" : "bg-secondary"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    domain.autorenew ? "right-1" : "left-1"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Nameservers
              </h3>
              {!editingNameservers && (
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingNameservers(true);
                  setNameservers(domain.nameservers ?? ["", "", "", ""]);
                }}>
                  Edit
                </Button>
              )}
            </div>

            {!editingNameservers ? (
              <div className="space-y-2">
                {domain.nameservers && domain.nameservers.length > 0 ? (
                  domain.nameservers.map((ns, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-secondary/30 font-mono text-sm">
                      {ns}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No nameservers configured.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {nameservers.map((ns, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label>Nameserver {idx + 1}</Label>
                    <Input
                      value={ns}
                      onChange={(e) => {
                        const newNs = [...nameservers];
                        newNs[idx] = e.target.value;
                        setNameservers(newNs);
                      }}
                      placeholder={`ns${idx + 1}.example.com`}
                      className="bg-background border-border focus-visible:ring-primary h-11 rounded-xl font-mono"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNameservers}
                    disabled={updateNameserversMutation.isPending}
                    className="h-11 rounded-xl gap-2"
                  >
                    {updateNameserversMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingNameservers(false)}
                    className="h-11 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Services</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">DNS Management</span>
                </div>
                <Badge variant={domain.dnsManagement ? "success" : "secondary"}>
                  {domain.dnsManagement ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Email Forwarding</span>
                </div>
                <Badge variant={domain.emailForwarding ? "success" : "secondary"}>
                  {domain.emailForwarding ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">WHOIS Privacy</span>
                </div>
                <Badge variant={domain.whoisPrivacy ? "success" : "secondary"}>
                  {domain.whoisPrivacy ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
