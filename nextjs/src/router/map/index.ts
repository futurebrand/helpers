import {
  type ContentTypes,
  type IContentMap,
} from '@futurebrand/types/contents'
import { type MetadataRoute } from 'next'

import type HelpersRouter from '../router'

interface IStaticPath {
  slug: string[]
  locale: string
}

type IStaticLimits = Partial<Record<ContentTypes, number>>
type ISitemapExcept = Partial<Record<ContentTypes, boolean>>

class RouterMap {
  constructor(private readonly router: HelpersRouter) {}

  public async getContentMap(
    type: ContentTypes,
    locale: string
  ): Promise<IContentMap[]> {
    return await this.router.contentService.map({
      type,
      locale,
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
          if (
            type === 'pages' &&
            (pathMap.params.path === '/' ||
              pathMap.params.path === `/${locale}`)
          ) {
            paths.push({
              slug: [],
              locale,
            })
            continue
          }

          const path = this.router.getPath(pathMap.params, locale, type)

          if (path == null) {
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

  public async generateSitemap(
    excepts: ISitemapExcept = {}
  ): Promise<MetadataRoute.Sitemap> {
    const singleTypes = this.router.contentType.mapContentTypes()

    const urls: MetadataRoute.Sitemap = []

    for (const locale of this.router.localization.locales) {
      for (const type of singleTypes) {
        if (excepts[type]) {
          continue
        }

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
