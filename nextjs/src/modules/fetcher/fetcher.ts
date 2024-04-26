import FetcherError from './fetcher.error'
import FetcherClient from './fetcher.interface'
import { IFetchConfig, IFetchResponse } from './types'

class Fetcher extends FetcherClient {

  private synthesizeParameters(params: Record<string, any> = {}) {
    const searchParameter = new URLSearchParams()
    
    const subParameters = (accumulatorKeys: string[], entry: any) => {
      for (const [subKey, subEntry] of Object.entries(entry)) {
        const keys = [...accumulatorKeys, subKey]
        if (subEntry !== null && typeof subEntry === 'object') {
          subParameters(keys, subEntry)
        } else {
          const firstKey = keys.shift()
          const key = keys.reduce(
            (accumulator, key) => `${accumulator}[${key}]`,
            firstKey
          ) as string
          if (subEntry != null) {
            searchParameter.append(key, subEntry as any)
          }
        }
      }
    }
  
    for (const [key, entry] of Object.entries(params)) {
      if (entry !== null && typeof entry === 'object') {
        subParameters([key], entry)
      } else {
        if (entry != null) {
          searchParameter.append(key, entry)
        }
      }
    }
  
    return searchParameter
  }

  private async fetch<T> (
    baseUrl: string,
    feachConfigs: IFetchConfig = {},
    method = 'GET'
  ): Promise<IFetchResponse<T>> {
    const requestConfig: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
      },
    }
    let requestUrl = baseUrl

    const { body, headers, params, revalidate } = feachConfigs

    if (revalidate || this.revalidate) {
      (requestConfig as any).next = {
        revalidate: revalidate ?? this.revalidate
      }
    }

    if (params) {
      const searchParameter = this.synthesizeParameters(params)
      requestUrl = `${requestUrl}?${searchParameter.toString()}`
    }

    if (headers) {
      requestConfig.headers = { ...requestConfig.headers, ...headers }
    }

    if (body) {
      if (typeof body === 'object') {
        requestConfig.body = JSON.stringify(body) as string
        (requestConfig.headers as any)['Content-Type'] = 'application/json'
      } else {
        requestConfig.body = body
      }
    }
    const requestProps = { url: requestUrl, ...requestConfig }


    try {
      const response = await fetch(requestUrl, requestConfig)
      const data = await response.json()

      if (response.status !== 200) {
        throw new FetcherError(requestProps, response, data)
      }

      return {
        data: data as T,
        headers: response.headers,
        request: requestProps,
        response,
      }

    } catch (error) {
      if (!(error instanceof FetcherError)) {
        console.error('* Unexpected Fetch Error', {
          request: requestProps
        })
      }
      
      throw error
    }
  }

  public async post<T = any>(path: string, config?: IFetchConfig) {
    return this.fetch<T>(this.getApiUrl(path), this.mescleConfig(config), 'POST')
  }

  public async get<T = any>(path: string, config?: IFetchConfig) {
    return this.fetch<T>(this.getApiUrl(path), this.mescleConfig(config), 'GET')
  }
}

export default Fetcher
