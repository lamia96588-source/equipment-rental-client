import { requireRole } from "@/lib/session";

// Only owner accounts can open the pages in this group; everyone else goes back to their own dashboard.
export default async function OwnerLayout({ children }) {
  await requireRole("owner");
  return children;
}
