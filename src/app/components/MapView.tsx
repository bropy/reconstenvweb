'use client';

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import jsPDF from "jspdf";
import L from "leaflet";
import "leaflet-draw";
import { motion } from "framer-motion";
import { ZoneData, AnalysisResponse, DamageAnalysis } from "../types/type";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function MapView() {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const [zones, setZones] = useState<ZoneData[]>([]);
  const [currentZone, setCurrentZone] = useState<{
    layer: L.Layer;
    points: { lat: number; lng: number }[];
    damage: number | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [damageAnalysis, setDamageAnalysis] = useState<DamageAnalysis | null>(null);

  const damageOptions = [25, 50, 75, 100];

  const getColorByDamage = (percent: number) => {
    if (percent >= 100) return "red";
    if (percent >= 75) return "orangered";
    if (percent >= 50) return "orange";
    if (percent >= 25) return "yellow";
    return "yellow";
  };

  const onCreated = (e: L.DrawEvents.Created) => {
    const { layerType, layer } = e;
    if (layerType === "rectangle" || layerType === "polygon") {
      const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
      const points = latlngs.map((point: L.LatLng) => ({
        lat: point.lat,
        lng: point.lng,
      }));

      setCurrentZone({ layer, points, damage: null });
    }
  };

  const handleDamageSelect = (percent: number) => {
    if (!currentZone) return;
    (currentZone.layer as L.Path).setStyle({
      color: getColorByDamage(percent),
      fillColor: getColorByDamage(percent),
      fillOpacity: 0.5,
    });

    const newZone: ZoneData = {
      id: Date.now().toString(),
      damage: percent,
      points: currentZone.points,
    };

    setZones((prevZones) => [...prevZones, newZone]);
    setCurrentZone(null);
  };

  const onDeleted = (e: L.DrawEvents.Deleted) => {
    const layers = e.layers;
    const layersArray: L.Layer[] = [];
  
    layers.eachLayer((layer: L.Layer) => {
      layersArray.push(layer);
    });
  
    setZones((prevZones) =>
      prevZones.filter((zone) => {
        return !layersArray.some((layer) => {
          const latlngs = ((layer as L.Polygon).getLatLngs()[0] as L.LatLng[]);
          const layerPoints = latlngs.map((point: L.LatLng) => ({
            lat: point.lat,
            lng: point.lng,
          }));
  
          if (zone.points.length !== layerPoints.length) return false;
          return zone.points.every((p, idx) => p.lat === layerPoints[idx].lat && p.lng === layerPoints[idx].lng);
        });
      })
    );
  };
  
  // Аналіз даних пошкоджень для відображення загальної статистики
  const calculateDamageAnalysis = (data: AnalysisResponse): DamageAnalysis => {
    let totalDamage = 0;
    let damagedFacilities = 0;
    const facilitiesByDamage: {[key: string]: number} = {
      "Критичні (100%)": 0,
      "Сильні (75%)": 0,
      "Середні (50%)": 0,
      "Легкі (25%)": 0,
      "Неушкоджені (0%)": 0
    };
    
    // Підрахунок об'єктів за рівнем пошкодження
    Object.values(data.results).forEach(category => {
      category.items.forEach(item => {
        const damage = item.damage || 0;
        
        if (damage > 0) {
          damagedFacilities++;
          totalDamage += damage;
        }
        
        if (damage === 100) facilitiesByDamage["Критичні (100%)"]++;
        else if (damage === 75) facilitiesByDamage["Сильні (75%)"]++;
        else if (damage === 50) facilitiesByDamage["Середні (50%)"]++;
        else if (damage === 25) facilitiesByDamage["Легкі (25%)"]++;
        else facilitiesByDamage["Неушкоджені (0%)"]++;
      });
    });
    
    // Розрахунок приблизної вартості відновлення (фейкові дані для прикладу)
    const baseCost = damagedFacilities * 5; // в мільйонах грн
    const damageMultiplier = totalDamage / (damagedFacilities || 1) / 100;
    const approximateReconstructionCost = baseCost * (1 + damageMultiplier);
    
    // Розрахунок приблизного часу відновлення (фейкові дані для прикладу)
    const approximateReconstructionTime = Math.round(damagedFacilities * 0.5 * damageMultiplier); // в місяцях
    
    return {
      totalDamage,
      damagedFacilities,
      approximateReconstructionCost: Math.round(approximateReconstructionCost),
      approximateReconstructionTime: Math.max(1, approximateReconstructionTime),
      facilitiesByDamage
    };
  };
  
  

// Inside your component:
const [isClient, setIsClient] = useState(false);

// Set isClient to true when component mounts (client-side only)
useEffect(() => {
  setIsClient(true);
}, []);

const handleSubmit = async () => {
  if (zones.length === 0) return;
  
  setIsLoading(true);
  
  try {
    // Приклад: місто Харків
    const dataToSend = {
      city: "Харків",
      zones: zones, 
    };

    console.log("Дані для надсилання:", JSON.stringify(dataToSend, null, 2));

    // Використовуємо fetch для відправки даних на API
    const response = await fetch("https://mltplrccnt.pythonanywhere.com/reconst/damage-zones-analysis/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setAnalysisData(data);
    
    // Розрахунок аналізу пошкоджень
    const analysis = calculateDamageAnalysis(data);
    setDamageAnalysis(analysis);
    
    // Відправка даних в локальне сховище для доступу іншими компонентами
    if (isClient) {
      localStorage.setItem('damageAnalysisData', JSON.stringify(data));
      localStorage.setItem('damageAnalysisSummary', JSON.stringify(analysis));
      window.dispatchEvent(new Event('damageAnalysisUpdated'));
    }
    
    console.log("Аналіз завершено:", data);
  } catch (error) {
    console.error("Помилка при відправці даних:", error);
    if (isClient) {
      alert("Помилка при відправці даних. Деталі в консолі.");
    }
  } finally {
    setIsLoading(false);
  }
};
  
  
  // Call this in useEffect or component initialization
  useEffect(() => {
    // Clean up event listener on component unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("requestMapScreenshot", () => {});
      }
    };
  }, []);
  
  return (
    <div className="relative min-h-screen" id="map-container">
      <MapContainer
        center={[49.99712258003538, 36.29473860661989]}
        zoom={13}
        style={{ height: "100vh", width: "100%", zIndex: 0  }}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=9aiMJwCT9cravYWI2zLA"
          attribution="&copy; OpenStreetMap contributors &copy; MapTiler"
          tileSize={512}
          zoomOffset={-1}
        />

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            onDeleted={onDeleted}
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
          disabled={isLoading}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all disabled:bg-gray-400"
        >
          {isLoading ? "Обробка..." : "Провести аналіз пошкоджень"}
        </motion.button>
      )}

      {damageAnalysis && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 right-6 bg-black/90 backdrop-blur-md p-4 rounded-xl shadow-lg z-[999] max-w-xs text-white"
          >
            <h3 className="font-bold text-lg mb-2">Результати аналізу</h3>
            <p className="text-sm mb-1">
              Пошкоджені об&apos;єкти: <span className="font-semibold">{damageAnalysis.damagedFacilities}</span>
            </p>
            <p className="text-sm mb-1">
              Приблизна вартість: <span className="font-semibold">{damageAnalysis.approximateReconstructionCost} млн грн</span>
            </p>
            <p className="text-sm">
              Час відновлення: <span className="font-semibold">~{damageAnalysis.approximateReconstructionTime} міс.</span>
            </p>
          </motion.div>

          {/* НОВА КНОПКА */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-[200px] right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg z-[999]"
          >
            Створити PDF-звіт
          </motion.button>
        </>
      )}
    </div>
  );
}