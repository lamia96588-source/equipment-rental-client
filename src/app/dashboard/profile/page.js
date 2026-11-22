import ProfileForm from "@/components/dashboard/ProfileForm";
import { requireUser } from "@/lib/session";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await requireUser("/dashboard/profile");
  return (
    <ProfileForm
      user={{
        name: user.name,
        email: user.email,
        image: user.image || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
      }}
    />
  );
}
