"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clearAccessToken } from "@/lib/api";
import { Field } from "@/components/ui";
import ImageInput from "@/components/ImageInput";
import GoogleButton from "./GoogleButton";

const ACCOUNT_TYPES = [
  { value: "customer", title: "Rent equipment", text: "Browse, book and pay for rentals" },
  { value: "owner", title: "List equipment", text: "Add your equipment and earn" },
];

function passwordProblem(password) {
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  return "";
}

export default function RegisterForm({ redirectTo }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "", role: "customer" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const problem = !form.name.trim()
      ? "Please enter your name"
      : !/^\S+@\S+\.\S+$/.test(form.email.trim())
        ? "Please enter a valid email address"
        : passwordProblem(form.password);

    if (problem) {
      setError(problem);
      toast.error(problem);
      return;
    }

    setError("");
    setLoading(true);

    const { error: authError } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.image || undefined,
      role: form.role,
    });

    if (authError) {
      const message = authError.message || "Could not create your account";
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    clearAccessToken();
    toast.success("Account created. Welcome to RentRig!");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold">I want to</legend>
          <div className="grid grid-cols-2 gap-3">
            {ACCOUNT_TYPES.map((type) => (
              <label
                key={type.value}
                className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                  form.role === type.value ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={type.value}
                  checked={form.role === type.value}
                  onChange={update("role")}
                  className="sr-only"
                />
                <span className="block text-sm font-bold">{type.title}</span>
                <span className="block text-xs text-base-content/65">{type.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Name">
          <input
            type="text"
            required
            autoComplete="name"
            className="input input-bordered w-full"
            placeholder="Your full name"
            value={form.name}
            onChange={update("name")}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            className="input input-bordered w-full"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
          />
        </Field>

        <ImageInput
          label="Photo"
          value={form.image}
          onChange={(image) => setForm((current) => ({ ...current, image }))}
        />

        <Field label="Password" hint="At least 6 characters, with one uppercase and one lowercase letter.">
          <span className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              className="input input-bordered w-full pr-12"
              placeholder="Create a password"
              value={form.password}
              onChange={update("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-base-content/60"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </span>
        </Field>

        {error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm font-medium text-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          Register
        </button>
      </form>

      <div className="divider text-xs text-base-content/50">OR</div>
      <GoogleButton redirectTo={redirectTo} />

      <p className="mt-6 text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-bold text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
