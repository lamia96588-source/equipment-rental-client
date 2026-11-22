import { requireRole } from "@/lib/session";

// Only customer accounts can open the pages in this group; everyone else goes back to their own dashboard.
export default async function CustomerLayout({ children }) {
  await requireRole("customer");
  return children;
}
