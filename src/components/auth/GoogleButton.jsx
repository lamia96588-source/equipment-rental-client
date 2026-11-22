"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

// New Google users are created with the Customer role (see lib/auth.js).
export default function GoogleButton({ redirectTo = "/dashboard" }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirectTo });
    if (error) {
      toast.error(error.message || "Google login is not available right now");
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleClick} disabled={loading} className="btn btn-outline w-full">
      {loading ? <span className="loading loading-spinner loading-sm" /> : <FcGoogle className="size-5" />}
      Continue with Google
    </button>
  );
}
