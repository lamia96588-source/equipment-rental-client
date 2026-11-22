/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Keep Turbopack inside this project even if a parent folder has its own lockfile.
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
