"use client";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

let cached = null;

export function clearAccessToken() {
  cached = null;
}

// Gets the JWT access token from /api/token and keeps it in memory until it is about to expire.
async function getAccessToken() {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const res = await fetch("/api/token", { cache: "no-store" });
  if (!res.ok) {
    cached = null;
    return null;
  }
  const data = await res.json();
  cached = { token: data.token, expiresAt: Date.now() + data.expiresIn * 1000 };
  return cached.token;
}

// Calls the Express API. Pass auth: false for public endpoints.
// Throws an Error with the server's message when the request fails.
export async function api(path, { method = "GET", body, auth = true } = {}) {
  const send = async () => {
    const headers = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) {
      const token = await getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  };

  let res;
  try {
    res = await send();
    if (res.status === 401 && auth) {
      // The token may have expired; get a fresh one and try once more.
      clearAccessToken();
      res = await send();
    }
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}
