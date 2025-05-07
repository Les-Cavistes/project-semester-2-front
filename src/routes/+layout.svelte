<script lang="ts">
// Imports
import { locale, locales, t } from "$lib/translations";

// Variables

// Functions
</script>

<select bind:value="{$locale}">
  {#each $locales as value}
    <option value="{value}">{$t(`lang.${value}`)}</option>
  {/each}
</select>

<main>
  <slot/>
</main>