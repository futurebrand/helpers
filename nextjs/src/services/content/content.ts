import { notFound, redirect } from 'next/navigation'
import i18n from '~/configs/i18n.json'
import { IFetchResponse, type FetcherClient, FetcherError } from '~/modules/fetcher'
import type { ContentTypes, IContent, IContentResponse, IContentSlugMap } from '~/types/contents'
import cmsApi from '~/utils/cms-api'

class ContentService {
  private readonly fetcher: FetcherClient
  public readonly locale: string

  constructor(locale?: string, fetcher?: FetcherClient) {
    this.fetcher = fetcher || cmsApi
    this.locale = locale || i18n.defaultLocale
  }

  public async getBySlug<T extends IContent>(
    type: ContentTypes,
    slug: string
  ): Promise<T> {
    'use server'

    if (!slug) {
      throw new Error('Slug is required')
    }

    let response: IFetchResponse<T>
 

    try {
      response = await this.fetcher.get(
        '/futurebrand-strapi-helpers/contents/find-by-slug',
        {
          params: {
            locale: this.locale,
            type,
            slug,
          },
        }
      )
    } catch (error) {
      const status = (error as FetcherError).response?.status
      if (status === 404) {
        notFound()
      }

      console.error((error as FetcherError).body)
      throw new Error(`Error on fetch ${slug}`)
    }

    const pageData = response?.data

    if (!pageData) {
      throw new Error('Page attributes not Found')
    }

    const contentRedirect = pageData.pageSeo?.redirect
    if (contentRedirect?.enabled) {
      redirect(contentRedirect.url)
    }
  
    return pageData
  }

  public async query<T extends IContent[]>(
    type: ContentTypes,
    filters: Record<string, any>,
    page: number = 1,
  ): Promise<IContentResponse<T>> {
    const response = await this.fetcher.get<IContentResponse<T>>(
      `/futurebrand-strapi-helpers/contents`,
      {
        params: {
          locale: this.locale,
          type,
          filters,
          page,
        },
      }
    )

    return response.data
  }

  public async getPathsMap(type: ContentTypes) {
    'use server'
    
    const response = await this.fetcher.get<IContentSlugMap[]>(
      `/futurebrand-strapi-helpers/contents/slugs`,
      {
        params: {
          type,
          locale: this.locale,
        },
      }
    )

    return response.data
  }
}

export default ContentService
