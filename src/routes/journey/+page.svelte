<script lang="ts">
    import { journeyStore } from "$lib/stores/journey";
    import { journeyServices } from "$lib/services/journeyServices";
    import { t } from "$lib/translations";
    import type { TJourney } from "$lib/schemas";
    
    // Form state
    const coordinates = $state({
      fromLon: 2.291881,  
      fromLat: 48.877711,
      toLon: 2.356462,
      toLat: 48.865943
    });
    
    const validationError = $state<string | null>(null);
    let selectedJourney = $state<TJourney | null>(null);
    
    function formatTime(timestamp: string): string {
      return `${timestamp.substring(9, 11)}:${timestamp.substring(11, 13)}:${timestamp.substring(13, 15)}`;
    }
    
    function formatDuration(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
    
    function getTransportIcon(type: string): string {
      switch (type) {
        case "public_transport":
          return "🚇";
        case "street_network":
          return "🚶";
        case "transfer":
          return "🔄";
        default:
          return "🚊";
      }
    }

    function getTransportType(type: string): string {
      switch (type) {
        case "public_transport":
          return $t('main.transportTypes.public_transport');
        case "street_network":
          return $t('main.transportTypes.street_network');
        case "transfer":
          return $t('main.transportTypes.transfer');
        default:
          return "Unknown";
      }
    }
    
    async function handleSubmit(e: Event) {
      e.preventDefault();
      
      selectedJourney = null;
      
      journeyStore.setLoading(true);
      
      try {
        const journeyService = journeyServices();
        const response = await journeyService.getJourney(
          coordinates.fromLon,
          coordinates.fromLat,
          coordinates.toLon,
          coordinates.toLat
        );
        
        journeyStore.setJourneyData(response);
      } catch (error) {
        console.error("Error fetching journey:", error);
        journeyStore.setError(error instanceof Error ? error.message : "Failed to fetch journey data");
      }
    }
    
    function selectJourney(journey: TJourney) {
      selectedJourney = journey;
    }
  </script>
  
  <div class="journey-container">
    <h1>
        {$t('main.journey.title')}
    </h1>
    
    <form class="journey-form" onsubmit={handleSubmit}>
      <div class="coordinates-group">
        <h2>
          {$t('main.journey.startPoint')}
        </h2>
        <div class="coordinate-inputs">
          <div class="input-group">
            <label for="fromLon">
                {$t('main.coordinates.longitude')}
            </label>
            <input 
              type="number" 
              id="fromLon" 
              bind:value={coordinates.fromLon} 
              step="0.000001"
            />
          </div>
          <div class="input-group">
            <label for="fromLat">
                {$t('main.coordinates.latitude')}    
            </label>
            <input 
              type="number" 
              id="fromLat" 
              bind:value={coordinates.fromLat} 
              step="0.000001"
            />
          </div>
        </div>
      </div>
      
      <div class="coordinates-group">
        <h2>
            {$t('main.journey.destination')}
        </h2>
        <div class="coordinate-inputs">
          <div class="input-group">
            <label for="toLon">
                {$t('main.coordinates.longitude')}
            </label>
            <input 
              type="number" 
              id="toLon" 
              bind:value={coordinates.toLon} 
              step="0.000001"
            />
          </div>
          <div class="input-group">
            <label for="toLat">
                {$t('main.coordinates.latitude')}
            </label>
            <input 
              type="number" 
              id="toLat" 
              bind:value={coordinates.toLat} 
              step="0.000001"
            />
          </div>
        </div>
      </div>
      
      {#if validationError}
        <div class="error-message">
          {validationError}
        </div>
      {/if}
      
      <button type="submit" class="submit-button" disabled={$journeyStore.loading}>
        {$journeyStore.loading ? $t('main.journey.loading') : $t('main.journey.findJourney')}
      </button>
    </form>
    
    {#if $journeyStore.error}
      <div class="error-message">
        {$journeyStore.error}
      </div>
    {/if}
    
    {#if $journeyStore.data && $journeyStore.data.journeys.length > 0}
      <div class="results-container">
        <h2>
            {$t('main.journey.journeyOptions')}
        </h2>
        
        <div class="journey-options">
          {#each $journeyStore.data.journeys as journey, i}
            <button 
              type="button"
              class="journey-option" 
              class:selected={selectedJourney === journey}
              onclick={() => selectJourney(journey)}
            >
              <h3>
                {$t('main.journey.option')} #{i + 1}
              </h3>
              <p class="journey-duration">
                {$t('main.journey.total')}: {formatDuration(journey.duration)}
              </p>
              <p class="journey-sections">
                {journey.sections.length} {$t('main.journey.sections')}
              </p>
            </button>
          {/each}
        </div>
        
        {#if selectedJourney}
          <div class="journey-details">
            <h2>
                {$t('main.journey.journeyDetails')}
            </h2>
            
            <div class="sections-container">
              {#each selectedJourney.sections as section, i}
                <div class="section">
                  <div class="section-header">
                    <span class="section-icon">{getTransportIcon(section.type)}</span>
                    <span class="section-type">{getTransportType(section.type)}</span>
                    <span class="section-duration">{formatDuration(section.duration)}</span>
                  </div>
                  
                  <div class="section-content">
                    <div class="section-from">
                      <span class="time">{formatTime(section.departure_date_time)}</span>
                      <span class="location">{section.from.name}</span>
                    </div>
                    
                    <div class="section-divider"></div>
                    
                    <div class="section-to">
                      <span class="time">{formatTime(section.arrival_date_time)}</span>
                      <span class="location">{section.to.name}</span>
                    </div>
                  </div>
                  
                  {#if i < selectedJourney.sections.length - 1}
                    <div class="connector"></div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
    
    {#if $journeyStore.data && $journeyStore.data.journeys.length === 0}
      <div class="no-results">
        <p>
            {$t('main.journey.noResults')}
        </p>
      </div>
    {/if}
    
    <div class="raw-data-container">
      <details>
        <summary>
            {$t('main.journey.showRawData')}
        </summary>
        <pre>{JSON.stringify($journeyStore.data, null, 2)}</pre>
      </details>
    </div>
  </div>
  
  <style lang="scss">
    .journey-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    
    h2 {
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    
    .journey-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
    }
    
    .coordinates-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      h2 {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }
    }
    
    .coordinate-inputs {
      display: flex;
      gap: 1rem;
      
      @media (max-width: 600px) {
        flex-direction: column;
      }
    }
    
    .input-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      
      label {
        font-size: 0.9rem;
        color: #666;
      }
      
      input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
      }
    }
    
    .submit-button {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover:not(:disabled) {
        background-color: #0052a3;
      }
      
      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
    
    .error-message {
      padding: 0.75rem;
      background-color: #ffe6e6;
      color: #dc3545;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .results-container {
      margin-top: 2rem;
    }
    
    .journey-options {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }
    
    .journey-option {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f8f8f8;
      cursor: pointer;
      transition: all 0.2s;
      flex: 1;
      min-width: 150px;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      &.selected {
        border-color: #0066cc;
        background-color: #e6f0ff;
      }
      
      h3 {
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
      }
      
      .journey-duration, .journey-sections {
        font-size: 0.9rem;
        color: #666;
      }
    }
    
    .journey-details {
      margin-top: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #fff;
    }
    
    .sections-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .section {
      position: relative;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
      
      .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        font-weight: bold;
        
        .section-icon {
          font-size: 1.2rem;
        }
        
        .section-type {
          text-transform: capitalize;
        }
        
        .section-duration {
          margin-left: auto;
          font-size: 0.9rem;
          color: #666;
        }
      }
      
      .section-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        .section-from, .section-to {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          
          .time {
            font-weight: bold;
            min-width: 65px;
          }
          
          .location {
            font-size: 0.95rem;
          }
        }
        
        .section-divider {
          height: 1px;
          background-color: #ddd;
          margin: 0.5rem 0;
        }
      }
    }
    
    .connector {
      position: absolute;
      left: 50%;
      bottom: -10px;
      transform: translateX(-50%);
      width: 2px;
      height: 10px;
      background-color: #ddd;
      z-index: 1;
    }
    
    .no-results {
      padding: 2rem;
      text-align: center;
      border: 1px dashed #ddd;
      border-radius: 8px;
      color: #666;
    }
    
    .raw-data-container {
      margin-top: 2rem;
      
      details {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 1rem;
        
        summary {
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        
        pre {
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 0.8rem;
          background-color: #fff;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
        }
      }
    }
  </style>