import cmsApi from '@futurebrand/strapi/api';
import { ICurrentPath, ILocaleContentSlugs, IPathCache, IStrapiLocales } from "./types";

export async function loadPathData (slugs?: ILocaleContentSlugs) {
  const response = await cmsApi.get<IStrapiLocales[]>('/i18n/locales')

  if (!response.data && !response.data.length) {
    return {
      locales: [],
      defaultLocale: '',
      slugs: slugs ?? {},
      currentPath: {
        locale: '',
        slug: '',
        type: 'pages',
      } as ICurrentPath,
    }
  }

  const locales = response.data.map((locale) => locale.code)
  const defaultLocale = response.data.find((locale) => locale.isDefault)?.code

  const data: IPathCache = {
    locales: locales ?? [],
    defaultLocale: defaultLocale ?? '',
    slugs: slugs ?? {},
    currentPath: {
      locale: defaultLocale,
      slug: '/',
      type: 'pages',
    } as ICurrentPath,
  }

  return data
}
