"use server"

import { useLocale } from 'next-intl';
import { useGlobalData } from '@futurebrand/hooks'

export async function useServerDictionary(locale?: string) {
  const optionsLocale = locale ?? useLocale()

  if (!optionsLocale) {
    throw new Error('useServerDictionary: locale not provided and no locale found in cache.')
  }

  const globalData = await useGlobalData(optionsLocale)
  return globalData.options.dictionary
}
