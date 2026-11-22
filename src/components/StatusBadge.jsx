const STYLES = {
  // equipment approval
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
  // booking
  confirmed: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
  // payment
  paid: "badge-success",
  unpaid: "badge-warning",
  // roles
  customer: "badge-neutral",
  owner: "badge-secondary",
  admin: "badge-primary",
};

export default function StatusBadge({ status, className = "" }) {
  const value = String(status || "unknown").toLowerCase();
  return (
    <span className={`badge badge-sm font-semibold capitalize ${STYLES[value] || "badge-ghost"} ${className}`}>
      {value}
    </span>
  );
}
