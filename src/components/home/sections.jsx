import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { FiArrowRight, FiCalendar, FiCreditCard, FiDollarSign, FiSearch, FiShield, FiUserCheck } from "react-icons/fi";
import { LuCamera, LuHardHat, LuProjector, LuTent, LuTractor, LuTruck } from "react-icons/lu";
import { CATEGORIES } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import EquipmentCard from "@/components/EquipmentCard";
import Avatar from "@/components/Avatar";
import { EmptyState } from "@/components/ui";

const CATEGORY_ICONS = {
  "Construction Equipment": LuHardHat,
  "Photography Equipment": LuCamera,
  "Vehicles & Transportation": LuTruck,
  "Agriculture Equipment": LuTractor,
  Electronics: LuProjector,
  "Event Equipment": LuTent,
};

function EquipmentGrid({ items, columns = "lg:grid-cols-3" }) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${columns}`}>
      {items.map((item, index) => (
        <Reveal key={item._id} delay={(index % 3) * 0.08} className="h-full">
          <EquipmentCard item={item} />
        </Reveal>
      ))}
    </div>
  );
}

export function FeaturedEquipment({ items }) {
  return (
    <section className="section-space">
      <div className="page-container">
        <SectionHeading
          eyebrow="Featured equipment"
          title="Ready to rent this week"
          lead="Six approved listings from verified owners, all available right now."
        >
          <Link href="/equipment" className="btn btn-outline btn-primary">
            View all equipment <FiArrowRight />
          </Link>
        </SectionHeading>

        {items.length ? (
          <EquipmentGrid items={items} />
        ) : (
          <EmptyState title="No equipment listed yet" text="Approved listings will appear here as soon as owners add them." />
        )}
      </div>
    </section>
  );
}

export function Categories({ counts = {} }) {
  return (
    <section className="section-space bg-base-200">
      <div className="page-container">
        <SectionHeading
          align="center"
          eyebrow="Categories"
          title="Find equipment by what you are working on"
          lead="From a weekend photo shoot to a full building site, start with the category that fits the job."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.name];
            const count = counts[category.name] || 0;
            return (
              <Reveal key={category.name} delay={(index % 3) * 0.08} className="h-full">
                <Link
                  href={`/equipment?category=${encodeURIComponent(category.name)}`}
                  className="card-surface group flex h-full items-start gap-4 p-6 transition-colors hover:border-primary"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                    <Icon className="size-7" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold">{category.name}</span>
                    <span className="mt-1 block text-sm text-base-content/65">{category.blurb}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      {count} {count === 1 ? "listing" : "listings"}
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    Icon: FiSearch,
    title: "Find the equipment",
    text: "Search by name or location, then narrow down by category, rental plan, price and availability.",
  },
  {
    Icon: FiCalendar,
    title: "Choose your dates",
    text: "Pick the start and end date and the quantity. The total is calculated before you confirm anything.",
  },
  {
    Icon: FiCreditCard,
    title: "Pay and collect",
    text: "Pay by card through Stripe. Your booking appears in your dashboard with its payment and booking status.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-space scroll-mt-16">
      <div className="page-container">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="Three steps from search to site"
          lead="Renting takes a few minutes, and you can follow every booking from your dashboard."
        />

        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.1} className="h-full">
              <li className="card-surface relative flex h-full flex-col p-7">
                <span className="font-display text-5xl font-extrabold text-base-300">0{index + 1}</span>
                <span className="absolute right-7 top-7 flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-content">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    Icon: FiDollarSign,
    title: "Affordable rental prices",
    text: "Pay a daily, weekly or monthly rate instead of buying equipment you will only use for one job.",
  },
  {
    Icon: FiUserCheck,
    title: "Verified equipment owners",
    text: "An admin reviews every listing before it goes live, and owner details are shown on each equipment page.",
  },
  {
    Icon: FiCalendar,
    title: "Flexible rental periods",
    text: "Book a single day or several months. You always see the number of days and the total before paying.",
  },
  {
    Icon: FiShield,
    title: "Secure payments",
    text: "Card details go straight to Stripe. Each payment is saved with its transaction ID for your records.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-space bg-neutral text-neutral-content">
      <div className="page-container grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
        <div>
          <p className="eyebrow">Why choose us</p>
          <h2 className="section-title mt-2 text-neutral-content">Renting should be simpler than buying.</h2>
          <p className="mt-4 leading-relaxed text-neutral-content/70">
            RentRig is built around the things that usually go wrong with rentals: unclear prices, unknown owners,
            fixed periods and risky payments.
          </p>
          <Link href="/equipment" className="btn btn-secondary mt-7">
            Browse equipment <FiArrowRight />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {BENEFITS.map(({ Icon, title, text }, index) => (
            <Reveal key={title} delay={(index % 2) * 0.08} className="h-full">
              <div className="h-full rounded-[1.25rem] border border-neutral-content/15 bg-neutral-content/5 p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-content">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-neutral-content">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-content/70">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecentlyAdded({ items }) {
  if (!items.length) return null;

  return (
    <section className="section-space">
      <div className="page-container">
        <SectionHeading
          eyebrow="Recently added"
          title="New on RentRig"
          lead="The latest listings approved by our team."
        >
          <Link href="/equipment?sort=recent" className="btn btn-outline btn-primary">
            See newest first <FiArrowRight />
          </Link>
        </SectionHeading>
        <EquipmentGrid items={items} columns="lg:grid-cols-4" />
      </div>
    </section>
  );
}

export function OwnerCallout() {
  return (
    <section className="section-space pt-0">
      <div className="page-container">
        <Reveal>
          <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-content md:grid-cols-[1.4fr_1fr] md:p-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">For equipment owners</p>
              <h2 className="section-title mt-2 text-primary-content">Equipment sitting idle? Put it to work.</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-primary-content/80">
                Create an owner account, add your equipment with photos and rental terms, and track bookings and
                monthly earnings from your own dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end">
              <Link href="/register" className="btn btn-secondary">
                List your equipment <FiArrowRight />
              </Link>
              <Link href="/#how-it-works" className="btn btn-outline border-primary-content/40 text-primary-content hover:bg-primary-content hover:text-primary">
                See how it works
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Reviews({ items }) {
  if (!items.length) return null;

  return (
    <section className="section-space bg-base-200">
      <div className="page-container">
        <SectionHeading
          align="center"
          eyebrow="Customer reviews"
          title="What renters say"
          lead="Feedback from customers after their rentals."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((review, index) => (
            <Reveal key={review._id} delay={(index % 4) * 0.07} className="h-full">
              <figure className="card-surface flex h-full flex-col p-6">
                <div className="flex gap-1 text-secondary" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, star) => (
                    <FaStar key={star} className={star < review.rating ? "" : "text-base-300"} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-base-content/80">
                  “{review.comment}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-base-300 pt-4">
                  <Avatar name={review.name} image={review.image} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{review.name}</span>
                    {review.equipmentName && (
                      <span className="block truncate text-xs text-base-content/60">Rented: {review.equipmentName}</span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
