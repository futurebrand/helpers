import { type MetadataRoute } from 'next'

import ContentService from '~/services/content'
import { IContentSlugs, type ContentTypes } from '~/types/contents'
import { getContentPath, getContentUrl } from '~/utils/path'

interface IStaticPath {
  slug: string[]
  locale: string
}

class SiteMapModule {
  constructor (private contentTypes: IContentSlugs) {}
  private getContentTypeWithSingles() {
    const contentTypes = Object.keys(this.contentTypes)
    return ['pages', ...contentTypes] as ContentTypes[]
  }

  public async getGenerateStaticPath(locales: string[]) {
    const paths: IStaticPath[] = []

    for (const locale of locales) {
      // Contents
      const contentTypes = this.getContentTypeWithSingles()
      const contentService = new ContentService(locale)

      for (const type of contentTypes) {
        const pathsMap = await contentService.getPathsMap(type)

        const slicedIndex = type === 'pages' ? 30 : 10
        const slicedPathsMap = pathsMap.slice(0, slicedIndex)

        for (const pathMap of slicedPathsMap) {
          const path = getContentPath(pathMap.slug, locale, type)

          if (
            type === 'pages' &&
            (pathMap.slug === '/' || pathMap.slug === `/${locale}`)
          ) {
            continue
          }

          paths.push({
            slug: path.split('/').filter((p) => p !== ''),
            locale,
          })
        }
      }
    }

    return paths
  }

  public async getGenerateSitemap(locales: string[]): Promise<MetadataRoute.Sitemap> {
    const urls: MetadataRoute.Sitemap = []

    for (const locale of locales) {
      const contentTypes = this.getContentTypeWithSingles()
      const contentService = new ContentService(locale)

      for (const type of contentTypes) {
        const pathsMap = await contentService.getPathsMap(type)
        for (const pathMap of pathsMap) {
          const url = getContentUrl(pathMap.slug, locale, type)
          const date = pathMap.date ? new Date(pathMap.date) : new Date()
          urls.push({
            url,
            lastModified: Number.isNaN(date.getTime()) ? new Date() : date,
          })
        }
      }
    }

    return urls
  }
}

export default SiteMapModule
