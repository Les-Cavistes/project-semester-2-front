import { JourneysResponseSchema, type TJourneysResponse } from "$lib/schemas";
import { error } from "@sveltejs/kit";
import axios from "axios";

type Coordinates = {
  lon: number;
  lat: number;
};

/**
 * Formats coordinates into a string representation
 * @param coords - Coordinate object with longitude and latitude
 * @returns Formatted string in the format "lon;lat"
 */
export const formatCoordinates = (coords: Coordinates): string => {
  return `${coords.lon};${coords.lat}`;
};

export class JourneyServices {
  private static instance: JourneyServices;

  private constructor() {}

  public static getInstance(): JourneyServices {
    if (!JourneyServices.instance) {
      JourneyServices.instance = new JourneyServices();
    }
    return JourneyServices.instance;
  }

  /**
   * Get journey information between two coordinate points
   *
   * @param fromLon - Starting point longitude
   * @param fromLat - Starting point latitude
   * @param toLon - Destination longitude
   * @param toLat - Destination latitude
   * @returns {Promise<TJourneysResponse>} Journey data with transport information
   * @throws {Error} When API request fails or validation fails
   */
  public async getJourney(
    fromLon: number,
    fromLat: number,
    toLon: number,
    toLat: number,
  ): Promise<TJourneysResponse> {
    try {
      const fromCoords = formatCoordinates({ lon: fromLon, lat: fromLat });
      const toCoords = formatCoordinates({ lon: toLon, lat: toLat });

      console.log(`🚀 Requesting journey from ${fromCoords} to ${toCoords}`);

      const response = await axios.get("/api/journey", {
        params: {
          from: fromCoords,
          to: toCoords,
        },
      });

      console.log("📥 Raw API response:", response.data);

      // Validate response against schema
      const validatedData = JourneysResponseSchema.parse(response.data.data);

      console.log("✅ Validated journey data:", validatedData);
      console.log(
        "🚇 Transport info sample:",
        validatedData.journeys[0]?.sections?.[0]?.transport,
      );

      return validatedData;
    } catch (e) {
      console.error("❌ Journey service error:", e);

      if (e instanceof Error) {
        // Handle validation errors
        if (e.name === "ZodError") {
          console.error("📋 Schema validation failed:", e.message);
          return Promise.reject(
            error(500, `Response validation failed: ${e.message}`),
          );
        }
        // Handle axios errors
        if (axios.isAxiosError(e)) {
          console.error(
            "🌐 API request failed:",
            e.response?.data || e.message,
          );
          return Promise.reject(
            error(
              e.response?.status || 500,
              `API request failed: ${e.message}`,
            ),
          );
        }
      }
      // Handle unknown errors
      return Promise.reject(error(500, "An unexpected error occurred"));
    }
  }
}

export const journeyServices = JourneyServices.getInstance;
