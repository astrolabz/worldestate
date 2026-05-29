"use client";

import dynamic from "next/dynamic";

const WorldGlobe = dynamic(
  async () => {
    const module = await import("@/components/map/world-globe");
    return module.WorldGlobe;
  },
  {
    ssr: false,
    loading: () => <div className="h-screen w-screen bg-black" />,
  },
);

export function MapView() {
  return <WorldGlobe />;
}
