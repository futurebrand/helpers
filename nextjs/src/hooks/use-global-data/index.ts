"use server";

import { IGlobalData } from "@futurebrand/types/global-options";
import { getGlobalData } from "../get-global-data";

/**
 * @deprecated use getGlobalData instead
 */
export async function useGlobalData(locale: string): Promise<IGlobalData> {
  return getGlobalData(locale);
}
