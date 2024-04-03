import { type MetadataRoute } from 'next'

import ContentService from '@futurebrand/services/content'
import PathModule from '../path'

interface IStaticPath {
  slug: string[]
  locale: string
}

class SiteMapModule {
  constructor () {}

  public async getGlobalGenerateStaticPath() {
    const pathModule = await PathModule.instantialize()
    const singleTypes = pathModule.getContentTypeWithSingles()
    
    const paths: IStaticPath[] = []

    /**
     * @TODO
     */

    for (const locale of pathModule.locales) {
      // Contents
      const contentService = new ContentService(locale)

      for (const type of singleTypes) {
        const pathsMap = await contentService.getPathsMap(type)

        const slicedIndex = type === 'pages' ? 30 : 10
        const slicedPathsMap = pathsMap.slice(0, slicedIndex)

        for (const pathMap of slicedPathsMap) {
          const path = pathModule.getContentPathFromParams(pathMap.params, locale, type)
          
          if (!path) {
            continue
          }

          if (
            type === 'pages' &&
            (pathMap.params.path === '/' || pathMap.params.path === `/${locale}`)
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
    const pathModule = await PathModule.instantialize()
    const singleTypes = pathModule.getContentTypeWithSingles()

    const urls: MetadataRoute.Sitemap = []

    for (const locale of pathModule.locales) {
      const contentService = new ContentService(locale)

      for (const type of singleTypes) {
        const pathsMap = await contentService.getPathsMap(type)
        for (const pathMap of pathsMap) {
          const url = pathModule.getLocalizedUrlFromParams(pathMap.params, locale, type)
          if (!url) {
            continue
          }
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
