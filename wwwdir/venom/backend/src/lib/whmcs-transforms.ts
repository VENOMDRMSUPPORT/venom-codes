import type { ClientProfile } from "@workspace/api-types";

/** Normalized shapes for WHMCS list responses (not all are in OpenAPI yet). */
export interface Service {
  id: string;
  productId?: string;
  productName: string;
  domain?: string;
  status: string;
  billingCycle?: string;
  nextDueDate?: string;
  amount?: string;
  username: string | null;
  dedicatedIp: string | null;
  regDate?: string;
  firstPaymentAmount?: string;
  notes: string | null;
}

export interface Invoice {
  id: string;
  status: string;
  date?: string;
  dueDate?: string;
  total: string;
  subtotal?: string;
  taxAmount?: string;
  credit?: string;
  paymentMethod: string | null;
  notes: string | null;
}

export interface Domain {
  id: string;
  domainName: string;
  status: string;
  expiryDate?: string;
  nextDueDate?: string;
  autoRenew: boolean;
  idProtection: boolean;
  registrarLock: boolean;
  nameservers?: string[];
  billingCycle?: string;
  amount?: string;
}

export interface TicketSummary {
  id: string;
  subject: string;
  status: string;
  department?: string;
  priority: string;
  lastUpdated?: string;
}

/** Single ticket thread for GET /tickets/:id */
export interface TicketReply {
  id: string;
  authorName?: string;
  isStaff: boolean;
  createdAt: string;
  message: string;
  attachments?: { filename: string; url?: string }[];
}

