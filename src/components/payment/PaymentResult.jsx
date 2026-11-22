"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { Spinner } from "@/components/ui";

// Runs on the payment success page. Asks the API to verify the Stripe session,
// which marks the booking as paid and saves the transaction.
export default function PaymentResult({ sessionId }) {
  const [state, setState] = useState({ status: "loading", data: null, message: "" });

  useEffect(() => {
    let cancelled = false;
    api("/payments/confirm", { method: "POST", body: { sessionId } })
      .then((data) => !cancelled && setState({ status: "success", data, message: "" }))
      .catch((error) => !cancelled && setState({ status: "error", data: null, message: error.message }));
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (state.status === "loading") return <Spinner label="Confirming your payment" />;

  if (state.status === "error") {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-error/10 text-error">
          <FiAlertTriangle className="size-8" />
        </span>
        <h1 className="section-title mt-6">We could not confirm this payment</h1>
        <p className="section-lead mt-3">{state.message}</p>
        <p className="mt-2 text-sm text-base-content/60">
          If you were charged, the booking will show as paid in My Rentals once the payment is confirmed.
        </p>
        <Link href="/dashboard/my-rentals" className="btn btn-primary mt-8">
          Go to My Rentals
        </Link>
      </div>
    );
  }

  const { booking, payment } = state.data;
  const rows = [
    { label: "Equipment", value: booking.equipmentName },
    { label: "Rental period", value: `${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}` },
    { label: "Quantity", value: booking.quantity },
    { label: "Amount paid", value: formatMoney(payment?.amount ?? booking.totalAmount) },
    { label: "Transaction ID", value: payment?.transactionId || booking.transactionId },
    { label: "Paid on", value: formatDate(payment?.createdAt || booking.paidAt) },
  ];

  return (
    <div className="text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
        <FiCheckCircle className="size-8" />
      </span>
      <h1 className="section-title mt-6">Payment successful</h1>
      <p className="section-lead mt-3">Your booking is confirmed. The owner has your contact number and delivery address.</p>

      <dl className="mt-8 rounded-[1.25rem] bg-base-200 p-5 text-left text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b border-base-300 py-2.5 last:border-0">
            <dt className="shrink-0 text-base-content/65">{row.label}</dt>
            <dd className="break-all text-right font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/my-rentals" className="btn btn-primary">
          View My Rentals
        </Link>
        <Link href="/equipment" className="btn btn-outline btn-primary">
          Rent more equipment
        </Link>
      </div>
    </div>
  );
}
