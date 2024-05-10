import { cache } from "@futurebrand/utils";
import { IRouterConfig } from "./types";

import HelpersRouter from './router'

async function getRouter(configs: IRouterConfig) {
  const router = new HelpersRouter(configs)
  await router.init()
  return router
}

export default cache('helpers-router', getRouter)