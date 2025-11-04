import { getRequestConfig } from "next-intl/server";

import { defaultLocale, locales } from "./locales";
import type { Locale } from "./locales";

const dictionaries: Record<
  Locale,
  () => Promise<Record<string, unknown>>
> = {
  en: () => import("../messages/en.json").then((mod) => mod.default),
  es: () => import("../messages/es.json").then((mod) => mod.default),
};

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: normalizedLocale,
    messages: await dictionaries[normalizedLocale](),
  };
});
