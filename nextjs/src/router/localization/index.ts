import { I18nConfig } from "./types";
import { loadLocalization } from '@futurebrand/services'
import { ILocalization, type ContentTypes } from '@futurebrand/types/contents'
import RouterContentType from "../content-type";
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
    path = path.startsWith('/') ? path : `/${path}`
  
    if (path.startsWith(`/${locale}`)) {
      return path
    }
  
    return locale !== this.defaultLocale ? `/${locale}${path}` : path
  }

  public async sanitizeContentLocalization(
    routes: any[],
    type: ContentTypes
  ) {
    const localizations: ILocalization[] = []
  
    for (const route of routes) {
      const { locale } = route

      const path = this.router.contentType.getPathFromParams(route, locale, type)
      localizations.push({
        locale,
        path: this.localizePath(path, locale)
      })
    }
  
    return localizations
  }
  
}

export default RouterLocalization