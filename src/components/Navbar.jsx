"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { authClient, useSession } from "@/lib/auth-client";
import { clearAccessToken } from "@/lib/api";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How It Works" },
];

export default function Navbar({ initialUser = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const [open, setOpen] = useState(false);

  // Until the client has checked the session, trust what the server rendered.
  const user = isPending ? initialUser : data?.user || null;

  const isActive = (href) => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    clearAccessToken();
    toast.success("You have been logged out");
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const linkClass = (href) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive(href) ? "bg-primary/10 text-primary" : "text-base-content/75 hover:bg-base-200 hover:text-base-content"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="page-container flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full pr-2" title={user.name}>
                  <Avatar name={user.name} image={user.image} size="sm" />
                  <span className="max-w-28 truncate text-sm font-semibold">{user.name?.split(" ")[0]}</span>
                </Link>
                <button type="button" onClick={handleLogout} className="btn btn-outline btn-primary btn-sm">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <ul className="page-container flex flex-col gap-1 py-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`block ${linkClass(link.href)}`} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link href="/dashboard" className={`block ${linkClass("/dashboard")}`} onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li className="mt-2 flex items-center justify-between gap-3 border-t border-base-300 pt-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <Avatar name={user.name} image={user.image} size="sm" />
                    <span className="truncate text-sm font-semibold">{user.name}</span>
                  </span>
                  <button type="button" onClick={handleLogout} className="btn btn-outline btn-primary btn-sm">
                    <FiLogOut /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-2 grid grid-cols-2 gap-2 border-t border-base-300 pt-3">
                <Link href="/login" className="btn btn-outline btn-primary btn-sm" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
