import { ContentTypes } from "@futurebrand/types/contents"
import { IRoute } from "../types"
import HelpersRouter from "../router"

class CurrentRoute {
  public path: string
  public locale: string
  public params: Record<string, string>
  public type: ContentTypes

  constructor (private router: HelpersRouter) {}

  public update(route: IRoute) {
    this.locale = route.locale
    if ('type' in route) {
      this.type = route.type
      this.params = route.params
      this.path = this.router.contentType.getPathFromParams(this.params, this.locale, this.type)
    } else {
      this.path = route.slug ? `/${route.slug.join('/')}` : '/'
      this.type = this.router.contentType.getTypeFromString(this.path, this.locale)
      this.params = this.router.contentType.getParamsFromString(this.path, this.type, this.locale)
    }
  }

  public get url() {
    return this.router.contentType.getUrl(this.path, this.locale)
  }
}

export default CurrentRoute