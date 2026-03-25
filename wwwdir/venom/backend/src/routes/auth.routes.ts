import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { signToken, verifyToken } from "../lib/jwt.js";
import { mapWhmcsClientToProfile } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  phonenumber: z.string().optional(),
  address1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  companyname: z.string().nullish(),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const router: IRouter = Router();

router.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await whmcsCall<{
      result: string;
      userid?: string | number;
      message?: string;
    }>("ValidateLogin", {
      email: body.email,
      password2: body.password,
    });

    if (result.result !== "success" || result.userid == null) {
      res.status(401).json({
        error: "invalid_credentials",
        message: result.message ?? "Invalid email or password",
      });
      return;
    }

    const clientId = String(result.userid);
    const details = await whmcsCall<Record<string, unknown>>(
      "GetClientsDetails",
      {
        clientid: clientId,
        stats: false,
      },
    );

    const client = mapWhmcsClientToProfile(details);
    const token = signToken({ sub: clientId });
    res.json({ token, client });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", requireAuth, (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

router.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    await whmcsCall("AddClient", {
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      password2: body.password,
      phonenumber: body.phonenumber ?? "",
      address1: body.address1 ?? "",
      city: body.city ?? "",
      state: body.state ?? "",
      postcode: body.postcode ?? "",
      country: body.country ?? "",
      companyname: body.companyname ?? "",
    });

    const loginResult = await whmcsCall<{
      result: string;
      userid?: string | number;
    }>("ValidateLogin", {
      email: body.email,
      password2: body.password,
    });

    if (loginResult.result !== "success" || loginResult.userid == null) {
      res.status(201).json({
        success: true,
        message: "Account created. Please log in.",
      });
      return;
    }

    const clientId = String(loginResult.userid);
    const details = await whmcsCall<Record<string, unknown>>(
      "GetClientsDetails",
      {
        clientid: clientId,
        stats: false,
      },
    );
    const client = mapWhmcsClientToProfile(details);
    const token = signToken({ sub: clientId });
    res.status(201).json({ token, client });
  } catch (e) {
    next(e);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const body = forgotSchema.parse(req.body);
    try {
      await whmcsCall("ResetPassword", {
        email: body.email,
      });
    } catch {
      // ignore — do not leak whether the email exists
    }
    res.json({
      success: true,
      message:
        "If an account exists for that email, password reset instructions have been sent.",
    });
  } catch (e) {
    next(e);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const clientId = req.clientId!;
    const details = await whmcsCall<Record<string, unknown>>(
      "GetClientsDetails",
      {
        clientid: clientId,
        stats: false,
      },
    );
    res.json(mapWhmcsClientToProfile(details));
  } catch (e) {
    next(e);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({
        error: "unauthorized",
        message: "Missing token",
      });
      return;
    }
    const token = auth.slice("Bearer ".length).trim();
    const { sub } = verifyToken(token);
    const newToken = signToken({ sub });
    res.json({ token: newToken });
  } catch (e) {
    next(e);
  }
});

export default router;
