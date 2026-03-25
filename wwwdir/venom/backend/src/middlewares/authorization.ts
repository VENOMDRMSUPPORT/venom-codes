import type { RequestHandler } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";

/**
 * Error response for authorization failures.
 * Uses 404 instead of 403 to avoid leaking information about resource existence.
 */
const notFoundResponse = {
  error: "not_found",
  message: "Resource not found",
};

/**
 * Verifies that a service belongs to the authenticated client.
 * This provides defense-in-depth beyond WHMCS API's clientid filtering.
 * 
 * @param clientId - The authenticated client's ID
 * @param serviceId - The service ID to verify ownership of
 * @returns true if the service belongs to the client, false otherwise
 */
async function verifyServiceOwnership(
  clientId: string,
  serviceId: string
): Promise<boolean> {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetClientsProducts",
      {
        clientid: clientId,
        serviceid: serviceId,
      }
    );
    
    // Check if we got any products back
    const products = result.products as { product?: unknown } | undefined;
    const raw = products?.product ?? result.product;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    
    // Verify the service exists and belongs to this client
    return list.some(
      (p: Record<string, unknown>) => String(p.id ?? "") === serviceId
    );
  } catch {
    return false;
  }
}

/**
 * Verifies that a domain belongs to the authenticated client.
 * This provides defense-in-depth beyond WHMCS API's clientid filtering.
 * 
 * @param clientId - The authenticated client's ID
 * @param domainId - The domain ID to verify ownership of
 * @returns true if the domain belongs to the client, false otherwise
 */
async function verifyDomainOwnership(
  clientId: string,
  domainId: string
): Promise<boolean> {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetClientsDomains",
      {
        clientid: clientId,
        domainid: domainId,
      }
    );
    
    // Check if we got any domains back
    const domains = result.domains as { domain?: unknown } | undefined;
    const raw = domains?.domain ?? result.domain;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    
    // Verify the domain exists and belongs to this client
    return list.some(
      (d: Record<string, unknown>) => String(d.id ?? "") === domainId
    );
  } catch {
    return false;
  }
}

/**
 * Verifies that a contact belongs to the authenticated client.
 * This provides defense-in-depth by checking contact ownership.
 * 
 * @param clientId - The authenticated client's ID
 * @param contactId - The contact ID to verify ownership of
 * @returns true if the contact belongs to the client, false otherwise
 */
async function verifyContactOwnership(
  clientId: string,
  contactId: string
): Promise<boolean> {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetContacts", {
      userid: clientId,
    });
    
    // Check if the contact exists in the client's contacts
    const contacts = result.contacts as { contact?: unknown } | undefined;
    const raw = contacts?.contact;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    
    return list.some(
      (c: Record<string, unknown>) => String(c.id ?? "") === contactId
    );
  } catch {
    return false;
  }
}

/**
 * Middleware factory that creates ownership validation middleware for services.
 * Verifies that the :serviceId parameter belongs to the authenticated client.
 * 
 * Usage:
 *   router.delete("/:serviceId", requireServiceOwnership, handler);
 */
export const requireServiceOwnership: RequestHandler = async (req, res, next) => {
  const clientId = req.clientId;
  const serviceId = req.params.serviceId;
  
  // Handle case where serviceId might be an array (though unlikely in this context)
  const serviceIdStr = Array.isArray(serviceId) ? serviceId[0] : serviceId;
  
  if (!clientId || !serviceIdStr) {
    res.status(400).json({
      error: "bad_request",
      message: "Missing required parameters",
    });
    return;
  }
  
  const isOwner = await verifyServiceOwnership(clientId, serviceIdStr);
  if (!isOwner) {
    res.status(404).json(notFoundResponse);
    return;
  }
  
  next();
};

/**
 * Middleware factory that creates ownership validation middleware for domains.
 * Verifies that the :domainId parameter belongs to the authenticated client.
 * 
 * Usage:
 *   router.post("/:domainId/renew", requireDomainOwnership, handler);
 */
export const requireDomainOwnership: RequestHandler = async (req, res, next) => {
  const clientId = req.clientId;
  const domainId = req.params.domainId;
  
  // Handle case where domainId might be an array (though unlikely in this context)
  const domainIdStr = Array.isArray(domainId) ? domainId[0] : domainId;
  
  if (!clientId || !domainIdStr) {
    res.status(400).json({
      error: "bad_request",
      message: "Missing required parameters",
    });
    return;
  }
  
  const isOwner = await verifyDomainOwnership(clientId, domainIdStr);
  if (!isOwner) {
    res.status(404).json(notFoundResponse);
    return;
  }
  
  next();
};

/**
 * Middleware factory that creates ownership validation middleware for contacts.
 * Verifies that the :contactId parameter belongs to the authenticated client.
 * 
 * Usage:
 *   router.put("/contacts/:contactId", requireContactOwnership, handler);
 */
export const requireContactOwnership: RequestHandler = async (req, res, next) => {
  const clientId = req.clientId;
  const contactId = req.params.contactId;
  
  // Handle case where contactId might be an array (though unlikely in this context)
  const contactIdStr = Array.isArray(contactId) ? contactId[0] : contactId;
  
  if (!clientId || !contactIdStr) {
    res.status(400).json({
      error: "bad_request",
      message: "Missing required parameters",
    });
    return;
  }
  
  const isOwner = await verifyContactOwnership(clientId, contactIdStr);
  if (!isOwner) {
    res.status(404).json(notFoundResponse);
    return;
  }
  
  next();
};

/**
 * Higher-order function that creates middleware to verify service ownership
 * for destructive operations (suspend, terminate, unsuspend, password change).
 * 
 * This is specifically for operations that modify or delete resources.
 */
export function requireServiceOwnershipForDestructive(): RequestHandler {
  return requireServiceOwnership;
}

/**
 * Higher-order function that creates middleware to verify domain ownership
 * for destructive operations (renew, transfer, release, etc.).
 */
export function requireDomainOwnershipForDestructive(): RequestHandler {
  return requireDomainOwnership;
}
