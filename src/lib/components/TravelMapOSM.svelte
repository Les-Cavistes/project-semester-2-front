<script lang="ts">
import { journeyServices } from "$lib/services/journeyServices";
import type { TPoint } from "$lib/types";
import type { LatLngExpression, Layer, Map as LeafletMap } from "leaflet";
import { onDestroy, onMount } from "svelte";
import { leafletService } from "../services/leafletServices";

// Combined props type
interface Props {
  travelRoute: TPoint[];
  height?: string;
  width?: string;
}

interface GeoJSON {
  coordinates: number[][];
}

interface Section {
  geojson?: GeoJSON;
}

interface Journey {
  sections: Section[];
  duration: number;
}

interface JourneyData {
  journeys: Journey[];
}

const { height = "500px", width = "100%", travelRoute }: Props = $props();

let mapContainer: HTMLDivElement;
let map: LeafletMap | null = $state(null);
let error: string | null = $state(null);
let selectedOption = $state(0);
let L: typeof import("leaflet");
let journeyData: JourneyData | null = $state(null);
const polylineGroups: Layer[][] = [];

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

async function initializeMap() {
  try {
    if (typeof window === "undefined" || !mapContainer) return;

    // Import Leaflet
    L = (await import("leaflet")).default;
    await import("leaflet/dist/leaflet.css");

    map = await leafletService.initializeMap(mapContainer, travelRoute);
    await leafletService.addTileLayer(map);
    // await leafletService.drawRoute(map, travelRoute);

    // Charger les données journey
    const service = journeyServices();
    journeyData = await service.getJourney(2.3522, 48.8566, 2.295, 48.8738);

    if (journeyData) {
      drawAllJourneys();
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to initialize map";
    console.error("Map initialization error:", e);
  }
}

function drawJourney(journey: Journey, journeyIndex: number) {
  // Clear previous polylines for this journey
  if (polylineGroups[journeyIndex] && map) {
    for (const layer of polylineGroups[journeyIndex]) {
      if (map) {
        map.removeLayer(layer);
      }
    }
  }
  polylineGroups[journeyIndex] = [];

  for (const section of journey.sections) {
    if (section.geojson?.coordinates) {
      const points: LatLngExpression[] = section.geojson.coordinates.map(
        (coord: number[]) => {
          return [coord[1], coord[0]] as [number, number];
        },
      );

      if (points.length > 0 && map) {
        const polyline = L.polyline(points, {
          color: journeyIndex === selectedOption ? "blue" : "gray",
          weight: journeyIndex === selectedOption ? 4 : 2,
          opacity: journeyIndex === selectedOption ? 1 : 0.5,
        }).addTo(map);
        polylineGroups[journeyIndex].push(polyline);
      }
    }
  }
}

function drawAllJourneys() {
  if (!map || !L || !journeyData) return;

  const allPoints: [number, number][] = [];

  for (const [index, journey] of journeyData.journeys.entries()) {
    drawJourney(journey, index);

    for (const section of journey.sections) {
      if (section.geojson?.coordinates) {
        for (const coord of section.geojson.coordinates) {
          allPoints.push([coord[1], coord[0]]);
        }
      }
    }
  }

  if (allPoints.length > 0) {
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

function changeOption(index: number) {
  selectedOption = index;
  if (journeyData) {
    // Redessiner tous les trajets avec les nouveaux styles
    for (const [i, journey] of journeyData.journeys.entries()) {
      drawJourney(journey, i);
    }
  }
}

onMount(() => {
  initializeMap();
});

onDestroy(() => {
  if (map) {
    map.remove();
  }
});
</script>

{#if journeyData && journeyData.journeys}
  <div class="options">
    <h3>Options de trajet :</h3>
    <div class="journey-options">
      {#each journeyData.journeys as journey, i}
        <button 
          onclick={() => changeOption(i)}
          class="journey-option"
          class:selected={selectedOption === i}
        >
          <h4>Option {i + 1}</h4>
          <p class="journey-duration">Total: {formatDuration(journey.duration)}</p>
          <p class="journey-sections">{journey.sections.length} sections</p>
        </button>
      {/each}
    </div>
  </div>
{/if}

{#if error}
  <div class="error">
    {error}
  </div>
{:else}
  <div bind:this={mapContainer} style="width: {width}; height: {height};"></div>
{/if}

<style>
  div {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .error {
    color: #dc2626;
    padding: 1rem;
    border: 1px solid #dc2626;
    border-radius: 8px;
    background-color: #fee2e2;
  }
  
  .options {
    padding: 1rem;
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .options h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }
  
  .journey-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
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
  }
  
  .journey-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .journey-option.selected {
    border-color: #0066cc;
    background-color: #e6f0ff;
  }
  
  .journey-option h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  .journey-duration, .journey-sections {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  /* Ensure Leaflet styles are applied */
  :global(.leaflet-container) {
    height: 100%;
    width: 100%;
  }
</style>