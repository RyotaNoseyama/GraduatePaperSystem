import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

// シンプルなハッシュ化とハッシュ検証

export async function hashPassword(password: string): Promise<string> {
  // crypto.pbkdf2を使用してハッシュ化
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      process.env.ADMIN_PASSWORD_SALT || "default-salt",
      100000,
      64,
      "sha512",
      (err, hash) => {
        if (err) reject(err);
        else resolve(hash.toString("hex"));
      },
    );
  });
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

const getSecretKey = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

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
