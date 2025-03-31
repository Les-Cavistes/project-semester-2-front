/**
 * @file src/lib/translations/index.ts
 * @description index
 * @author Tom Planche
 */
import i18n, {type Config} from 'sveltekit-i18n';
import lang from './lang.json';

export const config: Config = {
  translations: {
    en: {lang},
    fr: {lang},
  },
  loaders: [
    {
      locale: 'en',
      key: 'main',
      loader: async () => (await import('./en/content.json')).default,
    },
    {
      locale: 'fr',
      key: 'main',
      loader: async () => (await import('./fr/content.json')).default,
    },
  ],
};

export const {t, loading, locales, locale, loadTranslations} = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));

/**
 * End of file src/lib/translations/index.ts
 */