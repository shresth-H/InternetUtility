export function formatJSON(input: string): { formatted: string; valid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed, null, 2), valid: true };
  } catch (e) {
    return { formatted: input, valid: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

export function validateJSON(input: string): { valid: boolean; error?: string; type?: string } {
  try {
    const parsed = JSON.parse(input);
    return { valid: true, type: Array.isArray(parsed) ? "array" : typeof parsed };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

export interface JWTPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  valid: boolean;
  error?: string;
}

export function decodeJWT(token: string): JWTPayload {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) throw new Error("JWT must have 3 parts");
    const decode = (part: string) => JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      header: decode(parts[0]),
      payload: decode(parts[1]),
      signature: parts[2],
      valid: true,
    };
  } catch (e) {
    return {
      header: {},
      payload: {},
      signature: "",
      valid: false,
      error: e instanceof Error ? e.message : "Invalid JWT",
    };
  }
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function encodeBase64(input: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(input)));
  }
  return Buffer.from(input, "utf-8").toString("base64");
}

export function decodeBase64(input: string): { result: string; error?: string } {
  try {
    if (typeof atob !== "undefined") {
      return { result: decodeURIComponent(escape(atob(input))) };
    }
    return { result: Buffer.from(input, "base64").toString("utf-8") };
  } catch (e) {
    return { result: "", error: e instanceof Error ? e.message : "Invalid Base64" };
  }
}

export function encodeURL(input: string): string {
  return encodeURIComponent(input);
}

export function decodeURL(input: string): { result: string; error?: string } {
  try {
    return { result: decodeURIComponent(input) };
  } catch (e) {
    return { result: "", error: e instanceof Error ? e.message : "Invalid URL encoding" };
  }
}
