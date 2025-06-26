<script lang="ts">
import AddressAutocomplete from "$lib/components/AdressAutocomplete.svelte";
import TravelMapOSM from "$lib/components/TravelMapOSM.svelte";
import type { TPoint } from "$lib/types";
import type { PageProps } from "./$types";

// Interface pour les suggestions d'adresses
interface Suggestion {
  id: string;
  name: string;
  address?: string;
  type: string;
  coordinates: [number, number] | null;
}

// Get data from the `+page.ts` file
const { data }: PageProps = $props();

let selectedOrigin: Suggestion | null = $state(null);
let selectedDestination: Suggestion | null = $state(null);
let currentTravelRoute: TPoint[] = $state(data.travelRoute);
let showMap = $state(false);

function handleOriginSelected(place: Suggestion) {
  selectedOrigin = place;
  console.log("Origine sélectionnée:", place);
  updateRoute();
}

function handleDestinationSelected(place: Suggestion) {
  selectedDestination = place;
  console.log("Destination sélectionnée:", place);
  updateRoute();
}

function updateRoute() {
  if (selectedOrigin && selectedDestination) {
    // Créer un nouveau trajet avec les coordonnées sélectionnées
    if (selectedOrigin.coordinates && selectedDestination.coordinates) {
      currentTravelRoute = [
        {
          lat: selectedOrigin.coordinates[0],
          lng: selectedOrigin.coordinates[1],
          name: selectedOrigin.name,
        },
        {
          lat: selectedDestination.coordinates[0],
          lng: selectedDestination.coordinates[1],
          name: selectedDestination.name,
        },
      ];
      showMap = true;
    }
  }
}

function resetRoute() {
  selectedOrigin = null;
  selectedDestination = null;
  currentTravelRoute = data.travelRoute;
  showMap = false;
}

function useDefaultRoute() {
  selectedOrigin = null;
  selectedDestination = null;
  currentTravelRoute = data.travelRoute;
  showMap = true;
}

function swapAddresses() {
  const temp = selectedOrigin;
  selectedOrigin = selectedDestination;
  selectedDestination = temp;
  updateRoute();
}
</script>

<div class="app-container">
  <!-- Header -->
  <header class="header">
    <h1 class="logo">Paris GO</h1>
  </header>

  <!-- Map Section -->
  <section class="map-section">
    {#if showMap}
      <TravelMapOSM travelRoute={currentTravelRoute} />
    {:else}
      <div class="map-placeholder">
        <div class="placeholder-content">
          <h3>🗺️ Carte de Paris</h3>
          <p>Sélectionnez un itinéraire pour voir la carte</p>
        </div>
      </div>
    {/if}
    
    <!-- Search Overlay -->
    <div class="search-overlay">
      <div class="search-card">
        <div class="input-group">
          <div class="input-icon">🟢</div>
          <div class="autocomplete-wrapper">
            <AddressAutocomplete
              label=""
              placeholder="Point de départ"
              onAddressSelected={handleOriginSelected}
            />
          </div>
        </div>
        
        <button class="swap-icon" onclick={swapAddresses}>⇅</button>
        
        <div class="input-group">
          <div class="input-icon">🟠</div>
          <div class="autocomplete-wrapper">
            <AddressAutocomplete
              label=""
              placeholder="Point d'arrivée"
              onAddressSelected={handleDestinationSelected}
            />
          </div>
        </div>
<button class="route-btn" onclick={updateRoute}>
            Votre Trajet
          </button>
      </div>
    </div>
  </section>

  <!-- Selected addresses display -->
  {#if selectedOrigin || selectedDestination}
    <div class="selected-info">
      {#if selectedOrigin}
        <div class="selected-item">
          <span class="icon">🟢</span>
          <div class="info">
            <strong>Départ:</strong> {selectedOrigin.name}
            {#if selectedOrigin.address && selectedOrigin.address !== selectedOrigin.name}
              <span class="address-detail">({selectedOrigin.address})</span>
            {/if}
          </div>
        </div>
      {/if}
      
      {#if selectedDestination}
        <div class="selected-item">
          <span class="icon">🟠</span>
          <div class="info">
            <strong>Arrivée:</strong> {selectedDestination.name}
            {#if selectedDestination.address && selectedDestination.address !== selectedDestination.name}
              <span class="address-detail">({selectedDestination.address})</span>
            {/if}
          </div>
        </div>
      {/if}
      
      <button class="reset-btn" onclick={resetRoute}>
        ↻ Réinitialiser
      </button>
    </div>
  {/if}
</div>

<style>
  /* Travel Page (+page.svelte) - Desktop CSS Styles */

.app-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header */
.header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Map Section */
.map-section {
  position: relative;
  max-width: 1400px;
  margin: 50px auto;
  padding: 8rem 2rem 2rem 2rem;
}

.map-placeholder {
  height: 500px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.placeholder-content {
  text-align: center;
  color: #64748b;
}

.placeholder-content h3 {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.placeholder-content p {
  font-size: 1.1rem;
  margin: 0;
}

/* Search Overlay */
.search-overlay {
  position: absolute;
  top: -10px;
  left: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  justify-content: center;
}

.search-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 800px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
}

.input-icon {
  font-size: 1.2rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.autocomplete-wrapper {
  flex: 1;
  min-width: 200px;
}

.swap-icon {
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #6b7280;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.swap-icon:hover {
  background: #e5e7eb;
  color: #374151;
  transform: rotate(180deg);
}

.route-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.route-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Selected Info */
.selected-info {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  flex-wrap: wrap;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 250px;
}

.selected-item .icon {
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.selected-item .info {
  flex: 1;
}

.selected-item strong {
  color: #111827;
  font-weight: 600;
}

.address-detail {
  color: #6b7280;
  font-size: 0.9rem;
  display: block;
  margin-top: 0.2rem;
}

.reset-btn {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.reset-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Desktop-specific improvements */
@media (min-width: 1024px) {
  .search-card {
    max-width: 900px;
  }
  
  .autocomplete-wrapper {
    min-width: 250px;
  }
  
  .selected-info {
    justify-content: space-between;
  }
  
  .selected-item {
    flex: none;
    max-width: 350px;
  }
}

/* Large desktop screens */
@media (min-width: 1440px) {
  .map-section {
    padding: 8rem 3rem;
  }
  
  .search-card {
    padding: 2.5rem;
  }
}
</style>