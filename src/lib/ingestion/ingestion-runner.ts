import { upsertPropertyListing } from "@/lib/db/listings-repository";
import type { ListingConnector } from "@/lib/ingestion/listing-connector";

export interface IngestionResult {
  sourceName: string;
  totalProcessed: number;
}

export class IngestionRunner {
  public constructor(private readonly connectors: ListingConnector[]) {}

  public async run(): Promise<IngestionResult[]> {
    const results: IngestionResult[] = [];

    for (const connector of this.connectors) {
      const listings = await connector.fetchListings();

      for (const listing of listings) {
        await upsertPropertyListing({
          ...listing,
          sourceName: connector.sourceName,
        });
      }

      results.push({
        sourceName: connector.sourceName,
        totalProcessed: listings.length,
      });
    }

    return results;
  }
}
