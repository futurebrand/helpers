import React, { PropsWithChildren } from "react";

import { LocalizationsProvider } from "./localizations";
import { DictonaryProvider, setServerDictionary } from "./dictionary";
import { IDictonary } from "@futurebrand/types/global-options";
import { I18nConfig } from "@futurebrand/services";
import { getGlobalData } from "@futurebrand/hooks";

interface Props extends I18nConfig {
  locale: string;
  dictionary: IDictonary;
}

const ContextsDefault: React.FC<PropsWithChildren<Props>> = async ({
  children,
  locale,
  locales,
  defaultLocale,
  dictionary,
}) => {
  setServerDictionary({ dictionary });
  await getGlobalData(locale);

  return (
    <LocalizationsProvider
      locale={locale}
      defaultLocale={defaultLocale}
      locales={locales}
    >
      <DictonaryProvider dictionary={dictionary}>{children}</DictonaryProvider>
    </LocalizationsProvider>
  );
};

export default ContextsDefault;
