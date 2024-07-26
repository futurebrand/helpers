import { createCacheContext } from "@futurebrand/utils";

import { IDictonary } from "@futurebrand/types/global-options";

const [getServerDictionary, setServerDictionary] =
  createCacheContext<IDictonary | null>(null);

export { getServerDictionary, setServerDictionary };
