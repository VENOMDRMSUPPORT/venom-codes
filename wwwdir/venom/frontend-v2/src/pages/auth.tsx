import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useRegister, useForgotPassword } from "@/api/client";
import { useAuthStore } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, Mail, Lock, User, Building2 } from "lucide-react";
import { useState } from "react";

// --- LOGIN ---
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

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
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to Venom Codes.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="client@example.com"
              {...register("email")}
              className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 transition-all duration-200"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 pr-12 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-12 rounded-xl text-base font-semibold"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium">Continue with</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-semibold">
            Register now
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// --- REGISTER ---
const registerSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  companyname: z.string().optional(),
});

export function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

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
            <Label className="text-sm font-medium">First Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                autoComplete="given-name"
                placeholder="John"
                {...register("firstname")}
                className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 transition-all duration-200"
              />
            </div>
            {errors.firstname && (
              <p className="text-xs text-destructive">{errors.firstname.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Last Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                autoComplete="family-name"
                placeholder="Doe"
                {...register("lastname")}
                className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 transition-all duration-200"
              />
            </div>
            {errors.lastname && (
              <p className="text-xs text-destructive">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              autoComplete="email"
              placeholder="client@example.com"
              {...register("email")}
              className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 transition-all duration-200"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••••••"
              {...register("password")}
              className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 pr-12 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <div className="text-xs text-destructive space-y-1 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
              {errors.password.message?.split(". ").map((msg, i) => (
                <p key={i} className="flex items-center gap-1">
                  <span>•</span> {msg}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Company Name (Optional)</Label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Your Company Ltd."
              {...register("companyname")}
              className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 transition-all duration-200"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-4 h-12 w-full rounded-xl text-base font-semibold"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium">Already registered?</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// --- FORGOT PASSWORD ---
const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              {...register("email")}
              className="bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 h-12 rounded-xl pl-12 transition-all duration-200"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium">Remember your password?</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-semibold">
            ← Back to login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
