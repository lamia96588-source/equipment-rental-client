const DAY_MS = 24 * 60 * 60 * 1000;

export function formatMoney(amount) {
  const value = Number(amount) || 0;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// Dates are stored at UTC midnight, so they are always shown in UTC to avoid off-by-one days.
export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

// Today as "YYYY-MM-DD" in the visitor's own timezone, for <input type="date">.
export function todayInputValue(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * DAY_MS);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Same rules as the server: both the start and end day count,
// and weekly / monthly rates are charged per started week / month.
export function estimateRental({ price, rentalType, startDate, endDate, quantity }) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (!startDate || !endDate || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return null;
  }
  const days = Math.round((end - start) / DAY_MS) + 1;
  const units = rentalType === "Weekly" ? Math.ceil(days / 7) : rentalType === "Monthly" ? Math.ceil(days / 30) : days;
  const qty = Math.max(1, Number(quantity) || 1);
  return { days, units, total: Math.round(price * units * qty * 100) / 100 };
}

export function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "U"
  );
}
