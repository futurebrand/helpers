import { notFound, redirect } from 'next/navigation'

import { IFetchResponse, type FetcherClient, FetcherError } from '@futurebrand/modules/fetcher'
import type { IContent, IContentMap, IContentResponse } from '@futurebrand/types/contents'
import { IContentServiceConfigs, IQueryCallerParams, IServiceCallerProps, ISingleCallerProps } from './types'

import { cmsApi, cmsContentPath, ICMSContentApiPath } from '@futurebrand/services/cms'

class ContentService {
  private readonly fetcher: FetcherClient
  private readonly contentPath: ICMSContentApiPath
  private revalidate?: number

  constructor(configs: IContentServiceConfigs = {}) {
    this.fetcher = configs.fetcher || cmsApi
    this.contentPath = configs.contentPath || cmsContentPath
    this.revalidate = configs.revalidate
  }

  public setRevalidate(revalidate: number) {
    this.revalidate = revalidate
  }

  public async createRequest<T = any>(path: string, props: IServiceCallerProps<any> | any) {
    return await this.fetcher.get<T>(
      path,
      {
        params: props,
        revalidate: this.revalidate
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

  public async seo<T = IContent>(props: IServiceCallerProps<T>): Promise<T> {
    'use server'

    let response: IFetchResponse<T>

    try {
      response = await this.createRequest<T>(this.contentPath.seo, props)
    } catch (error) {
      console.error((error as FetcherError).body)
      throw new Error(`Error on get seo ${JSON.stringify(props.params)}`)
    }
  
    return response.data
  }

  public async preview<T = IContent>(token: string): Promise<T> {
    'use server'

    let response: IFetchResponse<T>

    try {
      response = await this.createRequest<T>(this.contentPath.preview, {
        token
      })
    } catch (error) {
      console.error((error as FetcherError).body)
      throw new Error('Error on get preview')
    }
  
    return response.data
  }

  public async query<T = IContent[]>(props: IServiceCallerProps<IQueryCallerParams>): Promise<IContentResponse<T>> {
    'use server'

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
