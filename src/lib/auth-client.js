"use client";

import { createAuthClient } from "better-auth/react";

// Talks to /api/auth on this same Next.js app.
export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut, updateUser } = authClient;
