import React, { PropsWithChildren } from 'react';

import { LocalizationsProvider } from './localizations';
import { DictonaryProvider } from './dictionary';
import { ClientPathProvider } from './client-path';
import { usePathModule } from '@futurebrand/hooks';
import { getDictionary } from '@futurebrand/utils';

interface Props {
  locale: string;
}

const ContextsDefault: React.FC<PropsWithChildren<Props>> = async ({
  children,
  locale
}) => {
  const pathModule = await usePathModule()
  pathModule.setCurrentLocale(locale)

  const dictionary = await getDictionary()

  return (
    <LocalizationsProvider
      locale={locale}
      locales={pathModule.locales}
    >
      <DictonaryProvider
        dictionary={dictionary}
      >
        <ClientPathProvider 
          locale={locale}
          slugs={pathModule.slugs}
        >
          {children}
        </ClientPathProvider>
      </DictonaryProvider>
    </LocalizationsProvider>
  )
}

export default ContextsDefault;