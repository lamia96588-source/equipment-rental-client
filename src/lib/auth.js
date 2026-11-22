import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// Reuse one MongoDB client across hot reloads and serverless invocations.
const client =
  globalThis.__rentrigMongo ?? new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
globalThis.__rentrigMongo = client;

const db = client.db(process.env.DB_NAME || "rentrig");

const SIGNUP_ROLES = ["customer", "owner"];
const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { transaction: false }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: process.env.GOOGLE_CLIENT_ID
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {},

  user: {
    additionalFields: {
      // input: false means the browser can never send a role, at sign-up or later.
      role: { type: "string", required: false, defaultValue: "customer", input: false },
      // What the person picked on the register form; only read once, when the account is created.
      accountType: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, defaultValue: "", input: true },
      address: { type: "string", required: false, defaultValue: "", input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // People may sign up as a customer or an owner. Google sign-ups get "customer".
        // Only the configured admin email becomes an admin. After this, roles are
        // changed only by an admin through the Express API.
        before: async (user) => {
          let role = SIGNUP_ROLES.includes(user.accountType) ? user.accountType : "customer";
          if (adminEmail && user.email?.toLowerCase() === adminEmail) role = "admin";
          return { data: { ...user, role } };
        },
      },
    },
  },

  plugins: [nextCookies()],
});
