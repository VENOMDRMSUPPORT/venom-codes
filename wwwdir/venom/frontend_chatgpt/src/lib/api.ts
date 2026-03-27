import { customFetch } from "@workspace/api-client";
import type {
  AnnouncementRecord,
  CartItem,
  CatalogProductRecord,
  ClientProfile,
  ContactRecord,
  DomainRecord,
  InvoiceRecord,
  KnowledgeArticle,
  KnowledgeCategory,
  OrderRecord,
  PaymentMethodRecord,
  QuoteRecord,
  ServiceRecord,
  TicketMessage,
  TicketRecord
} from "@/lib/site";
import { arrayFromPayload, isObject, readPath, titleCase, toNumber, toStringValue } from "@/lib/utils";

const ENDPOINTS = {
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  register: "/api/auth/register",
  forgotPassword: "/api/auth/forgot-password",
  me: "/api/auth/me",
  refresh: "/api/auth/refresh",
  profile: "/api/client/profile",
  contacts: "/api/client/contacts",
  dashboard: "/api/client/dashboard",
  changePassword: "/api/client/change-password",
  services: "/api/services",
  invoices: "/api/invoices",
  quotes: "/api/quotes",
  orders: "/api/orders",
  tickets: "/api/tickets",
  ticketDepartments: "/api/tickets/departments",
  domains: "/api/domains",
  products: "/api/products",
  announcements: "/api/announcements",
  knowledgebase: "/api/knowledgebase",
  knowledgebaseCategories: "/api/knowledgebase/categories",
  paymethods: "/api/paymethods",
  cart: "/api/cart"
} as const;

type RecordValue = Record<string, unknown>;

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  companyname?: string;
};

type UpdateProfilePayload = Partial<{
  firstname: string;
  lastname: string;
  companyname: string;
  phonenumber: string;
  address1: string;
  city: string;
  country: string;
}>;

type TicketPayload = {
  department: string;
  subject: string;
  message: string;
  priority: string;
};

function asRecord(value: unknown): RecordValue {
  return isObject(value) ? value : {};
}

function firstRecord(payload: unknown, keys: string[]) {
  if (isObject(payload)) {
    for (const key of keys) {
      const value = payload[key];
      if (isObject(value)) return value;
    }
  }
  return asRecord(payload);
}

function pickId(record: RecordValue, keys: string[], fallback: string) {
  return toStringValue(readPath(record, keys, fallback), fallback);
}

function normalizeClient(payload: unknown): ClientProfile {
  const record = asRecord(payload);
  return {
    id: pickId(record, ["id", "userid", "clientId"], "client"),
    firstname: toStringValue(readPath(record, ["firstname", "firstName"], "Client"), "Client"),
    lastname: toStringValue(readPath(record, ["lastname", "lastName"], "User"), "User"),
    email: toStringValue(readPath(record, ["email"], "client@example.test"), "client@example.test"),
    status: toStringValue(readPath(record, ["status"], "Active"), "Active"),
    company: toStringValue(readPath(record, ["companyname", "company"], "VENOM Client"), "VENOM Client"),
    role: toStringValue(readPath(record, ["role", "title"], "Account owner"), "Account owner"),
    location: toStringValue(readPath(record, ["location", "countryname", "country"], "Managed account"), "Managed account"),
    timezone: toStringValue(readPath(record, ["timezone"], "UTC"), "UTC"),
    creditBalance: toNumber(readPath(record, ["credit", "creditBalance", "balance"], 0), 0)
  };
}

function normalizeService(payload: unknown): ServiceRecord {
  const record = asRecord(payload);
  const name = toStringValue(readPath(record, ["name", "productName", "product", "domain"], "Unnamed service"), "Unnamed service");

  return {
    id: pickId(record, ["id", "serviceId", "serviceid"], name),
    name,
    category: toStringValue(readPath(record, ["category", "groupname", "group", "type"], "Streaming service"), "Streaming service"),
    status: toStringValue(readPath(record, ["status"], "Active"), "Active"),
    region: toStringValue(readPath(record, ["region", "server", "location"], "Assigned region"), "Assigned region"),
    cycle: toStringValue(readPath(record, ["billingCycle", "billingcycle", "cycle"], "Monthly"), "Monthly"),
    nextDue: toStringValue(readPath(record, ["nextDueDate", "nextduedate"], "TBC"), "TBC"),
    protocols: arrayFromPayload(readPath(record, ["protocols"], []), []).map((item) => String(item)),
    viewers: toStringValue(readPath(record, ["viewers", "audience"], "—"), "—"),
    load: toStringValue(readPath(record, ["load", "cpu"], "—"), "—"),
    uptime: toStringValue(readPath(record, ["uptime"], "—"), "—"),
    ip: toStringValue(readPath(record, ["dedicatedIp", "dedicatedip", "ip"], "—"), "—"),
    origin: toStringValue(readPath(record, ["domain", "hostname", "origin"], "—"), "—"),
    amount: toStringValue(readPath(record, ["amount", "recurringAmount"], ""), ""),
    summary: toStringValue(readPath(record, ["summary", "notes", "description"], "Managed VENOM service footprint."), "Managed VENOM service footprint.")
  };
}

