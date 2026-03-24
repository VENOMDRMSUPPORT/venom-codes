import React, { useState } from "react";
import {
  useGetClientProfile,
  useUpdateClientProfile,
  useGetClientContacts,
  useAddClientContact,
  useUpdateClientContact,
  useDeleteClientContact,
  useGetPayMethods,
  useDeletePayMethod,
  useAddPayMethod,
  useChangePassword,
  useGetEmailPreferences,
  useUpdateEmailPreferences,
  type Contact,
  type EmailPreferences,
} from "@workspace/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  UserCircle2,
  Lock,
  Users,
  CreditCard,
  Pencil,
  Trash2,
  Plus,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
} from "lucide-react";

// ─── Shared error state ────────────────────────────────────────────────────────

function PageError({ message }: { message: string }) {
  return (
    <div className="glass p-6 rounded-2xl flex items-center gap-3 text-red-400 border border-red-500/20">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

type ProfileForm = {
  firstname: string;
  lastname: string;
  email: string;
  companyname: string;
  phonenumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

export function Profile() {
  const { data: profile, isLoading, isError, error, refetch } = useGetClientProfile();
  const mut = useUpdateClientProfile();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { isDirty } } = useForm<ProfileForm>({
    values: profile
      ? {
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
          companyname: profile.companyname ?? "",
          phonenumber: profile.phonenumber ?? "",
          address1: profile.address1 ?? "",
          address2: profile.address2 ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          postcode: profile.postcode ?? "",
          country: profile.country ?? "",
        }
      : {
          firstname: "", lastname: "", email: "", companyname: "",
          phonenumber: "", address1: "", address2: "", city: "",
          state: "", postcode: "", country: "",
        },
  });

  if (isLoading) {
    return (
      <DashboardLayout title="My Profile">
        <div className="text-muted-foreground animate-pulse">Loading profile...</div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="My Profile">
        <PageError message={(error as { message?: string })?.message ?? "Failed to load profile. Please try again."} />
        <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl space-y-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <UserCircle2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="font-bold text-white text-lg">{profile?.firstname} {profile?.lastname}</div>
            <div className="text-muted-foreground text-sm">{profile?.email}</div>
            {profile?.credit && (
              <div className="text-xs text-green-400 mt-1">Credit Balance: ${profile.credit}</div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              await mut.mutateAsync({ data });
              toast({ title: "Profile updated successfully" });
              refetch();
            } catch {
              toast({ title: "Failed to update profile", variant: "destructive" });
            }
          })}
          className="glass p-6 rounded-2xl space-y-5"
        >
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Personal Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input {...register("firstname")} className="bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input {...register("lastname")} className="bg-black/20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
              type="email"
              className="bg-black/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input {...register("companyname")} className="bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input {...register("phonenumber")} className="bg-black/20" />
            </div>
          </div>

          <h3 className="font-semibold text-white text-sm uppercase tracking-wider pt-2">Address</h3>

          <div className="space-y-2">
            <Label>Address Line 1</Label>
            <Input {...register("address1")} className="bg-black/20" />
          </div>

          <div className="space-y-2">
            <Label>Address Line 2</Label>
            <Input {...register("address2")} className="bg-black/20" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input {...register("city")} className="bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>State / Region</Label>
              <Input {...register("state")} className="bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>Postcode</Label>
              <Input {...register("postcode")} className="bg-black/20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Country Code</Label>
            <Input {...register("country")} placeholder="e.g. US, GB, CA" className="bg-black/20 max-w-xs" />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={mut.isPending || !isDirty}>
              {mut.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

type ContactForm = {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
};

function ContactFormDialog({
  open,
  onClose,
  contact,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  onSaved: () => void;
}) {
  const addMut = useAddClientContact();
  const updateMut = useUpdateClientContact();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactForm>({
    values: contact
      ? {
          firstname: contact.firstname,
          lastname: contact.lastname,
          email: contact.email,
          phonenumber: contact.phonenumber ?? "",
        }
      : { firstname: "", lastname: "", email: "", phonenumber: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ContactForm) => {
    try {
      if (contact) {
        await updateMut.mutateAsync({ contactId: contact.id, data });
        toast({ title: "Contact updated" });
      } else {
        await addMut.mutateAsync({ data });
        toast({ title: "Contact added" });
      }
      onSaved();
      handleClose();
    } catch {
      toast({ title: "Failed to save contact", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="bg-[#0d0d1a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input {...register("firstname", { required: true })} className="bg-black/30" />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input {...register("lastname", { required: true })} className="bg-black/30" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input {...register("email", { required: true })} type="email" className="bg-black/30" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register("phonenumber")} className="bg-black/30" />
          </div>
          <div className="flex gap-2 pt-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : contact ? "Update" : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Contacts() {
  const { data, isLoading, isError, error, refetch } = useGetClientContacts();
  const deleteMut = useDeleteClientContact();
  const { toast } = useToast();
  const [dialogContact, setDialogContact] = useState<Contact | null | undefined>(undefined);

  const handleDelete = async (c: Contact) => {
    if (!confirm(`Delete contact ${c.firstname} ${c.lastname}?`)) return;
    try {
      await deleteMut.mutateAsync({ contactId: c.id });
      toast({ title: "Contact deleted" });
      refetch();
    } catch {
      toast({ title: "Failed to delete contact", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Contacts & Sub-Accounts">
        <div className="text-muted-foreground animate-pulse">Loading contacts...</div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Contacts & Sub-Accounts">
        <PageError message={(error as { message?: string })?.message ?? "Failed to load contacts. Please try again."} />
        <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Contacts & Sub-Accounts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Manage your account contacts and sub-account users.
          </p>
          <Button size="sm" onClick={() => setDialogContact(null)}>
            <Plus className="w-4 h-4 mr-1" /> Add Contact
          </Button>
        </div>

        {(!data || data.length === 0) ? (
          <div className="glass p-8 rounded-2xl text-center text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No contacts yet.</p>
            <Button size="sm" className="mt-4" onClick={() => setDialogContact(null)}>
              Add your first contact
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((c) => (
              <div key={c.id} className="glass p-5 rounded-2xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <UserCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {c.firstname} {c.lastname}
                    </div>
                    <div className="text-muted-foreground text-sm">{c.email}</div>
                    {c.phonenumber && (
                      <div className="text-muted-foreground text-xs mt-0.5">{c.phonenumber}</div>
                    )}
                    {c.subaccount && (
                      <span className="inline-block mt-1 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                        Sub-Account
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-white"
                    onClick={() => setDialogContact(c)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    onClick={() => handleDelete(c)}
                    disabled={deleteMut.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ContactFormDialog
        open={dialogContact !== undefined}
        onClose={() => setDialogContact(undefined)}
        contact={dialogContact ?? null}
        onSaved={refetch}
      />
    </DashboardLayout>
  );
}

// ─── Security ─────────────────────────────────────────────────────────────────

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function EmailPreferencesPanel() {
  const { data: prefs, isLoading, isError, refetch } = useGetEmailPreferences();
  const updateMut = useUpdateEmailPreferences();
  const { toast } = useToast();

  const EMAIL_PREFS: { key: keyof EmailPreferences; label: string; description: string }[] = [
    { key: "generalEmails", label: "General Account Emails", description: "Account updates and general notifications" },
    { key: "invoiceEmails", label: "Invoice & Billing Emails", description: "Invoice receipts and payment reminders" },
    { key: "productEmails", label: "Product / Service Emails", description: "Service activations, renewals, and updates" },
    { key: "domainEmails", label: "Domain Emails", description: "Domain registration and renewal reminders" },
    { key: "supportEmails", label: "Support Ticket Emails", description: "Replies and updates on your support tickets" },
    { key: "marketingEmails", label: "Marketing Emails", description: "Promotions and special offers" },
  ];

  const handleToggle = async (key: keyof EmailPreferences, value: boolean) => {
    try {
      await updateMut.mutateAsync({ data: { [key]: value } });
      toast({ title: "Preferences saved" });
      refetch();
    } catch {
      toast({ title: "Failed to update preferences", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground text-sm animate-pulse">Loading preferences...</div>;
  }

  if (isError || !prefs) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-400" />
        Unable to load email preferences.
        <button onClick={() => refetch()} className="underline text-primary hover:no-underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {EMAIL_PREFS.map(({ key, label, description }) => {
        const enabled = prefs[key as keyof typeof prefs] ?? true;
        return (
          <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
            <div>
              <div className="text-white text-sm font-medium">{label}</div>
              <div className="text-muted-foreground text-xs">{description}</div>
            </div>
            <button
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                enabled ? "bg-primary" : "bg-white/10"
              } ${updateMut.isPending ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => handleToggle(key, !enabled)}
              type="button"
              aria-label={`Toggle ${label}`}
              role="switch"
              aria-checked={enabled}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function Security() {
  const changePasswordMut = useChangePassword();
  const { toast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<PasswordForm>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    try {
      await changePasswordMut.mutateAsync({
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
      toast({ title: "Password changed successfully" });
      reset();
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? "Failed to change password";
      toast({ title: message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Security Settings">
      <div className="max-w-lg space-y-6">
        {/* Change Password */}
        <div className="glass p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Change Password</h3>
              <p className="text-muted-foreground text-xs">Choose a strong password for your account.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  {...register("currentPassword", { required: "Current password is required" })}
                  type={showCurrent ? "text" : "password"}
                  className="bg-black/20 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  onClick={() => setShowCurrent((v) => !v)}
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-400 text-xs">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Must be at least 6 characters" },
                  })}
                  type={showNew ? "text" : "password"}
                  className="bg-black/20 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  onClick={() => setShowNew((v) => !v)}
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-400 text-xs">{errors.newPassword.message}</p>
              )}
              {newPassword && newPassword.length >= 6 && (
                <div className="flex gap-1">
                  {[...Array(Math.min(Math.floor(newPassword.length / 3), 4))].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        newPassword.length >= 12 ? "bg-green-500" :
                        newPassword.length >= 9 ? "bg-yellow-400" : "bg-orange-400"
                      }`}
                    />
                  ))}
                  {[...Array(Math.max(0, 4 - Math.min(Math.floor(newPassword.length / 3), 4)))].map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full bg-white/10" />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === newPassword || "Passwords do not match",
                })}
                type="password"
                className="bg-black/20"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </div>

        {/* Email Notification Preferences */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Email Notification Preferences</h3>
              <p className="text-muted-foreground text-xs">Choose which emails you want to receive.</p>
            </div>
          </div>
          <EmailPreferencesPanel />
        </div>

        {/* Security Tips */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Account Security Tips</h3>
              <p className="text-muted-foreground text-xs">Keep your account safe.</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              Use a unique password not used on other sites.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              Include a mix of upper/lowercase letters, numbers, and symbols.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              Change your password regularly and never share it.
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function PaymentMethods() {
  const { data, isLoading, isError, error, refetch } = useGetPayMethods();
  const delMut = useDeletePayMethod();
  const addMut = useAddPayMethod();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [addGateway, setAddGateway] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addToken, setAddToken] = useState("");

  function handleAdd() {
    if (!addGateway || !addDescription) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    addMut.mutate(
      { data: { gateway: addGateway, description: addDescription, token: addToken || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Payment method added" });
          setShowAdd(false);
          setAddGateway("");
          setAddDescription("");
          setAddToken("");
          refetch();
        },
        onError: () => {
          toast({ title: "Failed to add payment method", variant: "destructive" });
        },
      }
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Payment Methods">
        <div className="text-muted-foreground animate-pulse">Loading payment methods...</div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Payment Methods">
        <PageError message={(error as { message?: string })?.message ?? "Failed to load payment methods."} />
        <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Payment Methods">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Payment Method
          </Button>
        </div>

        {showAdd && (
          <div className="glass p-6 rounded-2xl space-y-4 border border-primary/20">
            <h3 className="font-semibold text-white">Add New Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-gateway">Gateway *</Label>
                <Input
                  id="add-gateway"
                  placeholder="e.g. paypal, stripe"
                  value={addGateway}
                  onChange={(e) => setAddGateway(e.target.value)}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-desc">Description *</Label>
                <Input
                  id="add-desc"
                  placeholder="e.g. My PayPal Account"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="add-token">Token (optional)</Label>
                <Input
                  id="add-token"
                  placeholder="Gateway token (if applicable)"
                  value={addToken}
                  onChange={(e) => setAddToken(e.target.value)}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={addMut.isPending} className="gap-2">
                {addMut.isPending ? "Adding…" : "Add Method"}
              </Button>
            </div>
          </div>
        )}

        {(!data || data.length === 0) ? (
          <div className="glass p-8 rounded-2xl text-center text-muted-foreground">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No saved payment methods.</p>
            <p className="text-xs mt-1">Payment methods are saved automatically when you pay an invoice, or you can add one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((pm) => (
              <div
                key={pm.id}
                className="glass p-5 rounded-2xl flex flex-col justify-between min-h-[9rem]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white uppercase tracking-wider">
                      {pm.type || pm.gateway}
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {pm.description}
                    </div>
                    {pm.lastFour && (
                      <div className="text-muted-foreground text-xs mt-1">
                        •••• •••• •••• {pm.lastFour}
                      </div>
                    )}
                  </div>
                  <CreditCard className="w-5 h-5 text-primary/60 shrink-0" />
                </div>
                <div className="flex items-center justify-between mt-4">
                  {pm.expiry ? (
                    <p className="text-muted-foreground text-xs">Expires: {pm.expiry}</p>
                  ) : <span />}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2"
                    onClick={async () => {
                      if (!confirm("Remove this payment method?")) return;
                      try {
                        await delMut.mutateAsync({ payMethodId: pm.id });
                        toast({ title: "Payment method removed" });
                        refetch();
                      } catch {
                        toast({ title: "Failed to remove", variant: "destructive" });
                      }
                    }}
                    disabled={delMut.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
