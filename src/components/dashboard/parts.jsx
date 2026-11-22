// Layout pieces shared by every dashboard page.

export function PageHeader({ title, text, children }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-sm text-base-content/65">{text}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, Icon, tone = "primary" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/20 text-secondary-content",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
    warning: "bg-warning/20 text-warning",
  };

  return (
    <div className="card-surface flex h-full items-center gap-4 p-5">
      {Icon && (
        <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tones[tone] || tones.primary}`}>
          <Icon className="size-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm text-base-content/65">{label}</p>
        <p className="font-display text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}

export function Panel({ title, text, children, className = "" }) {
  return (
    <section className={`card-surface p-5 sm:p-6 ${className}`}>
      {title && <h2 className="text-lg font-bold">{title}</h2>}
      {text && <p className="mt-0.5 text-sm text-base-content/60">{text}</p>}
      <div className={title ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

// A table that scrolls sideways on small screens instead of breaking the page.
export function DataTable({ columns, children }) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-base-200 text-xs uppercase tracking-wide text-base-content/70">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Person({ name, email }) {
  return (
    <div className="min-w-36">
      <p className="font-semibold">{name || "-"}</p>
      <p className="text-xs text-base-content/60">{email}</p>
    </div>
  );
}
