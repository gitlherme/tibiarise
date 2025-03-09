import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tibiawiki.com.br",
        port: "",
        pathname: "/images/**",
      }
    ],
  }
};

export default withNextIntl(nextConfig);
