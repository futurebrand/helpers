
import { ICurrentPath, ILocaleContentSlugs, IPageParams, IPathData } from "./types"
import { ContentTypes, IContentSlugs } from "@futurebrand/types/contents"
import { loadPathData } from "."

class PathModule implements IPathData {
  currentPath: ICurrentPath
  locales: string[]
  defaultLocale: string
  slugs: ILocaleContentSlugs
  isInstantiated: boolean;

  constructor (slugs: ILocaleContentSlugs) {
    this.slugs = slugs
    this.isInstantiated = false
  }

  public setInstantiated() {
    this.isInstantiated = true
  }

  public static async instantialize(slugs: ILocaleContentSlugs, locale?: string): Promise<PathModule> {
    if (globalThis.__pathModule) {
      return globalThis.__pathModule
    }

    const instance = new PathModule(slugs)
    const pathLoader = await loadPathData(locale, slugs)
    instance.locales = pathLoader.locales
    instance.defaultLocale = pathLoader.defaultLocale
    instance.currentPath = pathLoader.currentPath
    
    instance.setInstantiated()
    globalThis.__pathModule = instance
    return instance
  }

  public static fromCache(cache: IPathData): PathModule {
    const instance = new PathModule(cache.slugs)
    instance.locales = cache.locales
    instance.defaultLocale = cache.defaultLocale
    instance.currentPath = cache.currentPath
    instance.slugs = cache.slugs
    instance.setInstantiated()
    return instance
  }


  public static get instance(): PathModule{
    if (!globalThis.__pathModule) {
      throw new Error('PathModule not instantiated')
    }
    return globalThis.__pathModule
  }

  public setCurrentPath(path: ICurrentPath) {
    this.currentPath = path
  }

  public setPathFromParams(params: any, fixedType?: ContentTypes) {
    const locale = params.locale ?? this.defaultLocale

    const pageSlug = params.slug ?? this.getLocaleHome(locale)
    const pageType = fixedType ?? this.getContentTypeBySlug(pageSlug, locale)

    const slugString = this.getSlugStringByType(pageSlug, pageType)

    this.setCurrentPath({
      locale,
      slug: slugString,
      type: pageType,
    })

    return this.currentPath
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

  public getLocalePath(locale: string, url: string) {
    url = url.startsWith('/') ? url : `/${url}`
  
    if (url.startsWith(`/${locale}`)) {
      return url
    }
  
    return locale !== this.defaultLocale ? `/${locale}${url}` : url
  }

  public getContentPath = (
    pathString: string,
    type: ContentTypes = 'pages',
    locale: string,
    localized = true
  ) => {
    const path = pathString?.endsWith('/') ? pathString : `${pathString}/`
  
    if (type === 'pages') {
      if (!localized) {
        return path
      }
      return this.getLocalePath(locale, path)
    }
  
    const contentTypeSlug = this.getContentTypeSlug(type, locale)
    if (contentTypeSlug) {
      const contentPath = `${contentTypeSlug}${path}`
      if (!localized) {
        return contentPath
      }
      return this.getLocalePath(locale, contentPath)
    }
  
    throw new Error('Content Type not Found')
  }

  public getContentUrl = (
    path: string,
    locale: string,
    type: ContentTypes = 'pages'
  ) => {
    const pagePath = this.getContentPath(path, type, locale)
    return `${process.env.siteUrl}${pagePath}`
  }

  public get currentUrl() {
    const { locale, slug, type } = this.currentPath
    return this.getContentUrl(slug, locale, type)
  }

  public get currentLocale() {
    return this.currentPath.locale
  }

  public getContentTypeWithSingles() {
    const contentTypes = Object.keys(this.getContentSlugs(this.defaultLocale))
    return ['pages', ...contentTypes] as ContentTypes[]
  }

  public getContentTypeBySlug (slug: string | string[], locale: string) : ContentTypes {
    if (typeof slug === 'string' || slug.length === 1) {
      return 'pages'
    }

    const currentPath = slug[0]
    const paths = this.getContentSlugs(locale)

    const contentType = Object.keys(paths).find(
      (key: string) => paths[key as keyof typeof paths] === currentPath
    )

    if (contentType) {
      return contentType as ContentTypes
    }

    return 'pages'
  }

  private getSlugStringByType (slug: string | string[], type: ContentTypes) {
    if (typeof slug === 'string') {
      return slug.startsWith('/') ? slug : `/${slug}`
    }
    return type === 'pages'
      ? `/${slug?.join('/')}`
      : `/${slug?.slice(1).join('/')}`
  }

  private getLocaleHome(locale: string) {
    return locale === this.defaultLocale ? '/' : `/${locale}`
  }
  
}

export default PathModule
