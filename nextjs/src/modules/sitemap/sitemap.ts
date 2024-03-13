import { type MetadataRoute } from 'next'

import ContentService from '@futurebrand/services/content'
import { type ContentTypes } from '~/types/contents'
import PathModule from '../path'

interface IStaticPath {
  slug: string[]
  locale: string
}

class SiteMapModule {
  locales: string[]
  singleTypes: ContentTypes[] 
  
  constructor () {
    const path = PathModule.instance
    this.locales = path.locales
    this.singleTypes = path.getContentTypeWithSingles()
  }

  public async getGenerateStaticPath() {
    const paths: IStaticPath[] = []

    for (const locale of this.locales) {
      // Contents
      const contentService = new ContentService(locale)

      for (const type of this.singleTypes) {
        const pathsMap = await contentService.getPathsMap(type)

        const slicedIndex = type === 'pages' ? 30 : 10
        const slicedPathsMap = pathsMap.slice(0, slicedIndex)

        for (const pathMap of slicedPathsMap) {
          const path = PathModule.instance.getContentPath(pathMap.slug, type, locale, false)
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

  public async getGenerateSitemap(): Promise<MetadataRoute.Sitemap> {
    const urls: MetadataRoute.Sitemap = []

    for (const locale of this.locales) {
      const contentService = new ContentService(locale)

      for (const type of this.singleTypes) {
        const pathsMap = await contentService.getPathsMap(type)
        for (const pathMap of pathsMap) {
          const url = PathModule.instance.getContentUrl(pathMap.slug, locale, type)
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
