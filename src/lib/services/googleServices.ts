import {
  Client,
  type PlaceAutocompleteRequest,
  type PlaceAutocompleteResponse,
  type PlaceDetailsRequest,
  type PlaceDetailsResponse,
} from "@googlemaps/google-maps-services-js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class GoogleServices {
  private static instance: GoogleServices;
  private readonly client: Client;

  private constructor() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error("[GoogleServices] GOOGLE_MAPS_API_KEY is not defined");
    }

    const axiosInstance = axios.create({
      params: {
        key: apiKey,
      },
    });

    this.client = new Client({ axiosInstance });
  }

  public static getInstance(): GoogleServices {
    if (!GoogleServices.instance) {
      GoogleServices.instance = new GoogleServices();
    }
    return GoogleServices.instance;
  }

  /**
   * Get the autocomplete from Google Maps API
   *
   * @param params {PlaceAutocompleteRequest["params"]} - Parameters for the autocomplete request @see PlaceAutocompleteRequest
   * @returns {Promise<PlaceAutocompleteResponse>} - Promise that resolves to the autocomplete response.
   */
  async placeAutocomplete(
    params: PlaceAutocompleteRequest["params"],
  ): Promise<PlaceAutocompleteResponse> {
    return this.client.placeAutocomplete({ params });
  }

  /**
   *
   * @param placeId {string} - The correct place id to get the long and lat for.
   * @returns {Promise<PlaceDetailsResponse>} - Promise that resolves to the place details response.
   */
  async placeDetails(placeId: string): Promise<PlaceDetailsResponse> {
    return this.client.placeDetails({
      params: {
        place_id: placeId,
        fields: ["geometry"], // Optimize by only requesting geometric data
      } as PlaceDetailsRequest["params"],
    });
  }
}

export const googleServices = GoogleServices.getInstance;
