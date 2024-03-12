import { ContentTypes } from "~/types/contents"
import { IPageParams } from "./types"
import i18n from "~/configs/i18n.json"
// import CONTENT_SLUGS from "~/configs/content-slugs"
// import { getContentPath, getContentUrl } from "~/utils/path"

const CONTENT_SLUGS = {}

class PathModule {
  public slug: string
  public locale: string
  public type: ContentTypes

  constructor (params: IPageParams | any) {
    const { locale, type } = params
    this.locale = locale ?? i18n.defaultLocale
    
    const slug = params.slug ?? this.getMainSlug()
    this.type = type ?? this.getContentTypeBySlug(slug)
    this.slug = this.getSlugByType(slug)
  }

  private getMainSlug() {
    return this.locale === i18n.defaultLocale ? '/' : `/${this.locale}`
  }

  private getSlugByType (slug: string | string[]) {
    if (typeof slug === 'string') {
      return slug.startsWith('/') ? slug : `/${slug}`
    }
    return this.type === 'pages'
      ? `/${slug?.join('/')}`
      : `/${slug?.slice(1).join('/')}`
  }
  
  private getContentSlugs() {
    return CONTENT_SLUGS[this.locale]
  }
  

  private getContentTypeBySlug (slug: string | string[]) : ContentTypes {
    if (typeof slug === 'string' || slug.length === 1) {
      return 'pages'
    }

    const currentPath = slug[0]
    const paths = this.getContentSlugs()

    const contentType = Object.keys(paths).find(
      (key: string) => paths[key as keyof typeof paths] === currentPath
    )

    if (contentType) {
      return contentType as ContentTypes
    }

    return 'pages'
  }
}

export default PathModule