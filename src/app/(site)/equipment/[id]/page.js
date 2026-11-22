import Link from "next/link";
import { notFound } from "next/navigation";
import { FiBox, FiMapPin, FiTag } from "react-icons/fi";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import EquipmentActions from "@/components/equipment/EquipmentActions";
import { RENTAL_UNIT } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/format";
import { privateGet } from "@/lib/server-api";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Equipment Details" };

// Private route: visitors who are not logged in are sent to the login page and brought back afterwards.
export default async function EquipmentDetailsPage({ params }) {
  const { id } = await params;
  const user = await requireUser(`/equipment/${id}`);
  const { data: item } = await privateGet(`/equipment/${id}`, user);
  if (!item) notFound();

  const available = item.availableQuantity > 0;

  const specs = [
    { label: "Category", value: item.category },
    { label: "Rental type", value: item.rentalType },
    { label: "Location", value: item.location },
    { label: "Available quantity", value: item.availableQuantity },
    { label: "Condition", value: item.condition || "-" },
    { label: "Brand", value: item.brand || "-" },
    { label: "Model", value: item.model || "-" },
    { label: "Listed on", value: formatDate(item.createdAt) },
  ];

  return (
    <section className="page-container section-space">
      <nav className="mb-6 text-sm text-base-content/60" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/equipment" className="hover:text-primary">
          All Equipment
        </Link>{" "}
        / <span className="text-base-content">{item.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0">
          <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-base-300 bg-base-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="size-full object-cover" />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/75">{item.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold">Equipment information</h2>
            <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-4 border-b border-base-300 py-3 text-sm">
                  <dt className="text-base-content/65">{spec.label}</dt>
                  <dd className="text-right font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold">Rental terms and conditions</h2>
            <p className="mt-3 whitespace-pre-line rounded-[1.25rem] bg-base-200 p-5 text-sm leading-relaxed text-base-content/75">
              {item.terms || "The owner has not added specific terms. Standard RentRig rental terms apply."}
            </p>
          </div>
        </div>

        <aside>
          <div className="card-surface sticky top-24 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-outline gap-1.5">
                <FiTag className="size-3" /> {item.category}
              </span>
              {item.status !== "approved" && <StatusBadge status={item.status} />}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight">{item.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-base-content/65">
              <FiMapPin className="size-4" /> {item.location}
            </p>

            <p className="mt-6">
              <span className="font-display text-4xl font-extrabold text-primary">{formatMoney(item.price)}</span>
              <span className="text-base-content/65"> / {RENTAL_UNIT[item.rentalType]}</span>
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-base-content/50">
              {item.rentalType} rental rate
            </p>

            <p
              className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                available ? "bg-success/10 text-success" : "bg-error/10 text-error"
              }`}
            >
              <FiBox className="size-4" />
              {available
                ? `${item.availableQuantity} unit${item.availableQuantity === 1 ? "" : "s"} available to rent`
                : "All units are currently rented out"}
            </p>

            <div className="mt-6">
              <EquipmentActions
                role={user.role}
                item={{
                  _id: item._id,
                  name: item.name,
                  price: item.price,
                  rentalType: item.rentalType,
                  availableQuantity: item.availableQuantity,
                }}
              />
            </div>

            <div className="mt-8 border-t border-base-300 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-base-content/50">Owner information</h2>
              <div className="mt-4 flex items-center gap-3">
                <Avatar name={item.owner?.name} image={item.owner?.image} />
                <div className="min-w-0">
                  <p className="truncate font-bold">{item.owner?.name || "RentRig owner"}</p>
                  <p className="truncate text-sm text-base-content/65">{item.owner?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
