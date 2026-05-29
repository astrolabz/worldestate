import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getListingsByBoundingBox } from "@/lib/db/listings-repository";
import type { BoundingBox } from "@/lib/models/property-listing";

const bboxSchema = z
  .string()
  .transform((value) => {
    const values = value.split(",").map((part) => Number(part.trim()));

    if (values.length !== 4 || values.some((item) => Number.isNaN(item))) {
      throw new Error("Invalid bbox");
    }

    const [west, south, east, north] = values;

    return {
      west,
      south,
      east,
      north,
    } satisfies BoundingBox;
  });

const priceSchema = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? undefined : numericValue;
  });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const bbox = bboxSchema.parse(searchParams.get("bbox"));
    const minPrice = priceSchema.parse(searchParams.get("minPrice") ?? undefined);
    const maxPrice = priceSchema.parse(searchParams.get("maxPrice") ?? undefined);

    const listings = await getListingsByBoundingBox(bbox, {
      minPrice,
      maxPrice,
    });

    return NextResponse.json({ listings });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
