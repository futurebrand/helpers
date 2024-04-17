import { notFound, redirect } from 'next/navigation'

import { IFetchResponse, type FetcherClient, FetcherError } from '@futurebrand/modules/fetcher'
import type { IContent, IContentMap, IContentResponse } from '@futurebrand/types/contents'
import { IQueryCallerParams, IServiceCallerProps, ISingleCallerProps } from './types'

import { cmsApi, cmsContentPath, ICMSContentApiPath } from '@futurebrand/services/cms'


class ContentService {
  private readonly fetcher: FetcherClient
  private readonly contentPath: ICMSContentApiPath

  constructor(fetcher?: FetcherClient, contentPath?: ICMSContentApiPath) {
    this.fetcher = fetcher || cmsApi
    this.contentPath = contentPath || cmsContentPath
  }


  public async createRequest<T = any>(path: string, props: IServiceCallerProps<any>) {
    return await this.fetcher.get<T>(
      path,
      {
        params: props,
      }
    )
  }

  public async single<T extends IContent>(props: ISingleCallerProps<T>): Promise<T> {
    'use server'

    if (props.previewData) {
      return props.previewData
    }

    let response: IFetchResponse<T>

    try {
      response = await this.createRequest<T>(this.contentPath.single, props)
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
    const response = await this.createRequest<IContentResponse<T>>(this.contentPath.query, props)
    return response.data
  }

  public async map(props: IServiceCallerProps<undefined>) {
    'use server'

    const response = await this.createRequest<IContentMap[]>(this.contentPath.map, props)
    return response.data
  }
}

export default ContentService
