import { IFetchConfig, IFetchResponse } from "./types";

abstract class FetcherClient {
  public revalidate?: number
  public body?: Record<string, any>
  public headers?: Record<string, any>
  public params?: Record<string, any>

  constructor(public basePath: string, configs?: IFetchConfig) {
    const envRevalidate = process.env.fetchRevalidate ? parseInt(process.env.fetchRevalidate) : undefined
    this.revalidate = configs?.revalidate ?? envRevalidate

    this.body = configs?.body
    this.headers = configs?.headers
    this.params = configs?.params
  }

  public getApiUrl(path: string) {
    return `${this.basePath}${path}`
  }

  private mescleConfigParam(base?: IFetchConfig, other?: IFetchConfig) {
    if (!base && !other) return undefined
    if (!base) return other
    if (!other) return base
    return {
      ...base,
      ...other,
    }
  }

  public mescleConfig(config?: IFetchConfig): IFetchConfig {
    return {
      body: this.mescleConfigParam(this.body, config?.body),
      headers: this.mescleConfigParam(this.headers, config?.headers),
      params: this.mescleConfigParam(this.params, config?.params),
      revalidate: config?.revalidate ?? this.revalidate,
    }
  }
  abstract get<T = any>(slug: string, config?: IFetchConfig): Promise<IFetchResponse<T>>
  abstract post<T = any>(slug: string, config?: IFetchConfig): Promise<IFetchResponse<T>>
}

export default FetcherClient
