import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { mapWhmcsClientToProfile } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

const updateProfileSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email().optional(),
  companyname: z.string().nullish(),
  phonenumber: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
});

router.get("/profile", async (req, res, next) => {
  try {
    const details = await whmcsCall<Record<string, unknown>>(
      "GetClientsDetails",
      {
        clientid: req.clientId!,
        stats: false,
      },
    );
    res.json(mapWhmcsClientToProfile(details));
  } catch (e) {
    next(e);
  }
});

router.put("/profile", async (req, res, next) => {
  try {
    const body = updateProfileSchema.parse(req.body);
    const { companyname, ...rest } = body;
    await whmcsCall("UpdateClient", {
      clientid: req.clientId!,
      ...rest,
      ...(companyname !== undefined && companyname !== null
        ? { companyname }
        : {}),
    });
    const details = await whmcsCall<Record<string, unknown>>(
      "GetClientsDetails",
      {
        clientid: req.clientId!,
        stats: false,
      },
    );
    res.json(mapWhmcsClientToProfile(details));
  } catch (e) {
    next(e);
  }
});

router.get("/contacts", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetContacts", {
      userid: req.clientId!,
    });
    const contacts = result.contacts as
      | { contact?: unknown }
      | undefined;
    const raw = contacts?.contact;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((c: Record<string, unknown>) => ({
      id: String(c.id ?? ""),
      firstname: String(c.firstname ?? ""),
      lastname: String(c.lastname ?? ""),
      email: String(c.email ?? ""),
      phonenumber: c.phonenumber != null ? String(c.phonenumber) : undefined,
      subaccount:
        c.subaccount === true ||
        c.subaccount === "1" ||
        c.subaccount === "on",
    }));
    res.json(mapped);
  } catch (e) {
    next(e);
  }
});

const contactInputSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  phonenumber: z.string().optional(),
});

