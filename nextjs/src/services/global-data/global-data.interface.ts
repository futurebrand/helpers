import { ICMSContentApiPath, cmsContentPath, cmsApi } from '@futurebrand/services'

import { FetcherClient } from '@futurebrand/modules/fetcher'
import { IGlobalData, IGlobalSEO } from '@futurebrand/types/global-options'

import type { IGlobalDataServiceConfigs } from './types'
  
abstract class GlobalDataClient  {
  private readonly fetcher: FetcherClient
  protected readonly contentPath: ICMSContentApiPath

  constructor(configs: IGlobalDataServiceConfigs = {}) {
    this.fetcher = configs.fetcher || cmsApi
    this.contentPath = configs.contentPath  || cmsContentPath
  }

  public get path () {
    return this.contentPath.global
  }

  public get api () {
    return this.fetcher
  }

  public abstract get(): Promise<IGlobalData>
  public abstract seo(): Promise<IGlobalSEO>

}

export default GlobalDataClient
