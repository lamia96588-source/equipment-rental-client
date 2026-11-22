"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBox,
  FiClipboard,
  FiGrid,
  FiHeart,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPlusCircle,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { authClient, useSession } from "@/lib/auth-client";
import { clearAccessToken } from "@/lib/api";
import { ROLE_LABELS } from "@/lib/constants";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";

const MENUS = {
  customer: [
    { href: "/dashboard", label: "Overview", Icon: FiGrid },
    { href: "/dashboard/my-rentals", label: "My Rentals", Icon: FiClipboard },
    { href: "/dashboard/favorites", label: "Favorites", Icon: FiHeart },
    { href: "/dashboard/profile", label: "Profile", Icon: FiUser },
  ],
  owner: [
    { href: "/dashboard", label: "Overview", Icon: FiGrid },
    { href: "/dashboard/add-equipment", label: "Add Equipment", Icon: FiPlusCircle },
    { href: "/dashboard/my-equipment", label: "My Equipment", Icon: FiBox },
    { href: "/dashboard/equipment-rentals", label: "My Equipment Rental", Icon: FiClipboard },
    { href: "/dashboard/profile", label: "My Profile", Icon: FiUser },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", Icon: FiGrid },
    { href: "/dashboard/users", label: "All Users", Icon: FiUsers },
    { href: "/dashboard/all-equipment", label: "All Equipment", Icon: FiBox },
    { href: "/dashboard/all-rentals", label: "All Rentals", Icon: FiClipboard },
    { href: "/dashboard/profile", label: "My Profile", Icon: FiUser },
  ],
};

// Full-width dashboard frame: a fixed sidebar on desktop, a slide-in drawer on phones and tablets.
export default function DashboardShell({ initialUser, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const [open, setOpen] = useState(false);

  // Profile edits update the session, so prefer it once it has loaded. The role always comes from the server.
  const user = { ...initialUser, ...(data?.user ? { name: data.user.name, image: data.user.image } : {}) };
  const menu = MENUS[user.role] || MENUS.customer;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut();
    clearAccessToken();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  };

  const isActive = (href) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col bg-neutral text-neutral-content">
      <div className="flex h-16 items-center justify-between border-b border-neutral-content/15 px-5">
        <Logo />
        <button
          type="button"
          className="btn btn-ghost btn-circle btn-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <FiX className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 border-b border-neutral-content/15 px-5 py-5">
        <Avatar name={user.name} image={user.image} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{user.name}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
            {ROLE_LABELS[user.role]} account
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
        <ul className="space-y-1">
          {menu.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive(href)
                    ? "bg-secondary text-secondary-content"
                    : "text-neutral-content/75 hover:bg-neutral-content/10 hover:text-neutral-content"
                }`}
              >
                <Icon className="size-4.5 shrink-0" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-1 border-t border-neutral-content/15 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-content/75 hover:bg-neutral-content/10 hover:text-neutral-content"
        >
          <FiHome className="size-4.5" /> Back to website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-neutral-content/75 hover:bg-neutral-content/10 hover:text-neutral-content"
        >
          <FiLogOut className="size-4.5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-base-200">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="relative h-full w-72 max-w-[85vw]">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-circle lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu className="size-5" />
            </button>
            <p className="font-display text-lg font-bold">{ROLE_LABELS[user.role]} Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/profile" className="flex items-center gap-2" title="My profile">
              <Avatar name={user.name} image={user.image} size="sm" />
              <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">{user.name}</span>
            </Link>
          </div>
        </header>

        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
