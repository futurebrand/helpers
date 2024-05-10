import { cmsApi } from '@futurebrand/services'
import { cache } from '@futurebrand/utils'
import { I18nConfig, ILocalesApiData } from './types'
import contentApiPath from './path'

async function loadLocalization () : Promise<I18nConfig> {

  const response = await cmsApi.get<ILocalesApiData[]>(contentApiPath.locales)
  
  if (!response.data && !response.data.length) {
    return {
      locales: [],
      defaultLocale: '',
    }
  }

  const locales = response.data.map((locale) => locale.code)
  const defaultLocale = response.data.find((locale) => locale.isDefault)?.code

  const data: I18nConfig = {
    locales: locales ?? [],
    defaultLocale: defaultLocale ?? '',
  }

  return data
}

export default cache('cms-locales', loadLocalization)
