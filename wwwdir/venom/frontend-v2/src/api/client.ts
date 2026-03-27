// Real API Client for VENOM CODES frontend
// Connects to Express backend with WHMCS integration

import { useQuery, useMutation, useQueryClient, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";

// ============================================================================
// TYPES
// ============================================================================

export interface ClientProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber?: string;
  companyname?: string;
  credit?: number;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface Service {
  id: number;
  productId?: number;
  productName: string;
  domain?: string;
  amount?: number;
  billingCycle?: string;
  nextDueDate?: string;
  regDate?: string;
  status: string;
  dedicatedIp?: string;
  username?: string;
  notes?: string;
  package?: {
    name: string;
    description?: string;
  };
}

export interface Invoice {
  id: number;
  invoiceNum?: string;
  date?: string;
  dueDate?: string;
  total?: number;
  balance?: number;
  status: string;
  subtotal?: number;
  tax?: number;
  taxRate?: number;
  credit?: number;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  description: string;
  amount: number;
  qty?: number;
}

export interface Quote {
  id: number;
  quoteNum?: string;
  date?: string;
  validUntil?: string;
  total?: number;
  status: string;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: number;
  description: string;
  amount: number;
  qty?: number;
}

export interface Order {
  id: number;
  ordernum?: string;
  date?: string;
  amount?: number;
  status: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId?: number;
  productName: string;
  amount: number;
}

export interface Ticket {
  id: number;
  ticketNum?: string;
  subject: string;
  department?: string;
  departmentId?: number;
  priority: string;
  priorityId?: number;
  status: string;
  lastUpdated?: string;
  lastReply?: string;
  createdAt?: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  userId?: number;
  name?: string;
  message: string;
  createdAt?: string;
  attachments?: string[];
}

export interface Domain {
  id: number;
  domain: string;
  regDate?: string;
  nextDueDate?: string;
  expiryDate?: string;
  status: string;
  autorenew?: boolean;
  nameservers?: string[];
  dnsManagement?: boolean;
  emailForwarding?: boolean;
  whoisPrivacy?: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  date?: string;
  publishedAt?: string;
  summary?: string;
  content?: string;
}

export interface KBCategory {
  id: number;
  name: string;
  description?: string;
  articleCount?: number;
  articles?: KBArticle[];
}

export interface KBArticle {
  id: number;
  categoryId: number;
  title: string;
  summary?: string;
  content?: string;
  views?: number;
  helpful?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  pid?: number;
  name: string;
  description: string;
  price?: number;
  cycle?: string;
  currency?: string;
  pricing?: ProductPricing;
  features?: string[];
}

export interface ProductPricing {
  monthly?: number;
  quarterly?: number;
  semiannually?: number;
  annually?: number;
  biennially?: number;
}

export interface DashboardSummary {
  activeServices?: number;
  pendingInvoices?: number;
  pendingInvoicesAmount?: number;
  openTickets?: number;
  activeDomains?: number;
  credit?: number;
  recentTickets?: Ticket[];
  recentInvoices?: Invoice[];
  recentAnnouncements?: Announcement[];
  recentServices?: Service[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  client: ClientProfile;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  companyname?: string;
  phonenumber?: string;
}

export interface RegisterResponse {
  token: string;
  client: ClientProfile;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateTicketRequest {
  deptId?: number;
  subject: string;
  message: string;
  priority?: number | string;
}

export interface TicketReplyRequest {
  message: string;
}

export interface UpdateProfileRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string;
  companyname?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

// ============================================================================
// API CLIENT
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function customFetch<T>(
  url: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> ?? {}),
  };

  // Add auth token if available and not skipped
  if (token && !options?.skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || response.statusText;
    throw new Error(errorMessage);
  }

  return data as T;
}

// Get auth token for use outside React components
export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("venom-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

export function useLogin(options?: UseMutationOptions<LoginResponse, Error, { data: LoginRequest }>) {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, { data: LoginRequest }>({
    mutationFn: ({ data }: { data: LoginRequest }) =>
      customFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: true,
      }),
    onSuccess: (data) => {
      // Invalidate and refetch queries that might depend on auth
      queryClient.invalidateQueries({ queryKey: ["client"] });
    },
    ...options,
  });
}

