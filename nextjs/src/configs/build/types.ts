import { IHeadersConfigs } from "../headers/types";

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