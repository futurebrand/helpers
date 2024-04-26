

function getHostName(url) {
  if (!url) return ''
  return new URL(url).hostname
}

function handleSiteUrl(siteUrl) {
  if (process.env.AWS_BRANCH && process.env.AWS_BRANCH !== 'main') {
    const buildIds = String(process.env.CODEBUILD_BUILD_ID).split(':')[0]
    const pullId = process.env.AWS_PULL_REQUEST_ID
    if (buildIds && pullId) {
      return `https://pr-${pullId}.${buildIds}.amplifyapp.com`
    }
  }

  return siteUrl
}

/**
 * Build the headers configuration for the application
 * @param {import('./types').ICSPConfigs} cspConfigs - SRC Configs
 * @param {() => Promise<any[]>} buildConfig
 * @returns {() => Promise<any[]>}
 */
function getCSPConfiguration (cspConfigs, buildConfig) {
  return async () => {
    const DEFAULT_SRC = cspConfigs.defaultSrc || []
    const SCRIPTS_SRC = cspConfigs.scriptSrc || []
    const STYLES_SRC = cspConfigs.styleSrc || []
    const FRAMES_SRC = cspConfigs.frameSrc || []
    const IMAGES_SRC = cspConfigs.imgSrc || []
  
    const cspHeader =
      process.env.NODE_ENV === 'development'
        ? ''
        : `
      default-src 'self' ${DEFAULT_SRC.join(' ')};
      script-src 'self' 'unsafe-eval' 'unsafe-inline' ${SCRIPTS_SRC.join(' ')};
      style-src 'self' 'unsafe-inline' ${STYLES_SRC.join(' ')};
      frame-src 'self' ${FRAMES_SRC.join(' ')};
      img-src 'self' blob: data: ${IMAGES_SRC.join(' ')};
      font-src 'self';
      object-src 'self';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `
    
    const restHeaders = buildConfig ? await buildConfig() : []

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
        ],
      },
      ...restHeaders
    ]
  }

}

/**
 * @param {import('./types').HelpersConfig} nextConfig
 *
 * @returns {import('next').NextConfig}
 * */
const withHelpers = ({ futureBrandHelpers, ...nextConfig }) => {
  const {
    cms,
    cdn,
    domains,
    csp,
    redirects
  } = futureBrandHelpers
  const siteUrl = handleSiteUrl(futureBrandHelpers.siteUrl)
  const siteHostName = getHostName(siteUrl)

  return {
    ...nextConfig,
    reactStrictMode: nextConfig.reactStrictMode != null ? nextConfig.reactStrictMode : true,
    poweredByHeader: nextConfig.poweredByHeader != null ? nextConfig.poweredByHeader : false,
    env: {
      cmsType: cms.type,
      cmsUrl: cms.url,
      ...(cms.type === 'strapi' ? { cmsPublicToken: cms.token, adminEnvKey: cms.adminEnvKey ?? '' } : {}),
      siteUrl,
      ...(nextConfig.env ?? {}),
    },
    trailingSlash: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: getHostName(cms.url),
        },
        {
          protocol: 'http',
          hostname: getHostName(cms.url),
        },
        {
          protocol: 'http',
          hostname: siteHostName,
          port: '3000',
        },
        {
          protocol: 'https',
          hostname: siteHostName,
        },
        {
          protocol: 'https',
          hostname: cdn || siteHostName,
        },
        ...(domains ? 
          domains.map((domain) => (
            {
              /**
               * @type {any}
               */
              protocol: 'https',
              hostname: domain,
            }
            )) 
            : []
        ),
      ],
      deviceSizes: [375, 480, 768, 1024, 1280, 1360, 1440],
      minimumCacheTTL: 31536000
    },
    headers: csp ? getCSPConfiguration(csp, nextConfig.headers) : nextConfig.headers,
    async redirects() {
      const baseRedirects = nextConfig.redirects ? await nextConfig.redirects() : []
      return [
        ...(redirects ? redirects.map((redirect) => ({
          ...redirect,
          permanent: redirect.permanent != null ? redirect.permanent : true,
        })) : []),
        ...baseRedirects
      ]
    },
  }
}

module.exports = withHelpers
