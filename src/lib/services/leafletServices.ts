import type { LatLngExpression, Map as LeafletMap } from "leaflet";

export class LeafletService {
  private static instance: LeafletService;

  /**
   * Private constructor to enforce the singleton pattern.
   * Use `LeafletService.getInstance()` to get the instance of this class.
   */
  private constructor() {}

  /**
   * Get the singleton instance of the LeafletService.
   *
   * @returns {LeafletService} The singleton instance of the LeafletService.
   */
  public static getInstance(): LeafletService {
    if (!LeafletService.instance) {
      LeafletService.instance = new LeafletService();
    }
    return LeafletService.instance;
  }

  /**
   * Initialize a Leaflet map.
   *
   * @param mapContainer {HTMLElement} The HTML element where the map will be rendered.
   * @param defaultLat {number} The default latitude for the map's center.
   * @param defaultLng {number} The default longitude for the map's center.
   * @param defaultZoom {number} The default zoom level for the map.
   * @returns {Promise<LeafletMap>} A promise that resolves to the initialized Leaflet map.
   */
  async initializeMap(
    mapContainer: HTMLElement,
    defaultLat: number,
    defaultLng: number,
    defaultZoom: number,
  ): Promise<LeafletMap> {
    const leaflet = await import("leaflet");

    // Import Leaflet CSS dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Initialize the map
    return leaflet
      .map(mapContainer)
      .setView([defaultLat, defaultLng], defaultZoom);
  }

  /**
   * Add a tile layer to the Leaflet map.
   *
   * @param map {LeafletMap} The Leaflet map instance to which the tile layer will be added.
   * @returns {Promise<void>} A promise that resolves when the tile layer is added.
   */
  async addTileLayer(map: LeafletMap): Promise<void> {
    const leaflet = await import("leaflet");

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      })
      .addTo(map);
  }

  /**
   * Draw a route on the Leaflet map.
   *
   * @param map {LeafletMap} The Leaflet map instance where the route will be drawn.
   * @param travelRoute {Array<{ lat: number; lng: number; name: string }>} An array of points representing the route.
   * @returns {Promise<void>} A promise that resolves when the route is drawn on the map.
   */
  async drawRoute(
    map: LeafletMap,
    travelRoute: { lat: number; lng: number; name: string }[],
  ): Promise<void> {
    const leaflet = await import("leaflet");

    // Convert travelRoute to LatLngExpression[][]
    const routeCoordinates: LatLngExpression[] = travelRoute.map((point) => [
      point.lat,
      point.lng,
    ]);

    // Draw polyline
    leaflet.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(map);

    // Add markers
    travelRoute.forEach((point, index) => {
      leaflet
        .marker([point.lat, point.lng])
        .addTo(map)
        .bindPopup(`<strong>${index + 1}. ${point.name}</strong>`);
    });
  }
}

export const leafletService = LeafletService.getInstance();
