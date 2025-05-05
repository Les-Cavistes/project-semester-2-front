import {
  Client,
  type PlaceAutocompleteRequest,
  type PlaceAutocompleteResponse,
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

  async placeAutocomplete(
    params: PlaceAutocompleteRequest["params"],
  ): Promise<PlaceAutocompleteResponse> {
    return this.client.placeAutocomplete({ params });
  }
}

export const googleServices = GoogleServices.getInstance;
