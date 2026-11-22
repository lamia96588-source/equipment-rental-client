import { FiChevronLeft, FiChevronRight, FiInbox } from "react-icons/fi";

// Small building blocks shared by the public pages and the dashboard.

export function Spinner({ label = "Loading", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`} role="status">
      <span className="loading loading-spinner loading-lg text-primary" />
      <span className="text-sm font-medium text-base-content/60">{label}…</span>
    </div>
  );
}

export function EmptyState({ title, text, children }) {
  return (
    <div className="card-surface flex flex-col items-center px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-base-200 text-base-content/50">
        <FiInbox className="size-6" />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      {text && <p className="mt-1.5 max-w-md text-sm text-base-content/65">{text}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="card-surface flex flex-col items-center px-6 py-12 text-center">
      <h3 className="text-lg font-bold">Could not load this data</h3>
      <p className="mt-1.5 max-w-md text-sm text-base-content/65">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-primary btn-sm mt-5">
          Try again
        </button>
      )}
    </div>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  // Show the first, the last and the pages around the current one.
  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-sm btn-outline"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>
      {numbers.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - numbers[i - 1] > 1 && <span className="px-1 text-base-content/50">…</span>}
          <button
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`btn btn-sm ${n === page ? "btn-primary" : "btn-outline"}`}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-outline"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </nav>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="text-xs text-base-content/60">{hint}</span>}
    </label>
  );
}
