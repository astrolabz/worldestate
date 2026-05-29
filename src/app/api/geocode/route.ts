import { NextRequest, NextResponse } from "next/server";

import { geocodeLocation } from "@/lib/geocoding/geocode-location";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query") ?? "";
    const location = await geocodeLocation(query);

    if (!location) {
      return NextResponse.json({ message: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({
      latitude: location.latitude,
      longitude: location.longitude,
      displayName: location.displayName,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Geocoding service error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
