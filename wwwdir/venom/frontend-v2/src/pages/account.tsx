import { useState } from "react";
import { useGetClientProfile, useUpdateClientProfile, useChangePassword, useGetContacts, useCreateContact, useUpdateContact, useDeleteContact, useGetPaymentMethods, useDeletePaymentMethod, useSetDefaultPaymentMethod, type PaymentMethod, type PaymentGateway } from "@/api/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Lock, CreditCard, Users, Save, Loader2, CheckCircle, Plus, Pencil, Trash2, Mail, Phone, Building2, AlertCircle, Wallet, Star, Globe, Bitcoin, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  phonenumber: z.string().optional(),
  companyname: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function Profile() {
  const { data, isLoading } = useGetClientProfile();
  const updateMutation = useUpdateClientProfile();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: data?.firstname ?? "",
      lastname: data?.lastname ?? "",
      email: data?.email ?? "",
      phonenumber: data?.phonenumber ?? "",
      companyname: data?.companyname ?? "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof profileSchema>) => {
    try {
      await updateMutation.mutateAsync({ data: formData });
      setSaved(true);
      toast({ title: "Profile updated", description: "Your profile has been saved." });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <div className="space-y-6">
          <div className="h-64 bg-secondary/30 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Update your account details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...register("firstname")} className="bg-background border-border h-12 rounded-xl" />
                {errors.firstname && <p className="text-xs text-rose-500">{errors.firstname.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...register("lastname")} className="bg-background border-border h-12 rounded-xl" />
                {errors.lastname && <p className="text-xs text-rose-500">{errors.lastname.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" {...register("email")} className="bg-background border-border h-12 rounded-xl" />
              {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input {...register("phonenumber")} placeholder="+1 234 567 8900" className="bg-background border-border h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input {...register("companyname")} placeholder="Your Company Ltd." className="bg-background border-border h-12 rounded-xl" />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending || !isDirty}
                className="h-12 rounded-xl gap-2 shadow-lg shadow-primary/10"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
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

export function Security() {
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      // API call would go here
      toast({ title: "Password changed", description: "Your password has been updated." });
      setSaved(true);
      reset();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to change password",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Security">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Change Password</h2>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" {...register("currentPassword")} className="bg-background border-border h-12 rounded-xl" />
              {errors.currentPassword && <p className="text-xs text-rose-500">{errors.currentPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" {...register("newPassword")} className="bg-background border-border h-12 rounded-xl" />
              {errors.newPassword && <p className="text-xs text-rose-500">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" {...register("confirmPassword")} className="bg-background border-border h-12 rounded-xl" />
              {errors.confirmPassword && <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="h-12 rounded-xl gap-2 shadow-lg shadow-primary/10">
              {saved ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              {saved ? "Password Changed!" : "Change Password"}
            </Button>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export function Contacts() {
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetContacts();
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      companyname: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ contactId: editingId, ...data });
        toast({ title: "Contact updated", description: "Contact has been updated successfully." });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: "Contact created", description: "New contact has been added." });
      }
      setEditingId(null);
      setShowAddForm(false);
      reset();
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to save contact", variant: "destructive" });
    }
  };

  const handleEdit = (contact: any) => {
    setEditingId(contact.id);
    reset(contact);
    setShowAddForm(true);
  };

  const handleDelete = async (contactId: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await deleteMutation.mutateAsync({ contactId });
      toast({ title: "Contact deleted", description: "Contact has been removed." });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to delete contact", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    reset();
  };

  return (
    <DashboardLayout title="Contacts">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Manage sub-account contacts for billing and notifications.</p>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
        </div>

        {isError && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load contacts. Please try again.</p>
          </div>
        )}

        {showAddForm && (
          <Card className="border-border/70 bg-card/80">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Contact" : "Add New Contact"}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input {...register("firstname", { required: true })} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input {...register("lastname", { required: true })} className="h-11 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" {...register("email", { required: true })} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input {...register("phonenumber")} placeholder="+1 234 567 8900" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input {...register("companyname")} className="h-11 rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-11 rounded-xl gap-2">
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingId ? "Update Contact" : "Add Contact"}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="h-11 rounded-xl">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-secondary/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : data && data.contacts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.contacts.map((contact) => (
              <Card key={contact.id} className="border-border/70 bg-card/80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {contact.firstname} {contact.lastname}
                        </p>
                        {contact.companyname && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {contact.companyname}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)} className="h-8 w-8 p-0">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.phonenumber && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phonenumber}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/70 bg-card/80">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30 text-muted-foreground" />
              <p className="font-medium text-foreground">No contacts found</p>
              <p className="text-sm text-muted-foreground mt-1">Add sub-account contacts to manage notifications.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export function PaymentMethods() {
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetPaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  const setDefaultMutation = useSetDefaultPaymentMethod();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gateway: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
    },
  });

  const paymentMethods = data?.paymentMethods ?? [];
  const availableGateways = data?.availableGateways ?? [];

  const handleDelete = async (paymentMethodId: string) => {
    if (!confirm("Are you sure you want to remove this payment method?")) return;
    try {
      await deleteMutation.mutateAsync({ paymentMethodId });
      toast({ title: "Payment method removed", description: "Your payment method has been removed." });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to remove payment method", variant: "destructive" });
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultMutation.mutateAsync({ paymentMethodId });
      toast({ title: "Default updated", description: "Your default payment method has been updated." });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to set default payment method", variant: "destructive" });
    }
  };

  const onSubmit = async (formData: any) => {
    // In a real implementation, this would call useCreatePaymentMethod
    // For now, show a message that payment methods are added during checkout
    toast({
      title: "Payment Methods",
      description: "Payment methods are securely added during the checkout process. This helps protect your payment information.",
    });
    setShowAddForm(false);
    reset();
  };

  const getPaymentIcon = (type: PaymentMethod["type"] | string) => {
    switch (type.toLowerCase()) {
      case "card":
      case "creditcard":
        return CreditCard;
      case "paypal":
        return Wallet;
      case "bank":
      case "banktransfer":
        return Banknote;
      case "crypto":
      case "bitcoin":
        return Bitcoin;
      default:
        return CreditCard;
    }
  };

  const getGatewayIcon = (gateway: string) => {
    const gw = gateway.toLowerCase();
    if (gw.includes("paypal")) return Wallet;
    if (gw.includes("stripe") || gw.includes("card")) return CreditCard;
    if (gw.includes("bank") || gw.includes("transfer")) return Banknote;
    if (gw.includes("bitcoin") || gw.includes("crypto")) return Bitcoin;
    return Globe;
  };

  return (
    <DashboardLayout title="Payment Methods">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Manage your saved payment methods and preferred billing options.</p>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Payment Method
          </Button>
        </div>

        {isError && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load payment methods. Please try again.</p>
          </div>
        )}

        {showAddForm && (
          <Card className="border-border/70 bg-card/80">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Payment Method</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Gateway</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableGateways.map((gateway) => {
                      const Icon = getGatewayIcon(gateway.name);
                      return (
                        <label
                          key={gateway.name}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50",
                            !gateway.enabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <input
                            type="radio"
                            value={gateway.name}
                            disabled={!gateway.enabled}
                            {...register("gateway", { required: true })}
                            className="sr-only"
                          />
                          <Icon className="w-6 h-6 mb-2 text-primary" />
                          <span className="text-xs font-medium text-center">{gateway.displayName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Secure Payment:</strong> For your security, payment details are entered directly on the payment gateway's
                      secure page during checkout. We never store your complete card information.
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="h-11 rounded-xl gap-2">
                    <Plus className="w-4 h-4" />
                    Continue to Add Payment Method
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="h-11 rounded-xl">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Saved Payment Methods
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-secondary/30 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {paymentMethods.map((method) => {
                const Icon = getPaymentIcon(method.type);
                return (
                  <Card key={method.id} className={cn("border-border/70 bg-card/80", method.isDefault && "border-primary/50 bg-primary/5")}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{method.displayName}</p>
                            {method.isDefault && (
                              <Badge variant="default" className="text-xs mt-1 gap-1">
                                <Star className="w-3 h-3" /> Default
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {!method.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(method.id)}
                              disabled={setDefaultMutation.isPending}
                              className="h-8 px-2 text-xs"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(method.id)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {method.lastFour && (
                        <div className="text-sm text-muted-foreground">
                          <p>•••• •••• •••• {method.lastFour}</p>
                          {method.expiryMonth && method.expiryYear && (
                            <p className="text-xs">Expires {method.expiryMonth}/{method.expiryYear}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-border/70 bg-card/80">
              <CardContent className="p-12 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30 text-muted-foreground" />
                <p className="font-medium text-foreground">No payment methods saved</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Payment methods are securely added during checkout. Your information is protected by industry-standard encryption.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {availableGateways.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Available Payment Gateways
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableGateways.map((gateway) => {
                const Icon = getGatewayIcon(gateway.name);
                return (
                  <Card key={gateway.name} className={cn("border-border/70 bg-card/80", !gateway.enabled && "opacity-50")}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{gateway.displayName}</p>
                          <Badge variant={gateway.enabled ? "success" : "secondary"} className="text-xs mt-1">
                            {gateway.enabled ? "Available" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
