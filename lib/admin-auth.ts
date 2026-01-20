import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

// シンプルなハッシュ化とハッシュ検証

export async function hashPassword(password: string): Promise<string> {
  // Use Web Crypto PBKDF2 to stay compatible with Edge runtime
  const enc = new TextEncoder();
  const salt = enc.encode(process.env.ADMIN_PASSWORD_SALT || "default-salt");
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-512",
    },
    keyMaterial,
    64 * 8,
  );

  return bufferToHex(new Uint8Array(derivedBits));
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

const getSecretKey = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || "your-secret-key",
  );

const bufferToHex = (buffer: Uint8Array): string =>
  Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export async function generateJWT(adminId: string): Promise<string> {
  return await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

export async function verifyJWT(
  token: string,
): Promise<{ adminId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.adminId) return null;
    return { adminId: payload.adminId as string };
  } catch (error) {
    return null;
  }
}

// Next.js API Route向けの管理者トークン検証ヘルパー
export async function verifyAdminToken(
  request: NextRequest,
): Promise<{ adminId: string } | null> {
  try {
    const token = request.cookies.get("adminToken")?.value;
    if (!token) return null;
    return await verifyJWT(token);
  } catch {
    return null;
  }
}
