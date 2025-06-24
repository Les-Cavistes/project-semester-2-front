import { CAVISTES_API_KEY } from "$env/static/private";
import { PUBLIC_BACK_ENDPOINT } from "$env/static/public";
import { json } from "@sveltejs/kit";
import axios from "axios";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const JourneyQuerySchema = z.object({
  from: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?;-?\d+(\.\d+)?$/,
      "Must be in format 'longitude;latitude'",
    ),
  to: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?;-?\d+(\.\d+)?$/,
      "Must be in format 'longitude;latitude'",
    ),
});

export const GET: RequestHandler = async ({ url }) => {
  try {
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    // Validate inputs
    if (!from || !to) {
      return json(
        {
          status: "error",
          message: "Both 'from' and 'to' parameters are required",
        },
        { status: 400 },
      );
    }

    try {
      JourneyQuerySchema.parse({ from, to });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return json(
          {
            status: "error",
            message: `Invalid parameters: ${validationError.errors[0].message}`,
          },
          { status: 400 },
        );
      }
    }

    if (
      CAVISTES_API_KEY === undefined ||
      CAVISTES_API_KEY === null ||
      CAVISTES_API_KEY.trim() === ""
    ) {
      return json(
        {
          status: "error",
          message: "CAVISTES_API_KEY is not defined",
        },
        { status: 500 },
      );
    }

    const { data } = await axios.get(`${PUBLIC_BACK_ENDPOINT}/journey`, {
      params: { from, to },
      headers: {
        CAVISTES_API_KEY: CAVISTES_API_KEY,
      },
    });

    return json(data);
  } catch (error) {
    console.error("Error fetching journey:", error);

    if (axios.isAxiosError(error)) {
      return json(
        {
          status: "error",
          message: error.response?.data?.message || "Backend server error",
        },
        { status: error.response?.status || 500 },
      );
    }

    return json(
      {
        status: "error",
        message: "Failed to fetch journey data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
