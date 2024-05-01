import { ICMSContentApiPath } from './types'

let contentApiPath: ICMSContentApiPath

const cmsType = process.env.cmsType || 'strapi'

const strapiContentsPath = '/futurebrand-strapi-helpers/contents'

if (cmsType === 'strapi') {
  contentApiPath = {
    query: strapiContentsPath,
    map:  strapiContentsPath + '/map',
    single: strapiContentsPath + '/single',
    seo: strapiContentsPath + '/seo',
    preview: strapiContentsPath + '/preview',
    locales: '/i18n/locales',
  }
} else if (cmsType === 'wp' || cmsType === 'wordpress') {
  /**
   * @TODO Add WordPress paths
   */
  contentApiPath = {
    query: '',
    map: '',
    single: '',
    seo: '',
    preview: '',
    locales: '',
  }
}

export default contentApiPath