function normalizeInvoice(payload: unknown): InvoiceRecord {
  const record = asRecord(payload);
  const items = arrayFromPayload(readPath(record, ["items", "lineItems"], []), []).map((line) => {
    const row = asRecord(line);
    return {
      label: toStringValue(readPath(row, ["description", "label", "name"], "Service line"), "Service line"),
      amount: toStringValue(readPath(row, ["amount", "total", "price"], "$0.00"), "$0.00")
    };
  });

  return {
    id: pickId(record, ["id", "invoiceId", "invoiceid"], "invoice"),
    status: toStringValue(readPath(record, ["status"], "Draft"), "Draft"),
    total: toStringValue(readPath(record, ["total"], "$0.00"), "$0.00"),
    balance: toStringValue(readPath(record, ["balance", "amountDue", "amountdue"], "$0.00"), "$0.00"),
    issuedOn: toStringValue(readPath(record, ["date", "issuedOn", "createdAt"], "TBC"), "TBC"),
    dueOn: toStringValue(readPath(record, ["dueDate", "duedate"], "TBC"), "TBC"),
    gateway: toStringValue(readPath(record, ["paymentMethod", "paymentmethod", "gateway"], "Managed gateway"), "Managed gateway"),
    items: items.length > 0 ? items : [{ label: "Commercial plan", amount: toStringValue(readPath(record, ["total"], "$0.00"), "$0.00") }]
  };
}

function normalizeQuote(payload: unknown): QuoteRecord {
  const record = asRecord(payload);
  return {
    id: pickId(record, ["id", "quoteId", "quoteid"], "quote"),
    status: toStringValue(readPath(record, ["status"], "Pending"), "Pending"),
    total: toStringValue(readPath(record, ["total"], "$0.00"), "$0.00"),
    validUntil: toStringValue(readPath(record, ["validUntil", "validuntil", "expiryDate"], "TBC"), "TBC"),
    summary: toStringValue(readPath(record, ["summary", "subject", "title"], "Commercial quote"), "Commercial quote"),
    scope: arrayFromPayload(readPath(record, ["scope", "items"], []), []).map((item) => String(item))
  };
}

function normalizeOrder(payload: unknown): OrderRecord {
  const record = asRecord(payload);
  return {
    id: pickId(record, ["id", "orderId", "orderid"], "order"),
    status: toStringValue(readPath(record, ["status"], "Pending"), "Pending"),
    total: toStringValue(readPath(record, ["total"], "$0.00"), "$0.00"),
    placedOn: toStringValue(readPath(record, ["date", "placedOn", "createdAt"], "TBC"), "TBC"),
    summary: toStringValue(readPath(record, ["summary", "notes", "description"], "Commercial order"), "Commercial order")
  };
}

function normalizeTicketMessage(payload: unknown): TicketMessage {
  const record = asRecord(payload);
  return {
    author: toStringValue(readPath(record, ["author", "name", "admin", "from"], "VENOM Support"), "VENOM Support"),
    role: titleCase(toStringValue(readPath(record, ["role", "type"], "support"), "support")),
    body: toStringValue(readPath(record, ["message", "body", "content", "text"], ""), ""),
    timestamp: toStringValue(readPath(record, ["timestamp", "date", "createdAt"], ""), "")
  };
}

