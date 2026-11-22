import Link from "next/link";
import { FiXCircle } from "react-icons/fi";

export const metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <section className="page-container section-space">
      <div className="card-surface mx-auto max-w-xl p-6 text-center sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning/15 text-warning">
          <FiXCircle className="size-8" />
        </span>
        <h1 className="section-title mt-6">Payment was not completed</h1>
        <p className="section-lead mt-3">
          You have not been charged. Your booking is saved as unpaid, so you can pay for it or cancel it from My
          Rentals.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/my-rentals" className="btn btn-primary">
            Go to My Rentals
          </Link>
          <Link href="/equipment" className="btn btn-outline btn-primary">
            Browse equipment
          </Link>
        </div>
      </div>
    </section>
  );
}
