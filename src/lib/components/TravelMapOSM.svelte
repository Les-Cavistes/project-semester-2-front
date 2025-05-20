<script lang="ts">
import type { TPoint } from "$lib/types";
import type { Map as LeafletMap } from "leaflet";
import { onDestroy } from "svelte";
import { leafletService } from "../services/leafletServices";

// Combined props type
interface Props {
  travelRoute: TPoint[];
  height?: string;
  width?: string;
}

const { height = "500px", width = "100%", travelRoute }: Props = $props();

let mapContainer: HTMLDivElement;
let map: LeafletMap | null = $state(null);
let error: string | null = $state(null);

async function initializeMap() {
  try {
    if (typeof window === "undefined" || !mapContainer) return;

    // Initialize the map using our service
    map = await leafletService.initializeMap(mapContainer, travelRoute);

    // Add tile layer
    await leafletService.addTileLayer(map);

    // Draw the travel route
    await leafletService.drawRoute(map, travelRoute);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to initialize map";
    console.error("Map initialization error:", e);
  }
}

$effect(() => {
  if (mapContainer) {
    initializeMap();
  }
});

onDestroy(() => {
  if (map) {
    map.remove();
  }
});
</script>

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
</style>