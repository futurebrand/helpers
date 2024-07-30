
import { ContentTypes } from "@futurebrand/types/contents"
import type { RouterSlugList, RouterSlugs } from "../types"
import * as pathToRegexp from 'path-to-regexp'
import HelpersRouter from "../router"

class RouterContentType {
  constructor (private router: HelpersRouter, public slugs: RouterSlugs) {}

  public getLocaleSlugs (locale: string) : RouterSlugList {
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
    params: any,
    locale: string,
    type: ContentTypes = 'pages'
  ) => {
    try {
      const contentRegex = this.getContentSlugRegex(locale, type)
      const pathMatch = pathToRegexp.compile(contentRegex)
      
      const paramsData = Object.keys(params).reduce((acc, key) => {
        if (Array.isArray(params[key])) {
          acc[key] = params[key];
          return acc
        } else if (!params[key] || typeof params[key] !== 'string') {
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

  public getLocalizedPath = (
    params: any,
    locale: string,
    type: ContentTypes = 'pages'
  ) => {
    const path = this.getPathFromParams(params, locale, type)
    return this.router.localization.localizePath(path, locale)
  }

  public getPathUrl(path: string) {
    let pathString = path.startsWith('/') ? path : `/${path}`
    pathString = pathString.endsWith('/') ? pathString : `${pathString}/`
    return `${process.env.siteUrl}${pathString}`
  }

  public mapContentTypes() : ContentTypes[] {
    const locale = this.router.localization.defaultLocale || Object.keys(this.slugs)[0]
    const contentTypes = this.getLocaleSlugs(locale)
    return Object.keys(contentTypes) as ContentTypes[]
  }
  
}

export default RouterContentType