const nextConfig = {
  experimental: { externalDir: true },
  transpilePackages: [
    '@convergio/starter-shared-shell',
    '@convergio/design-elements',
    '@convergio/design-tokens',
  ],
};

export default nextConfig;
