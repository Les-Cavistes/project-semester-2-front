<!-- Utilization of leaflet to simulate travels -->
<script lang="ts">
import type { Map as LeafletMap } from "leaflet";
import { onMount } from "svelte";
import { leafletService } from "../services/leafletServices";

// Default map settings
const DEFAULT_LAT = 48.8566; // Paris latitude
const DEFAULT_LNG = 2.3522; // Paris longitude
const DEFAULT_ZOOM = 11;

// Props
export const height = "500px";
export const width = "100%";
export const travelRoute = [
  { lat: 48.8584, lng: 2.2945, name: "Tour Eiffel" },
  { lat: 48.8606, lng: 2.3376, name: "Musée du Louvre" },
  { lat: 48.853, lng: 2.3499, name: "Notre-Dame" },
  { lat: 48.8738, lng: 2.295, name: "Arc de Triomphe" },
];

let mapContainer: HTMLElement;
let map: LeafletMap;

onMount(async () => {
  if (typeof window !== "undefined") {
    // Initialize the map using our service
    map = await leafletService.initializeMap(
      mapContainer,
      DEFAULT_LAT,
      DEFAULT_LNG,
      DEFAULT_ZOOM,
    );

    // Add tile layer
    await leafletService.addTileLayer(map);

    // Draw the travel route
    await leafletService.drawRoute(map, travelRoute);
  }
});
</script>

<div bind:this={mapContainer} style="width: {width}; height: {height};"></div>

<style>
  div {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
</style>