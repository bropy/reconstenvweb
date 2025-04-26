"use client";

import MapView from "../components/MapView";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";

export default function MapPage() {
  return (
    <div className="h-screen w-screen flex">
      <LeftPanel />
      <div className="flex-1 h-full">
        <MapView />
      </div>
      <RightPanel />
    </div>
  );
}
