import { type MetadataRoute } from 'next'

import { ContentService } from '@futurebrand/services'
import { ContentTypes, IContentMap } from '@futurebrand/types/contents'
import HelpersRouter from '../router'

interface IStaticPath {
  slug: string[]
  locale: string
}

type IStaticLimits = Partial<Record<ContentTypes, number>>

class RouterMap {
  constructor (private router: HelpersRouter) {}

  public async getContentMap(type: ContentTypes, locale: string): Promise<IContentMap[]> {
    const contentService = new ContentService()
    return await contentService.map({
      type,
      locale
    })
  }

  public async generateStaticPath(limits: IStaticLimits = {}) {
    if (process.env.NODE_ENV === 'development') {
      return []
    }
    
    const singleTypes = Object.keys(limits) as ContentTypes[]
    
    const paths: IStaticPath[] = []

    for (const locale of this.router.localization.locales) {
      // Contents

      for (const type of singleTypes) {
        const pathsMap = await this.getContentMap(type, locale)
        const limit = limits[type]

        const slicedPathsMap = pathsMap.slice(0, limit)

        for (const pathMap of slicedPathsMap) {
          const path = this.router.getPath(pathMap.params, locale, type)
          
          if (!path) {
            continue
          }

          if (
            type === 'pages' &&
            (pathMap.params.path === '/' || pathMap.params.path === `/${locale}`)
          ) {
            paths.push({
              slug: [],
              locale,
            })
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

  public async generateSitemap(): Promise<MetadataRoute.Sitemap> {
    const singleTypes = this.router.contentType.mapContentTypes()

    const urls: MetadataRoute.Sitemap = []

    for (const locale of this.router.localization.locales) {
      for (const type of singleTypes) {
        const pathsMap = await this.getContentMap(type, locale)
        for (const pathMap of pathsMap) {
          const url = this.router.getUrl(pathMap.params, locale, type)

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

export default RouterMap
