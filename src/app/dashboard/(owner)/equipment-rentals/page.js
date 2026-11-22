import { RentalsTable } from "@/components/dashboard/owner";

export const metadata = { title: "My Equipment Rental" };

export default function EquipmentRentalsPage() {
  return (
    <RentalsTable
      path="/bookings/owner"
      title="My Equipment Rental"
      text="Bookings customers have made for your equipment."
    />
  );
}
