"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiCalendar, FiX } from "react-icons/fi";
import { api } from "@/lib/api";
import { RENTAL_UNIT } from "@/lib/constants";
import { estimateRental, formatMoney, todayInputValue } from "@/lib/format";
import { Field } from "@/components/ui";

// Favorite button and the Book Now modal on the equipment details page.
// Only customers can book or save; owners and admins see a short note instead.
export default function EquipmentActions({ item, role }) {
  const dialogRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    startDate: todayInputValue(),
    endDate: todayInputValue(1),
    quantity: 1,
    contactNumber: "",
    deliveryAddress: "",
    notes: "",
  });

  const isCustomer = role === "customer";
  const available = item.availableQuantity > 0;

  useEffect(() => {
    if (!isCustomer) return;
    api(`/favorites/check/${item._id}`)
      .then((data) => setIsFavorite(data.isFavorite))
      .catch(() => {});
  }, [isCustomer, item._id]);

  const toggleFavorite = async () => {
    setFavoriteBusy(true);
    try {
      if (isFavorite) {
        await api(`/favorites/${item._id}`, { method: "DELETE" });
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api("/favorites", { method: "POST", body: { equipmentId: item._id } });
        setIsFavorite(true);
        toast.success("Saved to favorites");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFavoriteBusy(false);
    }
  };

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const estimate = estimateRental({ ...form, price: item.price, rentalType: item.rentalType });
  const quantity = Number(form.quantity);
  const quantityOk = Number.isInteger(quantity) && quantity >= 1 && quantity <= item.availableQuantity;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!estimate) return toast.error("The end date must be on or after the start date");
    if (!quantityOk) return toast.error(`Choose a quantity from 1 to ${item.availableQuantity}`);
    if (!form.contactNumber.trim()) return toast.error("Please enter a contact number");
    if (!form.deliveryAddress.trim()) return toast.error("Please enter a delivery address");

    setSubmitting(true);
    try {
      const data = await api("/bookings/checkout", {
        method: "POST",
        body: { ...form, quantity, equipmentId: item._id },
      });
      toast.success("Booking saved. Taking you to secure payment…");
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.message);
      setSubmitting(false);
    }
  };

  if (!isCustomer) {
    return (
      <p className="rounded-xl bg-base-200 px-4 py-3 text-sm text-base-content/75">
        Booking and favorites are available to customer accounts. You are signed in as{" "}
        <strong className="capitalize">{role}</strong>.{" "}
        <Link href="/dashboard" className="font-bold text-primary hover:underline">
          Go to dashboard
        </Link>
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="btn btn-primary flex-1"
          disabled={!available}
          onClick={() => dialogRef.current?.showModal()}
        >
          <FiCalendar /> {available ? "Book Now" : "Currently unavailable"}
        </button>
        <button
          type="button"
          className="btn btn-outline btn-primary"
          onClick={toggleFavorite}
          disabled={favoriteBusy}
          aria-pressed={isFavorite}
        >
          {isFavorite ? <FaHeart className="text-accent" /> : <FaRegHeart />}
          {isFavorite ? "Saved" : "Add to Favorites"}
        </button>
      </div>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Book this equipment</h2>
              <p className="mt-1 text-sm text-base-content/65">
                {item.name} · {formatMoney(item.price)} per {RENTAL_UNIT[item.rentalType]}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-circle btn-sm"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close booking form"
            >
              <FiX className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
            <Field label="Rental start date">
              <input
                type="date"
                required
                min={todayInputValue()}
                className="input input-bordered w-full"
                value={form.startDate}
                onChange={update("startDate")}
              />
            </Field>
            <Field label="Rental end date">
              <input
                type="date"
                required
                min={form.startDate || todayInputValue()}
                className="input input-bordered w-full"
                value={form.endDate}
                onChange={update("endDate")}
              />
            </Field>
            <Field label="Required quantity" hint={`${item.availableQuantity} available`}>
              <input
                type="number"
                required
                min="1"
                max={item.availableQuantity}
                className="input input-bordered w-full"
                value={form.quantity}
                onChange={update("quantity")}
              />
            </Field>
            <Field label="Contact number">
              <input
                type="tel"
                required
                autoComplete="tel"
                className="input input-bordered w-full"
                placeholder="+880 1XXX XXXXXX"
                value={form.contactNumber}
                onChange={update("contactNumber")}
              />
            </Field>
            <Field label="Delivery address" className="sm:col-span-2">
              <input
                type="text"
                required
                autoComplete="street-address"
                className="input input-bordered w-full"
                placeholder="House, road, area, city"
                value={form.deliveryAddress}
                onChange={update("deliveryAddress")}
              />
            </Field>
            <Field label="Additional notes (optional)" className="sm:col-span-2">
              <textarea
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="Delivery time, site access, anything the owner should know"
                value={form.notes}
                onChange={update("notes")}
              />
            </Field>

            <div className="rounded-xl bg-base-200 p-4 sm:col-span-2">
              {estimate ? (
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-base-content/65">Rental duration</dt>
                    <dd className="font-semibold">
                      {estimate.days} {estimate.days === 1 ? "day" : "days"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-base-content/65">
                      {formatMoney(item.price)} × {estimate.units} {RENTAL_UNIT[item.rentalType]}
                      {estimate.units === 1 ? "" : "s"} × {quantityOk ? quantity : 1} unit{quantity === 1 ? "" : "s"}
                    </dt>
                    <dd className="font-semibold">{formatMoney(estimate.total)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-base-300 pt-2 text-base">
                    <dt className="font-bold">Total rental amount</dt>
                    <dd className="font-display text-xl font-extrabold text-primary">{formatMoney(estimate.total)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-error">Choose an end date that is on or after the start date.</p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
              <button type="button" className="btn btn-ghost" onClick={() => dialogRef.current?.close()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting || !estimate || !quantityOk}>
                {submitting && <span className="loading loading-spinner loading-sm" />}
                Confirm and pay
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </>
  );
}
