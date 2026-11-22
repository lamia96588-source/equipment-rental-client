"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiCalendar, FiSearch, FiShield } from "react-icons/fi";

const POPULAR = ["Excavator", "Camera", "Cargo van", "Projector"];

const FACTS = [
  { value: "6", label: "equipment categories" },
  { value: "3", label: "rental plans: daily, weekly, monthly" },
  { value: "100%", label: "of payments handled by Stripe" },
];

export default function Hero() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [search, setSearch] = useState("");

  const rise = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/equipment?search=${encodeURIComponent(query)}` : "/equipment");
  };

  return (
    <section className="overflow-hidden bg-base-200">
      <div className="page-container grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <motion.p {...rise(0)} className="eyebrow">
            Equipment rental marketplace
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            Rent the equipment you need, <span className="text-primary">only for the days you need it.</span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="section-lead mt-5 max-w-xl text-lg">
            RentRig connects you with verified owners of construction, photography, transport, farm, electronics and
            event equipment. Pick your dates, see the total up front and pay securely online.
          </motion.p>

          <motion.form
            {...rise(0.24)}
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-base-300 bg-base-100 p-2 sm:flex-row"
            role="search"
          >
            <label className="flex flex-1 items-center gap-2.5 px-3">
              <FiSearch className="size-5 shrink-0 text-base-content/50" />
              <span className="sr-only">Search equipment</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by equipment name or location"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-base-content/50"
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </motion.form>

          <motion.div {...rise(0.3)} className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-base-content/60">Popular:</span>
            {POPULAR.map((term) => (
              <Link
                key={term}
                href={`/equipment?search=${encodeURIComponent(term)}`}
                className="rounded-full border border-base-300 bg-base-100 px-3 py-1 font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </Link>
            ))}
          </motion.div>

          <motion.dl {...rise(0.38)} className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-base-300 pt-6">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="font-display text-3xl font-extrabold text-primary">{fact.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-base-content/65 sm:text-sm">{fact.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -right-6 -top-6 hidden size-40 rounded-[2rem] bg-secondary lg:block" aria-hidden="true" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-base-300 bg-base-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/seed/hero.jpg"
              alt="An excavator, a cargo van and a tractor lined up in an equipment rental yard"
              className="size-full object-cover"
              fetchPriority="high"
            />
          </div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3 shadow-xl sm:left-8"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
              <FiShield className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold">Verified owners</span>
              <span className="block text-xs text-base-content/60">Every listing is reviewed by an admin</span>
            </span>
          </motion.div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-4 top-6 hidden items-center gap-3 rounded-2xl bg-neutral px-4 py-3 text-neutral-content shadow-xl sm:flex"
          >
            <FiCalendar className="size-5 text-secondary" />
            <span>
              <span className="block text-sm font-bold">Flexible periods</span>
              <span className="block text-xs text-neutral-content/70">From one day to several months</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
