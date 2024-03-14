import { IFetchConfig, IFetchResponse } from "./types";

abstract class FetcherClient {
  constructor(private basePath: string, private baseConfig?: IFetchConfig) {}
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
      body: this.mescleConfigParam(this.baseConfig?.body, config?.body),
      headers: this.mescleConfigParam(this.baseConfig?.headers, config?.headers),
      params: this.mescleConfigParam(this.baseConfig?.params, config?.params),
    }
  }
  abstract get<T = any>(slug: string, config?: IFetchConfig): Promise<IFetchResponse<T>>
  abstract post<T = any>(slug: string, config?: IFetchConfig): Promise<IFetchResponse<T>>
}

export default FetcherClient
