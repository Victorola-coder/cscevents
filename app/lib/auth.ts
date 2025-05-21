import { compare, hash } from "bcrypt";
import jwt, { JwtPayload, Secret, VerifyOptions } from "jsonwebtoken";
import { prisma } from "./prisma";
import { NextRequest } from "next/server";

export const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // Using `as jwt.Secret` to satisfy TypeScript
  return jwt.sign({ userId }, secret as jwt.Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function verifyToken(token: string): { userId: string } | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    // Using `as jwt.Secret` to satisfy TypeScript
    return jwt.verify(token, secret as jwt.Secret) as { userId: string };
  } catch (error) {
    return null;
  }
}

// Middleware to authenticate requests
export async function authenticateUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  return user;
}

// Middleware to check if user is an admin
export async function checkAdmin(req: NextRequest) {
  const user = await authenticateUser(req);

  if (!user || !user.isAdmin) {
    return null;
  }

  return user;
}

/**
 * Verify JWT token from request header
 */
export const verifyAuthToken = (req: NextRequest) => {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret as Secret) as JwtPayload & {
      userId: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};
