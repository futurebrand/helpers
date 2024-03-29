import { IHeadersConfigs } from "./types"

export function getHeadersConfiguration (configs: IHeadersConfigs) {
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