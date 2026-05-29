import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import type { BoundingBox, PropertyListing } from "@/lib/models/property-listing";

interface PriceFilter {
  minPrice?: number;
  maxPrice?: number;
}

interface UpsertListingInput {
  title: string;
  description: string;
  price: number;
  currency: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  originalUrl: string;
  sourceName: string;
  externalId: string;
}

interface ListingQueryRow {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  originalUrl: string;
  sourceName: string;
  externalId: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapRowToListing(row: ListingQueryRow): PropertyListing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    currency: row.currency,
    latitude: row.latitude,
    longitude: row.longitude,
    imageUrl: row.imageUrl,
    originalUrl: row.originalUrl,
    sourceName: row.sourceName,
    externalId: row.externalId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getListingsByBoundingBox(
  bbox: BoundingBox,
  filters: PriceFilter,
): Promise<PropertyListing[]> {
  const minimumPrice = filters.minPrice ?? null;
  const maximumPrice = filters.maxPrice ?? null;

  const query = sql<ListingQueryRow>`
    SELECT
      id,
      title,
      description,
      price,
      currency,
      latitude,
      longitude,
      image_url AS "imageUrl",
      original_url AS "originalUrl",
      source_name AS "sourceName",
      external_id AS "externalId",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM property_listings
    WHERE ST_Within(
      point,
      ST_MakeEnvelope(${bbox.west}, ${bbox.south}, ${bbox.east}, ${bbox.north}, 4326)
    )
    AND (${minimumPrice}::numeric IS NULL OR price >= ${minimumPrice})
    AND (${maximumPrice}::numeric IS NULL OR price <= ${maximumPrice})
    ORDER BY updated_at DESC
    LIMIT 500
  `;

  const result = await getDb().execute(query);

  return result.map((row) => mapRowToListing(row as unknown as ListingQueryRow));
}

export async function upsertPropertyListing(listing: UpsertListingInput): Promise<void> {
  await getDb().execute(sql`
    INSERT INTO property_listings (
      title,
      description,
      price,
      currency,
      latitude,
      longitude,
      point,
      image_url,
      original_url,
      source_name,
      external_id,
      created_at,
      updated_at
    ) VALUES (
      ${listing.title},
      ${listing.description},
      ${listing.price},
      ${listing.currency},
      ${listing.latitude},
      ${listing.longitude},
      ST_SetSRID(ST_MakePoint(${listing.longitude}, ${listing.latitude}), 4326),
      ${listing.imageUrl},
      ${listing.originalUrl},
      ${listing.sourceName},
      ${listing.externalId},
      NOW(),
      NOW()
    )
    ON CONFLICT (source_name, external_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      currency = EXCLUDED.currency,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      point = EXCLUDED.point,
      image_url = EXCLUDED.image_url,
      original_url = EXCLUDED.original_url,
      updated_at = NOW()
  `);
}
