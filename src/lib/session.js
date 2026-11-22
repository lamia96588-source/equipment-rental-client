import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

// Server-side helpers. Because the session is read from the cookie on the server,
// reloading a private page keeps the user on it instead of flashing the login page.

export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  if (!session?.user) return null;
  return { ...session.user, role: session.user.role || "customer" };
}

export async function requireUser(returnTo = "/dashboard") {
  const user = await getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function requireRole(roles, returnTo = "/dashboard") {
  const user = await requireUser(returnTo);
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect("/dashboard");
  return user;
}
