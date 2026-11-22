import Link from "next/link";
import { FiMapPin } from "react-icons/fi";
import { RENTAL_UNIT } from "@/lib/constants";
import { formatMoney } from "@/lib/format";

// Every card has the same image ratio and stretches to the same height as its neighbours.
export default function EquipmentCard({ item }) {
  const available = item.availableQuantity > 0;

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-base-100/95 px-3 py-1 text-xs font-bold text-base-content">
          {item.category}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
            available ? "bg-success text-success-content" : "bg-error text-error-content"
          }`}
        >
          {available ? `${item.availableQuantity} available` : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold" title={item.name}>
          {item.name}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-base-content/65">
          <FiMapPin className="size-4 shrink-0" /> <span className="truncate">{item.location}</span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p>
            <span className="font-display text-2xl font-extrabold text-primary">{formatMoney(item.price)}</span>
            <span className="text-sm text-base-content/65"> / {RENTAL_UNIT[item.rentalType] || "day"}</span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-base-content/50">
              {item.rentalType} rental
            </span>
          </p>
          <Link href={`/equipment/${item._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
