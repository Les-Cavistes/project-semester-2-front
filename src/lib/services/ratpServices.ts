// src/lib/services/ratpServices.ts
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
      // Appeler l'API route SvelteKit au lieu de l'API externe directement
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
