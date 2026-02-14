import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@tibiarise/database", "@tibiarise/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tibiawiki.com.br",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "static.tibia.com",
        port: "",
        pathname: "/images/library/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
