import { notFound, redirect } from 'next/navigation'
import { PathModule } from '@futurebrand/modules'

import { IFetchResponse, type FetcherClient, FetcherError } from '@futurebrand/modules/fetcher'
import type { IContent, IContentMap, IContentResponse } from '@futurebrand/types/contents'
import cmsApi from '@futurebrand/strapi/api'
import { IQueryCallerParams, IServiceCallerProps, ISingleCallerProps } from './types'

const REQUEST_PATH = {
  QUERY: '/futurebrand-strapi-helpers/contents',
  MAP: '/futurebrand-strapi-helpers/contents/map',
  SINGLE: '/futurebrand-strapi-helpers/contents/single',
}

class ContentService {
  private readonly fetcher: FetcherClient

  constructor(fetcher?: FetcherClient) {
    this.fetcher = fetcher || cmsApi 
  }

  public async getDefaultLocale () {
    const pathModule = await PathModule.instantialize()
    return pathModule.currentPath.locale ?? pathModule.defaultLocale
  }

  public async createRequest<T = any>(path: string, props: IServiceCallerProps<any>) {
    const locale = props.locale ?? await this.getDefaultLocale()
    return await this.fetcher.get<T>(
      path,
      {
        params: {
          key: props.key,
          locale,
          type: props.type,
          params: props.params,
        },
      }
    )
  }

  public async single<T extends IContent>(props: ISingleCallerProps<T>): Promise<T> {
    'use server'

    if (props.serverData) {
      return props.serverData
    }

    let response: IFetchResponse<T>

    try {
      response = await this.createRequest<T>(REQUEST_PATH.SINGLE, props)
    } catch (error) {
      const status = (error as FetcherError).response?.status
      if (status === 404) {
        notFound()
      }

      console.error((error as FetcherError).body)
      throw new Error(`Error on get single ${JSON.stringify(props.params)}`)
    }

    const pageData = response.data

    const contentRedirect = pageData.pageSeo?.redirect
    if (contentRedirect?.enabled) {
      redirect(contentRedirect.url)
    }
  
    return pageData
  }

  public async query<T = IContent[]>(props: IServiceCallerProps<IQueryCallerParams>): Promise<IContentResponse<T>> {
    const response = await this.createRequest<IContentResponse<T>>(REQUEST_PATH.QUERY, props)
    return response.data
  }

  public async map(props: IServiceCallerProps<undefined>) {
    'use server'

    const response = await this.createRequest<IContentMap[]>(REQUEST_PATH.MAP, props)
    return response.data
  }
}

export default ContentService
