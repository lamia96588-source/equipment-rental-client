import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { getUser } from "@/lib/session";
import { safeRedirect } from "@/lib/redirect";

export const metadata = { title: "Login" };

export default async function LoginPage({ searchParams }) {
  const redirectTo = safeRedirect((await searchParams).redirect);
  if (await getUser()) redirect(redirectTo);

  return (
    <AuthShell title="Welcome back" lead="Log in to manage your rentals, favorites and listings.">
      <LoginForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
