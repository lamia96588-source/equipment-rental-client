import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { getUser } from "@/lib/session";
import { safeRedirect } from "@/lib/redirect";

export const metadata = { title: "Register" };

export default async function RegisterPage({ searchParams }) {
  const redirectTo = safeRedirect((await searchParams).redirect);
  if (await getUser()) redirect(redirectTo);

  return (
    <AuthShell title="Create your account" lead="Join as a customer to rent, or as an owner to list your equipment.">
      <RegisterForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
