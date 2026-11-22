import { RentalsTable } from "@/components/dashboard/owner";

export const metadata = { title: "All Rentals" };

export default function AllRentalsPage() {
  return (
    <RentalsTable
      path="/bookings/admin/all"
      title="All Rentals"
      text="Every rental booking on the platform. Complete or cancel a booking when needed."
      showOwner
    />
  );
}
