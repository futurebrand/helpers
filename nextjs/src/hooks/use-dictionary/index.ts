import { getServerDictionary } from "@futurebrand/contexts";
import { useContext } from "react";
import { DictonaryContext } from "@futurebrand/contexts";

export { useServerDictionary } from "./use-server-dictionary";
export { useClientDictionary } from "./use-client-dictionary";

export function useDictionary() {
  if (typeof window === "undefined") {
    const dictionary = getServerDictionary();
    if (dictionary) {
      return dictionary;
    }
  }
  const { dictionary } = useContext(DictonaryContext);
  return dictionary;
}
