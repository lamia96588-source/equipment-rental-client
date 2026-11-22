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
import { EmptyState, ErrorState, Pagination, Spinner } from "@/components/ui";
import { DataTable, PageHeader } from "./parts";

export function MyRentals() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi(`/bookings/mine?page=${page}&limit=8`);
  const [busyId, setBusyId] = useState("");

  const payNow = async (booking) => {
    setBusyId(booking._id);
    try {
      const result = await api(`/bookings/${booking._id}/pay`, { method: "POST" });
      window.location.assign(result.url);
    } catch (err) {
      toast.error(err.message);
      setBusyId("");
    }
  };

  const cancel = async (booking) => {
    const ok = await confirmAction({
      title: "Cancel this booking?",
      text: `${booking.equipmentName} has not been paid for. The booking will be removed.`,
      confirmText: "Yes, cancel it",
    });
    if (!ok) return;
    setBusyId(booking._id);
    try {
      await api(`/bookings/${booking._id}`, { method: "DELETE" });
      toast.success("Booking cancelled");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <PageHeader title="My Rentals" text="Every booking you have made, with its payment and booking status.">
        <Link href="/equipment" className="btn btn-primary btn-sm">
          Rent equipment
        </Link>
      </PageHeader>

      {loading && !data ? (
        <Spinner label="Loading your rentals" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data.items.length ? (
        <EmptyState title="No rentals yet" text="When you book equipment it will show up here.">
          <Link href="/equipment" className="btn btn-primary btn-sm">
            Browse equipment
          </Link>
        </EmptyState>
      ) : (
        <>
          <DataTable
            columns={["Equipment name", "Rental start date", "Rental end date", "Booking date", "Total amount", "Payment status", "Booking status", "Actions"]}
          >
            {data.items.map((booking) => (
              <tr key={booking._id}>
                <td>
                  <Link href={`/equipment/${booking.equipmentId}`} className="font-semibold hover:text-primary">
                    {booking.equipmentName}
                  </Link>
                  <p className="text-xs text-base-content/60">
                    {booking.quantity} unit{booking.quantity === 1 ? "" : "s"} · {booking.rentalDays} day
                    {booking.rentalDays === 1 ? "" : "s"}
                  </p>
                </td>
                <td className="whitespace-nowrap">{formatDate(booking.startDate)}</td>
                <td className="whitespace-nowrap">{formatDate(booking.endDate)}</td>
                <td className="whitespace-nowrap">{formatDate(booking.createdAt)}</td>
                <td className="font-semibold">{formatMoney(booking.totalAmount)}</td>
                <td>
                  <StatusBadge status={booking.paymentStatus} />
                </td>
                <td>
                  <StatusBadge status={booking.bookingStatus} />
                </td>
                <td>
                  {booking.paymentStatus === "unpaid" && booking.bookingStatus !== "cancelled" ? (
                    <div className="flex gap-2">
                      <button type="button" className="btn btn-primary btn-xs" disabled={busyId === booking._id} onClick={() => payNow(booking)}>
                        Pay now
                      </button>
                      <button type="button" className="btn btn-outline btn-error btn-xs" disabled={busyId === booking._id} onClick={() => cancel(booking)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-base-content/50">-</span>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
}

export function Favorites() {
  const { data, loading, error, reload, setData } = useApi("/favorites");
  const [busyId, setBusyId] = useState("");

  const remove = async (item) => {
    setBusyId(item._id);
    try {
      await api(`/favorites/${item._id}`, { method: "DELETE" });
      setData((current) => current.filter((row) => row._id !== item._id));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <PageHeader title="Favorites" text="Equipment you saved to rent later." />

      {loading ? (
        <Spinner label="Loading your favorites" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data.length ? (
        <EmptyState title="No favorites yet" text="Open any equipment page and choose Add to Favorites.">
          <Link href="/equipment" className="btn btn-primary btn-sm">
            Browse equipment
          </Link>
        </EmptyState>
      ) : (
        <DataTable columns={["Equipment", "Category", "Location", "Rental price", "Availability", "Actions"]}>
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
              <td className="whitespace-nowrap">{item.location}</td>
              <td className="whitespace-nowrap font-semibold">
                {formatMoney(item.price)} / {RENTAL_UNIT[item.rentalType]}
              </td>
              <td>
                <span className={`badge badge-sm font-semibold ${item.availableQuantity > 0 ? "badge-success" : "badge-error"}`}>
                  {item.availableQuantity > 0 ? `${item.availableQuantity} available` : "Unavailable"}
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  <Link href={`/equipment/${item._id}`} className="btn btn-primary btn-xs">
                    View Details
                  </Link>
                  <button type="button" className="btn btn-outline btn-error btn-xs" disabled={busyId === item._id} onClick={() => remove(item)}>
                    Remove
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
