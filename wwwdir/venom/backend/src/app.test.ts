import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { signToken } from "./lib/jwt.js";

function mockWhmcs(body: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      json: async () => body,
    })),
  );
}

describe("Express route ordering (WHMCS action names)", () => {
  beforeEach(() => {
    mockWhmcs({ result: "success", statuses: [] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("GET /api/tickets/statuses uses GetSupportStatuses", async () => {
    const app = createApp();
    const token = signToken({ sub: "1" });
    const res = await request(app)
      .get("/api/tickets/statuses")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalled();
    const init = fetchMock.mock.calls[0][1] as { body?: string };
    expect(init.body).toContain("GetSupportStatuses");
  });

  it("GET /api/products/pricing uses GetTLDPricing", async () => {
    const app = createApp();
    const res = await request(app).get("/api/products/pricing");
    expect(res.status).toBe(200);
    const fetchMock = vi.mocked(fetch);
    const init = fetchMock.mock.calls[0][1] as { body?: string };
    expect(init.body).toContain("GetTLDPricing");
  });

  it("GET /api/users/permissions-list uses GetPermissionsList", async () => {
    const app = createApp();
    const token = signToken({ sub: "1" });
    const res = await request(app)
      .get("/api/users/permissions-list")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    const fetchMock = vi.mocked(fetch);
    const init = fetchMock.mock.calls[0][1] as { body?: string };
    expect(init.body).toContain("GetPermissionsList");
  });
});

describe("webhook endpoint", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.VENOM_WEBHOOK_SECRET;
  });

  it("returns 503 when VENOM_WEBHOOK_SECRET is unset", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/webhooks/whmcs")
      .set("Content-Type", "application/json")
      .send("{}");
    expect(res.status).toBe(503);
  });
});
