/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@convergio/design-elements', '@convergio/design-tokens'],
  experimental: {
    externalDir: true,
  },
};
export default nextConfig;
