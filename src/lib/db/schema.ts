import {
  customType,
  doublePrecision,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const geometryPoint = customType<{ data: string }>({
  dataType() {
    return "geometry(Point, 4326)";
  },
});

export const propertyListingsTable = pgTable(
  "property_listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 14, scale: 2 }).notNull(),
    currency: text("currency").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    point: geometryPoint("point").notNull(),
    imageUrl: text("image_url").notNull(),
    originalUrl: text("original_url").notNull(),
    sourceName: text("source_name").notNull(),
    externalId: text("external_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("property_listings_source_external_unique").on(
      table.sourceName,
      table.externalId,
    ),
    index("property_listings_point_gix").using("gist", table.point),
  ],
);

export type PropertyListingRow = typeof propertyListingsTable.$inferSelect;
