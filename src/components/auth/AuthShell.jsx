import { FiCheckCircle } from "react-icons/fi";

const POINTS = [
  "Verified owners and clearly listed rental terms",
  "Daily, weekly and monthly rates with the total shown before you pay",
  "Card payments handled securely by Stripe",
];

// Two-column frame shared by the login and register pages.
export default function AuthShell({ title, lead, children }) {
  return (
    <section className="page-container section-space">
      <div className="card-surface mx-auto grid max-w-5xl overflow-hidden lg:grid-cols-2">
        <div className="relative hidden bg-primary p-10 text-primary-content lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">RentRig account</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-primary-content">
              One account to rent equipment or earn from your own.
            </h2>
          </div>
          <ul className="space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-primary-content/90">
                <FiCheckCircle className="mt-0.5 size-5 shrink-0 text-secondary" /> {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="section-title">{title}</h1>
          <p className="section-lead mt-2">{lead}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
