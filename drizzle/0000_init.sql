CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS property_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  point geometry(Point, 4326) NOT NULL,
  image_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  external_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS property_listings_source_external_unique
  ON property_listings (source_name, external_id);

CREATE INDEX IF NOT EXISTS property_listings_point_gix
  ON property_listings USING GIST (point);
