<script lang="ts">
  // Imports
  import {debounce} from '$lib/actions/debounce';
  import type {TPlaces} from "$lib/schemas";

  // Variables
  let from: string = '';
  let to: string = '';
  let fromSuggestions: TPlaces['places'] = [];
  let toSuggestions: TPlaces['places'] = [];

  // Add a reference to the "to" input
  let toInput: HTMLInputElement;

  // Track valid selections
  let isValidFrom = false;
  let isValidTo = false;

  // Derived value to check if both inputs have valid selections
  $: canSubmit = isValidFrom && isValidTo;

  // Functions
  const fetchPlace = async (search: string): Promise<TPlaces['places']> => {
    const res = await fetch(`/api/places?q=${encodeURIComponent(search)}`);
    if (!res.ok) {
      throw new Error('Failed to fetch places');
    }
    const data: TPlaces = await res.json();
    return data.places;
  }

  const validateInput = (value: string, suggestions: TPlaces['places']): boolean => {
    return suggestions.some(suggestion => suggestion.name === value);
  };

  const handleFromInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    isValidFrom = validateInput(input.value, fromSuggestions);

    if (isValidFrom) {
      toInput?.focus();
    }
  };

  const handleToInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    isValidTo = validateInput(input.value, toSuggestions);
  };

  const handleFromChange = async (value: string) => {
    if (!value.trim()) {
      fromSuggestions = [];
      isValidFrom = false;
      return;
    }

    try {
      fromSuggestions = await fetchPlace(value);
      isValidFrom = validateInput(value, fromSuggestions);
    } catch (error) {
      console.error('Error fetching places:', error);
      fromSuggestions = [];
      isValidFrom = false;
    }
  };

  const handleToChange = async (value: string) => {
    if (!value.trim()) {
      toSuggestions = [];
      isValidTo = false;
      return;
    }

    try {
      toSuggestions = await fetchPlace(value);
      isValidTo = validateInput(value, toSuggestions);
    } catch (error) {
      console.error('Error fetching places:', error);
      toSuggestions = [];
      isValidTo = false;
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    // find TPlace object
    const fromPlace = fromSuggestions.find(suggestion => suggestion.name === from);
    const toPlace = toSuggestions.find(suggestion => suggestion.name === to);

    
    if (!fromPlace || !toPlace) {
      console.error('Invalid place selection');
      return;
    }

    console.log('Searching journey from', fromPlace, 'to', toPlace);
  };
</script>

<div class="journey-container">
  <h1>Plan Your Journey</h1>

  <div class="route-inputs">
    <div class="input-group">
      <label for="from">From:</label>
      <input
          type="text"
          id="from"
          list="from-suggestions"
          bind:value={from}
          placeholder="Enter starting location"
          use:debounce={{ callback: handleFromChange, delay: 100 }}
          on:input={handleFromInput}
      />
      <datalist id="from-suggestions">
        {#each fromSuggestions as suggestion}
          <option value={suggestion.name}>
          </option>
        {/each}
      </datalist>
    </div>

    <div class="input-group">
      <label for="to">To:</label>
      <input
          type="text"
          id="to"
          list="to-suggestions"
          bind:value={to}
          bind:this={toInput}
          placeholder="Enter destination"
          use:debounce={{ callback: handleToChange, delay: 100 }}
          on:input={handleToInput}
      />
      <datalist id="to-suggestions">
        {#each toSuggestions as suggestion}
          <option value={suggestion.name}>
          </option>
        {/each}
      </datalist>
    </div>

    <button
        class="submit-button"
        on:click={handleSubmit}
        disabled={!canSubmit}
    >
      Search Journey
    </button>
  </div>
</div>

<style lang="scss">
  .journey-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;

    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 2rem;
      text-align: center;
    }
  }

  .route-inputs {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    .submit-button {
      margin-top: 0.5rem;
      padding: 0.75rem 1.5rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgb(59 130 246 / 0.2);
      }

      &:active {
        transform: translateY(0);
        box-shadow: none;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;

        &:hover {
          background-color: #9ca3af;
          transform: none;
          box-shadow: none;
        }
      }
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 500;
      color: #4b5563;
      font-size: 0.875rem;
      margin-left: 0.25rem;
    }

    input {
      padding: 0.75rem 1rem;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background-color: #f9fafb;

      &::placeholder {
        color: #9ca3af;
      }

      &:hover {
        border-color: #d1d5db;
      }

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        background-color: #ffffff;
      }
    }
  }

  // Media query for smaller screens
  @media (max-width: 480px) {
    .journey-container {
      margin: 1rem auto;

      h1 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }
    }

    .route-inputs {
      padding: 1.5rem;
    }

    .input-group input {
      padding: 0.625rem 0.875rem;
    }

    .route-inputs .submit-button {
      padding: 0.625rem 1.25rem;
    }
  }
</style>
