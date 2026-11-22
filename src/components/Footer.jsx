import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import Logo from "./Logo";

const SOCIALS = [
  { href: "https://x.com", label: "X", Icon: FaXTwitter },
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-neutral text-neutral-content">
      <div className="page-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-content/70">
            Rent equipment from verified owners near you. Book for the days you need and pay securely online.
          </p>
          <ul className="mt-5 flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-content/20 text-neutral-content/80 transition-colors hover:border-secondary hover:bg-secondary hover:text-secondary-content"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/75">
            <li>
              <Link href="/" className="hover:text-neutral-content">
                Home
              </Link>
            </li>
            <li>
              <Link href="/equipment" className="hover:text-neutral-content">
                All Equipment
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="hover:text-neutral-content">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-neutral-content">
                List Your Equipment
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/75">
            {CATEGORIES.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/equipment?category=${encodeURIComponent(category.name)}`}
                  className="hover:text-neutral-content"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-content/75">
            <li className="flex items-start gap-2.5">
              <FiMapPin className="mt-0.5 size-4 shrink-0" /> House 12, Road 7, Dhanmondi, Dhaka 1205
            </li>
            <li className="flex items-center gap-2.5">
              <FiPhone className="size-4 shrink-0" /> +880 1700 000 000
            </li>
            <li className="flex items-center gap-2.5">
              <FiMail className="size-4 shrink-0" /> support@rentrig.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-content/15">
        <p className="page-container py-5 text-center text-sm text-neutral-content/60">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
