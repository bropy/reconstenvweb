'use client';

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../utils/fixLeafletIcon";

export default function MapView() {
  return (
    <div className="bg-white relative min-h-screen  text-black">
      <MapContainer
        center={[50.0020, 36.3074]} 
        zoom={13}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[50.0020, 36.3074]} />
      </MapContainer>
    </div>
  );
}


