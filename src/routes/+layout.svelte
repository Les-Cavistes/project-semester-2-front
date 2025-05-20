<script lang="ts">
// Imports
import { locale, locales, t } from "$lib/translations";

// Variables

// Functions
</script>

<header>
  <nav>
    <a href="/">Home</a>
    <a href="/journey">Journey Planner</a>
  </nav>
<select bind:value="{$locale}">
  {#each $locales as value}
    <option value="{value}">{$t(`lang.${value}`)}</option>
  {/each}
</select>
</header>

<main>
  <slot/>
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
  }
  
  nav {
    display: flex;
    gap: 1.5rem;
  }
  
  nav a {
    color: var(--text-color, #333);
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  nav a:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  main {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
</style>
