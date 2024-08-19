"use server";

import { getGlobalData } from "@futurebrand/hooks";
import { getLocale } from "next-intl/server";

export async function getDictionary(locale?: string) {
  const optionsLocale = locale ?? (await getLocale());

  if (!optionsLocale) {
    throw new Error(
      "useServerDictionary: locale not provided and no locale found in cache."
    );
  }

  const globalData = await getGlobalData(optionsLocale);
  return globalData.options.dictionary;
}
