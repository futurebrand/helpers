import Fetcher from '@futurebrand/modules/fetcher'

const basePath = `${process.env.cmsBaseUrl}/api`
const token = process.env.CMS_BACKEND_TOKEN || process.env.cmsFrontendToken

const api = new Fetcher(basePath, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export default api
