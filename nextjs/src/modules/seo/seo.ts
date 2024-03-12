import type { Metadata, ResolvingMetadata, Viewport } from 'next'
import PathModule from '~/modules/path'
import ContentService from '~/services/content'
import { ContentTypes, ILocalization } from '~/types/contents'
import { IGlobalSEO } from '~/types/global-options'
import { getCMSMediaUrl } from '~/utils/cms-media'
import { getContentUrl } from '~/utils/path'

class SEOModule {
  path: PathModule
  contentService: ContentService
  
  constructor(
    path?: PathModule,
    private readonly parent?: ResolvingMetadata,
    contentService?: ContentService
  ) {
    this.path = path ?? new PathModule({})
    // TODO: Implement a mock for the contentService
    this.contentService = contentService ?? new ContentService(this.path.locale)
  }

  public async getLocalizationCanonicals(routes: ILocalization[], type: ContentTypes) {
    const canonicals = {} as any

    for (const route of routes) {
      const { locale, slug } = route
      const url = getContentUrl(slug, locale, type)
      if (url) {
        canonicals[locale] = url
      }
    }

    return canonicals
  }

  public async getData() : Promise<Metadata> {
    try {
      // Query data
      const pageData = await this.contentService.getBySlug(this.path.type, this.path.slug)
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
      const url = this.path.url()
  
      const { viewport, themeColor, colorScheme, ...globals } = globalSEO as any
  
      const canonicals = await this.getLocalizationCanonicals(localizations, this.path.type)
  
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
          locale: this.path.locale,
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

  public static async fromPageParams(params: any, parent?: ResolvingMetadata) { 
    const path = new PathModule(params)
    const seo = new SEOModule(path, parent)
    return await seo.getData()
  }
}

export default SEOModule