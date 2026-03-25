import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useRegister, useForgotPassword } from "@workspace/api-client";
import { useAuthStore } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// --- LOGIN ---
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await loginMutation.mutateAsync({ data });
      setAuth(res.token, res.client);
      toast({ title: "Welcome back", description: "Successfully logged in." });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({ 
        title: "Login failed", 
        description: error?.message || "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to Venom Codes.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="client@example.com" {...register("email")} 
            className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80">Forgot password?</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register("password")} 
            className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={loginMutation.isPending} className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25">
          {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link href="/register" className="text-primary hover:text-primary/80 transition-colors">Register now</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// --- REGISTER ---
const registerSchema = z.object({
  firstname: z.string().min(2, "First name required"),
  lastname: z.string().min(2, "Last name required"),
  email: z.string().email(),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  companyname: z.string().optional(),
});

export function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);
  const registerMutation = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      const res = await registerMutation.mutateAsync({ data });
      setAuth(res.token, res.client);
      toast({ title: "Account created", description: "Welcome to Venom Codes." });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({ title: "Registration failed", description: error?.message, variant: "destructive" });
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join Venom Codes to manage your infrastructure.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input autoComplete="given-name" {...register("firstname")} className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
            {errors.firstname && <p className="text-xs text-destructive">{errors.firstname.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input autoComplete="family-name" {...register("lastname")} className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
            {errors.lastname && <p className="text-xs text-destructive">{errors.lastname.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input type="email" autoComplete="email" {...register("email")} className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" autoComplete="new-password" {...register("password")} className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Company Name (Optional)</Label>
          <Input {...register("companyname")} className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
        </div>

        <Button type="submit" disabled={registerMutation.isPending} className="w-full h-12 rounded-xl text-base font-semibold mt-4 shadow-lg shadow-primary/25">
          {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// --- FORGOT PASSWORD ---
const forgotSchema = z.object({
  email: z.string().email(),
});

export function ForgotPassword() {
  const { toast } = useToast();
  const mutation = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
    try {
      await mutation.mutateAsync({ data });
      toast({ title: "Email sent", description: "Check your inbox for reset instructions." });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message, variant: "destructive" });
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="We'll send you instructions to reset your password.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input type="email" {...register("email")} className="bg-muted/50 border-border focus-visible:ring-primary h-12 rounded-xl" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25">
          {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Remember your password? <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Back to login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
