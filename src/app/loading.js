import { Spinner } from "@/components/ui";

// Shown while a page is loading.
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center">
      <Spinner label="Loading" />
    </div>
  );
}
