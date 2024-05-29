"use server"

import { getLocale } from 'next-intl/server';
import { useGlobalData } from '@futurebrand/hooks'

export async function useServerDictionary(locale?: string) {
  const optionsLocale = locale ?? await getLocale()

  if (!optionsLocale) {
    throw new Error('useServerDictionary: locale not provided and no locale found in cache.')
  }

  const globalData = await useGlobalData(optionsLocale)
  return globalData.options.dictionary
}
