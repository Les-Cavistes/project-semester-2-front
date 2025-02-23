/**
 * @file src/lib/schemas/places.ts
 * @description places
 * @author Tom Planche
 */
import {z} from "zod";

// Basic reusable schemas
const CoordSchema = z.object({
  lat: z.string(),
  lon: z.string(),
});

const NetworkSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const CommercialModeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const PhysicalModeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const AdministrativeRegionSchema = z.object({
  id: z.string(),
  insee: z.string(),
  name: z.string(),
  label: z.string(),
  level: z.number(),
  coord: CoordSchema,
  zip_code: z.string().nullable(),
});

const CodeSchema = z.object({
  type: z.string(),
  value: z.string(),
});

const LineSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  commercial_mode: CommercialModeSchema,
  physical_modes: z.array(PhysicalModeSchema),
  network: NetworkSchema,
  color: z.string(),
  text_color: z.string(),
});

const StopAreaSchema = z.object({
  id: z.string(),
  coord: CoordSchema,
  label: z.string(),
  name: z.string(),
  administrative_regions: z.array(AdministrativeRegionSchema),
  timezone: z.string(),
  commercial_modes: z.array(CommercialModeSchema),
  physical_modes: z.array(PhysicalModeSchema),
  comment: z.null(),
  codes: z.array(CodeSchema),
  lines: z.array(LineSchema),
});

const PlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  quality: z.number(),
  embedded_type: z.string(),
  stop_area: StopAreaSchema.optional(),
});

const WarningSchema = z.object({
  id: z.string(),
  message: z.string(),
});

const FeedPublisherSchema = z.object({
  id: z.string(),
  license: z.string(),
  name: z.string(),
  url: z.string(),
});

const ContextSchema = z.object({
  current_datetime: z.string(),
  timezone: z.string(),
});

const LinkSchema = z.object({
  href: z.string(),
  templated: z.boolean(),
  rel: z.string(),
  type: z.string(),
});

// Main response schema
export const PlacesSchema = z.object({
  places: z.array(PlaceSchema),
  warnings: z.array(WarningSchema),
  feed_publishers: z.array(FeedPublisherSchema),
  context: ContextSchema,
  links: z.array(LinkSchema),
});

export type TPlaces = z.infer<typeof PlacesSchema>;

/**
 * End of file src/lib/schemas/places.ts
 */