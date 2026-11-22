import { redirect } from "next/navigation";
import PaymentResult from "@/components/payment/PaymentResult";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Payment Successful" };

export default async function PaymentSuccessPage({ searchParams }) {
  const sessionId = (await searchParams).session_id;
  if (typeof sessionId !== "string" || !sessionId) redirect("/dashboard/my-rentals");
  await requireUser(`/payment/success?session_id=${encodeURIComponent(sessionId)}`);

  return (
    <section className="page-container section-space">
      <div className="card-surface mx-auto max-w-xl p-6 sm:p-10">
        <PaymentResult sessionId={sessionId} />
      </div>
    </section>
  );
}
