"use client";

import MapView from "../components/MapView";
import SidePanel from "../components/SidePanel";

export default function MapPage() {
  return (
    <div className="h-screen w-screen flex">
      <SidePanel />
      <div className="flex-1 h-full">
        <MapView />
      </div>
    </div>
  );
}
