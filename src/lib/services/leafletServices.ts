import type { TPoint } from "$lib/types";
import type {
  LatLngExpression,
  Map as LeafletMap,
  PolylineOptions,
  TileLayerOptions,
} from "leaflet";

interface MapConfig {
  tileLayerUrl: string;
  tileLayerOptions: TileLayerOptions;
  polylineOptions: PolylineOptions;
}

const DEFAULT_MAP_CONFIG: MapConfig = {
  tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileLayerOptions: {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  },
  polylineOptions: {
    color: "blue",
    weight: 4,
  },
};

export class LeafletService {
  private static instance: LeafletService;
  private mapConfig: MapConfig;

  /**
   * Private constructor to enforce the singleton pattern.
   * Use `LeafletService.getInstance()` to get the instance of this class.
   */
  private constructor(config: Partial<MapConfig> = {}) {
    this.mapConfig = { ...DEFAULT_MAP_CONFIG, ...config };
  }

  /**
   * Get the singleton instance of the LeafletService.
   *
   * @returns {LeafletService} The singleton instance of the LeafletService.
   */
  public static getInstance(config?: Partial<MapConfig>): LeafletService {
    if (!LeafletService.instance) {
      LeafletService.instance = new LeafletService(config);
    }

    return LeafletService.instance;
  }

  /**
   * Initialize a Leaflet map.
   *
   * @param mapContainer {HTMLElement} The HTML element where the map will be rendered.
   * @param points {Array<TPoint>} An array of points representing the route.
   * @returns {Promise<LeafletMap>} A promise that resolves to the initialized Leaflet map.
   */
  async initializeMap(
    mapContainer: HTMLElement,
    points: TPoint[],
  ): Promise<LeafletMap> {
    try {
      const leaflet = await import("leaflet");

      // Import Leaflet CSS dynamically
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Initialize the map with a temporary center
      const map = leaflet.map(mapContainer).setView([0, 0], 2);

      // Calculate bounds from points
      const bounds = leaflet.latLngBounds(
        points.map((point) => [point.lat, point.lng]),
      );

      // Fit the map to the bounds with padding
      map.fitBounds(bounds, {
        maxZoom: this.mapConfig.tileLayerOptions.maxZoom,
      });

      return map;
    } catch (error) {
      console.error("Failed to initialize map:", error);
      throw new Error("Failed to initialize map");
    }
  }

  /**
   * Add a tile layer to the Leaflet map.
   *
   * @param map {LeafletMap} The Leaflet map instance to which the tile layer will be added.
   * @returns {Promise<void>} A promise that resolves when the tile layer is added.
   */
  async addTileLayer(map: LeafletMap): Promise<void> {
    try {
      const leaflet = await import("leaflet");
      leaflet
        .tileLayer(this.mapConfig.tileLayerUrl, this.mapConfig.tileLayerOptions)
        .addTo(map);
    } catch (error) {
      console.error("Failed to add tile layer:", error);
      throw new Error("Failed to add tile layer");
    }
  }

  /**
   * Draw a route on the Leaflet map.
   *
   * @param map {LeafletMap} The Leaflet map instance where the route will be drawn.
   * @param travelRoute {Array<{ lat: number; lng: number; name: string }>} An array of points representing the route.
   * @returns {Promise<void>} A promise that resolves when the route is drawn on the map.
   */
  async drawRoute(map: LeafletMap, travelRoute: Array<TPoint>): Promise<void> {
    try {
      const leaflet = await import("leaflet");

      if (!travelRoute.length) {
        throw new Error("Travel route is empty");
      }

      // Convert travelRoute to LatLngExpression[]
      const routeCoordinates: LatLngExpression[] = travelRoute.map((point) => [
        point.lat,
        point.lng,
      ]);

      // Draw polyline
      leaflet
        .polyline(routeCoordinates, this.mapConfig.polylineOptions)
        .addTo(map);

      // Add markers with popups
      travelRoute.forEach((point, index) => {
        if (point.name) {
          const marker = leaflet.marker([point.lat, point.lng]).addTo(map);

          marker.bindPopup(
            `<div class="marker-popup">
            <strong>${index + 1}. ${point.name}</strong>
          </div>`,
          );
        }
      });
    } catch (error) {
      console.error("Failed to draw route:", error);

      throw new Error("Failed to draw route");
    }
  }
}

export const leafletService = LeafletService.getInstance();
