"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clearAccessToken } from "@/lib/api";
import { Field } from "@/components/ui";
import GoogleButton from "./GoogleButton";

export default function LoginForm({ redirectTo }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await authClient.signIn.email({
      email: form.email.trim(),
      password: form.password,
    });

    if (authError) {
      const message = authError.message || "Email or password is incorrect";
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    clearAccessToken();
    toast.success("Logged in successfully");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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

        <Field label="Password">
          <span className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="input input-bordered w-full pr-12"
              placeholder="Your password"
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

        <button type="submit" className="btn btn-primary w-full" disabled={loading || !form.email || !form.password}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          Login
        </button>
      </form>

      <div className="divider text-xs text-base-content/50">OR</div>
      <GoogleButton redirectTo={redirectTo} />

      <p className="mt-6 text-center text-sm text-base-content/70">
        New to RentRig?{" "}
        <Link
          href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-bold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
