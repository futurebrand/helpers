import { I18nConfig } from "./types";
import { loadLocalization } from '@futurebrand/services'
import { ILocalization, ILocalizationRoute, type ContentTypes } from '@futurebrand/types/contents'

import HelpersRouter from "../router";

class RouterLocalization implements I18nConfig {
  locales: string[]
  defaultLocale: string
  
  constructor(private router: HelpersRouter) {
    this.locales = []
    this.defaultLocale = ''
  }

  async load() {
    const apiResponse = await loadLocalization()
    this.locales = apiResponse.locales
    this.defaultLocale = apiResponse.defaultLocale
  }

  public localizePath(path: string, locale: string) {
    if (path == null) {
      throw new Error('Path is required')
    }

    path = path.startsWith('/') ? path : `/${path}`
    path = path.endsWith('/') ? path : `${path}/`
  
    if (path.startsWith(`/${locale}`)) {
      return path
    }
  
    return locale !== this.defaultLocale ? `/${locale}${path}` : path
  }

  public async sanitizeContentLocalization(
    routes: ILocalization[],
    type: ContentTypes
  ) {
    const localizations: ILocalizationRoute[] = []
  
    for (const route of routes) {
      try {
        const { locale } = route
        const path = this.router.getPath(route.params, locale, type)
        localizations.push({
          locale,
          path: this.localizePath(path, locale)
        })
      } catch {
        continue
      }
    }
  
    return localizations
  }
  
}

export default RouterLocalization