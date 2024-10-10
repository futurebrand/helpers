const {
  getCSPConfiguration,
  getWebpackOtimization,
  getHostName,
  getSiteUrl,
  getDeployEnvironnement,
} = require('./utils')
const getCacheHandler = require('../cache-handler')

/**
 * @param {import('./types').NextWithHelpersConfig} nextConfig
 * @returns {import('next').NextConfig}
 */
const withHelpers = ({ futureBrandHelpers, ...nextConfig }) => {
  const { cms, cdn, domains, csp, redirects, revalidate } = futureBrandHelpers;
  const siteUrl = getSiteUrl(futureBrandHelpers.siteUrl);
  const siteHostName = getHostName(siteUrl);

  return {
    ...nextConfig,
    reactStrictMode:
      nextConfig.reactStrictMode != null ? nextConfig.reactStrictMode : true,
    poweredByHeader:
      nextConfig.poweredByHeader != null ? nextConfig.poweredByHeader : false,
    env: {
      deployEnv: getDeployEnvironnement(),
      fetchRevalidate: revalidate ? String(revalidate) : undefined,
      cmsType: cms.type,
      cmsUrl: cms.url,
      ...(cms.type === "strapi"
        ? { cmsPublicToken: cms.token, adminEnvKey: cms.adminEnvKey ?? "" }
        : {}),
      siteUrl,
      ...(nextConfig.env ?? {}),
    },
    trailingSlash: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: getHostName(cms.url),
        },
        {
          protocol: "http",
          hostname: getHostName(cms.url),
        },
        {
          protocol: "http",
          hostname: siteHostName,
          port: "3000",
        },
        {
          protocol: "https",
          hostname: siteHostName,
        },
        {
          protocol: "https",
          hostname: cdn || siteHostName,
        },
        ...(domains
          ? domains.map((domain) => ({
              /**
               * @type {any}
               */
              protocol: "https",
              hostname: domain,
            }))
          : []),
      ],
      deviceSizes: [375, 480, 768, 1024, 1280, 1360, 1440],
      minimumCacheTTL: 31536000,
    },
    cacheHandler: getCacheHandler(nextConfig.cacheHandler),
    webpack: (config, context) => {
      const { dev, isServer } = context;

      if (!isServer && !dev) {
        config.optimization = getWebpackOtimization(config.optimization);
      }

      if (nextConfig.webpack) {
        return nextConfig.webpack(config, context);
      }

      return config;
    },
    headers: csp
      ? getCSPConfiguration(csp, nextConfig.headers)
      : nextConfig.headers,
    async redirects() {
      const baseRedirects = nextConfig.redirects
        ? await nextConfig.redirects()
        : [];
      return [
        ...(redirects
          ? redirects.map((redirect) => ({
              ...redirect,
              permanent: redirect.permanent != null ? redirect.permanent : true,
            }))
          : []),
        ...baseRedirects,
      ];
    },
  };
};

module.exports = withHelpers;
