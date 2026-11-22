"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { confirmAction } from "@/lib/confirm";
import { RENTAL_UNIT } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import StatusBadge from "@/components/StatusBadge";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";
import { DataTable, PageHeader, Person } from "./parts";

export function MyEquipment() {
  const { data, loading, error, reload, setData } = useApi("/equipment/owner/mine");
  const [busyId, setBusyId] = useState("");

  const remove = async (item) => {
    const ok = await confirmAction({
      title: "Delete this equipment?",
      text: `${item.name} will be removed from the site. This cannot be undone.`,
      confirmText: "Yes, delete it",
    });
    if (!ok) return;
    setBusyId(item._id);
    try {
      await api(`/equipment/${item._id}`, { method: "DELETE" });
      setData((current) => current.filter((row) => row._id !== item._id));
      toast.success("Equipment deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <PageHeader title="My Equipment" text="Everything you have listed, with its approval status.">
        <Link href="/dashboard/add-equipment" className="btn btn-primary btn-sm">
          Add equipment
        </Link>
      </PageHeader>

      {loading ? (
        <Spinner label="Loading your equipment" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data.length ? (
        <EmptyState title="You have not listed any equipment" text="Add your first item and it will go to an admin for approval.">
          <Link href="/dashboard/add-equipment" className="btn btn-primary btn-sm">
            Add equipment
          </Link>
        </EmptyState>
      ) : (
        <DataTable columns={["Equipment name", "Category", "Rental price", "Available quantity", "Status", "Actions"]}>
          {data.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="flex min-w-52 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                  <span className="font-semibold">{item.name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap">{item.category}</td>
              <td className="whitespace-nowrap font-semibold">
                {formatMoney(item.price)} / {RENTAL_UNIT[item.rentalType]}
              </td>
              <td>{item.availableQuantity}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>
                <div className="flex gap-2">
                  <Link href={`/dashboard/equipment/${item._id}/edit`} className="btn btn-primary btn-xs">
                    Update
                  </Link>
                  <Link href={`/equipment/${item._id}`} className="btn btn-outline btn-xs">
                    View Details
                  </Link>
                  <button type="button" className="btn btn-outline btn-error btn-xs" disabled={busyId === item._id} onClick={() => remove(item)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}

// Shared by the owner's "My Equipment Rental" page and the admin's "All Rentals" page.
export function RentalsTable({ path, title, text, showOwner = false }) {
  const { data, loading, error, reload } = useApi(path);
  const [busyId, setBusyId] = useState("");

  const setStatus = async (booking, bookingStatus) => {
    if (bookingStatus === "cancelled") {
      const ok = await confirmAction({
        title: "Cancel this rental?",
        text: `${booking.equipmentName} for ${booking.customer?.name}. The units go back into stock.`,
        confirmText: "Yes, cancel it",
      });
      if (!ok) return;
    }
    setBusyId(booking._id);
    try {
      await api(`/bookings/${booking._id}/status`, { method: "PATCH", body: { bookingStatus } });
      toast.success(`Booking marked as ${bookingStatus}`);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  const columns = [
    "Customer information",
    ...(showOwner ? ["Owner information"] : []),
    showOwner ? "Equipment name" : "Equipment information",
    "Rental duration",
    "Required quantity",
    "Booking amount",
    "Payment status",
    "Booking status",
    "Actions",
  ];

  return (
    <>
      <PageHeader title={title} text={text} />

      {loading && !data ? (
        <Spinner label="Loading rentals" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data.length ? (
        <EmptyState title="No rentals yet" text="Bookings will appear here as soon as customers rent equipment." />
      ) : (
        <DataTable columns={columns}>
          {data.map((booking) => {
            const open = !["completed", "cancelled"].includes(booking.bookingStatus);
            const paid = booking.paymentStatus === "paid";
            return (
              <tr key={booking._id}>
                <td>
                  <Person name={booking.customer?.name} email={booking.customer?.email} />
                  <p className="text-xs text-base-content/60">{booking.contactNumber}</p>
                </td>
                {showOwner && (
                  <td>
                    <Person name={booking.owner?.name} email={booking.owner?.email} />
                  </td>
                )}
                <td>
                  <p className="min-w-40 font-semibold">{booking.equipmentName}</p>
                  {!showOwner && (
                    <p className="text-xs text-base-content/60">
                      {formatMoney(booking.unitPrice)} / {RENTAL_UNIT[booking.rentalType]}
                    </p>
                  )}
                </td>
                <td className="whitespace-nowrap">
                  {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                  <p className="text-xs text-base-content/60">
                    {booking.rentalDays} day{booking.rentalDays === 1 ? "" : "s"}
                  </p>
                </td>
                <td>{booking.quantity}</td>
                <td className="font-semibold">{formatMoney(booking.totalAmount)}</td>
                <td>
                  <StatusBadge status={booking.paymentStatus} />
                </td>
                <td>
                  <StatusBadge status={booking.bookingStatus} />
                </td>
                <td>
                  {open ? (
                    <div className="flex gap-2">
                      {paid && (
                        <button type="button" className="btn btn-primary btn-xs" disabled={busyId === booking._id} onClick={() => setStatus(booking, "completed")}>
                          Complete
                        </button>
                      )}
                      <button type="button" className="btn btn-outline btn-error btn-xs" disabled={busyId === booking._id} onClick={() => setStatus(booking, "cancelled")}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-base-content/50">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </DataTable>
      )}
    </>
  );
}
