import jwt from "jsonwebtoken";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Server Components use these to read from the Express API.

// Public data. Returns the fallback instead of throwing, so a page still renders if the API is down.
export async function publicGet(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

// Private data for the logged-in user. Returns { data, status }.
export async function privateGet(path, user) {
  try {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: 60,
    });
    const res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    return { data: res.ok ? data : null, status: res.status };
  } catch {
    return { data: null, status: 503 };
  }
}
