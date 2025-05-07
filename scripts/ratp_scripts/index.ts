import {ratpServices} from "../../src/lib/utils/ratpServices.ts";

const ratpServicesInstance = ratpServices();

/* STOP AUTOCOMPLETE */
(async () => {
  const query = "Gare d'Au"; // Gare d'Austerlitz

  try {
    const response = await ratpServicesInstance.getStopAutocomplete(query);

    console.log(`Found ${response.places.length} matching places.`);
    for (const place of response.places) {
      console.log(`Place: ${place.name}, ID: ${place.id}`);
    }

  } catch (error) {
    console.error("Error fetching autocomplete:", error);
  }
})();
