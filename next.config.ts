import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Keep the exact URL shape of the WordPress site (every page ends with "/")
  trailingSlash: true,
  experimental: { globalNotFound: true },
  images: { unoptimized: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(media|icons)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Hebrew URLs from the WordPress site are kept exactly; they are served by ASCII route folders
  // (Next.js cannot prerender non-ASCII folder names).
  async rewrites() {
    const he = (path: string) => encodeURI(path);
    return {
      beforeFiles: [
        { source: he("/להקה-לחתונה"), destination: "/wedding-band-he" },
        { source: he("/להקה-לחתונה/"), destination: "/wedding-band-he/" },
        { source: he("/להקה-לחתונה-copy"), destination: "/bar-mitzva-he" },
        { source: he("/להקה-לחתונה-copy/"), destination: "/bar-mitzva-he/" },
      ],
    };
  },
  async redirects() {
    return [
      // Old WordPress URLs that have no page of their own anymore
      { source: "/hello-world", destination: "/", permanent: true },
      { source: "/testimonial/:slug*", destination: "/#testimonials", permanent: true },
      { source: "/en/category/:slug*", destination: "/en/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/feed", destination: "/", permanent: true },
      // the internal ASCII paths should never be indexed – send them to the real Hebrew URLs
      { source: "/wedding-band-he", destination: encodeURI("/להקה-לחתונה/"), permanent: true },
      { source: "/bar-mitzva-he", destination: encodeURI("/להקה-לחתונה-copy/"), permanent: true },
    ];
  },
};

export default nextConfig;
