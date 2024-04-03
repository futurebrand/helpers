import type { Metadata, ResolvingMetadata, Viewport } from 'next'
import PathModule from '@futurebrand/modules/path'
import ContentService from '@futurebrand/services/content'
import { ContentTypes, ILocalization } from '@futurebrand/types/contents'
import { getCMSMediaUrl } from '@futurebrand/utils'

import { IGlobalSEO } from '@futurebrand/types/global-options'
import { ICurrentPath } from '../path/types'

class SEOModule {
  contentService: ContentService
  
  constructor(
    private readonly parent?: ResolvingMetadata,
    contentService?: ContentService
  ) {
    // TODO: Implement a mock for the contentService
    this.contentService = contentService ?? new ContentService()
  }

  public async getLocalizationCanonicals(routes: ILocalization[], type: ContentTypes) {
    const canonicals = {} as any
    const pathModule = await PathModule.instantialize()

    for (const route of routes) {
      const { locale } = route
      const url = pathModule.getLocalizedPathFromParams(route as any, locale, type)
      if (url) {
        canonicals[locale] = url
      }
    }

    return canonicals
  }

  public async getData() : Promise<Metadata> {
    try {
      const path = await PathModule.instantialize()
      const currentPath = path.currentPath
      // Query data
      this.contentService.locale = path.currentLocale
      const pageData = await this.contentService.getSingle(currentPath.type, currentPath.params)
      const globalSEO = await this.parent
  
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
      const url = path.currentUrl
  
      const { viewport, themeColor, colorScheme, ...globals } = globalSEO as any
  
      const canonicals = await this.getLocalizationCanonicals(localizations, currentPath.type)
  
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
          locale: path.currentLocale,
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

  public static async fromPageParams(params: any, parent?: ResolvingMetadata, fixedType?: ContentTypes) { 
    const pathModule = await PathModule.instantialize()
    pathModule.getPathFromParams(params, fixedType)

    const seo = new SEOModule(parent)
    return await seo.getData()
  }

  public static async fromCustomPath(path: ICurrentPath, parent?: ResolvingMetadata, fixedType?: ContentTypes) { 
    const pathModule = await PathModule.instantialize()
    pathModule.setCurrentPath(path)

    const seo = new SEOModule(parent)
    return await seo.getData()
  }
}

export default SEOModule