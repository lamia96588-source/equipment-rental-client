import jwt from "jsonwebtoken";
import { getUser } from "@/lib/session";

const EXPIRES_IN = 60 * 60; // one hour, in seconds

// Issues a short-lived JWT access token for the logged-in user.
// The browser sends it to the Express API as "Authorization: Bearer <token>".
export async function GET() {
  const user = await getUser();
  if (!user) {
    return Response.json({ message: "Not logged in" }, { status: 401 });
  }
  if (!process.env.JWT_SECRET) {
    return Response.json({ message: "JWT_SECRET is not configured" }, { status: 500 });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });

  return Response.json({ token, expiresIn: EXPIRES_IN }, { headers: { "Cache-Control": "no-store" } });
}
