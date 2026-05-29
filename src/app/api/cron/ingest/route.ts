import { NextRequest, NextResponse } from "next/server";

import { GenericPortalConnector } from "@/lib/ingestion/connectors/generic-portal-connector";
import { IngestionRunner } from "@/lib/ingestion/ingestion-runner";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  const bearerToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const headerToken = request.headers.get("x-cron-secret");

  return bearerToken === secret || headerToken === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sourceUrl = process.env.INGESTION_SOURCE_URL;

  if (!sourceUrl) {
    return NextResponse.json(
      { message: "INGESTION_SOURCE_URL is not configured" },
      { status: 500 },
    );
  }

  const runner = new IngestionRunner([new GenericPortalConnector(sourceUrl)]);
  const results = await runner.run();

  return NextResponse.json({
    message: "Ingestion completed",
    results,
  });
}
