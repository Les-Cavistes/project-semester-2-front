/**
 * @file src/routes/api/places/+server.ts
 * @description +server
 * @author Tom Planche
 */

import {RATP_API_KEY} from '$env/static/private';
import {
  error,
  json,
  type RequestHandler
} from '@sveltejs/kit';
import {RATP_API_ENDPOINT_V2} from '$lib/consts/';
import axios from "axios";
import {PlacesSchema} from "$lib/schemas/";

export const GET: RequestHandler = async ({url}) => {
    const query = url.searchParams.get('q') || url.searchParams.get('query');

    if (!query) {
      throw error(400, '`query` parameter is required');
    }

    const request = await axios.get(`${RATP_API_ENDPOINT_V2}/navitia/places`,
      {
        params: {
          q: query,
          display_geojson: false
        },
        headers: {
          apikey: RATP_API_KEY
        }
      },
    )

    if (request.status === 200) {
      return json(PlacesSchema.parse(request.data));
    }

    throw error(request.status, request.statusText);
  }
;

/**
 * End of file src/routes/api/places/+server.ts
 */