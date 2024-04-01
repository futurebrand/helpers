/**
 * This function is used to get the next build configuration
 * @param {import('./types').IBuildConfig} buildConfigs - The build configuration object
 * @param {any} extraConfigs - Extra configurations
 */
function getNextBuildConfig (buildConfigs, extraConfigs = {}) {
  const {
    cdnImageUrl,
    cmsBaseUrl,
    cmsFrontendToken,
    headers,
    imageDomains,
    redirects,
    envs
  } = buildConfigs
  let { siteUrl } = buildConfigs

  const cmsHostName = new URL(cmsBaseUrl).hostname
  const cdnImageUrlHostName = cdnImageUrl ? new URL(cdnImageUrl).hostname : ''

  let siteHostName = new URL(siteUrl).hostname

  if (process.env.AWS_BRANCH && process.env.AWS_BRANCH !== 'main') {
    const buildIds = String(process.env.CODEBUILD_BUILD_ID).split(':')[0]
    const pullId = process.env.AWS_PULL_REQUEST_ID
    if (buildIds && pullId) {
      siteUrl = `https://pr-${pullId}.${buildIds}.amplifyapp.com`
      siteHostName = new URL(siteUrl).hostname
    }
  }
  
  return {
    reactStrictMode: true,
    poweredByHeader: false,
    env: {
      cmsBaseUrl,
      siteUrl,
      cmsFrontendToken,
      ...(envs ?? {})
    },
    trailingSlash: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: cmsHostName,
        },
        {
          protocol: 'http',
          hostname: cmsHostName,
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
          hostname: cdnImageUrlHostName || siteHostName,
        },
        ...imageDomains.map((domain) => ({
          protocol: 'https',
          hostname: domain,
        })),
      ],
      deviceSizes: [375, 480, 768, 1024, 1280, 1360, 1440],
    },
    headers: getHeadersConfiguration(headers),
    async redirects() {
      return redirects
    },
    ...extraConfigs,
  }
}

/**
 * Build the headers configuration for the application
 * @param {import('./types').IHeadersConfigs} configs - SRC Configs
 */
function getHeadersConfiguration (configs) {
  return async () => {
    const DEFAULT_SRC = configs.defaultSrc || []
    const SCRIPTS_SRC = configs.scriptSrc || []
    const STYLES_SRC = configs.styleSrc || []
    const FRAMES_SRC = configs.frameSrc || []
    const IMAGES_SRC = configs.imgSrc || []
  
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
    ]
  }
  
}

module.exports = {
  getNextBuildConfig,
  getHeadersConfiguration
}