"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import Avatar from "@/components/Avatar";
import ImageInput from "@/components/ImageInput";
import StatusBadge from "@/components/StatusBadge";
import { Field } from "@/components/ui";
import { PageHeader, Panel } from "./parts";

export default function ProfileForm({ user }) {
  const router = useRouter();
  const [saved, setSaved] = useState({
    name: user.name || "",
    image: user.image || "",
    phone: user.phone || "",
    address: user.address || "",
  });
  const [form, setForm] = useState(saved);
  const [saving, setSaving] = useState(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const changed = Object.keys(form).some((key) => form[key] !== saved[key]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.error("Name cannot be empty");

    setSaving(true);
    const next = {
      name: form.name.trim(),
      image: form.image.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };
    const { error } = await authClient.updateUser(next);
    setSaving(false);

    if (error) return toast.error(error.message || "Could not update your profile");
    setSaved(next);
    setForm(next);
    toast.success("Profile updated");
    router.refresh();
  };

  return (
    <>
      <PageHeader title="My Profile" text="Your account details. The email address cannot be changed." />

      <div className="grid gap-6 xl:grid-cols-[20rem_1fr]">
        <Panel>
          <div className="flex flex-col items-center text-center">
            <Avatar name={saved.name} image={saved.image} size="lg" />
            <h2 className="mt-4 text-xl font-bold">{saved.name}</h2>
            <p className="break-all text-sm text-base-content/65">{user.email}</p>
            <StatusBadge status={user.role} className="mt-3" />
          </div>
          <dl className="mt-6 space-y-3 border-t border-base-300 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-base-content/65">Account type</dt>
              <dd className="font-semibold">{ROLE_LABELS[user.role]}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-base-content/65">Phone</dt>
              <dd className="font-semibold">{saved.phone || "Not added"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-base-content/65">Address</dt>
              <dd className="text-right font-semibold">{saved.address || "Not added"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-base-content/65">Member since</dt>
              <dd className="font-semibold">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Update profile">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input type="text" required className="input input-bordered w-full" value={form.name} onChange={update("name")} />
            </Field>
            <Field label="Email">
              <input type="email" className="input input-bordered w-full" value={user.email} disabled readOnly />
            </Field>
            <Field label="Phone number">
              <input
                type="tel"
                className="input input-bordered w-full"
                placeholder="+880 1XXX XXXXXX"
                value={form.phone}
                onChange={update("phone")}
              />
            </Field>
            <Field label="Address">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="House, road, area, city"
                value={form.address}
                onChange={update("address")}
              />
            </Field>
            <div className="sm:col-span-2">
              <ImageInput
                label="Profile image"
                value={form.image}
                onChange={(image) => setForm((current) => ({ ...current, image }))}
              />
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" className="btn btn-ghost" disabled={!changed || saving} onClick={() => setForm(saved)}>
                Reset
              </button>
              <button type="submit" className="btn btn-primary" disabled={!changed || saving}>
                {saving && <span className="loading loading-spinner loading-sm" />}
                Save changes
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </>
  );
}
