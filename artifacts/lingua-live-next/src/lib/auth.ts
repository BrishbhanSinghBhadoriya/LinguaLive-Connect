/**
 * Lightweight auth helpers — no extra npm packages.
 * Uses Node 18+ built-in Web Crypto for password hashing (PBKDF2)
 * and HMAC-SHA256 JWT signing.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

function u8ToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToU8(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g) ?? [];
  return new Uint8Array(pairs.map(h => parseInt(h, 16)));
}

/** Always returns a plain ArrayBuffer — avoids SharedArrayBuffer type issues */
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  const buf = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buf).set(u8);
  return buf;
}

// ─── Password Hashing (PBKDF2) ───────────────────────────────────────────────

async function pbkdf2Hash(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: toArrayBuffer(salt), iterations: 100_000, hash: "SHA-256" },
    key,
    256
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2Hash(password, salt);
  return `${u8ToHex(salt)}:${u8ToHex(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = stored.split(":");
    const salt = hexToU8(saltHex);
    const hash = await pbkdf2Hash(password, salt);
    return u8ToHex(hash) === hashHex;
  } catch {
    return false;
  }
}

// ─── JWT (HMAC-SHA256) ────────────────────────────────────────────────────────

function b64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function decodeB64url(str: string): string {
  const pad = str.length + ((4 - (str.length % 4)) % 4);
  return atob(str.replace(/-/g, "+").replace(/_/g, "/").padEnd(pad, "="));
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return u8ToHex(new Uint8Array(sig));
}

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET env variable is not set");
  return s;
}

export async function signToken(
  payload: { id: string; email: string },
  expiresInDays = 7
): Promise<string> {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 86400;
  const body = b64url(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }));
  const sig = await hmacSign(getJwtSecret(), `${header}.${body}`);
  return `${header}.${body}.${sig}`;
}

export async function verifyToken(
  token: string
): Promise<{ id: string; email: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = await hmacSign(getJwtSecret(), `${header}.${body}`);
    if (expected !== sig) return null;
    const payload = JSON.parse(decodeB64url(body));
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}
