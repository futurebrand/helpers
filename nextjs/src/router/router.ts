import { ResolvingMetadata } from "next";
import RouterContentType from "./content-type";
import CurrentRoute from "./current";
import RouterLocalization from "./localization";
import RouterSEO from "./seo";
import { IRoute, IRouterConfig } from "./types";
import RouterMap from "./map";

class HelpersRouter {
  public isInitialized: boolean
  
  public localization: RouterLocalization
  public contentType: RouterContentType
  public seo: RouterSEO
  public map: RouterMap

  public current: CurrentRoute

  constructor (configs: IRouterConfig) {
    this.isInitialized = false;
    this.contentType = new RouterContentType(this, configs.slugs)
    this.localization = new RouterLocalization(this)
    this.current = new CurrentRoute(this)
    this.seo = new RouterSEO(this)
    this.map = new RouterMap(this)
  }

  public async init() {
    await this.localization.load()
    this.isInitialized = true
  }

  public setRoute(router: IRoute) {
    this.current.update(router)
  }

  public async getSEO(router: IRoute, parent?: ResolvingMetadata) {
    this.setRoute(router)
    return this.seo.getData(parent)
  }

}



export default HelpersRouter