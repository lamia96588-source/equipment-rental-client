"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

// Lets the user upload a picture to imgbb, or paste a direct image link.
// Calls onChange with the final image URL.
export default function ImageInput({ value, onChange, label = "Image" }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5 MB");
    if (!IMGBB_KEY) return toast.error("Image upload is not configured. Paste an image link instead.");

    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: form });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error?.message || "Upload failed");
      onChange(data.data.display_url || data.data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-base-300 bg-base-200">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="size-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <FiUploadCloud className="size-7 text-base-content/40" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            disabled={uploading}
            onChange={(event) => upload(event.target.files?.[0])}
          />
          <input
            type="url"
            className="input input-bordered w-full"
            placeholder="or paste a direct image link (https://...)"
            value={value || ""}
            onChange={(event) => onChange(event.target.value.trim())}
          />
        </div>
      </div>
      {uploading && <span className="text-xs text-base-content/60">Uploading to imgbb…</span>}
    </div>
  );
}
