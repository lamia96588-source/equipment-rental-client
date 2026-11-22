import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/session";

// Private area. The session is checked on the server, so a reload never bounces a logged-in user to the login page.
export default async function DashboardLayout({ children }) {
  const user = await requireUser("/dashboard");
  const initialUser = { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };

  return <DashboardShell initialUser={initialUser}>{children}</DashboardShell>;
}
