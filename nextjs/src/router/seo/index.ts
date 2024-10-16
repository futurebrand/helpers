import { GlobalDataService } from '@futurebrand/services'
import {
  type ContentTypes,
  type ILocalization,
} from '@futurebrand/types/contents'
import { getCMSMediaUrl } from '@futurebrand/utils'
import type { Metadata, ResolvingMetadata, Viewport } from 'next'

import type HelpersRouter from '../router'

class RouterSEO {
  constructor(private readonly router: HelpersRouter) {}

  public async getLocalizationCanonicals(
    routes: ILocalization[],
    type: ContentTypes
  ) {
    const canonicals = {} as any

    /**
     * TODO: Implement Canonicals
     */
    for (const route of routes) {
      if (!route.locale) continue
      try {
        const { locale } = route
        const url = this.router.getUrl(route.params ?? {}, locale, type)

        if (url) {
          canonicals[locale] = url
        }
      } catch (error) {
        console.error(error)
        continue
      }
    }

    return canonicals
  }

  public async getData(
    parent?: ResolvingMetadata,
    revalidate?: number
  ): Promise<Metadata> {
    try {
      const currentRoute = this.router.current
      // Query data
      const pageData = await this.router.contentService.seo(
        {
          type: currentRoute.type,
          params: currentRoute.params as any,
          locale: currentRoute.locale,
        },
        revalidate
      )

      const globalSEO = await parent

      // Get page data
      const localizations = pageData.localizations || []
      const seo = pageData.pageSeo

      // Get SEO data
      const { metaDescription, metaTitle, showOnGoogle } = seo ?? {}
      const metaImage = seo?.metaImage?.data?.attributes
      const ogImage = metaImage
        ? {
            url: getCMSMediaUrl(metaImage.url),
            width: metaImage.width,
            height: metaImage.height,
          }
        : (globalSEO?.openGraph?.images?.[0] ?? null)
      const url = currentRoute.url

      const canonicals = await this.getLocalizationCanonicals(
        localizations,
        currentRoute.type
      )

      const title = metaTitle || globalSEO.title.absolute
      const description = metaDescription || globalSEO.description

      // Return SEO data
      return {
        title,
        description,
        robots: {
          index: showOnGoogle,
          follow: showOnGoogle,
        },
        openGraph: {
          ...globalSEO?.openGraph,
          title,
          description,
          url,
          type: 'website',
          locale: currentRoute.locale,
          ...(ogImage ? { images: [ogImage] } : {}),
        },
        alternates: {
          canonical: url,
          languages: canonicals,
        },
      } as unknown as Metadata
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  public async getGlobalMetadata(locale: string): Promise<Metadata> {
    const siteUrl = String(process.env.siteUrl)
    const service = new GlobalDataService()

    const seo = await service.seo(locale)

    if (!seo) {
      return {
        metadataBase: new URL(siteUrl),
      }
    }

    const ogImage = seo.metaImage
    const other = {} as any

    for (const meta of seo.customMetas) {
      other[meta.name] = meta.content
    }

    return {
      metadataBase: new URL(siteUrl),
      title: {
        default: seo.metaTitle,
      },
      description: seo.metaDescription,
      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        siteName: seo.siteName,
        images: [
          {
            url: getCMSMediaUrl(ogImage.url),
            width: ogImage.width,
            height: ogImage.height,
          },
        ],
      },

      other,
    } as unknown as Metadata
  }

  public async getViewport(locale: string): Promise<Viewport> {
    const service = new GlobalDataService()
    const seo = await service.seo(locale)

    return {
      themeColor: seo.themeColor,
    }
  }
}

export default RouterSEO
