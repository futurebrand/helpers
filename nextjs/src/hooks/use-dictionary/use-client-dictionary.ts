"use client";

import { useContext } from "react";
import { DictonaryContext } from "@futurebrand/contexts";

/**
 * @deprecated use getDictionary instead
 */
export function useClientDictionary() {
  const { dictionary } = useContext(DictonaryContext);
  return dictionary;
}
