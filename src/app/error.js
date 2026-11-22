"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown when a page throws while rendering.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="section-title mt-3">We could not load this page</h1>
      <p className="section-lead mt-3 max-w-md">
        This is a problem on our side. Try again, and if it keeps happening come back in a few minutes.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-outline btn-primary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
