import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config.js";

export interface JwtPayload {
  sub: string;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.JWT_SECRET);
  if (typeof decoded !== "object" || decoded === null || !("sub" in decoded)) {
    throw new Error("Invalid token payload");
  }
  return { sub: String((decoded as { sub: unknown }).sub) };
}
