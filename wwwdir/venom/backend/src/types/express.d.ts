export {};

declare global {
  namespace Express {
    interface Request {
      /** WHMCS client id (JWT `sub`) */
      clientId?: string;
    }
  }
}
