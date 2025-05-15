import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  // This function is required for the page to work with SvelteKit's routing,
  // but we don't need to load any specific data at this time.
  return {};
};