function normalizeTicket(payload: unknown): TicketRecord {
  const record = asRecord(payload);
  const baseMessage = readPath(record, ["message"], null);
  const replies = arrayFromPayload(readPath(record, ["replies", "messages"], []), []).map(normalizeTicketMessage);
  const messages = baseMessage
    ? [normalizeTicketMessage({ author: "Client", role: "client", message: baseMessage, date: readPath(record, ["createdAt"], "") }), ...replies]
    : replies;

  return {
    id: pickId(record, ["id", "ticketId", "tid"], "ticket"),
    subject: toStringValue(readPath(record, ["subject", "title"], "Support request"), "Support request"),
    department: toStringValue(readPath(record, ["department"], "Support"), "Support"),
    priority: toStringValue(readPath(record, ["priority"], "Medium"), "Medium"),
    status: toStringValue(readPath(record, ["status"], "Open"), "Open"),
    updatedAt: toStringValue(readPath(record, ["lastUpdated", "lastreply", "updatedAt", "date"], "TBC"), "TBC"),
    excerpt: toStringValue(readPath(record, ["excerpt", "message", "summary"], ""), ""),
    messages
  };
}

function normalizeDomain(payload: unknown): DomainRecord {
  const record = asRecord(payload);
  return {
    id: pickId(record, ["id", "domainId", "domainid"], "domain"),
    domain: toStringValue(readPath(record, ["domain", "name"], "example.test"), "example.test"),
    status: toStringValue(readPath(record, ["status"], "Active"), "Active"),
    registrar: toStringValue(readPath(record, ["registrar", "registrarModule"], "Managed registrar"), "Managed registrar"),
    expiresOn: toStringValue(readPath(record, ["expiryDate", "expirydate", "nextDueDate"], "TBC"), "TBC"),
    autorenew: Boolean(readPath(record, ["autoRenew", "autorenew"], false)),
    lock: Boolean(readPath(record, ["lockStatus", "registrarlock", "locked"], false)),
    nameservers: arrayFromPayload(readPath(record, ["nameservers"], []), []).map((item) => String(item)),
    purpose: toStringValue(readPath(record, ["purpose", "description"], "Managed domain record."), "Managed domain record.")
  };
}

function normalizeContact(payload: unknown): ContactRecord {
  const record = asRecord(payload);
  return {
    id: pickId(record, ["id", "contactId"], "contact"),
    name: toStringValue(readPath(record, ["name", "fullName", "fullname"], "Account contact"), "Account contact"),
    email: toStringValue(readPath(record, ["email"], "contact@example.test"), "contact@example.test"),
    role: toStringValue(readPath(record, ["role", "title"], "Contact"), "Contact"),
    scope: toStringValue(readPath(record, ["scope", "permissions"], "Managed account access"), "Managed account access")
  };
}

function normalizePaymethod(payload: unknown): PaymentMethodRecord {
  const record = asRecord(payload);
  return {
    id: pickId(record, ["id", "payMethodId", "paymethodid"], "pm"),
    label: toStringValue(readPath(record, ["description", "label", "displayName"], "Saved payment method"), "Saved payment method"),
    type: toStringValue(readPath(record, ["type", "paymentType", "gateway"], "Card"), "Card"),
    lastFour: toStringValue(readPath(record, ["lastFour", "last4", "suffix"], "0000"), "0000"),
    expires: toStringValue(readPath(record, ["expiry", "expires", "expiryDate"], "On file"), "On file"),
    isDefault: Boolean(readPath(record, ["isDefault", "default"], false))
  };
}

