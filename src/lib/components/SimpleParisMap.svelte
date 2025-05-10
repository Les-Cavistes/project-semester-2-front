 <!-- SimpleParisMap.svelte with OpenStreetMap -->
 <script lang="ts">
import { onMount } from "svelte";

// Paris coordinates
const DEFAULT_LAT = 48.8566;
const DEFAULT_LNG = 2.3522;
const DEFAULT_ZOOM = 12;

// Props
export const height = "400px"; // Changed from let to const
export const width = "100%"; // Changed from let to const
export const markerTitle = "Paris"; // Changed from let to const

let mapContainer: HTMLElement;

onMount(async () => {
  if (typeof window !== "undefined") {
    const leaflet = await import("leaflet");

    // Import Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Initialize the map
    const map = leaflet
      .map(mapContainer)
      .setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM);

    // Add the OpenStreetMap tile layer
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      })
      .addTo(map);

    // Add a marker for the center of Paris
    leaflet
      .marker([DEFAULT_LAT, DEFAULT_LNG])
      .addTo(map)
      .bindPopup(markerTitle)
      .openPopup();
  }
});
</script>

<div bind:this={mapContainer} style="width: {width}; height: {height};"></div>

<style>
  /* Necessary styles for the map to display correctly */
  div {
    z-index: 0;
  }
</style>