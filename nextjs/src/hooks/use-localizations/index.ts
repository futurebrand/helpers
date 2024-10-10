'use client'

import {
  type ILocalizationsContext,
  LocalizationsContext,
} from '@futurebrand/contexts/localizations'
import { useContext, useMemo } from 'react'

export function useLocalizations(): ILocalizationsContext {
  return useContext(LocalizationsContext)
}

export function useLocales() {
  const { locales } = useLocalizations()
  return useMemo(() => locales, [locales])
}

export function useLocale() {
  const { locale } = useLocalizations()
  return useMemo(() => locale, [locale])
}

export function useIsDefaultLocale() {
  const { isDefaultLocale } = useLocalizations()
  return useMemo(() => isDefaultLocale, [isDefaultLocale])
}
