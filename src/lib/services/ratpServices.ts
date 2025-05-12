import { PlacesSchema, type TPlaces } from "$lib/schemas";
import { error } from "@sveltejs/kit";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

export class RatpServices {
  private static instance: RatpServices;
  static RATP_API_ENDPOINT =
    "https://prim.iledefrance-mobilites.fr/marketplace";
  static RATP_API_ENDPOINT_V2 =
    "https://prim.iledefrance-mobilites.fr/marketplace/v2";

  private readonly axiosInstance: AxiosInstance;
  private readonly axiosInstanceV2: AxiosInstance;

  private constructor() {
    const apiKey = process.env.RATP_API_KEY;

    if (!apiKey) {
      throw new Error("[RatpServices] RATP_API_KEY is not defined");
    }

    this.axiosInstance = axios.create({
      baseURL: RatpServices.RATP_API_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
    });

    this.axiosInstanceV2 = axios.create({
      baseURL: RatpServices.RATP_API_ENDPOINT_V2,
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
    });
  }

  public static getInstance(): RatpServices {
    if (!RatpServices.instance) {
      RatpServices.instance = new RatpServices();
    }
    return RatpServices.instance;
  }

  /**
   * Get the stop autocomplete suggestions from the RATP API.
   *
   * @param query {string} The query to search for.
   * @returns {Promise<TPlaces[]>} The list of places matching the query.
   * @throws {Error} When the API request fails or response validation fails
   */
  public async getStopAutocomplete(query: string): Promise<TPlaces> {
    try {
      const request: AxiosResponse<TPlaces> = await this.axiosInstanceV2.get(
        "/navitia/places/",
        {
          params: {
            q: encodeURIComponent(query),
            display_geojson: false,
          },
        },
      );

      if (request.status !== 200) {
        return Promise.reject(
          error(request.status, `API request failed: ${request.statusText}`),
        );
      }

      return PlacesSchema.parse(request.data);
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

export const ratpServices = RatpServices.getInstance;
