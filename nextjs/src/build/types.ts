export interface IHeadersConfigs {
  defaultSrc?: string[]
  scriptSrc?: string[]
  styleSrc?: string[]
  frameSrc?: string[]
  imgSrc?: string[]
}

export interface IBuildRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

export interface IBuildConfig {
  cmsBaseUrl: string,
  cdnImageUrl: string,
  siteUrl: string,
  cmsFrontendToken: string,
  imageDomains: string[],
  envs?: any,
  redirects: IBuildRedirect
  headers: IHeadersConfigs
}

