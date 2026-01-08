import jwt, { Secret } from "jsonwebtoken";

export const generateToken = (id: string): string => {
  const secret: Secret = process.env.JWT_SECRET || "fallback-secret";
  // jwt types for expiresIn can vary between versions; cast to avoid strict mismatch
  const options = { expiresIn: process.env.JWT_EXPIRE || "7d" } as unknown as jwt.SignOptions;
  return jwt.sign({ id }, secret, options);
};

