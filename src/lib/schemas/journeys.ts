import { z } from "zod";

// Helper schemas for commonly used structures
const CoordinateSchema = z.object({
  lon: z.string(),
  lat: z.string(),
});

const CodeSchema = z.object({
  type: z.string(),
  value: z.string(),
});

const LinkSchema = z.object({
  type: z.string().optional(),
  id: z.string().optional(),
  templated: z.boolean().optional(),
  rel: z.string().optional(),
  href: z.string().optional(),
  internal: z.boolean().optional(),
});

const AddressSchema = z.object({
  id: z.string(),
  name: z.string(),
  house_number: z.number().optional(),
  coord: CoordinateSchema,
  label: z.string(),
  administrative_regions: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        level: z.number(),
        zip_code: z.string(),
        label: z.string(),
        insee: z.string(),
        coord: CoordinateSchema,
      }),
    )
    .optional(),
});

const StopAreaSchema = z.object({
  id: z.string(),
  name: z.string(),
  codes: z.array(CodeSchema).optional(),
  timezone: z.string(),
  label: z.string(),
  coord: CoordinateSchema,
  links: z.array(LinkSchema),
});

const AccessPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  access_point: z.object({
    id: z.string(),
    name: z.string(),
    coord: CoordinateSchema,
    access_point_code: z.string(),
    embedded_type: z.string(),
  }),
  is_entrance: z.boolean(),
  is_exit: z.boolean(),
  length: z.number(),
  traversal_time: z.number(),
  pathway_mode: z.number(),
});

const StopPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  codes: z.array(CodeSchema),
  label: z.string(),
  coord: CoordinateSchema,
  links: z.array(LinkSchema),
  commercial_modes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  physical_modes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      co2_emission_rate: z
        .object({
          value: z.number(),
          unit: z.string(),
        })
        .optional(),
    }),
  ),
  administrative_regions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      level: z.number(),
      zip_code: z.string(),
      label: z.string(),
      insee: z.string(),
      coord: CoordinateSchema,
    }),
  ),
  stop_area: StopAreaSchema,
  equipments: z.array(z.string()),
  address: AddressSchema,
  fare_zone: z.object({
    name: z.string(),
  }),
  access_points: z.array(AccessPointSchema).optional(),
});

const RouteSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_frequence: z.string(),
  direction_type: z.string(),
  physical_modes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  codes: z.array(CodeSchema),
  direction: z.object({
    id: z.string(),
    name: z.string(),
    quality: z.number(),
    stop_area: StopAreaSchema,
    embedded_type: z.string(),
  }),
  geojson: z.object({
    type: z.string(),
    coordinates: z.array(z.any()),
  }),
  links: z.array(LinkSchema),
  line: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    color: z.string(),
    text_color: z.string(),
    codes: z.array(CodeSchema),
    physical_modes: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
    commercial_mode: z.object({
      id: z.string(),
      name: z.string(),
    }),
    network: z.object({
      id: z.string(),
      name: z.string(),
      links: z.array(LinkSchema),
      codes: z.array(CodeSchema).optional(),
    }),
    opening_time: z.string(),
    closing_time: z.string(),
    geojson: z.object({
      type: z.string(),
      coordinates: z.array(z.any()),
    }),
    links: z.array(LinkSchema),
  }),
});

const DisruptionSchema = z.object({
  id: z.string(),
  disruption_id: z.string(),
  impact_id: z.string(),
  application_periods: z.array(
    z.object({
      begin: z.string(),
      end: z.string(),
    }),
  ),
  status: z.string(),
  updated_at: z.string(),
  cause: z.string(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  severity: z.object({
    name: z.string(),
    effect: z.string(),
    color: z.string(),
    priority: z.number(),
  }),
  messages: z.array(
    z.object({
      text: z.string(),
      channel: z.object({
        content_type: z.string(),
        id: z.string(),
        name: z.string(),
        types: z.array(z.string()),
      }),
    }),
  ),
  impacted_objects: z.array(
    z.object({
      pt_object: z.object({
        id: z.string(),
        name: z.string(),
        quality: z.number(),
        stop_area: StopAreaSchema.optional(),
        embedded_type: z.string(),
      }),
    }),
  ),
  uri: z.string(),
  disruption_uri: z.string(),
  contributor: z.string(),
});

// Main schema
export const TransportSchema = z.object({
  pagination: z.object({
    total_result: z.number(),
    start_page: z.number(),
    items_per_page: z.number(),
    items_on_page: z.number(),
  }),
  feed_publishers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      license: z.string(),
    }),
  ),
  disruptions: z.array(DisruptionSchema),
  context: z.object({
    current_datetime: z.string(),
    timezone: z.string(),
  }),
  arrivals: z.array(
    z.object({
      route: RouteSchema,
      stop_point: StopPointSchema,
      stop_date_time: z.object({
        departure_date_time: z.string(),
        base_departure_date_time: z.string(),
        arrival_date_time: z.string(),
        base_arrival_date_time: z.string(),
        additional_informations: z.array(z.any()),
        links: z.array(z.any()),
        data_freshness: z.string(),
      }),
      display_informations: z.object({
        commercial_mode: z.string(),
        network: z.string(),
        direction: z.string(),
        label: z.string(),
        color: z.string(),
        code: z.string(),
        headsign: z.string(),
        name: z.string(),
        links: z.array(z.any()),
        text_color: z.string(),
        trip_short_name: z.string(),
        description: z.string(),
        physical_mode: z.string(),
        equipments: z.array(z.string()),
      }),
      links: z.array(LinkSchema),
    }),
  ),
  links: z.array(LinkSchema),
  notes: z.array(z.any()),
  exceptions: z.array(z.any()),
});
