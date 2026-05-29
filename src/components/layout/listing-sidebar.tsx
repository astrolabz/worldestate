"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { PropertyListing } from "@/lib/models/property-listing";

interface ListingSidebarProps {
  listing: PropertyListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ListingSidebar({ listing, open, onOpenChange }: ListingSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {listing ? (
          <>
            <SheetHeader>
              <SheetTitle>{listing.title}</SheetTitle>
              <p className="text-sm text-zinc-500">{listing.sourceName}</p>
            </SheetHeader>
            <Card className="mt-6 overflow-hidden">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                width={640}
                height={360}
                className="h-52 w-full object-cover"
              />
              <CardHeader>
                <CardTitle>
                  {new Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency: listing.currency,
                    maximumFractionDigits: 0,
                  }).format(listing.price)}
                </CardTitle>
                <CardDescription>
                  {listing.latitude.toFixed(6)}, {listing.longitude.toFixed(6)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-700">{listing.description}</p>
                <Button asChild className="w-full">
                  <a href={listing.originalUrl} target="_blank" rel="noopener noreferrer">
                    Vedi annuncio originale
                  </a>
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="mt-10 text-sm text-zinc-500">Seleziona un marker sulla mappa per vedere i dettagli.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
