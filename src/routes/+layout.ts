import { loadTranslations } from "$lib/translations";
import type { Load } from "@sveltejs/kit";

export const load: Load = async ({ url }) => {
  const { pathname } = url;

  const initLocale = "fr"; // default locale

  await loadTranslations(initLocale, pathname); // keep this just before the `return`

  return {};
};
