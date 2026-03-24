import React from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/hooks/use-auth";
import { useThemeStore } from "@/hooks/use-theme";

// Page Imports
import { Login, Register, ForgotPassword } from "./pages/auth";
import { Dashboard } from "./pages/dashboard";
import { ServicesList, ServiceDetail } from "./pages/services";
import { InvoicesList, InvoiceDetail, QuotesList, QuoteDetail, OrdersList, OrderDetail } from "./pages/billing";
import { TicketsList, NewTicket, TicketDetail } from "./pages/support";
import { DomainsList, DomainDetail } from "./pages/domains";
import { Profile, Contacts, Security, PaymentMethods } from "./pages/account";
import { AnnouncementsList, AnnouncementDetail, KnowledgebaseIndex, KnowledgebaseCategoryPage, KnowledgebaseArticlePage, Catalog } from "./pages/public";
import { Cart } from "./pages/cart";
import { Landing } from "./pages/landing";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

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
  return <Component />;
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
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    ["violet", "blue", "green", "orange", "red"].forEach(a => html.classList.remove(`accent-${a}`));
    html.classList.add(`accent-${accent}`);
  }, [theme, accent]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeInit />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
