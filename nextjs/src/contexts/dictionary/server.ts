import { createCacheContext } from "@futurebrand/utils";

import { IDictonaryContext } from "./dictionary";

const [getServerDictionary, setServerDictionary] =
  createCacheContext<IDictonaryContext>({ dictionary: {} });

export { getServerDictionary, setServerDictionary };
