import type { Metadata, ResolvingMetadata, Viewport } from 'next'
// import PathModule from '@futurebrand/modules/path'
import { ContentTypes, ILocalization } from '@futurebrand/types/contents'
import { getCMSMediaUrl } from '@futurebrand/utils'

import { IGlobalSEO } from '@futurebrand/types/global-options'
import { ContentService } from '@futurebrand/services'
import CurrentRoute from '../current'
import RouterContentType from '../content-type'
import HelpersRouter from '../router'

class RouterSEO {
  contentService: ContentService
  
  constructor(
    private router: HelpersRouter,
    contentService?: ContentService
  ) {
    // TODO: Implement a mock for the contentService
    this.contentService = contentService ?? new ContentService()
  }

  public async getLocalizationCanonicals(routes: ILocalization[], type: ContentTypes) {
    const canonicals = {} as any

    /**
     * TODO: Implement Canonicals
     */
    for (const route of routes) {
      const { locale } = route
      const path = this.router.contentType.getPathFromParams(route as any, locale, type)
      const url = this.router.contentType.getUrl(path, locale)

      if (url) {
        canonicals[locale] = url
      }
    }

    return canonicals
  }

  public async getData(parent?: ResolvingMetadata) : Promise<Metadata> {
    try {
      const currentRoute = this.router.current
      // Query data
      const pageData = await this.contentService.single({
        type: currentRoute.type,
        params: currentRoute.params,
        locale: currentRoute.locale,
      })
      const globalSEO = await parent
  
      // Get page data
      const localizations =
        pageData.localizations || []
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
        : null
      const url = currentRoute.url
  
      const { viewport, themeColor, colorScheme, ...globals } = globalSEO as any
  
      const canonicals = await this.getLocalizationCanonicals(localizations, currentRoute.type)
  
      // Return SEO data
      return {
        ...globals,
        title: metaTitle,
        description: metaDescription,
        robots: {
          index: showOnGoogle,
          follow: showOnGoogle,
        },
        openGraph: {
          ...globalSEO?.openGraph,
          title: metaTitle,
          description: metaDescription,
          url,
          type: 'website',
          locale: currentRoute.locale,
          ...(ogImage ? { images: [ogImage] } : {}),
        },
        alternates: {
          canonical: url,
          ...canonicals,
        },
      } as unknown as Metadata
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  public getGlobalMetadata(seo: IGlobalSEO) : Metadata {
    const siteUrl = String(process.env.siteUrl)

    if (!seo) {
      return {
        metadataBase: new URL(siteUrl),
      }
    }

    const ogImage = seo.metaImage.data.attributes
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

  public getViewport(globalSEO: IGlobalSEO) : Viewport {

    if (!globalSEO) {
      return {}
    }

    return {
      themeColor: globalSEO.themeColor,
    }
  }
}

export default RouterSEO