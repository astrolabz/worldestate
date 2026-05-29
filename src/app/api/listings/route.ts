import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getListingsByBoundingBox } from "@/lib/db/listings-repository";
import type { BoundingBox } from "@/lib/models/property-listing";

const querySchema = z
  .object({
    bbox: z.string(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
  })
  .transform((value) => {
    const bboxValues = value.bbox.split(",").map((part) => Number(part.trim()));

    if (bboxValues.length !== 4 || bboxValues.some((item) => Number.isNaN(item))) {
      throw new Error("Invalid bbox");
    }

    const [west, south, east, north] = bboxValues;

    const minPrice = value.minPrice ? Number(value.minPrice) : undefined;
    const maxPrice = value.maxPrice ? Number(value.maxPrice) : undefined;

    if (typeof minPrice === "number" && Number.isNaN(minPrice)) {
      throw new Error("Invalid minPrice");
    }

    if (typeof maxPrice === "number" && Number.isNaN(maxPrice)) {
      throw new Error("Invalid maxPrice");
    }

    return {
      bbox: {
        west,
        south,
        east,
        north,
      } satisfies BoundingBox,
      minPrice,
      maxPrice,
    };
  })
  .superRefine((value, context) => {
    if (value.bbox.west < -180 || value.bbox.west > 180 || value.bbox.east < -180 || value.bbox.east > 180) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Longitude values must be between -180 and 180",
      });
    }

    if (value.bbox.south < -90 || value.bbox.south > 90 || value.bbox.north < -90 || value.bbox.north > 90) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Latitude values must be between -90 and 90",
      });
    }

    if (value.bbox.south > value.bbox.north) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "South must be less than or equal to north",
      });
    }

    if (typeof value.minPrice === "number" && value.minPrice < 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "minPrice cannot be negative",
      });
    }

    if (typeof value.maxPrice === "number" && value.maxPrice < 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "maxPrice cannot be negative",
      });
    }

    if (
      typeof value.minPrice === "number" &&
      typeof value.maxPrice === "number" &&
      value.minPrice > value.maxPrice
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "minPrice must be less than or equal to maxPrice",
      });
    }
  });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsedQuery = querySchema.parse({
      bbox: searchParams.get("bbox"),
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
    });

    const listings = await getListingsByBoundingBox(parsedQuery.bbox, {
      minPrice: parsedQuery.minPrice,
      maxPrice: parsedQuery.maxPrice,
    });

    return NextResponse.json({ listings });
  } catch (error) {
    if (error instanceof z.ZodError || (error instanceof Error && error.message.startsWith("Invalid "))) {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch listings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
