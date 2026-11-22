import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

// The same logo and wordmark is used in the navbar, the footer and the dashboard.
export default function Logo({ href = "/", className = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`} aria-label={`${SITE_NAME} home`}>
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
        <rect width="36" height="36" rx="10" className="fill-primary" />
        <path
          d="M11 25V11h7.2a4.6 4.6 0 0 1 1.9 8.8L23.5 25"
          fill="none"
          className="stroke-primary-content"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="25.5" cy="11.5" r="2.5" className="fill-secondary" />
      </svg>
      <span className="font-display text-xl font-extrabold tracking-tight">{SITE_NAME}</span>
    </Link>
  );
}
