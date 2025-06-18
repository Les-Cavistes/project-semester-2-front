import { z } from "zod";

const CoordinatesSchema = z.object({
  lat: z
    .string()
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Latitude must be a number",
    })
    .refine((val) => Number(val) >= -90 && Number(val) <= 90, {
      message: "Latitude must be between -90 and 90",
    }),
  lon: z
    .string()
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Longitude must be a number",
    })
    .refine((val) => Number(val) >= -180 && Number(val) <= 180, {
      message: "Longitude must be between -180 and 180",
    }),
});

const PlaceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  coordinates: CoordinatesSchema,
});

const SectionTypeEnum = z.enum([
  "street_network",
  "public_transport",
  "transfer",
]);

// Utility function to parse Navitia date format
function parseNavitiaDate(dateTime: string): Date {
  if (!dateTime || !/^\d{8}T\d{6}$/.test(dateTime)) {
    throw new Error(
      "Invalid date format, must be ISO 8601 like 20250515T221800",
    );
  }

  const year = dateTime.substring(0, 4);
  const month = dateTime.substring(4, 6);
  const day = dateTime.substring(6, 8);
  const hour = dateTime.substring(9, 11);
  const minute = dateTime.substring(11, 13);
  const second = dateTime.substring(13, 15);
  const formatted = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

  const date = new Date(formatted);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }

  return date;
}

// Format Date object to Navitia format
function formatToNavitiaDate(date: Date): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}T${hour}${minute}${second}`;
}

const NavitiaDateSchema = z
  .string()
  .refine((val) => /^\d{8}T\d{6}$/.test(val), {
    message: "Invalid date format, must be ISO 8601 like 20250515T221800",
  })
  .refine(
    (val) => {
      try {
        parseNavitiaDate(val);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid date value",
    },
  )
  .transform((val) => parseNavitiaDate(val));

const GeoJsonPropertySchema = z.object({
  length: z.number(),
});

const GeoJsonSchema = z.object({
  type: z.string(),
  coordinates: z.array(z.array(z.number())),
  properties: z.array(GeoJsonPropertySchema),
});

// Add transport line information schema
const TransportLineSchema = z.object({
  code: z.string(),
  name: z.string(),
  label: z.string(),
  color: z.string(),
  text_color: z.string(),
});

// Add transport information schema
const TransportSchema = z.object({
  mode: z.string(),
  network: z.string(),
  line: TransportLineSchema,
  direction: z.string(),
  headsign: z.string(),
  physical_mode: z.string(),
});

// Add stop point schema for detailed stops
const StopPointSchema = z.object({
  name: z.string(),
});

// Add stop date times schema
const StopDateTimeSchema = z.object({
  stop_point: StopPointSchema,
  departure_date_time: z.string().optional(),
  arrival_date_time: z.string().optional(),
});

const SectionSchema = z
  .object({
    duration: z.number().positive("Duration must be a positive number"),
    departure_date_time: NavitiaDateSchema,
    arrival_date_time: NavitiaDateSchema,
    from: PlaceSchema,
    to: PlaceSchema,
    type: SectionTypeEnum,
    geojson: GeoJsonSchema.optional(),
    // Add transport information (for public_transport sections)
    transport: TransportSchema.optional(),
    // Add detailed stop information
    stop_date_times: z.array(StopDateTimeSchema).optional(),
    // Legacy fields for backward compatibility
    line: z.string().optional(),
    mode: z.string().optional(),
    direction: z.string().optional(),
    color: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.arrival_date_time > data.departure_date_time;
    },
    {
      message: "Arrival time must be after departure time",
      path: ["arrival_date_time"],
    },
  );

const JourneySchema = z.object({
  duration: z.number().positive("Duration must be a positive number"),
  departure_date_time: NavitiaDateSchema.optional(),
  arrival_date_time: NavitiaDateSchema.optional(),
  sections: z.array(SectionSchema),
});

export const JourneysResponseSchema = z.object({
  journeys: z.array(JourneySchema),
});

// Export types
export type TCoordinates = z.infer<typeof CoordinatesSchema>;
export type TPlace = z.infer<typeof PlaceSchema>;
export type TSectionType = z.infer<typeof SectionTypeEnum>;
export type TGeoJson = z.infer<typeof GeoJsonSchema>;
export type TTransportLine = z.infer<typeof TransportLineSchema>;
export type TTransport = z.infer<typeof TransportSchema>;
export type TStopPoint = z.infer<typeof StopPointSchema>;
export type TStopDateTime = z.infer<typeof StopDateTimeSchema>;
export type TSection = z.infer<typeof SectionSchema>;
export type TJourney = z.infer<typeof JourneySchema>;
export type TJourneysResponse = z.infer<typeof JourneysResponseSchema>;

// Fonctions utilitaires exportées
export { parseNavitiaDate, formatToNavitiaDate };
