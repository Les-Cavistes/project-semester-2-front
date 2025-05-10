<!-- Utilisation of leaflet to simulate travels -->
<script lang="ts">
import type {
  LatLngExpression,
  Map as LeafletMap,
  Marker,
  Polyline,
} from "leaflet";
import { onMount } from "svelte";

// Default map settings
const DEFAULT_LAT = 48.8566; // Paris latitude
const DEFAULT_LNG = 2.3522; // Paris longitude
const DEFAULT_ZOOM = 11;

// Props
export const height = "500px"; // Changed from let to const
export const width = "100%"; // Changed from let to const
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
    const leaflet = await import("leaflet");

    // Import Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Initialize the map
    map = leaflet
      .map(mapContainer)
      .setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM);

    // Add OpenStreetMap tiles
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      })
      .addTo(map);

    // Draw the travel route
    drawTravelRoute(leaflet);
  }
});

function drawTravelRoute(leaflet: typeof import("leaflet")) {
  // Explicitly cast the array to LatLngExpression[][]
  const routeCoordinates = travelRoute.map(
    (point) => [point.lat, point.lng] as LatLngExpression,
  );
  leaflet.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(map);

  travelRoute.forEach((point, index) => {
    leaflet
      .marker([point.lat, point.lng])
      .addTo(map)
      .bindPopup(`<strong>${index + 1}. ${point.name}</strong>`);
  });
}
</script>

<div bind:this={mapContainer} style="width: {width}; height: {height};"></div>

<style>
  div {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
</style>