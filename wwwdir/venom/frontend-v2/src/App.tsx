import React, { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/hooks/use-auth";
import { useThemeStore } from "@/hooks/use-theme";

// Lazy load page components for better performance
const Login = lazy(() => import("./pages/auth").then(m => ({ default: m.Login })));
const Register = lazy(() => import("./pages/auth").then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import("./pages/auth").then(m => ({ default: m.ForgotPassword })));
const Dashboard = lazy(() => import("./pages/dashboard").then(m => ({ default: m.Dashboard })));
const ServicesList = lazy(() => import("./pages/services").then(m => ({ default: m.ServicesList })));
const ServiceDetail = lazy(() => import("./pages/services").then(m => ({ default: m.ServiceDetail })));
const InvoicesList = lazy(() => import("./pages/billing").then(m => ({ default: m.InvoicesList })));
const InvoiceDetail = lazy(() => import("./pages/billing").then(m => ({ default: m.InvoiceDetail })));
const QuotesList = lazy(() => import("./pages/billing").then(m => ({ default: m.QuotesList })));
const QuoteDetail = lazy(() => import("./pages/billing").then(m => ({ default: m.QuoteDetail })));
const OrdersList = lazy(() => import("./pages/billing").then(m => ({ default: m.OrdersList })));
const OrderDetail = lazy(() => import("./pages/billing").then(m => ({ default: m.OrderDetail })));
const TicketsList = lazy(() => import("./pages/support").then(m => ({ default: m.TicketsList })));
const NewTicket = lazy(() => import("./pages/support").then(m => ({ default: m.NewTicket })));
const TicketDetail = lazy(() => import("./pages/support").then(m => ({ default: m.TicketDetail })));
const DomainsList = lazy(() => import("./pages/domains").then(m => ({ default: m.DomainsList })));
const DomainDetail = lazy(() => import("./pages/domains").then(m => ({ default: m.DomainDetail })));
const Profile = lazy(() => import("./pages/account").then(m => ({ default: m.Profile })));
const Contacts = lazy(() => import("./pages/account").then(m => ({ default: m.Contacts })));
const Security = lazy(() => import("./pages/account").then(m => ({ default: m.Security })));
const PaymentMethods = lazy(() => import("./pages/account").then(m => ({ default: m.PaymentMethods })));
const AnnouncementsList = lazy(() => import("./pages/public").then(m => ({ default: m.AnnouncementsList })));
const AnnouncementDetail = lazy(() => import("./pages/public").then(m => ({ default: m.AnnouncementDetail })));
const KnowledgebaseIndex = lazy(() => import("./pages/public").then(m => ({ default: m.KnowledgebaseIndex })));
const KnowledgebaseCategoryPage = lazy(() => import("./pages/public").then(m => ({ default: m.KnowledgebaseCategoryPage })));
const KnowledgebaseArticlePage = lazy(() => import("./pages/public").then(m => ({ default: m.KnowledgebaseArticlePage })));
const Catalog = lazy(() => import("./pages/public").then(m => ({ default: m.Catalog })));
const Cart = lazy(() => import("./pages/cart").then(m => ({ default: m.Cart })));
const Landing = lazy(() => import("./pages/landing").then(m => ({ default: m.Landing })));
const NotFound = lazy(() => import("@/pages/not-found").then(m => ({ default: m.default })));

const queryClient = new QueryClient();

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Error Boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-destructive mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">An unexpected error occurred.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Wrapper
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const checkExpiry = useAuthStore(s => s.checkExpiry);
  const refreshToken = useAuthStore(s => s.refreshToken);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const valid = isAuthenticated && checkExpiry();

  React.useEffect(() => {
    if (valid) {
      refreshToken().catch(() => undefined);
    }
  }, [valid, refreshToken]);

  if (!valid) return <Redirect to="/login" />;
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

function Router() {
  return (
    <Switch>
      {/* Landing */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Protected Pages */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />

      <Route path="/services" component={() => <ProtectedRoute component={ServicesList} />} />
      <Route path="/services/:id" component={() => <ProtectedRoute component={ServiceDetail} />} />

      <Route path="/billing/invoices" component={() => <ProtectedRoute component={InvoicesList} />} />
      <Route path="/billing/invoices/:id" component={() => <ProtectedRoute component={InvoiceDetail} />} />
      <Route path="/billing/quotes" component={() => <ProtectedRoute component={QuotesList} />} />
      <Route path="/billing/quotes/:id" component={() => <ProtectedRoute component={QuoteDetail} />} />
      <Route path="/billing/orders" component={() => <ProtectedRoute component={OrdersList} />} />
      <Route path="/billing/orders/:orderId" component={() => <ProtectedRoute component={OrderDetail} />} />

      <Route path="/support/tickets" component={() => <ProtectedRoute component={TicketsList} />} />
      <Route path="/support/tickets/new" component={() => <ProtectedRoute component={NewTicket} />} />
      <Route path="/support/tickets/:id" component={() => <ProtectedRoute component={TicketDetail} />} />

      <Route path="/domains" component={() => <ProtectedRoute component={DomainsList} />} />
      <Route path="/domains/:id" component={() => <ProtectedRoute component={DomainDetail} />} />

      <Route path="/account/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/account/contacts" component={() => <ProtectedRoute component={Contacts} />} />
      <Route path="/account/security" component={() => <ProtectedRoute component={Security} />} />
      <Route path="/account/payment-methods" component={() => <ProtectedRoute component={PaymentMethods} />} />

      {/* Announcements & Knowledgebase — publicly accessible */}
      <Route path="/announcements" component={AnnouncementsList} />
      <Route path="/announcements/:id" component={AnnouncementDetail} />
      <Route path="/knowledgebase" component={KnowledgebaseIndex} />
      <Route path="/knowledgebase/:categoryId" component={KnowledgebaseCategoryPage} />
      <Route path="/knowledgebase/:categoryId/:articleId" component={KnowledgebaseArticlePage} />

      {/* Order Catalog & Cart */}
      <Route path="/order" component={() => <ProtectedRoute component={Catalog} />} />
      <Route path="/cart" component={() => <ProtectedRoute component={Cart} />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeInit() {
  const { theme, accent } = useThemeStore();
  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", theme === "dark");
    ["violet", "blue", "green", "orange", "red"].forEach(a => html.classList.remove(`accent-${a}`));
    html.classList.add(`accent-${accent}`);
  }, [theme, accent]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeInit />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