function normalizeAnnouncement(payload: unknown): AnnouncementRecord {
  const record = asRecord(payload);
  const id = pickId(record, ["id", "announcementId", "slug"], "announcement");
  const title = toStringValue(readPath(record, ["title"], "Announcement"), "Announcement");
  const summary = toStringValue(readPath(record, ["summary", "excerpt", "content"], ""), "");
  const bodyValue = readPath(record, ["body", "content"], summary);
  const body = Array.isArray(bodyValue)
    ? bodyValue.map((item) => String(item))
    : String(bodyValue)
        .split(/\n{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    id,
    title,
    summary,
    publishedAt: toStringValue(readPath(record, ["publishedAt", "date", "createdAt"], "TBC"), "TBC"),
    body: body.length > 0 ? body : [summary]
  };
}

function normalizeKbCategory(payload: unknown): KnowledgeCategory {
  const record = asRecord(payload);
  return {
    id: pickId(record, ["id", "categoryId", "slug"], "category"),
    title: toStringValue(readPath(record, ["title", "name"], "Knowledge category"), "Knowledge category"),
    summary: toStringValue(readPath(record, ["summary", "description"], "Operational guidance and reference."), "Operational guidance and reference."),
    articleCount: toNumber(readPath(record, ["articleCount", "count"], 0), 0)
  };
}

function normalizeKbArticle(payload: unknown, fallbackCategoryId = "category"): KnowledgeArticle {
  const record = asRecord(payload);
  const id = pickId(record, ["id", "articleId", "slug"], "article");
  const bodyValue = readPath(record, ["body", "content"], "");
  const body = Array.isArray(bodyValue)
    ? bodyValue.map((item) => String(item))
    : String(bodyValue)
        .split(/\n{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    id,
    categoryId: pickId(record, ["categoryId", "category", "categorySlug"], fallbackCategoryId),
    title: toStringValue(readPath(record, ["title"], "Knowledge article"), "Knowledge article"),
    summary: toStringValue(readPath(record, ["summary", "excerpt", "content"], ""), ""),
    updatedAt: toStringValue(readPath(record, ["updatedAt", "date", "createdAt"], "TBC"), "TBC"),
    body,
    views: toNumber(readPath(record, ["views"], 0), 0)
  };
}

function normalizeProduct(payload: unknown): CatalogProductRecord {
  const record = asRecord(payload);
  const pricing = arrayFromPayload(readPath(record, ["pricing", "prices"], []), []).map((entry) => {
    const line = asRecord(entry);
    return {
      label: toStringValue(readPath(line, ["billingCycle", "label", "cycle"], "Recurring"), "Recurring"),
      amount: toStringValue(readPath(line, ["price", "amount", "total"], "$0.00"), "$0.00")
    };
  });

  return {
    id: pickId(record, ["id", "productId"], "product"),
    name: toStringValue(readPath(record, ["name"], "Catalog product"), "Catalog product"),
    description: toStringValue(readPath(record, ["description", "summary"], ""), ""),
    type: toStringValue(readPath(record, ["type", "group"], "Service"), "Service"),
    pricing,
    highlight: toStringValue(readPath(record, ["highlight", "tagline"], "Production-ready commercial footprint."), "Production-ready commercial footprint.")
  };
}

function normalizeCartItem(payload: unknown): CartItem {
  const record = asRecord(payload);
  const quantity = toNumber(readPath(record, ["quantity"], 1), 1);
  return {
    id: pickId(record, ["id", "itemId"], "cart-item"),
    label: toStringValue(readPath(record, ["name", "label", "description"], "Cart item"), "Cart item"),
    cycle: toStringValue(readPath(record, ["billingCycle", "cycle"], "Recurring"), "Recurring"),
    unitPrice: toStringValue(readPath(record, ["unitPrice", "price", "amount"], "$0.00"), "$0.00"),
    quantity,
    total: toStringValue(readPath(record, ["total"], "$0.00"), "$0.00")
  };
}

async function fetchJson<T = unknown>(path: string, init?: RequestInit) {
  return customFetch<T>(path, init);
}

export async function loginRequest(payload: LoginPayload) {
  const response = await fetchJson<unknown>(ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const record = asRecord(response);
  const data = firstRecord(record, ["data", "result", "payload"]);
  const token = toStringValue(readPath(record, ["token", "accessToken"], readPath(data, ["token", "accessToken"], "")), "");
  const client = normalizeClient(readPath(record, ["client"], readPath(data, ["client"], {})));
  return { token, client };
}

export async function registerRequest(payload: RegisterPayload) {
  const response = await fetchJson<unknown>(ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const record = asRecord(response);
  const data = firstRecord(record, ["data", "result", "payload"]);
  const token = toStringValue(readPath(record, ["token", "accessToken"], readPath(data, ["token", "accessToken"], "")), "");
  const client = normalizeClient(readPath(record, ["client"], readPath(data, ["client"], payload)));
  return { token, client };
}

export async function forgotPasswordRequest(email: string) {
  return fetchJson(ENDPOINTS.forgotPassword, {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

export async function getMe() {
  const response = await fetchJson<unknown>(ENDPOINTS.me);
  return normalizeClient(firstRecord(response, ["client", "profile", "data"]));
}

export async function refreshTokenRequest(token: string) {
  const response = await fetchJson<RecordValue>(ENDPOINTS.refresh, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return { token: toStringValue(response?.token, "") };
}

export async function logoutRequest(token: string) {
  return fetchJson(ENDPOINTS.logout, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function getClientProfile() {
  const response = await fetchJson<unknown>(ENDPOINTS.profile);
  return normalizeClient(firstRecord(response, ["client", "profile", "data"]));
}

export async function updateClientProfile(payload: UpdateProfilePayload) {
  return fetchJson(ENDPOINTS.profile, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function getDashboardSnapshot() {
  return fetchJson<RecordValue>(ENDPOINTS.dashboard);
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return fetchJson(ENDPOINTS.changePassword, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function listServices() {
  const response = await fetchJson<unknown>(ENDPOINTS.services);
  return arrayFromPayload(response, ["services", "items", "data"]).map(normalizeService);
}

export async function getService(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.services}/${id}`);
  return normalizeService(firstRecord(response, ["service", "item", "data"]));
}

export async function requestServiceUpgrade(serviceId: string, payload: { newProductId: string; billingCycle?: string; paymentmethod?: string }) {
  return fetchJson(`${ENDPOINTS.services}/${serviceId}/upgrade`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function requestServiceCancellation(serviceId: string, payload: { type: string; reason: string }) {
  return fetchJson(`${ENDPOINTS.services}/${serviceId}/cancel`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function listInvoices() {
  const response = await fetchJson<unknown>(ENDPOINTS.invoices);
  return arrayFromPayload(response, ["invoices", "items", "data"]).map(normalizeInvoice);
}

export async function getInvoice(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.invoices}/${id}`);
  return normalizeInvoice(firstRecord(response, ["invoice", "item", "data"]));
}

export async function payInvoice(invoiceId: string, paymentMethodId?: string) {
  return fetchJson(`${ENDPOINTS.invoices}/${invoiceId}/pay`, {
    method: "POST",
    body: JSON.stringify(paymentMethodId ? { paymentMethodId } : {})
  });
}

export async function listQuotes() {
  const response = await fetchJson<unknown>(ENDPOINTS.quotes);
  return arrayFromPayload(response, ["quotes", "items", "data"]).map(normalizeQuote);
}

export async function getQuote(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.quotes}/${id}`);
  return normalizeQuote(firstRecord(response, ["quote", "item", "data"]));
}

export async function acceptQuote(id: string) {
  return fetchJson(`${ENDPOINTS.quotes}/${id}/accept`, {
    method: "POST"
  });
}

export async function declineQuote(id: string) {
  return fetchJson(`${ENDPOINTS.quotes}/${id}/decline`, {
    method: "POST"
  });
}

export async function listOrders() {
  const response = await fetchJson<unknown>(ENDPOINTS.orders);
  return arrayFromPayload(response, ["orders", "items", "data"]).map(normalizeOrder);
}

export async function getOrder(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.orders}/${id}`);
  return normalizeOrder(firstRecord(response, ["order", "item", "data"]));
}

export async function listTicketDepartments() {
  const response = await fetchJson<unknown>(ENDPOINTS.ticketDepartments);
  return arrayFromPayload(response, ["departments", "items", "data"]).map((entry) => String(entry));
}

export async function listTickets() {
  const response = await fetchJson<unknown>(ENDPOINTS.tickets);
  return arrayFromPayload(response, ["tickets", "items", "data"]).map(normalizeTicket);
}

export async function getTicket(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.tickets}/${id}`);
  return normalizeTicket(firstRecord(response, ["ticket", "item", "data"]));
}

export async function createTicket(payload: TicketPayload) {
  return fetchJson(ENDPOINTS.tickets, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function replyToTicket(ticketId: string, message: string) {
  return fetchJson(`${ENDPOINTS.tickets}/${ticketId}/reply`, {
    method: "POST",
    body: JSON.stringify({ message })
  });
}

export async function closeTicket(ticketId: string) {
  return fetchJson(`${ENDPOINTS.tickets}/${ticketId}/close`, {
    method: "POST"
  });
}

export async function listDomains() {
  const response = await fetchJson<unknown>(ENDPOINTS.domains);
  return arrayFromPayload(response, ["domains", "items", "data"]).map(normalizeDomain);
}

export async function getDomain(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.domains}/${id}`);
  return normalizeDomain(firstRecord(response, ["domain", "item", "data"]));
}

export async function updateNameservers(domainId: string, nameservers: string[]) {
  return fetchJson(`${ENDPOINTS.domains}/${domainId}/nameservers`, {
    method: "PUT",
    body: JSON.stringify({ nameservers })
  });
}

export async function toggleAutorenew(domainId: string, enabled: boolean) {
  return fetchJson(`${ENDPOINTS.domains}/${domainId}/autorenew`, {
    method: "POST",
    body: JSON.stringify({ enabled })
  });
}

export async function toggleRegistrarLock(domainId: string, lock: boolean) {
  return fetchJson(`${ENDPOINTS.domains}/${domainId}/registrarlock`, {
    method: "POST",
    body: JSON.stringify({ lock })
  });
}

export async function renewDomain(domainId: string, years = 1) {
  return fetchJson(`${ENDPOINTS.domains}/${domainId}/renew`, {
    method: "POST",
    body: JSON.stringify({ years })
  });
}

export async function listContacts() {
  const response = await fetchJson<unknown>(ENDPOINTS.contacts);
  return arrayFromPayload(response, ["contacts", "items", "data"]).map(normalizeContact);
}

export async function listAnnouncements() {
  const response = await fetchJson<unknown>(ENDPOINTS.announcements);
  return arrayFromPayload(response, ["announcements", "items", "data"]).map(normalizeAnnouncement);
}

export async function getAnnouncement(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.announcements}/${id}`);
  return normalizeAnnouncement(firstRecord(response, ["announcement", "item", "data"]));
}

export async function listKnowledgeCategories() {
  const response = await fetchJson<unknown>(ENDPOINTS.knowledgebaseCategories);
  return arrayFromPayload(response, ["categories", "items", "data"]).map(normalizeKbCategory);
}

export async function getKnowledgebaseIndex() {
  const response = await fetchJson<unknown>(ENDPOINTS.knowledgebase);
  return arrayFromPayload(response, ["categories", "items", "data"]).map(normalizeKbCategory);
}

export async function getKnowledgeCategory(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.knowledgebaseCategories}/${id}`);
  const record = asRecord(response);
  const category = normalizeKbCategory(readPath(record, ["category"], {}));
  const articles = arrayFromPayload(record, ["articles", "items", "data"]).map((article) => normalizeKbArticle(article, category.id));
  return { category, articles };
}

export async function getKnowledgeArticle(categoryId: string, articleId: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.knowledgebaseCategories}/${categoryId}/articles/${articleId}`);
  const record = asRecord(response);
  return {
    category: normalizeKbCategory(readPath(record, ["category"], { id: categoryId })),
    article: normalizeKbArticle(readPath(record, ["article", "item", "data"], {}), categoryId)
  };
}

export async function listProducts() {
  const response = await fetchJson<unknown>(ENDPOINTS.products);
  return arrayFromPayload(response, ["products", "items", "data"]).map(normalizeProduct);
}

export async function getProduct(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.products}/${id}`);
  return normalizeProduct(firstRecord(response, ["product", "item", "data"]));
}

export async function listPaymentMethods() {
  const response = await fetchJson<unknown>(ENDPOINTS.paymethods);
  return arrayFromPayload(response, ["paymethods", "payMethods", "items", "data"]).map(normalizePaymethod);
}

export async function getPaymentMethod(id: string) {
  const response = await fetchJson<unknown>(`${ENDPOINTS.paymethods}/${id}`);
  return normalizePaymethod(firstRecord(response, ["paymethod", "payMethod", "item", "data"]));
}

export async function getCart() {
  const response = await fetchJson<unknown>(ENDPOINTS.cart);
  return arrayFromPayload(response, ["items", "cart", "data"]).map(normalizeCartItem);
}

export async function addCartItem(payload: { productId: string; billingCycle?: string; domain?: string; quantity?: number; addons?: string[] }) {
  return fetchJson(`${ENDPOINTS.cart}/items`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateCartItem(itemId: string, payload: { quantity?: number; billingCycle?: string }) {
  return fetchJson(`${ENDPOINTS.cart}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function removeCartItem(itemId: string) {
  return fetchJson(`${ENDPOINTS.cart}/items/${itemId}`, {
    method: "DELETE"
  });
}

export async function clearCart() {
  return fetchJson(`${ENDPOINTS.cart}/clear`, {
    method: "POST"
  });
}

export async function checkoutCart(payload: { paymentMethodId?: string; notes?: string }) {
  return fetchJson(`${ENDPOINTS.cart}/checkout`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
