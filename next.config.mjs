const API_URL = process.env.API_URL || "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Product photos uploaded in the dashboard live on the API server; serve them from this site's domain.
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` }];
  },
};

export default nextConfig;
