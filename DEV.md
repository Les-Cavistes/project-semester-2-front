# Development Guide

## Internationalization (i18n)

This project uses `sveltekit-i18n` for handling translations and internationalization. The system is set up to support multiple languages, currently including English (en) and French (fr).

### Setup

The internationalization system is configured in `src/lib/translations/index.ts`. The configuration includes:
- Available languages (en, fr)
- Translation loaders for each language
- Language names in their native form

### Directory Structure

```
src/lib/translations/
├── index.ts           # Main i18n configuration
├── lang.json          # Language names
├── en/
│   └── content.json   # English translations
└── fr/
    └── content.json   # French translations
```

### How to Use

#### 1. Accessing Translations in Components

To use translations in your Svelte components:

```svelte
<script lang="ts">
  import { t } from '$lib/translations';
</script>

<h1>{$t('main.welcome')}</h1>
```

#### 2. Language Selection

The language selector is implemented in the layout component (`src/routes/+layout.svelte`):

```svelte
<script lang="ts">
  import { locale, locales, t } from '$lib/translations';
</script>

<select bind:value={$locale}>
  {#each $locales as value}
    <option value={value}>{$t(`lang.${value}`)}</option>
  {/each}
</select>
```

#### 3. Adding New Translations

1. Add new translation keys to the language-specific content files:
   - `src/lib/translations/en/content.json` for English
   - `src/lib/translations/fr/content.json` for French

2. Use nested objects for organizing translations:
```json
{
  "section": {
    "key": "Translation"
  }
}
```

3. Access nested translations using dot notation:
```svelte
{$t('section.key')}
```

#### 4. Default Language

The default language is set to French in `src/routes/+layout.ts`:
```typescript
const initLocale = 'fr';
```

### Best Practices

1. **Organize Translations**: Group related translations under meaningful namespaces
2. **Use Consistent Keys**: Maintain consistent naming conventions across all language files
3. **Keep Translations Updated**: Ensure all language files contain the same keys
4. **Use TypeScript**: Leverage TypeScript for type-safe translation keys

### Adding a New Language

To add a new language:

1. Create a new language directory in `src/lib/translations/` (e.g., `es/` for Spanish)
2. Add the language content file (e.g., `content.json`)
3. Add the language name to `lang.json`
4. Update the configuration in `index.ts` to include the new language

Example for adding Spanish:
```typescript
// In index.ts
export const config: Config = {
  translations: {
    en: { lang },
    fr: { lang },
    es: { lang }, // Add new language
  },
  loaders: [
    // ... existing loaders
    {
      locale: 'es',
      key: 'main',
      loader: async () => (await import('./es/content.json')).default,
    },
  ],
};
```
