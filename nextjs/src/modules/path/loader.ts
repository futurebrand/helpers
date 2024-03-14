import cmsApi from '@futurebrand/strapi/api';
import { ICurrentPath, ILocaleContentSlugs, IPathData, IStrapiLocales } from "./types";

export async function loadPathData (currentLocale?: string, slugs?: ILocaleContentSlugs) {
  const response = await cmsApi.get<IStrapiLocales[]>('/i18n/locales')

  if (!response.data && !response.data.length) {
    return {
      locales: [],
      defaultLocale: '',
      slugs: slugs ?? {},
      currentPath: {
        locale: currentLocale ?? '',
        slug: '',
        type: 'pages',
      } as ICurrentPath,
    }
  }

  const locales = response.data.map((locale) => locale.code)
  const defaultLocale = response.data.find((locale) => locale.isDefault)?.code

  const data: IPathData = {
    locales: locales ?? [],
    defaultLocale: defaultLocale ?? '',
    slugs: slugs ?? {},
    currentPath: {
      locale: currentLocale ?? defaultLocale,
      slug: '/',
      type: 'pages',
    } as ICurrentPath,
  }

  return data
}
