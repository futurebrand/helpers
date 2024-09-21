import { useIntl } from "react-intl";

function useLocale() {
  const { locale } = useIntl();
  return locale;
}

export default useLocale;
