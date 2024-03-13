import cmsApi from '@futurebrand/strapi/api'

import { FetcherClient } from '@futurebrand/modules/fetcher'
import { IGlobalStructure, IGlobalOptions } from '@futurebrand/types/global-options'

abstract class GlobalClient  {
  private readonly fetcher: FetcherClient
  public readonly locale: string
  public initialized: boolean

  constructor(
    locale?: string,
    fetcher?: FetcherClient
  ) {
    this.fetcher = fetcher || cmsApi
    this.locale = locale || 'en'
    this.initialized = false
  }

  public get api () {
    return this.fetcher
  }

  public abstract get options(): IGlobalOptions
  public abstract get structure(): IGlobalStructure

}

export default GlobalClient
