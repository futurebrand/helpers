import HelpersRouter from './router'
import { type IRouterConfig } from './types'

async function getRouter(configs: IRouterConfig) {
  const router = new HelpersRouter(configs)
  await router.init()
  return router
}

export default getRouter
