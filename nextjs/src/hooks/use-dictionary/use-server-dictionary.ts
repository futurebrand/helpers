import { getDictionary } from "../get-dictionary";

/**
 * @deprecated use getDictionary instead
 */
export async function useServerDictionary(locale?: string) {
  return await getDictionary(locale);
}
