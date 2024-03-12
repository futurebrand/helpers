import { getHeadersConfiguration } from "../headers";
import { IBuildConfig } from "./types";

export function getNextBuildConfig (buildConfigs: IBuildConfig, extraConfigs = {}) {
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