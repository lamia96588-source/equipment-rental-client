import EquipmentForm from "@/components/dashboard/EquipmentForm";
import { PageHeader } from "@/components/dashboard/parts";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Add Equipment" };

export default async function AddEquipmentPage() {
  const user = await requireRole("owner");
  return (
    <>
      <PageHeader title="Add Equipment" text="List a new item for rent. An admin reviews it before it goes live." />
      <EquipmentForm owner={{ name: user.name, email: user.email, image: user.image }} backTo="/dashboard/my-equipment" />
    </>
  );
}
