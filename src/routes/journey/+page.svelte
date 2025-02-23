<script lang="ts">
  // Imports
  import {debounce} from '$lib/actions/debounce';
  import type {TPlaces} from "$lib/schemas";

  // Variables
  let from: string = '';
  let to: string = '';
  let fromSuggestions: TPlaces['places'] = [];
  let toSuggestions: TPlaces['places'] = [];
  let datetime: string;
  let datetimeRepresents: 'departure' | 'arrival' = 'departure';
  let useNow: boolean = true;

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

  // Helper to format datetime to YYYYMMDDTHHMMSS
  const formatDatetime = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').slice(0, 15);
  };

  // Initialize datetime to current time
  $: if (useNow) {
    datetime = formatDatetime(new Date());
  }

  const handleSubmit = () => {
    if (!canSubmit) return;

    // find TPlace object
    const fromPlace = fromSuggestions.find(suggestion => suggestion.name === from);
    const toPlace = toSuggestions.find(suggestion => suggestion.name === to);
    
    if (!fromPlace || !toPlace) {
      console.error('Invalid place selection');
      return;
    }

    console.log('Searching journey:', {
      from: fromPlace,
      to: toPlace,
      datetime: useNow ? formatDatetime(new Date()) : datetime,
      datetimeRepresents
    });
  };
</script>

<div class="journey-container">
  <h1>Plan Your Journey</h1>

  <div class="route-inputs">
    <div class="input-group from-group">
      <label for="from">From</label>
      <div class="input-wrapper">
        <span class="material-icons">my_location</span>
        <input
          type="text"
          id="from"
          list="from-suggestions"
          bind:value={from}
          placeholder="Enter starting location"
          use:debounce={{ callback: handleFromChange, delay: 100 }}
          on:input={handleFromInput}
        />
      </div>
      <datalist id="from-suggestions">
        {#each fromSuggestions as suggestion}
          <option value={suggestion.name}></option>
        {/each}
      </datalist>
    </div>

    <div class="input-group to-group">
      <label for="to">To</label>
      <div class="input-wrapper">
        <span class="material-icons">location_on</span>
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
      </div>
      <datalist id="to-suggestions">
        {#each toSuggestions as suggestion}
          <option value={suggestion.name}></option>
        {/each}
      </datalist>
    </div>

    <div class="datetime-group">
      <div class="datetime-controls">
        <div class="checkbox-group">
          <label class="toggle" for="use-now">
            <input
              type="checkbox"
              id="use-now"
              bind:checked={useNow}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-label">Now</span>
          </label>
        </div>

        <div class="input-group compact">
          <label for="datetime-represents">Time represents</label>
          <div class="select-wrapper">
            <select
              id="datetime-represents"
              bind:value={datetimeRepresents}
            >
              <option value="departure">Departure</option>
              <option value="arrival">Arrival</option>
            </select>
            <span class="material-icons">expand_more</span>
          </div>
        </div>
      </div>

      {#if !useNow}
        <div class="input-group">
          <label for="datetime">Date and Time</label>
          <div class="input-wrapper">
            <span class="material-icons">schedule</span>
            <input
              type="datetime-local"
              id="datetime"
              bind:value={datetime}
              step="60"
            />
          </div>
        </div>
      {/if}
    </div>

    <button
      class="submit-button"
      on:click={handleSubmit}
      disabled={!canSubmit}
    >
      <span class="material-icons">directions_transit</span>
      Search Journey
    </button>
  </div>
</div>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</svelte:head>

<style lang="scss">
  .journey-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 2rem;
      text-align: center;
      background: linear-gradient(45deg, #3b82f6, #2563eb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .route-inputs {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: #ffffff;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
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

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .material-icons {
        position: absolute;
        left: 1rem;
        color: #6b7280;
        font-size: 1.25rem;
      }

      input {
        width: 100%;
        padding: 0.875rem 1rem 0.875rem 3rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
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
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background-color: #ffffff;
        }
      }
    }

    &.compact {
      .select-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        select {
          width: 100%;
          padding: 0.875rem 2.5rem 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          background-color: #f9fafb;
          appearance: none;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            border-color: #d1d5db;
          }

          &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            background-color: #ffffff;
          }
        }

        .material-icons {
          position: absolute;
          right: 1rem;
          color: #6b7280;
          pointer-events: none;
        }
      }
    }
  }

  .datetime-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 2px solid #f3f4f6;

    .datetime-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
  }

  .toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .toggle-slider {
        background-color: #3b82f6;
        &:before {
          transform: translateX(1.25rem);
        }
      }
    }

    .toggle-slider {
      position: relative;
      width: 2.5rem;
      height: 1.25rem;
      background-color: #e5e7eb;
      border-radius: 1rem;
      transition: all 0.2s ease;

      &:before {
        content: '';
        position: absolute;
        height: 1rem;
        width: 1rem;
        left: 0.125rem;
        bottom: 0.125rem;
        background-color: white;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
    }

    .toggle-label {
      margin-left: 0.75rem;
      font-size: 0.875rem;
      color: #4b5563;
    }
  }

  .submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(45deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    .material-icons {
      font-size: 1.25rem;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: linear-gradient(45deg, #9ca3af, #6b7280);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;

      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }

  @media (max-width: 480px) {
    .journey-container {
      margin: 1rem auto;

      h1 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
      }
    }

    .route-inputs {
      padding: 1.5rem;
    }

    .datetime-group {
      .datetime-controls {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .input-group.compact {
        width: 100%;
      }
    }
  }
</style>