export function useRegister(options?: UseMutationOptions<RegisterResponse, Error, { data: RegisterRequest }>) {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, Error, { data: RegisterRequest }>({
    mutationFn: ({ data }: { data: RegisterRequest }) =>
      customFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: true,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["client"] });
    },
    ...options,
  });
}

export function useForgotPassword(options?: UseMutationOptions<{ success: boolean; message?: string }, Error, { data: ForgotPasswordRequest }>) {
  return useMutation<{ success: boolean; message?: string }, Error, { data: ForgotPasswordRequest }>({
    mutationFn: ({ data }: { data: ForgotPasswordRequest }) =>
      customFetch<{ success: boolean; message?: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: true,
      }),
    ...options,
  });
}

export function useLogout(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await customFetch<void>("/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
    ...options,
  });
}

// ============================================================================
// CLIENT PROFILE HOOKS
// ============================================================================

export function useGetClientProfile(options?: UseQueryOptions<ClientProfile, Error>) {
  return useQuery<ClientProfile, Error>({
    queryKey: ["client", "profile"],
    queryFn: () => customFetch<ClientProfile>("/client/me"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useUpdateClientProfile(options?: UseMutationOptions<ClientProfile, Error, { data: UpdateProfileRequest }>) {
  const queryClient = useQueryClient();

  return useMutation<ClientProfile, Error, { data: UpdateProfileRequest }>({
    mutationFn: ({ data }: { data: UpdateProfileRequest }) =>
      customFetch<ClientProfile>("/client/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      // Update the cache with new profile data
      queryClient.setQueryData(["client", "profile"], data);
    },
    ...options,
  });
}

export function useChangePassword(options?: UseMutationOptions<{ success: boolean }, Error, ChangePasswordRequest>) {
  return useMutation<{ success: boolean }, Error, ChangePasswordRequest>({
    mutationFn: (data: ChangePasswordRequest) =>
      customFetch<{ success: boolean }>("/client/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

export function useGetDashboardSummary(options?: UseQueryOptions<DashboardSummary, Error>) {
  return useQuery<DashboardSummary, Error>({
    queryKey: ["dashboard"],
    queryFn: () => customFetch<DashboardSummary>("/client/dashboard"),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

// ============================================================================
// SERVICES HOOKS
// ============================================================================

export function useGetServices(params?: { status?: string; page?: number; limit?: number }, options?: UseQueryOptions<{ services: Service[]; total: number; limit?: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ services: Service[]; total: number; limit?: number }, Error>({
    queryKey: ["services", params],
    queryFn: () => customFetch<{ services: Service[]; total: number; limit?: number }>(`/services${queryString}`),
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
}

export function useGetServiceDetail(serviceId: string, options?: UseQueryOptions<Service, Error>) {
  return useQuery<Service, Error>({
    queryKey: ["service", serviceId],
    queryFn: () => customFetch<Service>(`/services/${serviceId}`),
    enabled: !!serviceId,
    ...options,
  });
}

export function useCancelService(options?: UseMutationOptions<{ success: boolean }, Error, { serviceId: string; data?: { reason?: string; type?: string } }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { serviceId: string; data?: { reason?: string; type?: string } }>({
    mutationFn: ({ serviceId, data }) =>
      customFetch<{ success: boolean }>(`/services/${serviceId}/cancel`, {
        method: "POST",
        body: JSON.stringify(data ?? {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    ...options,
  });
}

export function useSuspendService(options?: UseMutationOptions<{ success: boolean }, Error, { serviceId: string; data?: { reason?: string } }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { serviceId: string; data?: { reason?: string } }>({
    mutationFn: ({ serviceId, data }) =>
      customFetch<{ success: boolean }>(`/services/${serviceId}/suspend`, {
        method: "POST",
        body: JSON.stringify(data ?? {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    ...options,
  });
}

export function useUnsuspendService(options?: UseMutationOptions<{ success: boolean }, Error, { serviceId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { serviceId: string }>({
    mutationFn: ({ serviceId }) =>
      customFetch<{ success: boolean }>(`/services/${serviceId}/unsuspend`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    ...options,
  });
}

export function useUpgradeService(options?: UseMutationOptions<{ success: boolean }, Error, { serviceId: string; data: { newproductid: string; paymentmethod: string } }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { serviceId: string; data: { newproductid: string; paymentmethod: string } }>({
    mutationFn: ({ serviceId, data: { newproductid, paymentmethod } }) =>
      customFetch<{ success: boolean }>(`/services/${serviceId}/upgrade`, {
        method: "POST",
        body: JSON.stringify({ newproductid, paymentmethod }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    ...options,
  });
}

export function useTerminateService(options?: UseMutationOptions<{ success: boolean }, Error, { serviceId: string; reason?: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { serviceId: string; reason?: string }>({
    mutationFn: ({ serviceId, reason }) =>
      customFetch<{ success: boolean }>(`/services/${serviceId}/terminate`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    ...options,
  });
}

export function useGetServiceAddons(serviceId: string, options?: UseQueryOptions<any[], Error>) {
  return useQuery<any[], Error>({
    queryKey: ["service", serviceId, "addons"],
    queryFn: () => customFetch<any[]>(`/client/services/${serviceId}/addons`),
    enabled: !!serviceId,
    ...options,
  });
}

// ============================================================================
// BILLING HOOKS
// ============================================================================

export function useGetInvoices(params?: { status?: string; page?: number; limit?: number }, options?: UseQueryOptions<{ invoices: Invoice[]; total: number; limit?: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ invoices: Invoice[]; total: number; limit?: number }, Error>({
    queryKey: ["invoices", params],
    queryFn: () => customFetch<{ invoices: Invoice[]; total: number; limit?: number }>(`/invoices${queryString}`),
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useGetInvoiceDetail(invoiceId: string, options?: UseQueryOptions<Invoice, Error>) {
  return useQuery<Invoice, Error>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => customFetch<Invoice>(`/invoices/${invoiceId}`),
    enabled: !!invoiceId,
    ...options,
  });
}

export function usePayInvoice(options?: UseMutationOptions<{ success: boolean }, Error, { invoiceId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { invoiceId: string }>({
    mutationFn: ({ invoiceId }) =>
      customFetch<{ success: boolean }>(`/invoices/${invoiceId}/pay`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    ...options,
  });
}

export function useGetQuotes(params?: { page?: number; limit?: number }, options?: UseQueryOptions<{ quotes: Quote[]; total: number; limit?: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ quotes: Quote[]; total: number; limit?: number }, Error>({
    queryKey: ["quotes", params],
    queryFn: () => customFetch<{ quotes: Quote[]; total: number; limit?: number }>(`/quotes${queryString}`),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useGetQuoteDetail(quoteId: string, options?: UseQueryOptions<Quote, Error>) {
  return useQuery<Quote, Error>({
    queryKey: ["quote", quoteId],
    queryFn: () => customFetch<Quote>(`/quotes/${quoteId}`),
    enabled: !!quoteId,
    ...options,
  });
}

export function useAcceptQuote(options?: UseMutationOptions<{ success: boolean }, Error, { quoteId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { quoteId: string }>({
    mutationFn: ({ quoteId }) =>
      customFetch<{ success: boolean }>(`/quotes/${quoteId}/accept`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    ...options,
  });
}

export function useGetOrders(params?: { page?: number; limit?: number }, options?: UseQueryOptions<{ orders: Order[]; total: number; limit?: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ orders: Order[]; total: number; limit?: number }, Error>({
    queryKey: ["orders", params],
    queryFn: () => customFetch<{ orders: Order[]; total: number; limit?: number }>(`/orders${queryString}`),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useGetOrderDetail(orderId: string, options?: UseQueryOptions<Order, Error>) {
  return useQuery<Order, Error>({
    queryKey: ["order", orderId],
    queryFn: () => customFetch<Order>(`/orders/${orderId}`),
    enabled: !!orderId,
    ...options,
  });
}

// ============================================================================
// SUPPORT TICKETS HOOKS
// ============================================================================

export function useGetTickets(params?: { status?: string; departmentId?: number; page?: number; limit?: number }, options?: UseQueryOptions<{ tickets: Ticket[]; total: number; limit?: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ tickets: Ticket[]; total: number; limit?: number }, Error>({
    queryKey: ["tickets", params],
    queryFn: () => customFetch<{ tickets: Ticket[]; total: number; limit?: number }>(`/tickets${queryString}`),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useGetTicketDetail(ticketId: string, options?: UseQueryOptions<Ticket, Error>) {
  return useQuery<Ticket, Error>({
    queryKey: ["ticket", ticketId],
    queryFn: () => customFetch<Ticket>(`/tickets/${ticketId}`),
    enabled: !!ticketId,
    staleTime: 30 * 1000, // 30 seconds - tickets update frequently
    ...options,
  });
}

export function useCreateTicket(options?: UseMutationOptions<Ticket, Error, { data: CreateTicketRequest }>) {
  const queryClient = useQueryClient();

  // Priority string to number mapping for WHMCS API
  const priorityMap: Record<string, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Emergency: 4,
  };

  return useMutation<Ticket, Error, { data: CreateTicketRequest }>({
    mutationFn: ({ data }: { data: CreateTicketRequest }) => {
      // Convert string priority to number for WHMCS API
      const processedData = {
        ...data,
        priority: typeof data.priority === "string"
          ? priorityMap[data.priority]
          : data.priority,
        deptId: data.deptId ?? 1, // Default to department 1 if not specified
      };
      return customFetch<Ticket>("/tickets", {
        method: "POST",
        body: JSON.stringify(processedData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    ...options,
  });
}

export function useReplyTicket(options?: UseMutationOptions<Ticket, Error, { ticketId: string; message: string }>) {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, { ticketId: string; message: string }>({
    mutationFn: ({ ticketId, message }) =>
      customFetch<Ticket>(`/tickets/${ticketId}/reply`, {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
    onSuccess: (data, variables) => {
      // Update the specific ticket cache
      queryClient.setQueryData(["ticket", variables.ticketId], data);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    ...options,
  });
}

export function useCloseTicket(options?: UseMutationOptions<{ success: boolean }, Error, { ticketId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { ticketId: string }>({
    mutationFn: ({ ticketId }) =>
      customFetch<{ success: boolean }>(`/tickets/${ticketId}/close`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    ...options,
  });
}

export function useReopenTicket(options?: UseMutationOptions<{ success: boolean }, Error, { ticketId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { ticketId: string }>({
    mutationFn: ({ ticketId }) =>
      customFetch<{ success: boolean }>(`/tickets/${ticketId}/reopen`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    ...options,
  });
}

// ============================================================================
// DOMAINS HOOKS
// ============================================================================

export function useGetDomains(params?: { status?: string; page?: number; limit?: number }, options?: UseQueryOptions<{ domains: Domain[]; total: number; limit?: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ domains: Domain[]; total: number; limit?: number }, Error>({
    queryKey: ["domains", params],
    queryFn: () => customFetch<{ domains: Domain[]; total: number; limit?: number }>(`/domains${queryString}`),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useGetDomainDetail(domainId: string, options?: UseQueryOptions<Domain, Error>) {
  return useQuery<Domain, Error>({
    queryKey: ["domain", domainId],
    queryFn: () => customFetch<Domain>(`/domains/${domainId}`),
    enabled: !!domainId,
    ...options,
  });
}

export function useUpdateDomainNameservers(options?: UseMutationOptions<Domain, Error, { domainId: string; nameservers: string[] }>) {
  const queryClient = useQueryClient();

  return useMutation<Domain, Error, { domainId: string; nameservers: string[] }>({
    mutationFn: ({ domainId, nameservers }) =>
      customFetch<Domain>(`/domains/${domainId}/nameservers`, {
        method: "PUT",
        body: JSON.stringify({ nameservers }),
      }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["domain", variables.domainId], data);
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
    ...options,
  });
}

export function useToggleDomainAutorenew(options?: UseMutationOptions<Domain, Error, { domainId: string; autorenew: boolean }>) {
  const queryClient = useQueryClient();

  return useMutation<Domain, Error, { domainId: string; autorenew: boolean }>({
    mutationFn: ({ domainId, autorenew }) =>
      customFetch<Domain>(`/domains/${domainId}/autorenew`, {
        method: "PUT",
        body: JSON.stringify({ autorenew }),
      }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["domain", variables.domainId], data);
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
    ...options,
  });
}

// ============================================================================
// ANNOUNCEMENTS HOOKS
// ============================================================================

export function useGetAnnouncements(params?: { page?: number; limit?: number }, options?: UseQueryOptions<{ announcements: Announcement[]; total: number; limit?: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ announcements: Announcement[]; total: number; limit?: number }, Error>({
    queryKey: ["announcements", params],
    queryFn: () => customFetch<{ announcements: Announcement[]; total: number; limit?: number }>(`/announcements${queryString}`),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useGetAnnouncementDetail(announcementId: string, options?: UseQueryOptions<Announcement, Error>) {
  return useQuery<Announcement, Error>({
    queryKey: ["announcement", announcementId],
    queryFn: () => customFetch<Announcement>(`/announcements/${announcementId}`),
    enabled: !!announcementId,
    ...options,
  });
}

// ============================================================================
// KNOWLEDGEBASE HOOKS
// ============================================================================

export function useGetKnowledgebaseCategories(options?: UseQueryOptions<{ categories: KBCategory[] }, Error>) {
  return useQuery<{ categories: KBCategory[] }, Error>({
    queryKey: ["knowledgebase"],
    queryFn: () => customFetch<{ categories: KBCategory[] }>("/knowledgebase"),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

export function useGetKnowledgebaseCategory(categoryId: string, options?: UseQueryOptions<KBCategory, Error>) {
  return useQuery<KBCategory, Error>({
    queryKey: ["knowledgebase", "category", categoryId],
    queryFn: async () => {
      const response = await customFetch<{ category: KBCategory | null; articles: KBArticle[] }>(
        `/knowledgebase/categories/${categoryId}`,
      );
      if (!response.category) {
        throw new Error("Category not found");
      }
      return {
        ...response.category,
        articles: response.articles ?? [],
        articleCount: response.articles?.length ?? response.category.articleCount,
      };
    },
    enabled: !!categoryId,
    ...options,
  });
}

export function useGetKnowledgebaseArticle(categoryId: string, articleId: string, options?: UseQueryOptions<KBArticle, Error>) {
  return useQuery<KBArticle, Error>({
    queryKey: ["knowledgebase", "category", categoryId, "article", articleId],
    queryFn: async () => {
      const response = await customFetch<{ article: KBArticle | null }>(
        `/knowledgebase/categories/${categoryId}/articles/${articleId}`,
      );
      if (!response.article) {
        throw new Error("Article not found");
      }
      return response.article;
    },
    enabled: !!(categoryId && articleId),
    ...options,
  });
}

// ============================================================================
// PRODUCT CATALOG HOOKS
// ============================================================================

export function useGetCatalogProducts(params?: { groupId?: number; page?: number; limit?: number }, options?: UseQueryOptions<{ products: Product[]; total: number }, Error>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";

  return useQuery<{ products: Product[]; total: number }, Error>({
    queryKey: ["catalog", "products", params],
    queryFn: () => customFetch<{ products: Product[]; total: number }>(`/products${queryString}`),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useGetCatalogProductDetail(productId: string, options?: UseQueryOptions<Product, Error>) {
  return useQuery<Product, Error>({
    queryKey: ["catalog", "product", productId],
    queryFn: () => customFetch<Product>(`/products/${productId}`),
    enabled: !!productId,
    ...options,
  });
}

export function useGetCatalogProductGroups(options?: UseQueryOptions<{ groups: { id: number; name: string }[] }, Error>) {
  return useQuery<{ groups: { id: number; name: string }[] }, Error>({
    queryKey: ["catalog", "groups"],
    queryFn: () => customFetch<{ groups: { id: number; name: string }[] }>("/products/groups"),
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

// ============================================================================
// CART HOOKS
// ============================================================================

export function useGetCart(options?: UseQueryOptions<{ items: any[]; subtotal: number; total: number }, Error>) {
  return useQuery<{ items: any[]; subtotal: number; total: number }, Error>({
    queryKey: ["cart"],
    queryFn: () => customFetch<{ items: any[]; subtotal: number; total: number }>("/cart"),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
}

export function useAddToCart(options?: UseMutationOptions<{ success: boolean }, Error, { productId: number; billingCycle?: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { productId: number; billingCycle?: string }>({
    mutationFn: (data) =>
      customFetch<{ success: boolean }>("/cart/items", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
}

export function useUpdateCartItem(options?: UseMutationOptions<{ success: boolean }, Error, { orderId: string; billingCycle?: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { orderId: string; billingCycle?: string }>({
    mutationFn: ({ orderId, billingCycle }) =>
      customFetch<{ success: boolean }>(`/cart/items/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ billingCycle }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
}

export function useRemoveFromCart(options?: UseMutationOptions<{ success: boolean }, Error, { orderId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { orderId: string }>({
    mutationFn: ({ orderId }) =>
      customFetch<{ success: boolean }>(`/cart/items/${orderId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
}

export function useCheckoutCart(options?: UseMutationOptions<{ success: boolean; orderId?: number }, Error, { paymentMethod?: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; orderId?: number }, Error, { paymentMethod?: string }>({
    mutationFn: (data) =>
      customFetch<{ success: boolean; orderId?: number }>("/cart/checkout", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    ...options,
  });
}

// ============================================================================
// CONTACTS HOOKS
// ============================================================================

// Alias exports for backward compatibility with existing imports
export const useGetInvoice = useGetInvoiceDetail;
export const useGetQuote = useGetQuoteDetail;
export const useGetOrder = useGetOrderDetail;
export const useGetAnnouncement = useGetAnnouncementDetail;
export const useGetTicket = useGetTicketDetail;
export const useGetDomain = useGetDomainDetail;
export const useGetService = useGetServiceDetail;


export function useGetContacts(options?: UseQueryOptions<{ contacts: ClientProfile[]; total: number }, Error>) {
  return useQuery<{ contacts: ClientProfile[]; total: number }, Error>({
    queryKey: ["contacts"],
    queryFn: () => customFetch<{ contacts: ClientProfile[]; total: number }>("/client/contacts"),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCreateContact(options?: UseMutationOptions<ClientProfile, Error, Partial<ClientProfile>>) {
  const queryClient = useQueryClient();

  return useMutation<ClientProfile, Error, Partial<ClientProfile>>({
    mutationFn: (data) =>
      customFetch<ClientProfile>("/client/contacts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    ...options,
  });
}

export function useUpdateContact(options?: UseMutationOptions<ClientProfile, Error, { contactId: number } & Partial<ClientProfile>>) {
  const queryClient = useQueryClient();

  return useMutation<ClientProfile, Error, { contactId: number } & Partial<ClientProfile>>({
    mutationFn: ({ contactId, ...data }) =>
      customFetch<ClientProfile>(`/client/contacts/${contactId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    ...options,
  });
}

export function useDeleteContact(options?: UseMutationOptions<{ success: boolean }, Error, { contactId: number }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { contactId: number }>({
    mutationFn: ({ contactId }) =>
      customFetch<{ success: boolean }>(`/client/contacts/${contactId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    ...options,
  });
}

// ============================================================================
// PAYMENT METHODS HOOKS
// ============================================================================

export interface PaymentMethod {
  id: string;
  gateway: string;
  displayName: string;
  type: "card" | "bank" | "paypal" | "crypto" | "other";
  isDefault?: boolean;
  lastFour?: string;
  expiryMonth?: number;
  expiryYear?: number;
  createdAt?: string;
}

export interface PaymentGateway {
  name: string;
  displayName: string;
  type: string;
  enabled: boolean;
  icon?: string;
}

export function useGetPaymentMethods(options?: UseQueryOptions<{ paymentMethods: PaymentMethod[]; availableGateways: PaymentGateway[] }, Error>) {
  return useQuery<{ paymentMethods: PaymentMethod[]; availableGateways: PaymentGateway[] }, Error>({
    queryKey: ["paymentMethods"],
    queryFn: () => customFetch<{ paymentMethods: PaymentMethod[]; availableGateways: PaymentGateway[] }>("/client/payment-methods"),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useCreatePaymentMethod(options?: UseMutationOptions<PaymentMethod, Error, { data: Omit<PaymentMethod, "id"> }>) {
  const queryClient = useQueryClient();

  return useMutation<PaymentMethod, Error, { data: Omit<PaymentMethod, "id"> }>({
    mutationFn: ({ data }) =>
      customFetch<PaymentMethod>("/client/payment-methods", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
    ...options,
  });
}

export function useDeletePaymentMethod(options?: UseMutationOptions<{ success: boolean }, Error, { paymentMethodId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { paymentMethodId: string }>({
    mutationFn: ({ paymentMethodId }) =>
      customFetch<{ success: boolean }>(`/client/payment-methods/${paymentMethodId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
    ...options,
  });
}

export function useSetDefaultPaymentMethod(options?: UseMutationOptions<{ success: boolean }, Error, { paymentMethodId: string }>) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { paymentMethodId: string }>({
    mutationFn: ({ paymentMethodId }) =>
      customFetch<{ success: boolean }>(`/client/payment-methods/${paymentMethodId}/default`, {
        method: "PUT",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
    ...options,
  });
}
