import i18n from '~/configs/i18n.json'
import cmsApi from '~/utils/cms-api'

import { FetcherClient } from '~/modules/fetcher'
import { IGlobalStructure, IGlobalOptions } from '~/types/global-options'

abstract class GlobalClient implements IGlobalStructure, IGlobalStructure {
  private readonly fetcher: FetcherClient
  public readonly locale: string
  public initialized: boolean

  constructor(
    locale?: string,
    fetcher?: FetcherClient
  ) {
    this.fetcher = fetcher || cmsApi
    this.locale = locale || i18n.defaultLocale
    this.initialized = false
  }

  public get api () {
    return this.fetcher
  }

  public abstract get header(): IGlobalStructure['header']
  public abstract get footer(): IGlobalStructure['footer']
  public abstract get menu(): IGlobalStructure['menu']

  public abstract get globalSEO(): IGlobalOptions['globalSEO']
  public abstract get dictionary(): IGlobalOptions['dictionary']
  public abstract get notFound(): IGlobalOptions['notFound']

}

export default GlobalClient
