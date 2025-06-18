import { GoogleServices } from "$lib/services/googleServices";
import type { PlaceAutocompleteRequest } from "@googlemaps/google-maps-services-js";
// src/routes/api/places/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get("q");

  if (!query) {
    return json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    console.log("🔍 Google Places search for:", query);

    const googleServices = GoogleServices.getInstance();

    const placeAutocompleteParams = {
      input: query,
      location: { lat: 48.8566, lng: 2.3522 }, // Paris comme centre
      radius: 50000, // 50km autour de Paris
      components: ["country:fr"], // Limiter à la France
      language: "fr",
      // types: "establishment" // Utilisez une seule valeur ou omettez cette ligne pour inclure tous les types
    } as PlaceAutocompleteRequest["params"];

    const { data: placesFound } = await googleServices.placeAutocomplete(
      placeAutocompleteParams,
    );

    console.log("✅ Google Places found:", placesFound.predictions.length);

    // Transformer la réponse Google en format compatible
    const places = await Promise.all(
      placesFound.predictions.slice(0, 8).map(async (prediction) => {
        try {
          // Récupérer les détails pour avoir les coordonnées
          const { data: details } = await googleServices.placeDetails(
            prediction.place_id,
          );

          return {
            id: prediction.place_id,
            name:
              prediction.structured_formatting?.main_text ||
              prediction.description,
            embedded_type: "address",
            quality: 90,
            coord: details.result.geometry?.location
              ? {
                  lat: details.result.geometry.location.lat.toString(),
                  lon: details.result.geometry.location.lng.toString(),
                }
              : undefined,
            address: {
              label: details.result.formatted_address || prediction.description,
            },
          };
        } catch (detailError) {
          console.warn(
            "Error fetching details for place:",
            prediction.place_id,
            detailError,
          );
          // Retourner les données basiques même si les détails échouent
          return {
            id: prediction.place_id,
            name:
              prediction.structured_formatting?.main_text ||
              prediction.description,
            embedded_type: "address",
            quality: 85,
            address: {
              label: prediction.description,
            },
          };
        }
      }),
    );

    return json({ places });
  } catch (error) {
    console.error("❌ Error fetching Google places:", error);
    return json(
      {
        error: "Failed to fetch places",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
