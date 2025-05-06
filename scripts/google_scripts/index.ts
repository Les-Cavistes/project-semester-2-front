import {GoogleServices} from "../../src/lib/utils/googleServices.ts";
import type {PlaceAutocompleteRequest} from "@googlemaps/google-maps-services-js";

const googleServices = GoogleServices.getInstance();
const textToComplete = "Aux ratt";

/* PLACE AUTOCOMPLETE + PLACE DETAILS FOR COORDS */
(async () => {
  const placeAutocompleteParams = {
    input: textToComplete,
    location: {lat: 48.8566, lng: 2.3522},
    radius: 1000, // 1km
    components: ["country:fr"], // country: ISO 3166-1 Alpha-2 compatible country code
    language: "fr",
  } as PlaceAutocompleteRequest["params"];

  try {
    const {data: placesFound} = await googleServices.placeAutocomplete(placeAutocompleteParams);

    if (!placesFound.predictions.length) {
      console.error("No places found");
      return;
    }

    const chosenPlaceId = placesFound.predictions[0].place_id;
    const {data: placeDetails} = await googleServices.placeDetails(chosenPlaceId);

    console.log("Place details:", placeDetails);

  } catch (error) {
    console.error("Error fetching autocomplete:", error);
  }
})()