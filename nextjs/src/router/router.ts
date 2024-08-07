import { ResolvingMetadata } from "next";
import RouterContentType from "./content-type";
import CurrentRoute from "./current";
import RouterLocalization from "./localization";
import RouterSEO from "./seo";
import { IRoute, IRouterConfig } from "./types";
import RouterMap from "./map";
import { ContentTypes } from "@futurebrand/types/contents";

class HelpersRouter {
  public isInitialized: boolean
  
  public localization: RouterLocalization
  public contentType: RouterContentType
  public seo: RouterSEO
  public map: RouterMap

  public current: CurrentRoute

  constructor (configs: IRouterConfig) {
    if ('window' in globalThis) {
      throw new Error('Router should be used only in server side')
    }

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

  /** @SETTERS */

  /**
   * Set current route data
   */
  public setRoute(router: IRoute) {
    this.current.update(router)
  }

  /** @GETTERS */

  /**
   * Get content SEO
   */
  public async getSEO(router: IRoute, parent: ResolvingMetadata, revalidate: number) {
    this.setRoute(router)
    this.seo.setRevalidate(revalidate)
    return this.seo.getData(parent)
  }

  /**
   * Get content path localized
   */
  public getLocalizedPath(
    params: any,
    locale: string,
    type: ContentTypes = 'pages'
  ) {
    return this.contentType.getLocalizedPath(params, locale, type)
  }

  /**
   * Get content path
   */
  public getPath(
    params: any,
    locale: string,
    type: ContentTypes = 'pages'
  ) {
    return this.contentType.getPathFromParams(params, locale, type)
  }

  /**
   * Get content url
   */
  public getUrl(
    params: any,
    locale: string,
    type: ContentTypes = 'pages'
  ) {
    const path = this.getLocalizedPath(params, locale, type)
    return this.contentType.getPathUrl(path)
  }

}



export default HelpersRouter