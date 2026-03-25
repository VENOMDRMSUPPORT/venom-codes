import { describe, expect, it, vi } from "vitest";
import { WhmcsApiError, whmcsCall } from "./whmcs-client.js";

describe("whmcsCall", () => {
  it("throws WhmcsApiError when result is error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => ({ result: "error", message: "bad" }),
      })),
    );
    await expect(whmcsCall("GetClients", {})).rejects.toThrow(WhmcsApiError);
  });

  it("returns JSON payload on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => ({ result: "success", clientid: "1" }),
      })),
    );
    const r = await whmcsCall<{ clientid: string }>("GetClients", {});
    expect(r.clientid).toBe("1");
  });
});
