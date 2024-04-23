import React, { PropsWithChildren } from 'react';

import { LocalizationsProvider } from './localizations';
import { DictonaryProvider } from './dictionary';
import { IDictonary } from '@futurebrand/types/global-options';

interface Props {
  locales: string[]
  locale: string;
  dictionary: IDictonary
}

const ContextsDefault: React.FC<PropsWithChildren<Props>> = async ({
  children,
  locale,
  locales,
  dictionary
}) => {

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