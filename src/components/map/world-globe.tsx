"use client";

import "cesium/Build/Cesium/Widgets/widgets.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CesiumComponentRef, Entity, Viewer } from "resium";
import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  Viewer as CesiumViewer,
  Color,
} from "cesium";

import { ListingSidebar } from "@/components/layout/listing-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import type { BoundingBox, PropertyListing } from "@/lib/models/property-listing";

interface ActiveFilters {
  minPrice?: number;
  maxPrice?: number;
}

interface SearchPayload {
  searchText: string;
  minPrice?: number;
  maxPrice?: number;
}

interface GeocodePayload {
  latitude: number;
  longitude: number;
}

const INITIAL_BBOX: BoundingBox = {
  west: -180,
  south: -85,
  east: 180,
  north: 85,
};

export function WorldGlobe() {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const fetchTimerRef = useRef<number | null>(null);

  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  useEffect(() => {
    (window as typeof window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = "/cesium";

    const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
    Ion.defaultAccessToken = token ?? "";
    // TODO: Inserire il token Cesium Ion reale in NEXT_PUBLIC_CESIUM_ION_TOKEN.
  }, []);

  const listingsById = useMemo(() => {
    return new Map(listings.map((listing) => [listing.id, listing]));
  }, [listings]);

  const fetchListings = useCallback(
    async (bbox: BoundingBox, filters: ActiveFilters): Promise<void> => {
      const query = new URLSearchParams({
        bbox: `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
      });

      if (typeof filters.minPrice === "number") {
        query.set("minPrice", String(filters.minPrice));
      }

      if (typeof filters.maxPrice === "number") {
        query.set("maxPrice", String(filters.maxPrice));
      }

      const response = await fetch(`/api/listings?${query.toString()}`);

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { listings: PropertyListing[] };
      setListings(payload.listings);
    },
    [],
  );

  const computeBoundingBox = useCallback((): BoundingBox => {
    const viewer = viewerRef.current?.cesiumElement;

    if (!viewer) {
      return INITIAL_BBOX;
    }

    const rectangle = viewer.camera.computeViewRectangle(viewer.scene.globe.ellipsoid);

    if (!rectangle) {
      return INITIAL_BBOX;
    }

    return {
      west: CesiumMath.toDegrees(rectangle.west),
      south: CesiumMath.toDegrees(rectangle.south),
      east: CesiumMath.toDegrees(rectangle.east),
      north: CesiumMath.toDegrees(rectangle.north),
    };
  }, []);

  const scheduleFetch = useCallback((): void => {
    if (fetchTimerRef.current) {
      window.clearTimeout(fetchTimerRef.current);
    }

    fetchTimerRef.current = window.setTimeout(() => {
      const bbox = computeBoundingBox();
      void fetchListings(bbox, activeFilters);
    }, 250);
  }, [activeFilters, computeBoundingBox, fetchListings]);

  useEffect(() => {
    scheduleFetch();
  }, [scheduleFetch]);

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;

    if (!viewer) {
      return;
    }

    const removeCameraMoveEnd = viewer.camera.moveEnd.addEventListener(() => {
      scheduleFetch();
    });

    const removeSelectionChanged = viewer.selectedEntityChanged.addEventListener((entity) => {
      const listing = entity?.id ? listingsById.get(String(entity.id)) ?? null : null;
      setSelectedListing(listing);
      setIsSidebarOpen(Boolean(listing));
    });

    return () => {
      removeCameraMoveEnd();
      removeSelectionChanged();
    };
  }, [listingsById, scheduleFetch]);

  async function handleApplyFilters(payload: SearchPayload): Promise<void> {
    const nextFilters = {
      minPrice: payload.minPrice,
      maxPrice: payload.maxPrice,
    };

    setActiveFilters(nextFilters);
    await fetchListings(computeBoundingBox(), nextFilters);

    if (!payload.searchText.trim()) {
      return;
    }

    const geocodeResponse = await fetch(`/api/geocode?query=${encodeURIComponent(payload.searchText)}`);

    if (!geocodeResponse.ok) {
      return;
    }

    const geocodePayload = (await geocodeResponse.json()) as GeocodePayload;
    const viewer = viewerRef.current?.cesiumElement;

    if (!viewer) {
      return;
    }

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(geocodePayload.longitude, geocodePayload.latitude, 2_500_000),
      duration: 1.5,
    });
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <TopNavbar onApplyFilters={handleApplyFilters} />
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        geocoder={false}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        baseLayerPicker
        infoBox={false}
        selectionIndicator={false}
        shouldAnimate
      >
        {listings.map((listing) => (
          <Entity
            key={listing.id}
            id={listing.id}
            position={Cartesian3.fromDegrees(listing.longitude, listing.latitude)}
            point={{
              pixelSize: 10,
              color: Color.fromCssColorString("#3b82f6"),
              outlineWidth: 2,
              outlineColor: Color.WHITE,
            }}
            description={listing.title}
          />
        ))}
      </Viewer>
      <ListingSidebar listing={selectedListing} open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
    </div>
  );
}
