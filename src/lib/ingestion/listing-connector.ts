export interface ConnectorListing {
  title: string;
  description: string;
  price: number;
  currency: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  originalUrl: string;
  externalId: string;
}

export interface ListingConnector {
  sourceName: string;
  fetchListings(): Promise<ConnectorListing[]>;
}
