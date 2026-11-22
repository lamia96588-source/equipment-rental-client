import { initials } from "@/lib/format";

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-2xl",
};

// Shows the user's photo, or their initials when there is no photo.
export default function Avatar({ name, image, size = "md", className = "" }) {
  const box = `${SIZES[size] || SIZES.md} shrink-0 rounded-full ${className}`;

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={name || "User"} className={`${box} object-cover`} referrerPolicy="no-referrer" />
    );
  }
  return (
    <span className={`${box} inline-flex items-center justify-center bg-primary font-bold text-primary-content`}>
      {initials(name)}
    </span>
  );
}
