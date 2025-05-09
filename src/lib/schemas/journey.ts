import { z } from "zod";

const CoordinatesSchema = z.object({
  lat: z.string(),
  lon: z.string(),
});

const PlaceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  coordinates: CoordinatesSchema,
});

const SectionSchema = z.object({
  duration: z.number(),
  departure_date_time: z.string(),
  arrival_date_time: z.string(),
  from: PlaceSchema,
  to: PlaceSchema,
  type: z.string(),
});

const JourneySchema = z.object({
  duration: z.number(),
  sections: z.array(SectionSchema),
});

export const JourneysResponseSchema = z.object({
  journeys: z.array(JourneySchema),
});

// Export types
export type TCoordinates = z.infer<typeof CoordinatesSchema>;
export type TPlace = z.infer<typeof PlaceSchema>;
export type TSection = z.infer<typeof SectionSchema>;
export type TJourney = z.infer<typeof JourneySchema>;
export type TJourneysResponse = z.infer<typeof JourneysResponseSchema>;