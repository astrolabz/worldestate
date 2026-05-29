import * as cheerio from "cheerio";

import type { ConnectorListing, ListingConnector } from "@/lib/ingestion/listing-connector";

export class GenericPortalConnector implements ListingConnector {
  public readonly sourceName = "generic-portal";

  public constructor(private readonly sourceUrl: string) {}

  public async fetchListings(): Promise<ConnectorListing[]> {
    const response = await fetch(this.sourceUrl, {
      headers: {
        "User-Agent": "WorldEstateBot/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to download listings from ${this.sourceUrl}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const listings: ConnectorListing[] = [];

    $(".listing-card").each((_, element) => {
      const title = $(element).find(".listing-title").text().trim();
      const description = $(element).find(".listing-description").text().trim();
      const priceRaw = $(element).find(".listing-price").text().trim();
      const imageUrl = $(element).find("img").attr("src")?.trim();
      const originalUrl = $(element).find("a.listing-link").attr("href")?.trim();
      const latitude = Number($(element).attr("data-lat"));
      const longitude = Number($(element).attr("data-lng"));
      const externalId = $(element).attr("data-id")?.trim();
      const currency = $(element).attr("data-currency")?.trim() || "EUR";

      const normalizedPrice = Number(
        priceRaw.replace(currency, "").replace(/[^\d.,-]/g, "").replace(",", "."),
      );

      if (
        !title ||
        !description ||
        Number.isNaN(normalizedPrice) ||
        !imageUrl ||
        !originalUrl ||
        Number.isNaN(latitude) ||
        Number.isNaN(longitude) ||
        !externalId
      ) {
        return;
      }

      const sourceLink = new URL(originalUrl, this.sourceUrl).toString();
      const imageLink = new URL(imageUrl, this.sourceUrl).toString();

      listings.push({
        title,
        description,
        price: normalizedPrice,
        currency,
        latitude,
        longitude,
        imageUrl: imageLink,
        originalUrl: sourceLink,
        externalId,
      });
    });

    return listings;
  }
}
