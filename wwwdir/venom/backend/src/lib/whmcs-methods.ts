/**
 * WHMCS API method name constants.
 *
 * Using constants instead of magic strings prevents typos and makes refactoring easier.
 * All method names match WHMCS External API documentation.
 *
 * @see https://developers.whmcs.com/api/
 * @module whmcs-methods
 */

/**
 * WHMCS API action methods organized by category.
 * Using const assertion ensures type safety and prevents modification.
 */
export const WHMCS_METHODS = {
  // Authentication & Client Methods
  VALIDATE_LOGIN: "ValidateLogin",
  ADD_CLIENT: "AddClient",
  GET_CLIENTS_DETAILS: "GetClientsDetails",
  UPDATE_CLIENT: "UpdateClient",
  GET_CONTACTS: "GetContacts",
  ADD_CONTACT: "AddContact",
  UPDATE_CONTACT: "UpdateContact",
  DELETE_CONTACT: "DeleteContact",
  GET_CREDITS: "GetCredits",

  // Ticket Methods
  GET_SUPPORT_DEPARTMENTS: "GetSupportDepartments",
  GET_SUPPORT_STATUSES: "GetSupportStatuses",
  GET_TICKET_COUNTS: "GetTicketCounts",
  GET_TICKET_PREDEFINED_CATS: "GetTicketPredefinedCats",
  GET_TICKET_PREDEFINED_REPLIES: "GetTicketPredefinedReplies",
  BLOCK_TICKET_SENDER: "BlockTicketSender",
  GET_TICKETS: "GetTickets",
  OPEN_TICKET: "OpenTicket",
  GET_TICKET: "GetTicket",
  ADD_TICKET_REPLY: "AddTicketReply",
  UPDATE_TICKET: "UpdateTicket",
  GET_TICKET_NOTES: "GetTicketNotes",
  ADD_TICKET_NOTE: "AddTicketNote",
  GET_TICKET_ATTACHMENT: "GetTicketAttachment",
  DELETE_TICKET_REPLY: "DeleteTicketReply",

  // Domain Methods
  DOMAIN_WHOIS: "DomainWhois",
  GET_CLIENTS_DOMAINS: "GetClientsDomains",
  DOMAIN_UPDATE_NAMESERVERS: "DomainUpdateNameservers",
  DOMAIN_RENEW: "DomainRenew",
  DOMAIN_UPDATE_AUTO_RENEW: "DomainUpdateAutoRenew",
  DOMAIN_TOGGLE_ID_PROTECT: "DomainToggleIdProtect",
  DOMAIN_UPDATE_LOCKING_STATUS: "DomainUpdateLockingStatus",
  DOMAIN_TRANSFER: "DomainTransfer",
  DOMAIN_GET_LOCKING_STATUS: "DomainGetLockingStatus",
  DOMAIN_GET_NAMESERVERS: "DomainGetNameservers",
  DOMAIN_GET_WHOIS_INFO: "DomainGetWhoisInfo",
  DOMAIN_UPDATE_WHOIS_INFO: "DomainUpdateWhoisInfo",
  DOMAIN_REQUEST_EPP: "DomainRequestEPP",
  DOMAIN_REGISTER: "DomainRegister",
  DOMAIN_RELEASE: "DomainRelease",

  // Invoice Methods
  GET_INVOICES: "GetInvoices",
  GET_INVOICE: "GetInvoice",

  // Product/Service Methods
  GET_CLIENTS_PRODUCTS: "GetClientsProducts",
  UPGRADE_PRODUCT: "UpgradeProduct",

  // Announcement Methods
  GET_ANNOUNCEMENTS: "GetAnnouncements",

  // Email Methods
  GET_EMAILS: "GetEmails",
  SEND_EMAIL: "SendEmail",
  SEND_ADMIN_EMAIL: "SendAdminEmail",
  GET_EMAIL_TEMPLATES: "GetEmailTemplates",

  // Admin Methods
  GET_ADMIN_DETAILS: "GetAdminDetails",
  GET_ADMIN_USERS: "GetAdminUsers",
  LOG_ACTIVITY: "LogActivity",

  // Server Methods
  GET_SERVERS: "GetServers",

  // System Methods
  GET_ACTIVITY_LOG: "GetActivityLog",
  GET_AUTOMATION_LOG: "GetAutomationLog",
  GET_CONFIGURATION_VALUE: "GetConfigurationValue",
  SET_CONFIGURATION_VALUE: "SetConfigurationValue",
  GEN_INVOICES: "GenInvoices",

  // Staff Methods
  GET_STAFF_ONLINE: "GetStaffOnline",

  // Client Notes
  ADD_CLIENT_NOTE: "AddClientNote",

  // Knowledge Base Methods
  GET_KNOWLEDGEBASE_ARTICLE: "GetKnowledgebaseArticle",
  GET_KNOWLEDGEBASE_CATEGORIES: "GetKnowledgebaseCategories",

  // Reset Password
  RESET_PASSWORD: "ResetPassword",
} as const;

/**
 * Type-safe union of all WHMCS method names.
 * Use this for function parameters that expect a valid WHMCS method.
 */
export type WhmcsMethodName = (typeof WHMCS_METHODS)[keyof typeof WHMCS_METHODS];

/**
 * Validates if a string is a valid WHMCS method name.
 * @param method - The method name to validate
 * @returns True if the method is valid
 */
export function isValidWhmcsMethod(method: string): method is WhmcsMethodName {
  return Object.values(WHMCS_METHODS).includes(method as WhmcsMethodName);
}

/**
 * Asserts that a string is a valid WHMCS method name.
 * Throws an error if invalid.
 * @param method - The method name to validate
 * @throws Error if the method is invalid
 */
export function assertValidWhmcsMethod(method: string): asserts method is WhmcsMethodName {
  if (!isValidWhmcsMethod(method)) {
    throw new Error(`Invalid WHMCS method: ${method}`);
  }
}
