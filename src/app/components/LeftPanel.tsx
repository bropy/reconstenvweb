"use client";
import { useState, useEffect, useRef } from "react";
import { FaTable, FaListUl, FaMap, FaFilePdf, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import { AnalysisResponse, InfrastructureItem } from "../types/type";
import {
  FaBook,
  FaHospital,
  FaClinicMedical,
  FaUniversity,
  FaBan,
  FaEnvelope,
  FaShieldAlt,
  FaFireExtinguisher,
  FaTree,
  FaShoppingCart,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaPills } from "react-icons/fa6";
interface ReconstructionCosts {
  [key: string]: {
    basePrice: number;  // Price per square meter in UAH
    timePerDamagePoint: number; // Days per damage percentage point
  }
}
// Reuse the icon function from RightPanel for consistency
const getIcon = (category: string) => {
  const commonClasses = "w-5 h-5 min-w-5 min-h-5";

  switch (category) {
    case "schools":
      return <FaBook className={`${commonClasses} text-blue-500`} />;
    case "hospitals":
      return <FaHospital className={`${commonClasses} text-red-500`} />;
    case "pharmacies":
      return <FaPills className={`${commonClasses} text-green-500`} />;
    case "kindergartens":
      return <FaBook className={`${commonClasses} text-pink-400`} />;
    case "clinics":
      return <FaClinicMedical className={`${commonClasses} text-purple-400`} />;
    case "universities":
      return <FaUniversity className={`${commonClasses} text-indigo-400`} />;
    case "banks":
      return <FaBan className={`${commonClasses} text-yellow-500`} />;
    case "post_offices":
      return <FaEnvelope className={`${commonClasses} text-orange-400`} />;
    case "police_stations":
      return <FaShieldAlt className={`${commonClasses} text-blue-700`} />;
    case "fire_stations":
      return <FaFireExtinguisher className={`${commonClasses} text-red-700`} />;
    case "parks":
      return <FaTree className={`${commonClasses} text-green-700`} />;
    case "supermarkets":
      return <FaShoppingCart className={`${commonClasses} text-amber-600`} />;
    default:
      return (
        <div className="w-2 h-2 min-w-2 min-h-2 bg-amber-500 rounded-full" />
      );
  }
};

// Category name map (Ukrainian)
const categoryNameMap: Record<string, string> = {
  schools: "Школи",
  hospitals: "Лікарні",
  pharmacies: "Аптеки",
  kindergartens: "Дитячі садки",
  clinics: "Клініки",
  universities: "Університети",
  banks: "Банки",
  post_offices: "Поштові відділення",
  police_stations: "Поліцейські дільниці",
  fire_stations: "Пожежні частини",
  parks: "Парки",
  supermarkets: "Супермаркети",
};

// Priority levels and their descriptions
const priorityLevels: Record<number, { name: string, colorClass: string }> = {
  1: { name: "Критичний", colorClass: "bg-red-600" },
  2: { name: "Високий", colorClass: "bg-orange-500" },
  3: { name: "Середній", colorClass: "bg-yellow-500" },
  4: { name: "Низький", colorClass: "bg-blue-500" },
  5: { name: "Плановий", colorClass: "bg-green-500" },
};
const reconstructionCosts: ReconstructionCosts = {
  hospitals: { basePrice: 25000, timePerDamagePoint: 0.5 },
  schools: { basePrice: 18000, timePerDamagePoint: 0.4 },
  pharmacies: { basePrice: 15000, timePerDamagePoint: 0.3 },
  kindergartens: { basePrice: 16500, timePerDamagePoint: 0.35 },
  clinics: { basePrice: 22000, timePerDamagePoint: 0.45 },
  universities: { basePrice: 20000, timePerDamagePoint: 0.4 },
  banks: { basePrice: 17000, timePerDamagePoint: 0.3 },
  post_offices: { basePrice: 14000, timePerDamagePoint: 0.25 },
  police_stations: { basePrice: 18000, timePerDamagePoint: 0.35 },
  fire_stations: { basePrice: 19000, timePerDamagePoint: 0.4 },
  parks: { basePrice: 8000, timePerDamagePoint: 0.2 },
  supermarkets: { basePrice: 12000, timePerDamagePoint: 0.3 },
};
// Interface for reconstruction item with timeline
interface ReconstructionItem extends InfrastructureItem {
  priority: number;
  startDate: string;
  endDate: string;
  progress: number;
  category: string;
}

function LeftPanel() {
  const [sortField, setSortField] = useState<string>("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [reconstructionPlan, setReconstructionPlan] = useState<ReconstructionItem[]>([]);
  const [filterPriority, setFilterPriority] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "table" | "map">("list");
  const [selectedMapImageUrl, setSelectedMapImageUrl] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Add this to your useEffect to handle map image capture
  useEffect(() => {
    // Function to handle map screenshot events
    const handleMapScreenshot = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.imageUrl) {
        setSelectedMapImageUrl(customEvent.detail.imageUrl);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener("mapScreenshotCaptured", handleMapScreenshot);
    }
    // Listen for map screenshot events
  
    return () => {
      if (typeof window !== 'undefined') {

      window.removeEventListener("mapScreenshotCaptured", handleMapScreenshot);}
    };
  }, []);
  
  // Add this function to your LeftPanel component for exporting as PDF

  useEffect(() => {
    // Function to generate a reconstruction plan based on analysis data
    const generateReconstructionPlan = () => {
      const storedData = localStorage.getItem("damageAnalysisData");
      if (!storedData) return;

      const analysisData: AnalysisResponse = JSON.parse(storedData);
      const allDamagedItems: ReconstructionItem[] = [];

      // Get current date for timeline calculation
      const currentDate = new Date();
      
      // Process all infrastructure categories
      Object.entries(analysisData.results).forEach(([category, data]) => {
        // Filter only damaged items
        const damagedItems = data.items.filter(item => (item.damage || 0) > 0 && item.name !== "Unnamed");
        
        damagedItems.forEach(item => {
          // Assign priority based on damage level and infrastructure type
          let priority = 5; // Default priority
          
          // Critical infrastructure gets higher priority
          if (["hospitals", "fire_stations", "police_stations"].includes(category)) {
            if ((item.damage || 0) >= 70) priority = 1;
            else if ((item.damage || 0) >= 40) priority = 2;
            else priority = 3;
          } else if (["schools", "kindergartens", "clinics", "pharmacies"].includes(category)) {
            if ((item.damage || 0) >= 80) priority = 2;
            else if ((item.damage || 0) >= 50) priority = 3;
            else priority = 4;
          } else {
            if ((item.damage || 0) >= 90) priority = 3;
            else if ((item.damage || 0) >= 60) priority = 4;
            else priority = 5;
          }
          
          // Calculate start and end dates based on priority and damage
          const startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() + (priority * 5)); // Higher priority starts sooner
          
          const endDate = new Date(startDate);
          // More damaged buildings take longer to reconstruct
          const reconstructionDays = Math.ceil((item.damage || 0) / 10) * 15;
          endDate.setDate(endDate.getDate() + reconstructionDays);
          
          // Add to reconstruction plan with random progress
          allDamagedItems.push({
            ...item,
            priority,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            progress: Math.floor(Math.random() * 30), // Random initial progress 0-30%
            category
          });
        });
      });

      setReconstructionPlan(allDamagedItems);
    };

    generateReconstructionPlan();
    
    // Listen for updates to damage analysis data
    if (typeof window !== 'undefined') {

    window.addEventListener("damageAnalysisUpdated", generateReconstructionPlan);
    }
    return () => {
      if (typeof window !== 'undefined') {

      window.removeEventListener("damageAnalysisUpdated", generateReconstructionPlan);}
    };
  }, []);

  // Sort function for reconstruction items
  const sortReconstructionItems = (items: ReconstructionItem[]) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "priority":
          comparison = a.priority - b.priority;
          break;
        case "damage":
          comparison = (b.damage || 0) - (a.damage || 0);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "startDate":
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case "endDate":
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        case "progress":
          comparison = a.progress - b.progress;
          break;
        default:
          comparison = a.priority - b.priority;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Filter by priority level
  const handleFilterByPriority = (priority: number | null) => {
    setFilterPriority(priority === filterPriority ? null : priority);
  };

  // Calculate days remaining for reconstruction
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter and sort the reconstruction plan
  const filteredAndSortedPlan = sortReconstructionItems(
    filterPriority !== null 
      ? reconstructionPlan.filter(item => item.priority === filterPriority)
      : reconstructionPlan
  );
  const calculateRebuildPrice = (item: ReconstructionItem): number => {
    const costs = reconstructionCosts[item.category] || { basePrice: 15000, timePerDamagePoint: 0.3 };
    // Assuming average building size is 500 sq meters, scaled by damage percentage
    const size = 500;
    const damageRatio = (item.damage || 0) / 100;
    return Math.round(size * costs.basePrice * damageRatio);
  };
  
  const calculateRebuildTime = (item: ReconstructionItem): number => {
    const costs = reconstructionCosts[item.category] || { basePrice: 15000, timePerDamagePoint: 0.3 };
    return Math.round((item.damage || 0) * costs.timePerDamagePoint);
  };
  
  // Function to format price in Ukrainian hryvnia
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(price);
  };
  // If no data, show a message
  if (reconstructionPlan.length === 0) {
    return (
      <div className="w-64 flex flex-col p-4 overflow-auto max-h-screen bg-black text-white shadow-2xl rounded-r-2xl">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">
          План реконструкції
        </h1>
        <p className="text-gray-400 text-sm">
          Виділіть на карті зони пошкодження та проведіть аналіз для створення плану реконструкції.
        </p>
      </div>
    );
  }

  return (
    <div className="w-72 flex flex-col p-4 overflow-auto max-h-screen bg-black text-white shadow-2xl rounded-r-2xl">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        План реконструкції
      </h1>
      
      {/* Priority filter buttons */}
      <div className="mb-4">
        <h2 className="text-sm text-gray-300 mb-2">Фільтр за пріоритетом:</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(priorityLevels).map(([level, { name, colorClass }]) => (
            <button
              key={level}
              onClick={() => handleFilterByPriority(parseInt(level))}
              className={`text-xs px-2 py-1 rounded-full ${
                filterPriority === parseInt(level) 
                  ? `${colorClass} text-white` 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {name}
            </button>
          ))}
          {filterPriority !== null && (
            <button
              onClick={() => setFilterPriority(null)}
              className="text-xs px-2 py-1 rounded-full bg-gray-600 text-white"
            >
              Скинути
            </button>
          )}
        </div>
      </div>
      
      {/* Sort controls */}
      <div className="mb-4 bg-gray-800 rounded-lg p-3">
        <h2 className="text-sm text-gray-300 mb-2">Сортування:</h2>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleSort("priority")}
            className={`text-xs p-1 rounded ${sortField === "priority" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Пріоритет {sortField === "priority" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
          <button 
            onClick={() => handleSort("damage")}
            className={`text-xs p-1 rounded ${sortField === "damage" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Пошкодження {sortField === "damage" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
          <button 
            onClick={() => handleSort("startDate")}
            className={`text-xs p-1 rounded ${sortField === "startDate" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Початок {sortField === "startDate" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
          <button 
            onClick={() => handleSort("endDate")}
            className={`text-xs p-1 rounded ${sortField === "endDate" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Завершення {sortField === "endDate" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-sm text-gray-300">Вигляд:</h2>
  <div className="flex space-x-2">
    <button 
      onClick={() => setViewMode("list")}
      className={`p-2 rounded ${viewMode === "list" ? "bg-blue-600" : "bg-gray-700"}`}
      title="Список"
    >
      <FaListUl />
    </button>
    <button 
      onClick={() => setViewMode("table")}
      className={`p-2 rounded ${viewMode === "table" ? "bg-blue-600" : "bg-gray-700"}`}
      title="Таблиця"
    >
      <FaTable />
    </button>
    <button 
      onClick={() => setViewMode("map")}
      className={`p-2 rounded ${viewMode === "map" ? "bg-blue-600" : "bg-gray-700"}`}
      title="Карта зон"
    >
      <FaMap />
    </button>
  </div>
</div>

{/* Table view */}
{viewMode === "table" && (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-md font-semibold text-gray-200">Таблиця реконструкції</h2>
      <button 
        onClick={() => {
          alert("Цікаво? Тоді додамо цю функцію в майбутньому.");
        }}
        className="flex items-center gap-1 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
        title="Експорт у PDF"
      >
        <FaFilePdf /> PDF
      </button>
    </div>
    
    <div 
      ref={tableRef}
      className="bg-gray-800 p-3 rounded-lg overflow-x-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-600"
    >
      <table className="min-w-full text-xs text-gray-300">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="p-2 rounded-tl-lg">#</th>
            <th className="p-2">Назва</th>
            <th className="p-2">Тип</th>
            <th className="p-2">Вартість</th>
            <th className="p-2 rounded-tr-lg">Час (днів)</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedPlan.map((item, index) => (
            <tr 
              key={index} 
              className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700`}
            >
              <td className="p-2 border-t border-gray-700">{index + 1}</td>
              <td className="p-2 border-t border-gray-700 font-semibold">
                <div className="flex items-center gap-2">
                  {getIcon(item.category)}
                  <span>{item.name}</span>
                </div>
              </td>
              <td className="p-2 border-t border-gray-700">{categoryNameMap[item.category]}</td>
              <td className="p-2 border-t border-gray-700">{formatPrice(calculateRebuildPrice(item))}</td>
              <td className="p-2 border-t border-gray-700">{calculateRebuildTime(item)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-700 font-semibold">
            <td className="p-2 rounded-bl-lg" colSpan={3}>Всього:</td>
            <td className="p-2">{formatPrice(
              filteredAndSortedPlan.reduce((sum, item) => sum + calculateRebuildPrice(item), 0)
            )}</td>
            <td className="p-2 rounded-br-lg">{
              Math.round(filteredAndSortedPlan.reduce(
                (sum, item) => sum + calculateRebuildTime(item), 0
              ) / filteredAndSortedPlan.length * filteredAndSortedPlan.length)
            } днів</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
)}

{/* Map view */}
{viewMode === "map" && (
  <div className="mb-4">
    <h2 className="text-md font-semibold text-gray-200 mb-2">Карта пошкоджених зон</h2>
    
    {selectedMapImageUrl ? (
      <div className="bg-gray-800 p-3 rounded-lg">
        <img 
          src={selectedMapImageUrl} 
          alt="Карта пошкоджених зон" 
          className="w-full rounded border border-gray-700" 
        />
        <div className="text-xs text-gray-400 mt-2">
          <p>Червоним кольором позначені зони з критичними пошкодженнями інфраструктури.</p>
          <div className="flex justify-between mt-2">
            <button 
              className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedMapImageUrl;
                link.download = 'damage-map.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <FaDownload size={12} /> Зберегти
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
        <p>Для перегляду карти виділіть зони пошкодження та зробіть скріншот.</p>
        <button 
          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => {
            alert("Ця функція ще не реалізована. Слідкуйте за оновленнями!");
          }}
        >
          Створити знімок карти
        </button>
      </div>
    )}
  </div>
)}

{viewMode === "list" && (
  <div className="flex flex-col space-y-4">
    {/* Your existing list view code here */}
  </div>
)}
      {/* Reconstruction timeline */}
      <div className="flex flex-col space-y-4">
        {filteredAndSortedPlan.map((item, index) => {
          const daysRemaining = getDaysRemaining(item.endDate);
          const priorityInfo = priorityLevels[item.priority];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gray-800 rounded-lg p-3 shadow-md"
            >
              <div className="flex items-start gap-2 mb-2">
                {getIcon(item.category)}
                <div className="flex-1">
                  <h3 className="text-md font-semibold text-white">{item.name}</h3>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityInfo.colorClass} text-white`}>
                      {priorityInfo.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {categoryNameMap[item.category]}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Пошкодження: {item.damage}%</span>
                  <span>Прогрес: {item.progress}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-gray-400">Початок:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <FaCalendarAlt className="text-blue-400" /> {item.startDate}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-400">Завершення:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <FaCalendarAlt className="text-green-400" /> {item.endDate}
                  </span>
                </div>
                
                <div className="flex flex-col col-span-2 mt-1 bg-gray-700 p-1 rounded">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Залишилось:</span>
                    <span className="font-semibold text-white">{daysRemaining} днів</span>
                  </div>
                  
                  {/* Remaining days indicator */}
                  <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                    <div 
                      className={`rounded-full h-1 ${
                        daysRemaining > 30 ? "bg-green-500" : 
                        daysRemaining > 15 ? "bg-yellow-500" : 
                        "bg-red-500"
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.max(5, 100 - (daysRemaining / 60 * 100)))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Summary information */}
      <div className="mt-6 bg-gray-800 rounded-lg p-3">
        <h2 className="text-sm font-semibold text-gray-200 mb-2">Загальна статистика:</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-700 p-2 rounded">
            <span className="text-gray-400">Загальна кількість:</span>
            <div className="text-xl font-bold text-white">{reconstructionPlan.length}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <span className="text-gray-400">Критичний пріоритет:</span>
            <div className="text-xl font-bold text-red-500">
              {reconstructionPlan.filter(item => item.priority === 1).length}
            </div>
          </div>
          <div className="bg-gray-700 p-2 rounded col-span-2">
            <div className="flex justify-between text-gray-400">
              <span>Середній час реконструкції:</span>
              <span className="font-semibold text-white">
                {Math.round(
                  reconstructionPlan.reduce((sum, item) => {
                    const start = new Date(item.startDate);
                    const end = new Date(item.endDate);
                    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                  }, 0) / reconstructionPlan.length
                )} днів
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftPanel;