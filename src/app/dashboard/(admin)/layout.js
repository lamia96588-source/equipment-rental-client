import { requireRole } from "@/lib/session";

// Only admin accounts can open the pages in this group; everyone else goes back to their own dashboard.
export default async function AdminLayout({ children }) {
  await requireRole("admin");
  return children;
}
