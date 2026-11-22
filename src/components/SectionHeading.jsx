// One heading style for every section on the site.
export default function SectionHeading({ eyebrow, title, lead, align = "left", children }) {
  const centered = align === "center";

  return (
    <div
      className={`mb-10 flex flex-col gap-4 md:mb-12 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title mt-2">{title}</h2>
        {lead && <p className="section-lead mt-3">{lead}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
