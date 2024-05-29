import { ContentTypes } from "@futurebrand/types/contents"
import { IRoute } from "../types"
import HelpersRouter from "../router"
import { createCacheContext } from "@futurebrand/utils"

interface ICurrentRoute {
  path: string
  locale: string
  params: Record<string, string>
  type: ContentTypes
}

const [getCache, updateCache] = createCacheContext<ICurrentRoute | null>(null);

class CurrentRoute implements ICurrentRoute{
  public path: string
  public locale: string
  public params: Record<string, string>
  public type: ContentTypes

  constructor (private router: HelpersRouter) {
    const cacheData = getCache()
    if (cacheData) {
      this.path = cacheData.path
      this.locale = cacheData.locale
      this.params = cacheData.params
      this.type = cacheData.type
    }
  }

  public update(route: IRoute) {
    this.locale = route.locale
    if ('type' in route) {
      this.type = route.type
      this.params = route.params
      this.path = this.router.getPath(this.params, this.locale, this.type)
    } else {
      this.path = route.slug ? `/${route.slug.join('/')}` : '/'
      this.type = this.router.contentType.getTypeFromString(this.path, this.locale)
      this.params = this.router.contentType.getParamsFromString(this.path, this.type, this.locale)
    }

    updateCache({
      path: this.path,
      locale: this.locale,
      params: this.params,
      type: this.type
    })
  }

  public get url() {
    return this.router.getUrl(this.params, this.locale, this.type)
  }
}

export default CurrentRoute