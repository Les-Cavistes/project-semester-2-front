import axios from "axios";
import { JourneysResponseSchema, type TJourneysResponse } from "$lib/schemas";
import { error } from "@sveltejs/kit";

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
   * @returns {Promise<TJourneysResponse>} Journey data
   * @throws {Error} When API request fails or validation fails
   */
  public async getJourney(
    fromLon: number,
    fromLat: number,
    toLon: number,
    toLat: number
  ): Promise<TJourneysResponse> {
    try {
      const fromCoords = `${fromLon};${fromLat}`;
      const toCoords = `${toLon};${toLat}`;

      const response = await axios.get("/api/journey", {
        params: {
          from: fromCoords,
          to: toCoords
        }
      });

      // Validate response against schema
      return JourneysResponseSchema.parse(response.data.data);
    } catch (e) {
      if (e instanceof Error) {
        // Handle validation errors
        if (e.name === "ZodError") {
          return Promise.reject(
            error(500, `Response validation failed: ${e.message}`)
          );
        }
        // Handle axios errors
        if (axios.isAxiosError(e)) {
          return Promise.reject(
            error(
              e.response?.status || 500,
              `API request failed: ${e.message}`
            )
          );
        }
      }
      // Handle unknown errors
      return Promise.reject(error(500, "An unexpected error occurred"));
    }
  }
}

export const journeyServices = JourneyServices.getInstance;