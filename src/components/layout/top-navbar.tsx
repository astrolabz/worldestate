"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterValues {
  searchText: string;
  minPrice?: number;
  maxPrice?: number;
}

interface TopNavbarProps {
  onApplyFilters: (filters: FilterValues) => void;
}

export function TopNavbar({ onApplyFilters }: TopNavbarProps) {
  const [searchText, setSearchText] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onApplyFilters({
      searchText,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  return (
    <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex justify-center p-4">
      <form
        className="pointer-events-auto flex w-full max-w-6xl flex-wrap items-center gap-2 rounded-xl border border-white/20 bg-black/35 p-3 shadow-lg backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <Input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Cerca città o indirizzo"
          className="min-w-48 flex-1"
        />
        <Input
          type="number"
          min="0"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="Prezzo min"
          className="w-32"
        />
        <Input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="Prezzo max"
          className="w-32"
        />
        <Button type="submit">Applica filtri</Button>
      </form>
    </header>
  );
}
