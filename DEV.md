# Development Guide

## Internationalization (i18n)

This project uses `sveltekit-i18n` for handling translations and internationalization. The system is set up to support multiple languages, currently including English (en) and French (fr).

### Setup

The internationalization system is configured in [`src/lib/translations/index.ts`](src/lib/translations/index.ts). The
configuration includes:
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

The language selector is implemented in the layout component ([`src/routes/+layout.svelte`](src/routes/+layout.svelte)):

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
   - [`src/lib/translations/en/content.json`](src/lib/translations/en/content.json) for English
   - [`src/lib/translations/fr/content.json`](src/lib/translations/fr/content.json) for French

2. Use nested objects for organizing translations
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

The default language is set to French in [`src/routes/+layout.ts`](src/routes/+layout.ts):
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

1. Create a new language directory in [`src/lib/translations/`](src/lib/translations) (e.g., `es/` for Spanish)
2. Add the language content file (e.g., `content.json`)
3. Add the language name to `lang.json`
4. Update the configuration in [`index.ts`](src/lib/translations/index.ts) to include the new language

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

## RATP Services

The project includes a service layer for interacting with the RATP API. The implementation is located in
[`src/lib/utils/ratpServices.ts`](src/lib/services/ratpServices.ts).

### Features

- Singleton pattern for API client management
- Environment-based API key configuration
- Type-safe API responses using Zod schemas
- Support for both v1 and v2 API endpoints

### Usage Example

A small proof of concept (POC) is located in [`scripts/ratp_scripts/index.ts`](scripts/ratp_scripts/index.ts) to
demonstrate the usage of RATP services.

## Google Services

The project includes a service layer for interacting with the Google Maps API. The implementation is located in
[`src/lib/utils/googleServices.ts`](src/lib/services/googleServices.ts).

### Features

- Singleton pattern for API client management
- Environment-based API key configuration
- Type-safe API responses using Google Maps Services JS types
- Optimized place details requests

### Available Methods

- `placeAutocomplete`: Get place suggestions based on user input
- `placeDetails`: Get detailed information about a specific place (optimized for geometry data)

### Usage Example

A small POC is located in [`scripts/google_scripts/index.ts`](scripts/google_scripts/index.ts) to demonstrate the usage
of Google services.

## Input Debouncing

A custom Svelte action for debouncing input events is available in `src/lib/actions/debounce.ts`.

### Usage Example

```svelte
<script lang="ts">
  import { debounce } from '$lib/actions/debounce';
  
  let inputValue = '';
  
  function handleInput(value: string) {
    console.log('Input value:', value);
  }
</script>

<input 
  type="text" 
  bind:value={inputValue} 
  use:debounce={{ delay: 500, callback: handleInput }} 
/>
```
