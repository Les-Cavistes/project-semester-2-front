import type { TPoint } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const travelRoute = [
    { lat: 48.877711, lng: 2.291881 },
    { lat: 48.87769, lng: 2.291815 },
    { lat: 48.877153, lng: 2.292163 },
    { lat: 48.877102, lng: 2.292186 },
    { lat: 48.877009, lng: 2.292221 },
    { lat: 48.876979, lng: 2.292242 },
    { lat: 48.87692, lng: 2.292291 },
    { lat: 48.876596, lng: 2.292563 },
    { lat: 48.876566, lng: 2.292481 },
    { lat: 48.876555, lng: 2.292444 },
    { lat: 48.876542, lng: 2.292404 },
    { lat: 48.876476, lng: 2.292461 },
    { lat: 48.876426, lng: 2.292503 },
    { lat: 48.876361, lng: 2.292559 },
    { lat: 48.876169, lng: 2.292721 },
    { lat: 48.876093, lng: 2.292737 },
    { lat: 48.875859, lng: 2.292938 },
    { lat: 48.875818, lng: 2.293013 },
    { lat: 48.875671, lng: 2.293137 },
    { lat: 48.875289, lng: 2.293459 },
    { lat: 48.875294, lng: 2.293679 },
    { lat: 48.8752620263, lng: 2.2938857257 },
  ] as Array<TPoint>;

  return {
    travelRoute,
  };
};
