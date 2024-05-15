import { FetcherClient } from "@futurebrand/modules";
import { ICMSContentApiPath } from "../cms";

export interface IGlobalDataServiceConfigs {
  fetcher?: FetcherClient
  contentPath?: ICMSContentApiPath
}
