import type { TPlaces } from "$lib/schemas";
import axios from "axios";

export class RatpServices {
  private static instance: RatpServices;

  private constructor() {}

  public static getInstance(): RatpServices {
    if (!RatpServices.instance) {
      RatpServices.instance = new RatpServices();
    }
    return RatpServices.instance;
  }

  public async getStopAutocomplete(query: string): Promise<TPlaces> {
    try {
      const response = await axios.get("/api/places", {
        params: { q: query },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
      throw new Error("Failed to fetch autocomplete suggestions");
    }
  }
}

export const ratpServices = () => RatpServices.getInstance();
