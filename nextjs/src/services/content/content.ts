import { notFound, redirect } from 'next/navigation'
import { PathModule } from '@futurebrand/modules'

import { IFetchResponse, type FetcherClient, FetcherError } from '@futurebrand/modules/fetcher'
import type { ContentTypes, IContent, IContentResponse, IContentSlugMap } from '@futurebrand/types/contents'
import cmsApi from '@futurebrand/strapi/api'

class ContentService {
  private readonly fetcher: FetcherClient

  constructor(public locale?: string, fetcher?: FetcherClient) {
    this.fetcher = fetcher || cmsApi 
  }

  public async getLocale () {
    if (!this.locale) {
      const pathModule = await PathModule.instantialize()
      this.locale = pathModule.currentPath.locale ?? pathModule.defaultLocale
    }
    return this.locale
  }

  public async getSingle<T extends IContent>(
    type: ContentTypes,
    params: Record<string, string>
  ): Promise<T> {
    'use server'

    if (!params) {
      throw new Error('Slug is required')
    }

    let response: IFetchResponse<T>
    const locale = await this.getLocale()

    try {
      response = await this.fetcher.get(
        '/futurebrand-strapi-helpers/contents/single',
        {
          params: {
            locale,
            type,
            params,
          },
        }
      )
    } catch (error) {
      const status = (error as FetcherError).response?.status
      if (status === 404) {
        notFound()
      }

      console.error((error as FetcherError).body)
      throw new Error(`Error on fetch ${JSON.stringify(params)}`)
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
    const locale = await this.getLocale()

    const response = await this.fetcher.get<IContentResponse<T>>(
      `/futurebrand-strapi-helpers/contents`,
      {
        params: {
          locale,
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

    const locale = await this.getLocale()
    
    const response = await this.fetcher.get<IContentSlugMap[]>(
      `/futurebrand-strapi-helpers/contents/map`,
      {
        params: {
          type,
          locale,
        },
      }
    )

    return response.data
  }
}

export default ContentService
