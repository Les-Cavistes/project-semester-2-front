import { GoogleServices, googleServices } from "$lib/utils/googleServices";
import {
  Client,
  type PlaceAutocompleteRequest,
} from "@googlemaps/google-maps-services-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the external dependencies
vi.mock("axios");
vi.mock("@googlemaps/google-maps-services-js", () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      placeAutocomplete: vi.fn(),
      placeDetails: vi.fn(),
    })),
  };
});

describe("GoogleServices", () => {
  // Store original environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset the environment before each test
    vi.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.GOOGLE_MAPS_API_KEY = "test-api-key";

    // Clear any cached instances between tests
    // @ts-ignore - Accessing private static for testing purposes
    GoogleServices.instance = undefined;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe("Initialization", () => {
    it("should throw an error if API key is not defined", () => {
      // biome-ignore lint/performance/noDelete: test purposes
      delete process.env.GOOGLE_MAPS_API_KEY;

      expect(() => GoogleServices.getInstance()).toThrow(
        "[GoogleServices] GOOGLE_MAPS_API_KEY is not defined",
      );
    });
  });

  describe("Singleton Pattern", () => {
    it("should create only one instance", () => {
      const instance1 = GoogleServices.getInstance();
      const instance2 = GoogleServices.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("placeAutocomplete", () => {
    it("should call client.placeAutocomplete with the provided params", async () => {
      const mockResponse = {
        data: {
          predictions: [
            {
              description: "Paris, France",
              place_id: "place_id_1",
            },
            {
              description: "Paris, Texas, USA",
              place_id: "place_id_2",
            },
          ],
          status: "OK",
        },
      };

      const mockClient = {
        placeAutocomplete: vi.fn().mockResolvedValue(mockResponse),
      };

      // @ts-ignore - Mocking the Client implementation
      Client.mockImplementation(() => mockClient);

      const googleServices = GoogleServices.getInstance();
      const params = {
        input: "Paris",
        types: "(cities)",
      } as PlaceAutocompleteRequest["params"];

      const result = await googleServices.placeAutocomplete(params);

      expect(mockClient.placeAutocomplete).toHaveBeenCalledWith({
        params,
      });
      expect(result).toBe(mockResponse);
    });

    it("should propagate errors from the API call", async () => {
      const mockError = new Error("API Error");
      const mockClient = {
        placeAutocomplete: vi.fn().mockRejectedValue(mockError),
      };

      // @ts-ignore - Mocking the Client implementation
      Client.mockImplementation(() => mockClient);

      const googleServices = GoogleServices.getInstance();
      const params = {
        input: "Paris",
        types: ["(citiess)"], // not an array and wrong type
      };

      // @ts-ignore - Mocking the Client implementation
      await expect(
        googleServices.placeAutocomplete(
          params as unknown as PlaceAutocompleteRequest["params"],
        ),
      ).rejects.toThrow("API Error");
    });
  });

  describe("googleServices export", () => {
    it("should export a function that returns the GoogleServices instance", () => {
      // The function should return the singleton instance
      const instance = googleServices();
      expect(instance).toBeInstanceOf(GoogleServices);
    });
  });

  describe("placeDetails", () => {
    it("should call client.placeDetails with the correct parameters", async () => {
      const mockResponse = {
        data: {
          result: {
            geometry: {
              location: {
                lat: 48.8566,
                lng: 2.3522,
              },
            },
          },
          status: "OK",
        },
      };

      const mockClient = {
        placeAutocomplete: vi.fn(),
        placeDetails: vi.fn().mockResolvedValue(mockResponse),
      };

      // @ts-ignore - Mocking the Client implementation
      Client.mockImplementation(() => mockClient);

      const googleServices = GoogleServices.getInstance();
      const placeId = "test_place_id";

      const result = await googleServices.placeDetails(placeId);

      expect(mockClient.placeDetails).toHaveBeenCalledWith({
        params: {
          place_id: placeId,
          fields: ["geometry"],
        },
      });
      expect(result).toBe(mockResponse);
    });

    it("should propagate errors from the API call", async () => {
      const mockError = new Error("Places API Error");
      const mockClient = {
        placeAutocomplete: vi.fn(),
        placeDetails: vi.fn().mockRejectedValue(mockError),
      };

      // @ts-ignore - Mocking the Client implementation
      Client.mockImplementation(() => mockClient);

      const googleServices = GoogleServices.getInstance();

      await expect(
        googleServices.placeDetails("invalid_place_id"),
      ).rejects.toThrow("Places API Error");
    });
  });
});
