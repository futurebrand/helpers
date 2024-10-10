const OTIMIZATION_STYLE_SIZE = 25000

/**
 * @param {string} url
 * @returns {string}
 */
function getHostName(url) {
  if (!url) return ''
  return new URL(url).hostname
}

function getSiteUrl(siteUrl) {
  if (process.env.AWS_BRANCH && process.env.AWS_BRANCH !== 'main') {
    const buildIds = String(process.env.CODEBUILD_BUILD_ID).split(':')[0]
    const pullId = process.env.AWS_PULL_REQUEST_ID
    if (buildIds && pullId) {
      return `https://pr-${pullId}.${buildIds}.amplifyapp.com`
    }
  }
  return siteUrl
}

function getDeployEnvironnement() {
  if (process.env.NODE_ENV === 'development') {
    return 'local'
  }

  if (
    process.env.AMPLIFY_AMAZON_CLIENT_ID != null ||
    process.env.AMPLIFY_DIFF_DEPLOY != null
  ) {
    return 'amplify'
  }

  if (process.env.VERCEL != null) {
    return 'vercel'
  }

  return 'unknown'
}

function getWebpackOtimization(currentOptimization) {
  const splitChunks = currentOptimization.splitChunks

  return {
    ...currentOptimization,
    splitChunks: {
      ...(splitChunks ?? {}),
      cacheGroups: {
        ...(splitChunks.cacheGroups ?? {}),
        style: {
          name: 'style',
          priority: 10,
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
          minSize: OTIMIZATION_STYLE_SIZE,
          maxSize: OTIMIZATION_STYLE_SIZE,
        },
      },
    },
  }
}

/**
 * Build the headers configuration for the application
 * @param {import('./types').ICSPConfigs} cspConfigs - SRC Configs
 * @param {() => Promise<any[]>} buildConfig
 * @returns {() => Promise<any[]>}
 */
function getCSPConfiguration(cspConfigs, buildConfig) {
  return async () => {
    const DEFAULT_SRC = cspConfigs.defaultSrc || []
    const SCRIPTS_SRC = cspConfigs.scriptSrc || []
    const STYLES_SRC = cspConfigs.styleSrc || []
    const FRAMES_SRC = cspConfigs.frameSrc || []
    const IMAGES_SRC = cspConfigs.imgSrc || []
    const FONT_SRC = cspConfigs.fontSrc || []
    const OBJECT_SRC = cspConfigs.objectSrc || []

    const cspHeader =
      process.env.NODE_ENV === 'development'
        ? ''
        : `
      default-src 'self' ${DEFAULT_SRC.join(' ')};
      script-src 'self' 'unsafe-eval' 'unsafe-inline' ${SCRIPTS_SRC.join(' ')};
      style-src 'self' 'unsafe-inline' ${STYLES_SRC.join(' ')};
      frame-src 'self' ${FRAMES_SRC.join(' ')};
      img-src 'self' blob: data: ${IMAGES_SRC.join(' ')};
      font-src 'self' ${FONT_SRC.join(' ')};
      object-src 'self' ${OBJECT_SRC.join(' ')};
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
      ...restHeaders,
    ]
  }
}

module.exports = {
  getHostName,
  getSiteUrl,
  getCSPConfiguration,
  getWebpackOtimization,
  getDeployEnvironnement,
}
