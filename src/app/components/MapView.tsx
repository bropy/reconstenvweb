'use client';

import { useRef, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import { motion } from "framer-motion";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface ZoneData {
  points: { lat: number; lng: number }[];
  damage: number;
}

export default function MapView() {
  const featureGroupRef = useRef<L.FeatureGroup<any>>(null);

  const [zones, setZones] = useState<ZoneData[]>([]);
  const [currentZone, setCurrentZone] = useState<{
    layer: L.Layer;
    points: { lat: number; lng: number }[];
    damage: number | null;
  } | null>(null);

  const damageOptions = [25, 50, 75, 100];

  const getColorByDamage = (percent: number) => {
    if (percent >= 100) return "red";
    if (percent >= 75) return "orangered";
    if (percent >= 50) return "orange";
    if (percent >= 25) return "yellow";
    return "yellow";
  };

  const onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "rectangle" || layerType === "polygon") {
      const latlngs = layer.getLatLngs()[0];
      const points = latlngs.map((point: { lat: number; lng: number }) => ({
        lat: point.lat,
        lng: point.lng,
      }));

      setCurrentZone({ layer, points, damage: null });
    }
  };

  const handleDamageSelect = (percent: number) => {
    if (!currentZone) return;
    (currentZone.layer as any).setStyle({
      color: getColorByDamage(percent),
      fillColor: getColorByDamage(percent),
      fillOpacity: 0.5,
    });

    const newZone: ZoneData = {
      damage: percent,
      points: currentZone.points,
    };

    setZones((prevZones) => [...prevZones, newZone]);
    setCurrentZone(null);
  };

  
  const handleSubmit = () => {
    const dataToSend = {
      zones, 
    };

    console.log("Дані для надсилання:", JSON.stringify(dataToSend, null, 2));

    // Тут можна виконати запит на сервер
    // fetch("/your-endpoint", { method: "POST", body: JSON.stringify(dataToSend) })

  };

  return (
    <div className="relative min-h-screen">
      <MapContainer
        center={[49.99712258003538, 36.29473860661989]}
        zoom={13}
        style={{ height: "100vh", width: "100%", zIndex: 0  }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
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

      {currentZone && currentZone.damage === null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 z-[999]"
        >
          <div className="text-gray-700 text-lg font-semibold">
            Ступінь пошкодженості
          </div>
          <div className="flex gap-4">
            {damageOptions.map((percent) => (
              <motion.button
                key={percent}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDamageSelect(percent)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md border-2 transition-all`}
                style={{
                  backgroundColor: getColorByDamage(percent),
                  borderColor: getColorByDamage(percent),
                }}
              >
                {percent}%
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {zones.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all"
        >
          Надіслати дані
        </motion.button>
      )}
    </div>
  );
}
