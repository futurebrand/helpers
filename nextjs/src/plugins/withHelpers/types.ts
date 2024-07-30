import { NextConfig } from 'next'

export interface ICSPConfigs {
  defaultSrc?: string[]
  scriptSrc?: string[]
  styleSrc?: string[]
  frameSrc?: string[]
  imgSrc?: string[]
}

export interface IBuildRedirect {
  source: string;
  destination: string;
  permanent?: boolean;
}

export type IGetSlugsFunction = (locale: string) => Record<string, string>

export interface IStrapiCMSConfig {
  type: 'strapi',
  url: string,
  token: string,
  adminEnvKey?: string,
}

export interface IWordpressCMSConfig {
  type: 'wp',
  url: string,
}

export type ICMSConfig = IStrapiCMSConfig | IWordpressCMSConfig

export interface IHelpersConfig { 
  cms: ICMSConfig,
  cdn?: string,
  siteUrl: string,
  domains?: string[],
  redirects?: IBuildRedirect[]
  csp?: ICSPConfigs
  revalidate?: number
}

export interface NextWithHelpersConfig extends NextConfig{
  futureBrandHelpers: IHelpersConfig
}
