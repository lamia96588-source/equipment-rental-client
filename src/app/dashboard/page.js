import Overview from "@/components/dashboard/Overview";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  return <Overview role={user.role} name={user.name} />;
}
