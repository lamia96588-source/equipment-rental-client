import { Suspense } from "react";
import EquipmentBrowser from "@/components/equipment/EquipmentBrowser";
import { Spinner } from "@/components/ui";

export const metadata = { title: "All Equipment" };

export default function AllEquipmentPage() {
  return (
    <section className="page-container section-space">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow">All equipment</p>
        <h1 className="section-title mt-2">Browse equipment for rent</h1>
        <p className="section-lead mt-3">
          Search by name or location, filter by category, rental type, price and availability, and sort the results.
        </p>
      </div>
      <Suspense fallback={<Spinner label="Loading equipment" />}>
        <EquipmentBrowser />
      </Suspense>
    </section>
  );
}
