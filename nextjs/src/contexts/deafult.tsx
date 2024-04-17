import React, { PropsWithChildren } from 'react';

import { LocalizationsProvider } from './localizations';
import { DictonaryProvider } from './dictionary';
import { useServerDictionary } from '@futurebrand/hooks';

interface Props {
  locales: string[]
  locale: string;
}

const ContextsDefault: React.FC<PropsWithChildren<Props>> = async ({
  children,
  locale,
  locales
}) => {

  const dictionary = await useServerDictionary(locale)

  return (
    <LocalizationsProvider
      locale={locale}
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