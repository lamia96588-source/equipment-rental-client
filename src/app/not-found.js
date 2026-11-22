import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-base-200 px-4 py-16 text-center">
      <Logo />
      <p className="mt-10 font-display text-8xl font-extrabold text-primary sm:text-9xl">404</p>
      <h1 className="section-title mt-4">This page is not in our yard</h1>
      <p className="section-lead mt-3 max-w-md">
        The link may be old, or the equipment may have been removed. Head back home or browse what is available.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/equipment" className="btn btn-outline btn-primary">
          Browse equipment
        </Link>
      </div>
    </main>
  );
}