export interface TicketDetail {
  id: string;
  subject: string;
  status: string;
  priority: string;
  department?: string;
  createdAt: string;
  message?: string;
  replies: TicketReply[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  type?: string;
  pricing: Record<string, unknown>;
}

export interface SavedPayMethod {
  id: string;
  type?: string;
  gateway?: string;
  description?: string;
  lastFour?: string;
  expiry?: string;
}

export interface Quote {
  id: string;
  subject: string;
  status: string;
  expiryDate?: string;
  total: string;
  notes: string | null;
}

export interface Order {
  id: string;
  status: string;
  date?: string;
  total: string;
  paymentMethod?: string;
  invoiceId?: string;
}

/** WHMCS GetClientsDetails / client object */
export function mapWhmcsClientToProfile(
  raw: Record<string, unknown>,
): ClientProfile {
  return {
    id: String(raw.userid ?? raw.client_id ?? raw.id ?? ""),
    firstname: String(raw.firstname ?? ""),
    lastname: String(raw.lastname ?? ""),
    email: String(raw.email ?? ""),
    companyname:
      raw.companyname === null || raw.companyname === undefined
        ? null
        : String(raw.companyname),
    phonenumber: raw.phonenumber != null ? String(raw.phonenumber) : undefined,
    address1: raw.address1 != null ? String(raw.address1) : undefined,
    address2:
      raw.address2 === null || raw.address2 === undefined
        ? null
        : String(raw.address2),
    city: raw.city != null ? String(raw.city) : undefined,
    state: raw.state != null ? String(raw.state) : undefined,
    postcode: raw.postcode != null ? String(raw.postcode) : undefined,
    country: raw.country != null ? String(raw.country) : undefined,
    currency:
      raw.currency_code != null
        ? Number(raw.currency)
        : raw.currency != null
          ? Number(raw.currency)
          : undefined,
    currencyCode:
      raw.currency_code != null ? String(raw.currency_code) : undefined,
    credit: raw.credit != null ? String(raw.credit) : undefined,
    status: String(raw.status ?? "Active"),
    createdAt:
      raw.datecreated != null ? String(raw.datecreated) : String(raw.date ?? ""),
  };
}

function asArray<T>(v: unknown): T[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v as T[];
  return [v as T];
}

export function mapProductsToServices(
  response: Record<string, unknown>,
): Service[] {
  const products = response.products as
    | { product?: unknown }
    | undefined
    | unknown;
  const list =
    products &&
    typeof products === "object" &&
    "product" in (products as object)
      ? asArray<Record<string, unknown>>(
          (products as { product?: unknown }).product,
        )
      : asArray<Record<string, unknown>>(response.product);

  return list.map((raw) => ({
    id: String(raw.id ?? raw.serviceid ?? ""),
    productId: raw.pid != null ? String(raw.pid) : undefined,
    productName: String(raw.name ?? raw.productname ?? ""),
    domain: raw.domain != null ? String(raw.domain) : undefined,
    status: String(raw.status ?? ""),
    billingCycle:
      raw.billingcycle != null ? String(raw.billingcycle) : undefined,
    nextDueDate:
      raw.nextduedate != null ? String(raw.nextduedate) : undefined,
    amount: raw.recurringamount != null ? String(raw.recurringamount) : undefined,
    username:
      raw.username === null || raw.username === undefined
        ? null
        : String(raw.username),
    dedicatedIp:
      raw.dedicatedip === null || raw.dedicatedip === undefined
        ? null
        : String(raw.dedicatedip),
    regDate: raw.regdate != null ? String(raw.regdate) : undefined,
    firstPaymentAmount:
      raw.firstpaymentamount != null
        ? String(raw.firstpaymentamount)
        : undefined,
    notes:
      raw.notes === null || raw.notes === undefined
        ? null
        : String(raw.notes),
  }));
}

export function mapInvoicesResponse(
  response: Record<string, unknown>,
): Invoice[] {
  const inv = response.invoices as { invoice?: unknown } | undefined;
  const list = inv?.invoice
    ? asArray<Record<string, unknown>>(inv.invoice)
    : asArray<Record<string, unknown>>(response.invoice);

  return list.map((raw) => ({
    id: String(raw.id ?? raw.invoiceid ?? ""),
    status: String(raw.status ?? ""),
    date: raw.date != null ? String(raw.date) : undefined,
    dueDate: raw.duedate != null ? String(raw.duedate) : undefined,
    total: String(raw.total ?? raw.balance ?? "0"),
    subtotal: raw.subtotal != null ? String(raw.subtotal) : undefined,
    taxAmount: raw.tax != null ? String(raw.tax) : undefined,
    credit: raw.credit != null ? String(raw.credit) : undefined,
    paymentMethod:
      raw.paymentmethod === null || raw.paymentmethod === undefined
        ? null
        : String(raw.paymentmethod),
    notes:
      raw.notes === null || raw.notes === undefined ? null : String(raw.notes),
  }));
}

function parseNameservers(raw: unknown): string[] | undefined {
  if (raw == null) return undefined;
  if (Array.isArray(raw)) return raw.map(String);
  const s = String(raw);
  if (!s.trim()) return undefined;
  return s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
}

export function mapDomainsResponse(
  response: Record<string, unknown>,
): Domain[] {
  const d = response.domains as { domain?: unknown } | undefined;
  const list = d?.domain
    ? asArray<Record<string, unknown>>(d.domain)
    : asArray<Record<string, unknown>>(response.domain);

  return list.map((raw) => ({
    id: String(raw.id ?? raw.domainid ?? ""),
    domainName: String(raw.domainname ?? raw.domain ?? ""),
    status: String(raw.status ?? ""),
    expiryDate: raw.expirydate != null ? String(raw.expirydate) : undefined,
    nextDueDate:
      raw.nextduedate != null ? String(raw.nextduedate) : undefined,
    autoRenew:
      raw.autorenew === "on" ||
      raw.autorenew === true ||
      raw.autorenew === "1",
    idProtection:
      raw.idprotection === "on" ||
      raw.idprotection === true ||
      raw.idprotection === "1",
    registrarLock:
      raw.registrarlock === "on" ||
      raw.registrarlock === true ||
      raw.registrarlock === "1",
    nameservers: parseNameservers(raw.ns1 ?? raw.nameservers),
    billingCycle:
      raw.billingcycle != null ? String(raw.billingcycle) : undefined,
    amount: raw.recurringamount != null ? String(raw.recurringamount) : undefined,
  }));
}

export function mapTicketsResponse(
  response: Record<string, unknown>,
): TicketSummary[] {
  const t = response.tickets as { ticket?: unknown } | undefined;
  const list = t?.ticket
    ? asArray<Record<string, unknown>>(t.ticket)
    : asArray<Record<string, unknown>>(response.ticket);

  return list.map((raw) => ({
    id: String(raw.id ?? raw.tid ?? ""),
    subject: String(raw.subject ?? ""),
    status: String(raw.status ?? ""),
    department:
      raw.deptname != null
        ? String(raw.deptname)
        : raw.department_name != null
          ? String(raw.department_name)
          : undefined,
    priority: String(raw.priority ?? "Medium"),
    lastUpdated:
      raw.lastreply != null
        ? String(raw.lastreply)
        : raw.date != null
          ? String(raw.date)
          : undefined,
  }));
}

/** Normalize WHMCS GetTicket for the client UI. */
export function mapTicketDetail(raw: Record<string, unknown>): TicketDetail {
  const repliesObj = raw.replies as Record<string, unknown> | undefined;
  let replySource: unknown = repliesObj?.reply ?? (raw as { reply?: unknown }).reply;
  const replyList = asArray<Record<string, unknown>>(replySource);

  const replies: TicketReply[] = replyList.map((r) => {
    const attBlock = r.attachments as { attachment?: unknown } | undefined;
    const attRaw = attBlock?.attachment ?? (r as { attachment?: unknown }).attachment;
    const attList = asArray<Record<string, unknown>>(attRaw);
    return {
      id: String(r.id ?? ""),
      authorName:
        r.name != null
          ? String(r.name)
          : r.user != null
            ? String(r.user)
            : undefined,
      isStaff:
        String(r.admin ?? "") !== "" ||
        r.requestor_type === "operator" ||
        r.userid === "0",
      createdAt: String(r.date ?? ""),
      message: String(r.message ?? ""),
      attachments:
        attList.length > 0
          ? attList.map((a) => ({
              filename: String(a.filename ?? ""),
              url: a.url != null ? String(a.url) : undefined,
            }))
          : undefined,
    };
  });

  return {
    id: String(raw.ticketid ?? raw.id ?? ""),
    subject: String(raw.subject ?? ""),
    status: String(raw.status ?? ""),
    priority: String(raw.priority ?? ""),
    department: raw.deptname != null ? String(raw.deptname) : undefined,
    createdAt: String(raw.date ?? raw.opendate ?? ""),
    message: String(raw.message ?? raw.reqmessage ?? ""),
    replies,
  };
}

export function mapSupportDepartments(
  result: Record<string, unknown>,
): { id: string; name: string }[] {
  const dep = result.departments as { department?: unknown } | undefined;
  const raw = dep?.department ?? result.department;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return (list as Record<string, unknown>[]).map((d) => ({
    id: String(d.id ?? ""),
    name: String(d.name ?? ""),
  }));
}

export function mapProductsCatalog(result: Record<string, unknown>): CatalogProduct[] {
  const products = result.products as { product?: unknown } | undefined;
  const raw = products?.product;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return (list as Record<string, unknown>[]).map((p) => ({
    id: String(p.id ?? p.pid ?? ""),
    name: String(p.name ?? ""),
    description: p.description != null ? String(p.description) : undefined,
    type: p.type != null ? String(p.type) : undefined,
    pricing:
      p.pricing && typeof p.pricing === "object"
        ? (p.pricing as Record<string, unknown>)
        : {},
  }));
}

export function mapPayMethodsList(result: Record<string, unknown>): SavedPayMethod[] {
  const pm = result.paymethods as { paymethod?: unknown } | undefined;
  const raw = pm?.paymethod ?? (result as { paymethod?: unknown }).paymethod;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return (list as Record<string, unknown>[]).map((p) => ({
    id: String(p.id ?? p.paymethodid ?? ""),
    type: p.type != null ? String(p.type) : undefined,
    gateway: p.gateway != null ? String(p.gateway) : undefined,
    description: p.description != null ? String(p.description) : undefined,
    lastFour:
      p.lastfour != null
        ? String(p.lastfour)
        : p.last4 != null
          ? String(p.last4)
          : undefined,
    expiry:
      p.expirydate != null
        ? String(p.expirydate)
        : p.expiry != null
          ? String(p.expiry)
          : undefined,
  }));
}

export function mapQuotesResponse(
  response: Record<string, unknown>,
): Quote[] {
  const q = response.quotes as { quote?: unknown } | undefined;
  const list = q?.quote
    ? asArray<Record<string, unknown>>(q.quote)
    : asArray<Record<string, unknown>>(response.quote);

  return list.map((raw) => ({
    id: String(raw.id ?? raw.quoteid ?? ""),
    subject: String(raw.subject ?? ""),
    status: String(raw.status ?? ""),
    expiryDate: raw.validuntil != null ? String(raw.validuntil) : undefined,
    total: String(raw.total ?? "0"),
    notes:
      raw.notes === null || raw.notes === undefined ? null : String(raw.notes),
  }));
}

export function mapOrdersResponse(
  response: Record<string, unknown>,
): Order[] {
  const o = response.orders as { order?: unknown } | undefined;
  const list = o?.order
    ? asArray<Record<string, unknown>>(o.order)
    : asArray<Record<string, unknown>>(response.order);

  return list.map((raw) => ({
    id: String(raw.id ?? raw.orderid ?? ""),
    status: String(raw.status ?? ""),
    date: raw.date != null ? String(raw.date) : undefined,
    total: String(raw.amount ?? raw.total ?? "0"),
    paymentMethod:
      raw.paymentmethod != null ? String(raw.paymentmethod) : undefined,
    invoiceId: raw.invoiceid != null ? String(raw.invoiceid) : undefined,
  }));
}
