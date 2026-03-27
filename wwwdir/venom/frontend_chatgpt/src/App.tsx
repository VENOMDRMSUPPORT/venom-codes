import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import { useAuthStore } from "@/hooks/use-auth";
import { useThemeStore } from "@/hooks/use-theme";
import { DataState } from "@/components/ui/data-state";
import { Landing } from "@/pages/landing";
import { Login, Register, ForgotPassword } from "@/pages/auth";
import { Dashboard } from "@/pages/dashboard";
import { ServicesList, ServiceDetail } from "@/pages/services";
import {
  InvoicesList,
  InvoiceDetail,
  QuotesList,
  QuoteDetail,
  OrdersList,
  OrderDetail
} from "@/pages/billing";
import { TicketsList, NewTicket, TicketDetail } from "@/pages/support";
import { DomainsList, DomainDetail } from "@/pages/domains";
import { Profile, Contacts, Security, PaymentMethods } from "@/pages/account";
import {
  AnnouncementsList,
  AnnouncementDetail,
  KnowledgebaseIndex,
  KnowledgebaseCategoryPage,
  KnowledgebaseArticlePage,
  Catalog
} from "@/pages/public";
import { Cart } from "@/pages/cart";
import { NotFound } from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 20_000
    }
  }
});

function ThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}

function SessionSync() {
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const previewMode = useAuthStore((state) => state.previewMode);

  useEffect(() => {
    if (!isAuthenticated || previewMode) return;

    refreshToken().catch(() => undefined);
    const interval = window.setInterval(() => {
      refreshToken().catch(() => undefined);
    }, 4 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [isAuthenticated, previewMode, refreshToken]);

  return null;
}

function RouteTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const previewMode = useAuthStore((state) => state.previewMode);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (hydrated && !isAuthenticated && !previewMode) {
      setLocation("/login");
    }
  }, [hydrated, isAuthenticated, previewMode, setLocation]);

  if (!hydrated) {
    return (
      <div className="shell flex min-h-screen items-center justify-center py-24">
        <DataState kind="loading" title="Restoring your secure session" message="Checking stored credentials and portal access state." />
      </div>
    );
  }

  if (!isAuthenticated && !previewMode) {
    return null;
  }

  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const previewMode = useAuthStore((state) => state.previewMode);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (hydrated && (isAuthenticated || previewMode)) {
      setLocation("/dashboard");
    }
  }, [hydrated, isAuthenticated, previewMode, setLocation]);

  if (!hydrated) {
    return (
      <div className="shell flex min-h-screen items-center justify-center py-24">
        <DataState kind="loading" title="Preparing access" message="Loading your preferred entry point." />
      </div>
    );
  }

  if (isAuthenticated || previewMode) {
    return null;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <RouteTransition>
      <Switch>
        <Route path="/login">
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        </Route>
        <Route path="/register">
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        </Route>
        <Route path="/forgot-password">
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        </Route>

        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>

        <Route path="/services/:serviceId">
          {(params) => (
            <ProtectedRoute>
              <ServiceDetail serviceId={params.serviceId} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/services">
          <ProtectedRoute>
            <ServicesList />
          </ProtectedRoute>
        </Route>

        <Route path="/billing/invoices/:invoiceId">
          {(params) => (
            <ProtectedRoute>
              <InvoiceDetail invoiceId={params.invoiceId} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/billing/quotes/:quoteId">
          {(params) => (
            <ProtectedRoute>
              <QuoteDetail quoteId={params.quoteId} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/billing/orders/:orderId">
          {(params) => (
            <ProtectedRoute>
              <OrderDetail orderId={params.orderId} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/billing/quotes">
          <ProtectedRoute>
            <QuotesList />
          </ProtectedRoute>
        </Route>
        <Route path="/billing/orders">
          <ProtectedRoute>
            <OrdersList />
          </ProtectedRoute>
        </Route>
        <Route path="/billing">
          <ProtectedRoute>
            <InvoicesList />
          </ProtectedRoute>
        </Route>

        <Route path="/support/new">
          <ProtectedRoute>
            <NewTicket />
          </ProtectedRoute>
        </Route>
        <Route path="/support/:ticketId">
          {(params) => (
            <ProtectedRoute>
              <TicketDetail ticketId={params.ticketId} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/support">
          <ProtectedRoute>
            <TicketsList />
          </ProtectedRoute>
        </Route>

        <Route path="/domains/:domainId">
          {(params) => (
            <ProtectedRoute>
              <DomainDetail domainId={params.domainId} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/domains">
          <ProtectedRoute>
            <DomainsList />
          </ProtectedRoute>
        </Route>

        <Route path="/account/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>
        <Route path="/account/contacts">
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        </Route>
        <Route path="/account/security">
          <ProtectedRoute>
            <Security />
          </ProtectedRoute>
        </Route>
        <Route path="/account/payments">
          <ProtectedRoute>
            <PaymentMethods />
          </ProtectedRoute>
        </Route>

        <Route path="/announcements/:announcementId">{(params) => <AnnouncementDetail announcementId={params.announcementId} />}</Route>
        <Route path="/announcements" component={AnnouncementsList} />
        <Route path="/knowledgebase/:categoryId/:articleId">{(params) => <KnowledgebaseArticlePage categoryId={params.categoryId} articleId={params.articleId} />}</Route>
        <Route path="/knowledgebase/:categoryId">{(params) => <KnowledgebaseCategoryPage categoryId={params.categoryId} />}</Route>
        <Route path="/knowledgebase" component={KnowledgebaseIndex} />
        <Route path="/catalog" component={Catalog} />

        <Route path="/" component={Landing} />

        <Route path="/cart">
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </RouteTransition>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <SessionSync />
      <AppRoutes />
    </QueryClientProvider>
  );
}
