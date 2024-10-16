import { useQueryParams } from "@strapi/helper-plugin";
import { useMemo } from "react";

function useLocale(data: any) {
  const [{ query }] = useQueryParams();
  const locale: string | null = useMemo(
    () => data?.locale || (query as any)?.plugins?.i18n?.locale || null,
    [query, data]
  );
  return locale;
}

export default useLocale;
