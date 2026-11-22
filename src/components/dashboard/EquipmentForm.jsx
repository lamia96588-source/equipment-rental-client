"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { CATEGORY_NAMES, CONDITIONS, RENTAL_TYPES } from "@/lib/constants";
import Avatar from "@/components/Avatar";
import ImageInput from "@/components/ImageInput";
import StatusBadge from "@/components/StatusBadge";
import { Field } from "@/components/ui";
import { Panel } from "./parts";

const BLANK = {
  name: "",
  description: "",
  category: "",
  location: "",
  price: "",
  rentalType: "Daily",
  availableQuantity: 1,
  condition: "Good",
  brand: "",
  model: "",
  image: "",
  terms: "",
};

// Used for both adding new equipment and editing an existing item.
export default function EquipmentForm({ item, owner, backTo }) {
  const router = useRouter();
  const editing = Boolean(item);
  const [form, setForm] = useState(() =>
    editing ? Object.fromEntries(Object.keys(BLANK).map((key) => [key, item[key] ?? BLANK[key]])) : BLANK
  );
  const [saving, setSaving] = useState(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const problem = !form.name.trim()
      ? "Equipment name is required"
      : !form.category
        ? "Please choose a category"
        : !form.location.trim()
          ? "Location is required"
          : !(Number(form.price) > 0)
            ? "Rental price must be greater than 0"
            : !Number.isInteger(Number(form.availableQuantity)) || Number(form.availableQuantity) < 0
              ? "Available quantity must be a whole number"
              : !form.image
                ? "Please upload an equipment image"
                : !form.description.trim()
                  ? "Description is required"
                  : "";
    if (problem) return toast.error(problem);

    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), availableQuantity: Number(form.availableQuantity) };
      if (editing) {
        await api(`/equipment/${item._id}`, { method: "PATCH", body });
        toast.success("Equipment updated");
      } else {
        await api("/equipment", { method: "POST", body });
        toast.success("Equipment added. It will be visible after an admin approves it.");
      }
      router.push(backTo);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_20rem]" noValidate>
      <Panel title="Equipment details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Equipment name" className="sm:col-span-2">
            <input type="text" required className="input input-bordered w-full" placeholder="e.g. Compact Mini Excavator 1.8T" value={form.name} onChange={update("name")} />
          </Field>
          <Field label="Category">
            <select required className="select select-bordered w-full" value={form.category} onChange={update("category")}>
              <option value="" disabled>
                Choose a category
              </option>
              {CATEGORY_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <input type="text" required className="input input-bordered w-full" placeholder="City or area" value={form.location} onChange={update("location")} />
          </Field>
          <Field label="Rental price ($)">
            <input type="number" required min="1" step="0.01" className="input input-bordered w-full" placeholder="0.00" value={form.price} onChange={update("price")} />
          </Field>
          <Field label="Rental type">
            <select className="select select-bordered w-full" value={form.rentalType} onChange={update("rentalType")}>
              {RENTAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Available quantity">
            <input type="number" required min="0" step="1" className="input input-bordered w-full" value={form.availableQuantity} onChange={update("availableQuantity")} />
          </Field>
          <Field label="Equipment condition">
            <select className="select select-bordered w-full" value={form.condition} onChange={update("condition")}>
              {CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <input type="text" className="input input-bordered w-full" placeholder="e.g. Kubota" value={form.brand} onChange={update("brand")} />
          </Field>
          <Field label="Model">
            <input type="text" className="input input-bordered w-full" placeholder="e.g. U17-3" value={form.model} onChange={update("model")} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea required rows={4} className="textarea textarea-bordered w-full" placeholder="What it is, what it is good for and what is included" value={form.description} onChange={update("description")} />
          </Field>
          <Field label="Rental terms and conditions" className="sm:col-span-2">
            <textarea rows={4} className="textarea textarea-bordered w-full" placeholder="ID requirements, damage policy, late return fees, cancellation rules" value={form.terms} onChange={update("terms")} />
          </Field>
          <div className="sm:col-span-2">
            <ImageInput label="Equipment image" value={form.image} onChange={(image) => setForm((current) => ({ ...current, image }))} />
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-6">
        <Panel title="Status">
          <StatusBadge status={editing ? item.status : "pending"} />
          <p className="mt-3 text-sm text-base-content/65">
            {editing
              ? "Only an admin can change the approval status."
              : "New equipment starts as pending and appears on the site once an admin approves it."}
          </p>
        </Panel>

        <Panel title="Owner information">
          <div className="flex items-center gap-3">
            <Avatar name={owner?.name} image={owner?.image} />
            <div className="min-w-0">
              <p className="truncate font-bold">{owner?.name}</p>
              <p className="truncate text-sm text-base-content/65">{owner?.email}</p>
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="loading loading-spinner loading-sm" />}
            {editing ? "Save changes" : "Add equipment"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => router.push(backTo)}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
