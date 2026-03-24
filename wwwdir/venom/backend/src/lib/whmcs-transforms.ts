import type {
  ClientProfile,
  Domain,
  Invoice,
  Order,
  Quote,
  Service,
  TicketSummary,
} from "@workspace/api-types";

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
    lastUpdated:
      raw.lastreply != null
        ? String(raw.lastreply)
        : raw.date != null
          ? String(raw.date)
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
