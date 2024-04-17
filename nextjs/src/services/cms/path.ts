import { ICMSContentApiPath } from './types'

let contentApiPath: ICMSContentApiPath

const cmsType = process.env.cmsType || 'strapi'

if (cmsType === 'strapi') {
  contentApiPath = {
    query: '/futurebrand-strapi-helpers/contents',
    map: '/futurebrand-strapi-helpers/contents/map',
    single: '/futurebrand-strapi-helpers/contents/single',
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
    locales: '',
  }
}

export default contentApiPath
