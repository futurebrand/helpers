import { type I18nConfig } from '@futurebrand/services'
import { type IDictonary } from '@futurebrand/types/global-options'
import React, { type PropsWithChildren } from 'react'

import { DictonaryProvider } from './dictionary'
import { LocalizationsProvider } from './localizations'

interface Props extends I18nConfig {
  locale: string
  dictionary: IDictonary
}

const ContextsDefault: React.FC<PropsWithChildren<Props>> = async ({
  children,
  locale,
  locales,
  defaultLocale,
  dictionary,
}) => {
  return (
    <LocalizationsProvider
      locale={locale}
      defaultLocale={defaultLocale}
      locales={locales}
    >
      <DictonaryProvider dictionary={dictionary}>{children}</DictonaryProvider>
    </LocalizationsProvider>
  )
}

export default ContextsDefault
