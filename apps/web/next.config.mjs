/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@afyasecure/fhir-types", "@afyasecure/auth-rbac", "@afyasecure/database"],
  ...(process.env.BUILD_STANDALONE === "true" ? { output: "standalone" } : {}),
};

export default nextConfig;