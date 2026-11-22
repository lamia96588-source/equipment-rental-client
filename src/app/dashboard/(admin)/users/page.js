import { AllUsers } from "@/components/dashboard/admin";
import { requireRole } from "@/lib/session";

export const metadata = { title: "All Users" };

export default async function AllUsersPage() {
  const user = await requireRole("admin");
  return <AllUsers currentUserId={user.id} />;
}
