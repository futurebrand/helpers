import fs from 'node:fs/promises'
import * as pathToRegexp from 'path-to-regexp'

import { ICurrentPath, ILocaleContentSlugs, IPathCache } from "./types"
import { ContentTypes, IContentSlugs } from "@futurebrand/types/contents"
import { loadPathData } from "."

class PathModule implements IPathCache {
  currentPath: ICurrentPath
  locales: string[]
  defaultLocale: string
  slugs: ILocaleContentSlugs
  isInstantiated: boolean
  changeEvent?: () => void

  constructor () {
    this.slugs = {}
    this.isInstantiated = false
  }

  public setInstantiated() {
    this.isInstantiated = true
  }

  public async loadSlugs() {
    try {
      const file = await fs.readFile(
        process.cwd() + '/configs/content-slugs.json',
        'utf8'
      )
      const data = JSON.parse(file) as ILocaleContentSlugs;
      
      this.slugs = data
      
      return data
    } catch (error) {
      console.error()
      return {}
    }
  }

  public static async instantialize(cache: IPathCache = {}): Promise<PathModule> {
    if (globalThis.__pathModule) {
      return globalThis.__pathModule
    }

    const instance = new PathModule()
    
    if (cache?.slugs) {
      instance.slugs = cache.slugs
    } else {
      await instance.loadSlugs()
    }

    if (!cache.locales || !cache.defaultLocale) {
      const pathLoader = await loadPathData(instance.slugs)
      instance.locales = pathLoader.locales
      instance.defaultLocale = pathLoader.defaultLocale
      instance.currentPath = pathLoader.currentPath
    } else {
      instance.locales = cache.locales
      instance.defaultLocale = cache.defaultLocale
      instance.currentPath = cache.currentPath
    }
    
    instance.setInstantiated()
    globalThis.__pathModule = instance

    return instance
  }

  public setCurrentPath(path: ICurrentPath) {
    this.currentPath = path
    if (this.changeEvent) {
      this.changeEvent()
    }
  }

  public onChange(changeEvent: () => void) {
    this.changeEvent = changeEvent
  }

  public getPathFromParams(params: any, fixedType?: ContentTypes) {
    const locale = params.locale ?? this.defaultLocale

    const pagePath = this.getPathStringByParamsSlug(params.slug)
    const pageType = fixedType ?? this.getContentTypeByPath(pagePath, locale)
    const pageParams = this.getContentParamsByPath(pagePath, pageType, locale)
    
    this.setCurrentPath({
      path: pagePath,
      locale,
      params: pageParams,
      type: pageType,
    })

    return this.currentPath
  }

  public setCurrentLocale(locale: string) {
    this.currentPath.locale = locale
    if (this.changeEvent) {
      this.changeEvent()
    }
  }

  public getContentTypeSlug(
    type: ContentTypes = 'pages',
    locale?: string
  ): string | false {
    const currentLocale = locale || this.defaultLocale
    return this.slugs[currentLocale]?.[type as keyof IContentSlugs] || false
  }
  
  public getContentSlugs(locale: string) {
    return this.slugs[locale]
  }

  public getLocalePath(path: string, locale: string) {
    path = path.startsWith('/') ? path : `/${path}`
  
    if (path.startsWith(`/${locale}`)) {
      return path
    }
  
    return locale !== this.defaultLocale ? `/${locale}${path}` : path
  }

  public getLocalizedUrl = (
    path: string,
    locale: string
  ) => {
    const pagePath = this.getLocalePath(path, locale)
    return `${process.env.siteUrl}${pagePath}`
  }

  public get currentUrl() {
    const { locale, path } = this.currentPath
    return this.getLocalizedUrl(path, locale)
  }

  public get currentLocale() {
    return this.currentPath.locale
  }

  public getContentTypeWithSingles() {
    return Object.keys(this.getContentSlugs(this.defaultLocale)) as ContentTypes[]
  }

  public toPathCache(): IPathCache {
    return {
      locales: this.locales,
      defaultLocale: this.defaultLocale,
      slugs: this.slugs,
      currentPath: this.currentPath,
    }
  }

  public getLocalizedUrlFromParams = (
    params: Record<string, string>,
    locale: string,
    type: ContentTypes = 'pages'
  ) => {
    const pagePath = this.getContentPathFromParams(params, locale, type)
    if (pagePath === null) {
      return null
    }
    
    return this.getLocalizedUrl(pagePath, locale)
  }

  public getLocalizedPathFromParams = (
    params: Record<string, string>,
    locale: string,
    type: ContentTypes = 'pages'
  ) => {
    const pagePath = this.getContentPathFromParams(params, locale, type)
    if (pagePath === null) {
      return null
    }

    return this.getLocalePath(pagePath, locale)
  }

  public getContentPathFromParams = (
    params: Record<string, string>,
    locale: string,
    type: ContentTypes = 'pages'
  ) => {
    try {
      const contentRegex = this.getContentSlugs(locale)[type]
      const pathMatch = pathToRegexp.compile(contentRegex)
      
      const paramsData = Object.keys(params).reduce((acc, key) => {
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

  public getContentTypeByPath (path: string, locale: string) : ContentTypes {
    const contentTypes = this.getContentSlugs(locale)

    for (const [type, regex] of Object.entries(contentTypes)) {
      const pathRegex = pathToRegexp.pathToRegexp(regex)
      if (pathRegex.exec(path)) {
        return type as ContentTypes
      }
    }

    return 'pages'
  }

  public getContentParamsByPath (path: string, type: ContentTypes, locale: string) : Record<string, string> {
    const contentRegex = this.getContentSlugs(locale)[type]
    const pathMatch = pathToRegexp.match(contentRegex)

    const match = pathMatch(path)
    if (!match) {
      throw new Error('Path Error')
    }

    const params = match.params as Record<string, string>

    return params

  }

  private getPathStringByParamsSlug (slug: string | string[]) {
    if (typeof slug === 'string') {
      return slug.startsWith('/') ? slug : `/${slug}`
    }
    return `/${slug?.join('/')}` 
  }
  
}

export default PathModule
