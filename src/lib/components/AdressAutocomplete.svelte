<script lang="ts">
import type { TPlaces } from "$lib/schemas";
import { ratpServices } from "$lib/services/ratpServices";
import { onMount } from "svelte";

// Définir les types pour les suggestions
interface Suggestion {
  id: string;
  name: string;
  address?: string;
  type: string;
  coordinates: [number, number] | null;
}

// Définir le type pour le callback
type AddressSelectedCallback = (place: Suggestion) => void;

interface Props {
  placeholder?: string;
  onAddressSelected?: AddressSelectedCallback;
  value?: string;
  label?: string;
}

const {
  placeholder = "Saisissez une adresse...",
  onAddressSelected,
  value = "",
  label = "Adresse",
}: Props = $props();

let inputValue = $state(value);
let suggestions: Suggestion[] = $state([]);
let isLoading = $state(false);
let showSuggestions = $state(false);
let selectedIndex = $state(-1);
let inputRef: HTMLInputElement;
let suggestionsRef: HTMLUListElement;
let debounceTimeout: ReturnType<typeof setTimeout>;

// Debounce function avec un type plus précis
function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number,
): (...args: T) => void {
  return function executedFunction(...args: T) {
    const later = () => {
      clearTimeout(debounceTimeout);
      func(...args);
    };
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(later, wait);
  };
}

async function searchPlaces(query: string) {
  if (query.length < 3) {
    suggestions = [];
    showSuggestions = false;
    return;
  }

  isLoading = true;
  try {
    const ratpService = ratpServices();
    const response = await ratpService.getStopAutocomplete(query);

    // Filtrer et formater les résultats avec une meilleure gestion des types
    suggestions =
      response.places?.map((place) => {
        const suggestion: Suggestion = {
          id: place.id,
          name: place.name,
          type: place.embedded_type,
          coordinates: null,
        };

        // Gestion sécurisée de l'adresse
        if (
          place.embedded_type === "address" &&
          "address" in place &&
          place.address &&
          typeof place.address === "object" &&
          "label" in place.address
        ) {
          suggestion.address = (place.address as { label: string }).label;
        } else {
          suggestion.address = place.name;
        }

        // Gestion sécurisée des coordonnées
        if (
          "coord" in place &&
          place.coord &&
          typeof place.coord === "object" &&
          "lat" in place.coord &&
          "lon" in place.coord
        ) {
          suggestion.coordinates = [
            Number.parseFloat(
              (place.coord as { lat: string; lon: string }).lat,
            ),
            Number.parseFloat(
              (place.coord as { lat: string; lon: string }).lon,
            ),
          ];
        }

        return suggestion;
      }) || [];

    showSuggestions = suggestions.length > 0;
    selectedIndex = -1;
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    suggestions = [];
    showSuggestions = false;
  } finally {
    isLoading = false;
  }
}

const debouncedSearch = debounce(searchPlaces, 300);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  inputValue = target.value;
  debouncedSearch(inputValue);
}

function selectSuggestion(suggestion: Suggestion) {
  inputValue = suggestion.address || suggestion.name;
  showSuggestions = false;
  suggestions = [];
  selectedIndex = -1;

  if (onAddressSelected) {
    onAddressSelected(suggestion);
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!showSuggestions || suggestions.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectSuggestion(suggestions[selectedIndex]);
      }
      break;
    case "Escape":
      showSuggestions = false;
      selectedIndex = -1;
      inputRef.blur();
      break;
  }
}

function handleBlur() {
  // Délai pour permettre le clic sur une suggestion
  setTimeout(() => {
    showSuggestions = false;
    selectedIndex = -1;
  }, 150);
}

function handleFocus() {
  if (suggestions.length > 0) {
    showSuggestions = true;
  }
}

onMount(() => {
  return () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  };
});
</script>

<div class="address-autocomplete">
  {#if label}
    <label for="address-input" class="label">{label}</label>
  {/if}
  <div class="input-container">
    <input
      bind:this={inputRef}
      id="address-input"
      type="text"
      bind:value={inputValue}
      placeholder={placeholder}
      on:input={handleInput}
      on:keydown={handleKeydown}
      on:blur={handleBlur}
      on:focus={handleFocus}
      class="input"
      autocomplete="off"
    />
    
    {#if isLoading}
      <div class="loading-indicator">
        <div class="spinner"></div>
      </div>
    {/if}
    
    {#if showSuggestions && suggestions.length > 0}
      <ul bind:this={suggestionsRef} class="suggestions">
        {#each suggestions as suggestion, index}
          <li
            class="suggestion-item"
            class:selected={index === selectedIndex}
            on:click={() => selectSuggestion(suggestion)}
            role="option"
            tabindex="-1"
          >
            <div class="suggestion-content">
              <div class="suggestion-header">
                <span class="suggestion-name">{suggestion.name}</span>
                <span class="suggestion-type">{suggestion.type}</span>
              </div>
              {#if suggestion.address && suggestion.address !== suggestion.name}
                <span class="suggestion-address">{suggestion.address}</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .address-autocomplete {
    position: relative;
    width: 100%;
  }

  .label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #1f2937;
    font-size: 0.9rem;
  }

  .input-container {
    position: relative;
  }

  .input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    line-height: 1.5;
    background-color: white;
    transition: all 0.2s ease;
  }

  .input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .loading-indicator {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 50;
    margin: 0;
    padding: 0;
    list-style: none;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    max-height: 250px;
    overflow-y: auto;
    margin-top: 0.5rem;
  }

  .suggestion-item {
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.15s ease;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item.selected {
    background-color: #f8faff;
  }

  .suggestion-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .suggestion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .suggestion-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 0.9rem;
    flex: 1;
  }

  .suggestion-type {
    color: #3b82f6;
    font-size: 0.75rem;
    text-transform: capitalize;
    background-color: #eff6ff;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .suggestion-address {
    color: #6b7280;
    font-size: 0.8rem;
    line-height: 1.4;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .suggestions {
      max-height: 200px;
    }
    
    .suggestion-item {
      padding: 0.75rem;
    }

    .suggestion-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .suggestion-type {
      align-self: flex-start;
    }
  }

  @media (max-width: 480px) {
    .input {
      padding: 0.875rem;
      font-size: 16px;
    }
  }
</style>