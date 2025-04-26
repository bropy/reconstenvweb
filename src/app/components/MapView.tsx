'use client';

import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { useRef, useState } from "react";
import L, { LeafletEvent, Polygon, Rectangle } from "leaflet";

export default function MapView() {
  const featureGroupRef = useRef<L.FeatureGroup<any>>(null);

  const [selectedLayer, setSelectedLayer] = useState<L.Layer | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [damagePercent, setDamagePercent] = useState<number | null>(null);

  const colorsByDamage: Record<number, string> = {
    25: "yellow",
    50: "orange",
    75: "orangered",
    100: "red",
  };

  const onCreated = (e: any) => {
    const { layerType, layer } = e;
    
    if (layerType === 'rectangle' || layerType === 'polygon') {
      let latlngs: any[] = [];

      latlngs = layer.getLatLngs()[0];

      const points = latlngs.map((point: { lat: number; lng: number }) => ({
        lat: point.lat,
        lng: point.lng,
      }));

      setSelectedLayer(layer);
      setPolygonPoints(points);
      setDamagePercent(null); 
    }
  };

  const handleDamageSelect = (percent: number) => {
    setDamagePercent(percent);

    if (selectedLayer) {
      (selectedLayer as any).setStyle({
        color: colorsByDamage[percent],
        fillColor: colorsByDamage[percent],
        fillOpacity: 0.5,
      });
    }

    const dataToSend = {
      damage: percent,
      points: polygonPoints,
    };

    console.log('Дані для надсилання:', JSON.stringify(dataToSend, null, 2));
    
    // TODO: Тут можна відправити запит fetch або Axios
    // fetch("/your-endpoint", { method: "POST", body: JSON.stringify(dataToSend) })
  };

  return (
    <div className="relative min-h-screen">
      <MapContainer
        center={[49.99712258003538, 36.29473860661989]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{
              rectangle: true,
              polygon: true,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
      {selectedLayer && damagePercent === null && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-4 flex gap-4 z-[999]">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => handleDamageSelect(percent)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              {percent}%
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
