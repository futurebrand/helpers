import { type MetadataRoute } from 'next'

import ContentService from '@futurebrand/services/content'
import PathModule from '../path'
import { ContentTypes, IContentMap } from '@futurebrand/types/contents'

interface IStaticPath {
  slug: string[]
  locale: string
}

class SiteMapModule {
  constructor () {}

  public async getContentMap(type: ContentTypes, locale: string): Promise<IContentMap[]> {
    const contentService = new ContentService()
    return await contentService.map({
      type,
      locale
    })
  }

  public async getGlobalGenerateStaticPath() {
    const pathModule = await PathModule.instantialize()
    const singleTypes = pathModule.getContentTypeWithSingles()
    
    const paths: IStaticPath[] = []

    /**
     * @TODO
     */

    for (const locale of pathModule.locales) {
      // Contents

      for (const type of singleTypes) {
        const pathsMap = await this.getContentMap(type, locale)

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
      for (const type of singleTypes) {
        const pathsMap = await this.getContentMap(type, locale)
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
