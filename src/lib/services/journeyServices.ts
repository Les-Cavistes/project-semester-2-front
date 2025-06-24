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
export const getJourney = async (
  fromLon: number,
  fromLat: number,
  toLon: number,
  toLat: number,
): Promise<TJourneysResponse> => {
  try {
    const fromCoords = formatCoordinates({ lon: fromLon, lat: fromLat });
    const toCoords = formatCoordinates({ lon: toLon, lat: toLat });

    const response = await axios.get("/api/journey", {
      params: {
        from: fromCoords,
        to: toCoords,
      },
    });

    // Validate response against schema
    return JourneysResponseSchema.parse(response.data.data);
  } catch (e) {
    if (e instanceof Error) {
      // Handle validation errors
      if (e.name === "ZodError") {
        return Promise.reject(
          error(500, `Response validation failed: ${e.message}`),
        );
      }
      // Handle axios errors
      if (axios.isAxiosError(e)) {
        return Promise.reject(
          error(e.response?.status || 500, `API request failed: ${e.message}`),
        );
      }
    }
    // Handle unknown errors
    return Promise.reject(error(500, "An unexpected error occurred"));
  }
};
