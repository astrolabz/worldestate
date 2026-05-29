"use client";

import dynamic from "next/dynamic";

const WorldGlobe = dynamic(
  async () => {
    const worldGlobeModule = await import("@/components/map/world-globe");
    return worldGlobeModule.WorldGlobe;
  },
  {
    ssr: false,
    loading: () => <div className="h-screen w-screen bg-black" />,
  },
);

export function MapView() {
  return <WorldGlobe />;
}