router.post("/contacts", async (req, res, next) => {
  try {
    const body = contactInputSchema.parse(req.body);
    await whmcsCall("AddContact", {
      clientid: req.clientId!,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      phonenumber: body.phonenumber ?? "",
    });
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.put("/contacts/:contactId", async (req, res, next) => {
  try {
    const body = contactInputSchema.parse(req.body);
    await whmcsCall("UpdateContact", {
      contactid: req.params.contactId,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      phonenumber: body.phonenumber ?? "",
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.delete("/contacts/:contactId", async (req, res, next) => {
  try {
    await whmcsCall("DeleteContact", {
      contactid: req.params.contactId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

// Note: WHMCS doesn't have a direct ChangePassword API for clients
// Password changes are typically done through the WHMCS client area interface
// or can be implemented using UpdateClient with password2 if supported
router.post("/change-password", async (req, res, next) => {
  try {
    const { newPassword } = req.body as { newPassword?: string };
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ 
        error: "bad_request", 
        message: "New password must be at least 6 characters" 
      });
      return;
    }
    
    // Using UpdateClient with password2 - this may require admin context
    // In client context, users typically use the password change form in client area
    await whmcsCall("UpdateClient", {
      clientid: req.clientId!,
      password2: newPassword,
    });
    
    res.json({ success: true, message: "Password updated" });
  } catch (e) {
    next(e);
  }
});

router.get("/email-preferences", async (req, res, next) => {
  try {
    const details = await whmcsCall<Record<string, unknown>>(
      "GetClientsDetails",
      {
        clientid: req.clientId!,
        stats: false,
      },
    );
    const prefs = details.email_preferences as Record<string, unknown> | undefined;
    if (prefs && typeof prefs === "object") {
      res.json({
        generalEmails: Boolean(prefs.general),
        invoiceEmails: Boolean(prefs.invoice),
        productEmails: Boolean(prefs.product),
        domainEmails: Boolean(prefs.domain),
        supportEmails: Boolean(prefs.support),
        marketingEmails: Boolean(prefs.affiliate),
      });
      return;
    }
    res.json({
      generalEmails: true,
      invoiceEmails: true,
      productEmails: true,
      domainEmails: true,
      supportEmails: true,
      marketingEmails: false,
    });
  } catch (e) {
    next(e);
  }
});

const emailPrefsSchema = z.object({
  generalEmails: z.boolean().optional(),
  invoiceEmails: z.boolean().optional(),
  productEmails: z.boolean().optional(),
  domainEmails: z.boolean().optional(),
  supportEmails: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

router.put("/email-preferences", async (req, res, next) => {
  try {
    const body = emailPrefsSchema.parse(req.body);
    await whmcsCall("UpdateClient", {
      clientid: req.clientId!,
      email_preferences: JSON.stringify({
        general: body.generalEmails,
        invoice: body.invoiceEmails,
        product: body.productEmails,
        domain: body.domainEmails,
        support: body.supportEmails,
        affiliate: body.marketingEmails,
      }),
    });
    res.json(body);
  } catch (e) {
    next(e);
  }
});

router.get("/credits", async (req, res, next) => {
  try {
    const result = await whmcsCall<{ credit?: string }>("GetCredits", {
      clientid: req.clientId!,
    });
    res.json({ credit: result.credit ?? "0.00" });
  } catch (e) {
    next(e);
  }
});

router.get("/dashboard", async (req, res, next) => {
  try {
    // Parallel fetch all dashboard data
    const [
      productsResult,
      invoicesResult,
      ticketCounts,
      domainsResult,
      ticketsResult,
      announcementsResult,
    ] = await Promise.allSettled([
      whmcsCall<Record<string, unknown>>("GetClientsProducts", {
        clientid: req.clientId!,
        limit: 5,
      }),
      whmcsCall<Record<string, unknown>>("GetInvoices", {
        userid: req.clientId!,
        limit: 5,
      }),
      whmcsCall<Record<string, unknown>>("GetTicketCounts", {
        clientid: req.clientId!,
      }),
      whmcsCall<Record<string, unknown>>("GetClientsDomains", {
        clientid: req.clientId!,
        limit: 100,
      }),
      whmcsCall<Record<string, unknown>>("GetTickets", {
        clientid: req.clientId!,
        limit: 5,
      }),
      whmcsCall<Record<string, unknown>>("GetAnnouncements", {
        limit: 3,
      }),
    ]);

    // Extract active services count
    let activeServices = 0;
    if (productsResult.status === "fulfilled") {
      const products = productsResult.value.products as { product?: unknown } | undefined;
      const raw = products?.product ?? productsResult.value.product;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      activeServices = list.filter(
        (p: Record<string, unknown>) => String(p.status ?? "") === "Active"
      ).length;
    }

    // Extract unpaid invoices and amount
    let pendingInvoices = 0;
    let pendingInvoicesAmount = "0";
    const recentInvoices: Array<{
      id: string;
      total: string;
      status: string;
      dueDate?: string;
    }> = [];

    if (invoicesResult.status === "fulfilled") {
      const invoices = invoicesResult.value.invoices as { invoice?: unknown } | undefined;
      const raw = invoices?.invoice ?? invoicesResult.value.invoice;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      for (const inv of list as Record<string, unknown>[]) {
        const status = String(inv.status ?? "");
        const isUnpaid = status === "Unpaid";
        if (isUnpaid && pendingInvoices < 5) {
          pendingInvoices++;
          const amount = String(inv.total ?? "0");
          pendingInvoicesAmount = String(
            parseFloat(pendingInvoicesAmount) + parseFloat(amount)
          );
        }
        if (recentInvoices.length < 5) {
          recentInvoices.push({
            id: String(inv.id ?? inv.invoiceid ?? ""),
            total: String(inv.total ?? "0"),
            status: status,
            dueDate: inv.duedate != null ? String(inv.duedate) : undefined,
          });
        }
      }
    }

    // Extract open tickets count
    let openTickets = 0;
    if (ticketCounts.status === "fulfilled") {
      openTickets = Number(ticketCounts.value.open ?? ticketCounts.value.total ?? 0);
    }

    // Extract active domains count
    let activeDomains = 0;
    if (domainsResult.status === "fulfilled") {
      const domains = domainsResult.value.domains as { domain?: unknown } | undefined;
      const raw = domains?.domain ?? domainsResult.value.domain;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      activeDomains = list.filter(
        (d: Record<string, unknown>) => String(d.status ?? "") === "Active"
      ).length;
    }

    // Extract recent tickets
    const recentTickets: Array<{
      id: string;
      subject: string;
      status: string;
      lastUpdated?: string;
    }> = [];

    if (ticketsResult.status === "fulfilled") {
      const tickets = ticketsResult.value.tickets as { ticket?: unknown } | undefined;
      const raw = tickets?.ticket ?? ticketsResult.value.ticket;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      for (const t of list as Record<string, unknown>[]) {
        if (recentTickets.length >= 5) break;
        recentTickets.push({
          id: String(t.id ?? t.tid ?? ""),
          subject: String(t.subject ?? ""),
          status: String(t.status ?? ""),
          lastUpdated:
            t.lastreply != null
              ? String(t.lastreply)
              : t.date != null
                ? String(t.date)
                : undefined,
        });
      }
    }

    // Extract recent announcements
    const recentAnnouncements: Array<{
      id: string;
      title: string;
      date?: string;
    }> = [];

    if (announcementsResult.status === "fulfilled") {
      const announcements = announcementsResult.value.announcements as {
        announcement?: unknown;
      } | undefined;
      const raw = announcements?.announcement ?? announcementsResult.value.announcement;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      for (const a of list as Record<string, unknown>[]) {
        if (recentAnnouncements.length >= 3) break;
        recentAnnouncements.push({
          id: String(a.id ?? ""),
          title: String(a.title ?? ""),
          date: a.date != null ? String(a.date) : undefined,
        });
      }
    }

    res.json({
      activeServices,
      pendingInvoices,
      pendingInvoicesAmount,
      openTickets,
      activeDomains,
      recentInvoices,
      recentTickets,
      recentAnnouncements,
    });
  } catch (e) {
    next(e);
  }
});

/** GET /client/emails - Get client email history */
router.get("/emails", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetEmails", {
      clientid: req.clientId!,
    });
    const emails = result.emails as { email?: unknown } | undefined;
    const raw = emails?.email;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((e: Record<string, unknown>) => ({
      id: String(e.id ?? ""),
      date: String(e.date ?? ""),
      subject: String(e.subject ?? ""),
      from_: String(e.from ?? ""),
      to: String(e.to ?? ""),
      body: String(e.message ?? ""),
    }));
    res.json({ emails: mapped });
  } catch (e) {
    next(e);
  }
});

/** POST /client/notes - Add a note to client account */
router.post("/notes", async (req, res, next) => {
  try {
    const { note } = req.body as { note?: string };
    if (!note) {
      res.status(400).json({ error: "bad_request", message: "Note content is required" });
      return;
    }
    await whmcsCall("AddClientNote", {
      userid: req.clientId!,
      notes: note,
    });
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
