import { ContentTypes } from "@futurebrand/types/contents"
import { RouterSlugItem, RouterSlugs } from "../types"
import * as pathToRegexp from 'path-to-regexp'
import RouterLocalization from "../localization"
import HelpersRouter from "../router"

class RouterContentType {
  constructor (private router: HelpersRouter, public slugs: RouterSlugs) {}

  public getLocaleSlugs (locale: string) : RouterSlugItem {
    let contentTypes = this.slugs[locale]
    if (!contentTypes) {
      const defaultLocale = this.router.localization.defaultLocale || Object.keys(this.slugs)[0]
      contentTypes = this.slugs[defaultLocale]
    }
    return contentTypes
  }

  public getContentSlugRegex (locale: string, type: ContentTypes) : string {
    const contentTypes = this.getLocaleSlugs(locale)
    const contentRegex = contentTypes[type]

    if (!contentRegex) {
      throw new Error('Content type not Found in Slugs Object')
    }

    return contentRegex
  }

  public getTypeFromString (path: string, locale: string) : ContentTypes {
    const contentTypes = this.getLocaleSlugs(locale)

    for (const [type, regex] of Object.entries(contentTypes)) {
      const pathRegex = pathToRegexp.pathToRegexp(regex)
      if (pathRegex.exec(path)) {
        return type as ContentTypes
      }
    }

    return 'pages'
  }

  public getParamsFromString (path: string, type: ContentTypes, locale: string) : Record<string, string> {
    const contentRegex = this.getContentSlugRegex(locale, type)

    const pathMatch = pathToRegexp.match(contentRegex)
    const match = pathMatch(path)
    if (!match) {
      throw new Error('Path not match with content type regex')
    }

    const params = match.params as Record<string, string>

    return params
  }

  public getPathFromParams = (
    params: Record<string, string>,
    locale: string,
    type: ContentTypes = 'pages'
  ) => {
    try {
      const contentRegex = this.getContentSlugRegex(locale, type)
      const pathMatch = pathToRegexp.compile(contentRegex)
      
      const paramsData = Object.keys(params).reduce((acc, key) => {
        if (!params[key] || typeof params[key] !== 'string') {
          acc[key] = ''
          return acc
        }
        const value = params[key].split('/').filter((p) => p !== '')
        if (!value) {
          acc[key] = ''
        } else {
          acc[key] = value.length === 1 ? value[0] : value
        }
        return acc
      }, {})
      
      return pathMatch(paramsData)
    } catch (error) {
      console.log(`ContentType: (${type}) - error on get path from params`)
      console.log({params, error})
      return null
    }
  }

  public getUrl(path: string, locale: string) {
    const localizedPath = this.router.localization.localizePath(path, locale)
    return `${process.env.siteUrl}${localizedPath}`
  }

  public mapContentTypes() : ContentTypes[] {
    const locale = this.router.localization.defaultLocale || Object.keys(this.slugs)[0]
    const contentTypes = this.getLocaleSlugs(locale)
    return Object.keys(contentTypes) as ContentTypes[]
  }
  
}

export default RouterContentType