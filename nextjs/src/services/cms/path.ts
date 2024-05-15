import { ICMSContentApiPath } from './types'

let contentApiPath: ICMSContentApiPath

const cmsType = process.env.cmsType || 'strapi'

const strapiGlobalPath = '/futurebrand-strapi-helpers/global'
const strapiContentsPath = '/futurebrand-strapi-helpers/contents'

if (cmsType === 'strapi') {
  contentApiPath = {
    query: strapiContentsPath,
    map:  strapiContentsPath + '/map',
    single: strapiContentsPath + '/single',
    seo: strapiContentsPath + '/seo',
    preview: strapiContentsPath + '/preview',
    global: {
      locales: '/i18n/locales',
      data: strapiGlobalPath,
      seo: strapiGlobalPath + '/seo',
    }
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
    global: {
      locales: '',
      data: '',
      seo: '',
    }
  }
}

export default contentApiPath
