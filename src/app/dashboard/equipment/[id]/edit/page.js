import { notFound } from "next/navigation";
import EquipmentForm from "@/components/dashboard/EquipmentForm";
import { PageHeader } from "@/components/dashboard/parts";
import { privateGet } from "@/lib/server-api";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Update Equipment" };

// Owners can edit their own equipment; admins can edit any item. The API enforces the same rule.
export default async function EditEquipmentPage({ params }) {
  const { id } = await params;
  const user = await requireRole(["owner", "admin"]);
  const { data: item } = await privateGet(`/equipment/${id}`, user);
  if (!item) notFound();
  if (user.role === "owner" && item.owner?.email !== user.email) notFound();

  return (
    <>
      <PageHeader title="Update Equipment" text={item.name} />
      <EquipmentForm
        item={item}
        owner={item.owner}
        backTo={user.role === "admin" ? "/dashboard/all-equipment" : "/dashboard/my-equipment"}
      />
    </>
  );
}
