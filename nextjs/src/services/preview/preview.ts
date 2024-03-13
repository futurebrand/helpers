import { notFound } from 'next/navigation'

import { IPreviewProps } from './types'
import { ApiResponse } from '@futurebrand/types/strapi'
import type { FetcherClient  } from '@futurebrand/modules/fetcher'
import type {IContent } from '~/types/contents'
import cmsApi from '@futurebrand/strapi/api'

class PreviewContentService {
  private readonly fetcher: FetcherClient

  constructor(fetcher?: FetcherClient) {
    this.fetcher = fetcher || cmsApi
  }

  async queryPreview ({ api, id, token }: IPreviewProps) {
    let response: ApiResponse<IContent>
  
    try {
      response = await this.fetcher.get('/strapi-preview-link/data', {
        params: {
          api,
          id,
          token,
          populate: 'deep',
        }
      })
    } catch (error) {
      console.error(error)
      notFound()
    }
  
    const pageData = response?.data?.data?.attributes
  
    if (!pageData) {
      throw new Error('Page attributes not Found')
    }
  
    return pageData
  }
  
}

export default PreviewContentService
