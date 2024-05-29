import { cmsApi } from '@futurebrand/services'
import { I18nConfig, ILocalesApiData } from './types'
import contentApiPath from './path'
import cacheFunction from '@futurebrand/utils/server-cache/memory-cache'

async function loadLocalization () : Promise<I18nConfig> {
  const fetchRevalidate = process.env.fetchRevalidate
  const revalidate = fetchRevalidate ? Number(fetchRevalidate) : 60
  
  const response = await cmsApi.get<ILocalesApiData[]>(contentApiPath.global.locales, {
    revalidate
  })
  
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


export default cacheFunction('cms-locales', loadLocalization)