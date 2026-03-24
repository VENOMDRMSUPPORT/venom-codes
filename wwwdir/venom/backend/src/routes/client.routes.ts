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

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.post("/change-password", async (req, res, next) => {
  try {
    const body = changePasswordSchema.parse(req.body);
    await whmcsCall("ChangePassword", {
      clientid: req.clientId!,
      password2: body.newPassword,
      oldpassword: body.currentPassword,
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
    const stats = await whmcsCall<Record<string, unknown>>("GetClientsStats", {
      userid: req.clientId!,
    });
    res.json({
      activeServices: Number(stats.productsnum ?? stats.activeservices ?? 0),
      pendingInvoices: Number(stats.unpaidinvoices ?? stats.pendinginvoices ?? 0),
      pendingInvoicesAmount: String(stats.pendinginvoicesamount ?? "0"),
      openTickets: Number(stats.opentickets ?? 0),
      activeDomains: Number(stats.activedomains ?? stats.domainsnum ?? 0),
      recentInvoices: [],
      recentTickets: [],
      recentAnnouncements: [],
    });
  } catch (e) {
    next(e);
  }
});

export default router;
