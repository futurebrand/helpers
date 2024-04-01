import { BeforeQueryEvent, BeforeGetSingleEvent, AfterGetSingleEvent, AfterQueryEvent, FilterEvent, IFilter } from "./types";

class ContentModuleEvents<T = IFilter> {
  protected onFilterEvent: FilterEvent<T>
  protected beforeQueryEvent: BeforeQueryEvent
  protected afterQueryEvent: AfterQueryEvent
  protected beforeGetSingleEvent: BeforeGetSingleEvent
  protected afterGetSingleEvent: AfterGetSingleEvent

  constructor() {
    this.onFilterEvent = async () => ({})

    this.beforeQueryEvent = async (params) => params
    this.afterQueryEvent = async (data) => data

    this.beforeGetSingleEvent = async (params) => params
    this.afterGetSingleEvent = async (data) => data
  }

  public onGetFilter(event: FilterEvent<T>) {
    this.onFilterEvent = event
  }

  public onBeforeQuery(event: BeforeQueryEvent) {
    this.beforeQueryEvent = event
  }

  public onAfterQuery(event: AfterQueryEvent) {
    this.afterQueryEvent = event
  }

  public onBeforeGetSingle(event: BeforeGetSingleEvent) {
    this.beforeGetSingleEvent = event
  }

  public onAfterGetSingle(event: AfterGetSingleEvent) {
    this.afterGetSingleEvent = event
  }
}

export default ContentModuleEvents