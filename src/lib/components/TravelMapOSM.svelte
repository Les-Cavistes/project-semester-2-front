<script lang="ts">
import type { TJourney, TJourneysResponse, TSection } from "$lib/schemas";
import { journeyServices } from "$lib/services/journeyServices";
import type { TPoint } from "$lib/types";
import type { LatLngExpression, Layer, Map as LeafletMap } from "leaflet";
import { onDestroy, onMount } from "svelte";
import { leafletService } from "../services/leafletServices";

// Props
interface Props {
  travelRoute: TPoint[];
  height?: string;
  width?: string;
}

const { height = "100%", width = "100%", travelRoute }: Props = $props();

// State
let mapContainer: HTMLDivElement;
let map: LeafletMap | null = $state(null);
let error: string | null = $state(null);
let selectedOption = $state(0);
let L: typeof import("leaflet");
let journeyData: TJourneysResponse | null = $state(null);
let isLoading = $state(false);
const polylineGroups: Layer[][] = [];

// Utilitaires
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatTime(dateTime?: Date | string): string {
  if (!dateTime) return "";

  // Handle both Date objects and string formats
  if (typeof dateTime === "string") {
    if (dateTime.includes("T") && dateTime.length >= 13) {
      // Navitia format: 20250618T192354
      const hour = dateTime.substring(9, 11);
      const minute = dateTime.substring(11, 13);
      return `${hour}:${minute}`;
    }
  } else if (dateTime instanceof Date) {
    return dateTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "";
}

function getTransportIcon(
  transport?: TSection["transport"],
  sectionType?: string,
): string {
  if (transport) {
    switch (transport.mode?.toLowerCase()) {
      case "métro":
      case "metro":
        return "🚇";
      case "rer":
        return "🚆";
      case "bus":
        return "🚌";
      case "tramway":
      case "tram":
        return "🚋";
      default:
        return "🚉";
    }
  }

  switch (sectionType) {
    case "street_network":
      return "🚶";
    case "transfer":
      return "🔄";
    default:
      return "🚉";
  }
}

function getTransportColor(
  transport?: TSection["transport"],
  sectionType?: string,
): string {
  if (transport?.line?.color) {
    return `#${transport.line.color}`;
  }

  if (transport) {
    switch (transport.mode?.toLowerCase()) {
      case "métro":
      case "metro":
        return "#0066CC";
      case "rer":
        return "#800080";
      case "bus":
        return "#00AA00";
      case "tramway":
      case "tram":
        return "#FF6600";
      default:
        return "#0066CC";
    }
  }

  switch (sectionType) {
    case "street_network":
      return "#666666";
    case "transfer":
      return "#999999";
    default:
      return "#0066CC";
  }
}

function getTransportName(
  transport?: TSection["transport"],
  sectionType?: string,
): string {
  if (transport) {
    const lineName = transport.line?.name || transport.line?.code;
    const mode = transport.mode;

    if (lineName && mode) {
      return `${mode} ${lineName}`;
    }
    if (lineName) {
      return lineName;
    }
    if (mode) {
      return mode;
    }
  }

  switch (sectionType) {
    case "street_network":
      return "À pied";
    case "transfer":
      return "Correspondance";
    default:
      return "Transport";
  }
}

// Fonctions principales
async function initializeMap() {
  try {
    if (typeof window === "undefined" || !mapContainer) return;

    L = (await import("leaflet")).default;
    await import("leaflet/dist/leaflet.css");

    map = await leafletService.initializeMap(mapContainer, travelRoute);
    await leafletService.addTileLayer(map);

    if (travelRoute.length >= 2) {
      await loadJourneyData();
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to initialize map";
    console.error("Map initialization error:", e);
  }
}

async function loadJourneyData() {
  if (travelRoute.length < 2) return;

  isLoading = true;
  error = null;

  try {
    const origin = travelRoute[0];
    const destination = travelRoute[travelRoute.length - 1];

    const service = journeyServices();
    const response = await service.getJourney(
      origin.lng,
      origin.lat,
      destination.lng,
      destination.lat,
    );

    if (response) {
      console.log("✅ Journey data received:", response);

      // Trier par durée et prendre seulement les 3 plus rapides
      const sortedJourneys = response.journeys
        .sort((a, b) => a.duration - b.duration)
        .slice(0, 3);

      journeyData = { journeys: sortedJourneys };
      drawAllJourneys();
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load journey data";
    console.error("Journey loading error:", e);
  } finally {
    isLoading = false;
  }
}

function drawJourney(journey: TJourney, journeyIndex: number) {
  if (polylineGroups[journeyIndex] && map) {
    for (const layer of polylineGroups[journeyIndex]) {
      map.removeLayer(layer);
    }
  }
  polylineGroups[journeyIndex] = [];

  for (const section of journey.sections) {
    if (section.geojson?.coordinates) {
      const points: LatLngExpression[] = section.geojson.coordinates.map(
        (coord: number[]) => [coord[1], coord[0]] as [number, number],
      );

      if (points.length > 0 && map) {
        const color = getTransportColor(section.transport, section.type);

        const polyline = L.polyline(points, {
          color: color,
          weight: journeyIndex === selectedOption ? 5 : 3,
          opacity: journeyIndex === selectedOption ? 1 : 0.6,
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
    for (const [i, journey] of journeyData.journeys.entries()) {
      drawJourney(journey, i);
    }
  }
}

function getTransferCount(journey: TJourney): number {
  const publicTransportSections = journey.sections.filter(
    (s: TSection) => s.type === "public_transport",
  ).length;
  return Math.max(0, publicTransportSections - 1);
}

// Réactivité
$effect(() => {
  if (map && travelRoute.length >= 2) {
    for (const group of polylineGroups) {
      for (const layer of group) {
        map.removeLayer(layer);
      }
    }
    polylineGroups.length = 0;
    loadJourneyData();
  }
});

onMount(() => {
  initializeMap();
});

onDestroy(() => {
  if (map) {
    map.remove();
  }
});
</script>

<!-- Map Container -->
<div class="map-wrapper">
  {#if error}
    <div class="error-container">
      <div class="error-message">
        ❌ {error}
      </div>
    </div>
  {:else}
    <div bind:this={mapContainer} class="map-container" style="width: {width}; height: {height};"></div>
  {/if}

  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Recherche d'itinéraires...</p>
      </div>
    </div>
  {/if}
</div>

<!-- Journey Results Section -->
{#if journeyData?.journeys && journeyData.journeys.length > 0}
  <section class="journey-section">
    <div class="drag-handle"></div>
    
    <div class="journey-header">
      <h2 class="journey-title">🚀 3 trajets les plus rapides</h2>
      <p class="journey-subtitle">
        {travelRoute[0]?.name || 'Départ'} → {travelRoute[travelRoute.length - 1]?.name || 'Arrivée'}
      </p>
    </div>

    <!-- Journey Options -->
    <div class="journey-options">
      {#each journeyData.journeys as journey, i}
        <div 
          class="option-card"
          class:selected={selectedOption === i}
          on:click={() => changeOption(i)}
          role="button"
          tabindex="0"
        >
          <div class="option-header">
            <span class="option-time">⚡ {formatDuration(journey.duration)}</span>
            <span class="option-badge">#{i + 1}</span>
          </div>
          <div class="option-details">
            <div class="detail-item">
              <span>🔄</span>
              <span>{getTransferCount(journey)} correspondance{getTransferCount(journey) !== 1 ? 's' : ''}</span>
            </div>
            {#if journey.departure_date_time && journey.arrival_date_time}
              <div class="detail-item">
                <span>🕐</span>
                <span>{formatTime(journey.departure_date_time)} → {formatTime(journey.arrival_date_time)}</span>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Journey Steps -->
    {#if journeyData?.journeys[selectedOption]}
      {@const selectedJourney = journeyData.journeys[selectedOption]}
      <div class="journey-steps">
        <h3 class="steps-title">
          📋 Détails du trajet #{selectedOption + 1} - 
          {selectedOption === 0 ? 'Le plus rapide' : selectedOption === 1 ? '2ème plus rapide' : '3ème plus rapide'}
        </h3>
        
        {#each selectedJourney.sections as section}
          {@const transport = section.transport}
          {@const sectionColor = getTransportColor(transport, section.type)}
          
          <div class="step">
            <div class="step-icon" style="background-color: {sectionColor};">
              {getTransportIcon(transport, section.type)}
            </div>
            <div class="step-content">
              <div class="step-main">
                {getTransportName(transport, section.type)}
                {#if transport?.direction}
                  <span class="direction">→ {transport.direction}</span>
                {/if}
              </div>
              
              {#if transport?.line}
                <div class="line-badge" style="background-color: #{transport.line.color}; color: #{transport.line.text_color}">
                  {transport.line.label}
                </div>
              {/if}
              
              <div class="step-details">
                {#if section.from?.name && section.to?.name}
                  {section.from.name} → {section.to.name}
                {/if}
              </div>
              
              <!-- Affichage du nombre d'arrêts intermédiaires -->
              {#if section.stop_date_times && section.stop_date_times.length > 2}
                <div class="stops-count">
                  {section.stop_date_times.length - 2} arrêt{section.stop_date_times.length - 2 > 1 ? 's' : ''} intermédiaire{section.stop_date_times.length - 2 > 1 ? 's' : ''}
                </div>
              {/if}
              
              {#if section.departure_date_time && section.arrival_date_time}
                <div class="timing">
                  🕐 {formatTime(section.departure_date_time)} → {formatTime(section.arrival_date_time)}
                </div>
              {/if}
            </div>
            <div class="step-time">{formatDuration(section.duration || 0)}</div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if}

<style>
  /* TravelMapOSM.svelte - Desktop CSS Styles */

.map-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

.map-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #fef2f2;
  border: 2px dashed #fca5a5;
  border-radius: 12px;
}

.error-message {
  color: #dc2626;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 12px;
}

.loading-content {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  color: #374151;
  font-weight: 500;
  margin: 0;
}

/* Journey Results Section */
.journey-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
  overflow: hidden;
}

.drag-handle {
  width: 60px;
  height: 6px;
  background: #d1d5db;
  border-radius: 3px;
  margin: 1rem auto 0 auto;
}

.journey-header {
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
  border-bottom: 1px solid #f3f4f6;
}

.journey-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.journey-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

/* Journey Options */
.journey-options {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.option-card {
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.option-card.selected {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.option-time {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
}

.option-badge {
  background: #3b82f6;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.option-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.95rem;
}

/* Journey Steps */
.journey-steps {
  padding: 2rem;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
}

.steps-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2rem 0;
  text-align: center;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.step:last-child {
  margin-bottom: 0;
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-main {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.direction {
  color: #6b7280;
  font-weight: 400;
  font-size: 0.95rem;
}

.line-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.step-details {
  color: #4b5563;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.stops-count {
  color: #6b7280;
  font-size: 0.9rem;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.timing {
  color: #6b7280;
  font-size: 0.9rem;
}

.step-time {
  background: #f3f4f6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
}

/* Responsive adjustments for desktop */
@media (min-width: 1024px) {
  .journey-options {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .option-card {
    min-height: 140px;
  }
  
  .journey-section {
    margin-top: 3rem;
  }
}
</style>