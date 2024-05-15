import React, { PropsWithChildren } from 'react';

import { LocalizationsProvider } from './localizations';
import { DictonaryProvider } from './dictionary';
import { IDictonary } from '@futurebrand/types/global-options';
import { I18nConfig } from '@futurebrand/services';

interface Props extends I18nConfig{
  locale: string
  dictionary: IDictonary
}

const ContextsDefault: React.FC<PropsWithChildren<Props>> = async ({
  children,
  locale,
  locales,
  defaultLocale,
  dictionary
}) => {

  return (
    <LocalizationsProvider
      locale={locale}
      defaultLocale={defaultLocale}
      locales={locales}
    >
      <DictonaryProvider
        dictionary={dictionary}
      >
        {children}
      </DictonaryProvider>
    </LocalizationsProvider>
  )
}

export default ContextsDefault;