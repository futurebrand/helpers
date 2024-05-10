export interface ICMSContentApiPath {
  query: string,
  map: string,
  single: string,
  seo: string,
  preview: string,
  locales: string,
}

export interface ILocalesApiData {
  name: string
  code: string
  isDefault: boolean
}

export interface I18nConfig {
  locales: string[],
  defaultLocale: string,
}