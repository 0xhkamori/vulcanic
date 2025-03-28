/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  compiler: {
    styledComponents: true,
  },
  
  // Add configuration to resolve issues with fs and other Node.js modules
  webpack: (config, { isServer }) => {
    // Fixing node: scheme imports
    if (!isServer) {
      // Don't attempt to import node modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        crypto: false,
        stream: false,
        buffer: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
      };
      
      // Replace hebece with an empty module on the client side
      config.resolve.alias = {
        ...config.resolve.alias,
        hebece: false,
      };
    }
    
    // Ensure server-only code doesn't leak into client bundles
    if (!isServer) {
      // Mark certain files as external to prevent bundling them in the client
      config.externals = [
        ...config.externals || [],
        'hebece',
        'node-fetch'
      ];
    }
    
    return config;
  },
};

module.exports = withPWA(nextConfig); 


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "hkamori",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
