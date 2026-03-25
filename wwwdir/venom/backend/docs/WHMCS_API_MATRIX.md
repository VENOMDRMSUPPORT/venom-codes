# WHMCS External API ↔ Venom routes

Reference: [WHMCS API Index](https://developers.whmcs.com/api/api-index/) and per-action pages under `developers.whmcs.com/api-reference/`.

Columns: **WHMCS action** | **HTTP** | **Venom route** | **Auth** | **Notes**

## Auth (public)

| Action | Method | Route | Auth | Notes |
|--------|--------|-------|------|-------|
| ValidateLogin | POST | `/api/auth/login` | none | `password2` per [ValidateLogin](https://developers.whmcs.com/api-reference/validatelogin/) |
| AddClient | POST | `/api/auth/register` | none | |
| ResetPassword | POST | `/api/auth/forgot-password` | none | |
| GetClientsDetails | GET | `/api/auth/me` | JWT | |

## Client (JWT)

| Action | Method | Route | Auth | Notes |
|--------|--------|-------|------|-------|
| GetClientsDetails / UpdateClient | GET/PUT | `/api/client/profile` | JWT | |
| GetContacts, AddContact, UpdateContact, DeleteContact | * | `/api/client/contacts` | JWT | |
| UpdateClient | POST | `/api/client/change-password` | JWT | |
| UpdateClient | PUT | `/api/client/email-preferences` | JWT | |
| GetCredits | GET | `/api/client/credits` | JWT | |
| GetClientsStats | GET | `/api/client/dashboard` | JWT | |
| GetEmails | GET | `/api/client/emails` | JWT | |
| AddClientNote | POST | `/api/client/notes` | JWT | |

## Services (JWT)

| Action | Method | Route | Auth | Notes |
|--------|--------|-------|------|-------|
| GetClientsProducts | GET | `/api/services`, `/api/services/:id` | JWT | |
| GetClientsAddons | GET | `/api/services/:id/addons` | JWT | |
| AddCancelRequest, UpgradeProduct, Module*, UpdateClientProduct | POST/PUT | `/api/services/...` | JWT | |

## Domains (JWT + public whois)

| Action | Method | Route | Auth | Notes |
|--------|--------|-------|------|-------|
| DomainWhois | GET | `/api/domains/whois` | none | |
| GetClientsDomains | GET | `/api/domains` | JWT | |
| Domain* | * | `/api/domains/...` | JWT | See WHMCS Domain* actions |

## Invoices, quotes, orders, cart, tickets, billing, pay methods

Mapped 1:1 to WHMCS actions named in the corresponding `*.routes.ts` files. **CapturePayment** uses `invoiceid` ([docs](https://developers.whmcs.com/api-reference/capturepayment/)); Venom exposes `POST /api/paymethods/capture` with body `{ invoiceId, cvv? }`.

## Billing helpers

| Topic | Route | WHMCS | Notes |
|-------|-------|-------|-------|
| Cycles | GET `/api/billing/cycles` | *not an API action* | Returns standard WHMCS cycle names (see route implementation). |
| Gateways | GET `/api/billing/gateways` | GetPaymentMethods | Active gateways list ([GetPaymentMethods](https://developers.whmcs.com/api-reference/getpaymentmethods/)). |
| Stored cards/accounts | GET `/api/paymethods` | GetPayMethods | Per-client pay methods ([GetPayMethods](https://developers.whmcs.com/api-reference/getpaymethods/)). |

## Not implemented (WHMCS has no matching External API)

| Route | Status |
|-------|--------|
| `/api/knowledgebase/*` | `501` — use WHMCS KB UI, custom module, or CMS. |

## SSL certificate API

WHMCS SSL automation actions vary by version/module. Routes are disabled unless `VENOM_ENABLE_SSL_API=true`.

## Admin-only HTTP surface (requires `VENOM_ADMIN_API_KEY`)

Routers: `/api/admin`, `/api/system`, `/api/modules`, `/api/notifications`. These proxy powerful WHMCS actions; they are **not** mounted unless `VENOM_ADMIN_API_KEY` is set, and each request must send header `X-Admin-Key: <key>`.

## Webhooks (WHMCS → Venom)

`POST /api/webhooks/whmcs` with JSON body and HMAC-SHA256 in `X-Whmcs-Signature` when `VENOM_WEBHOOK_SECRET` is set. Sample PHP hook files live under `backend/docs/whmcs-hooks/`.
