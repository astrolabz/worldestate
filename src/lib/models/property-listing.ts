export interface PropertyListing {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}
