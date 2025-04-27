"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fa";
import { FaPills } from "react-icons/fa6"; // Фарм іконка (аптека)

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

// Перетворення назв категорій на українську
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

// Функція для отримання класу за рівнем пошкодження
const getDamageColorClass = (damage: number = 0) => {
  if (damage >= 100) return "bg-red-500 border-red-700";
  if (damage >= 75) return "bg-orange-500 border-orange-700";
  if (damage >= 50) return "bg-amber-500 border-amber-700";
  if (damage >= 25) return "bg-yellow-500 border-yellow-700";
  return "bg-green-500 border-green-700";
};

function RightPanel() {
  const [visibleCounts, setVisibleCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(
    null
  );
  const initialVisible = 3; // Скільки елементів видно спочатку

  useEffect(() => {
    // Функція для оновлення даних з локального сховища
    const updateData = () => {
      const storedData = localStorage.getItem("damageAnalysisData");
      if (storedData) {
        setAnalysisData(JSON.parse(storedData));
      }
    };

    // Виклик при першому завантаженні
    updateData();

    // Підписка на подію оновлення даних
    if (typeof window !== 'undefined') {

    window.addEventListener("damageAnalysisUpdated", updateData);}

    // Відписка при розмонтуванні
    return () => {
      if (typeof window !== 'undefined') {

      window.removeEventListener("damageAnalysisUpdated", updateData);}
    };
  }, []);

  const handleShowMore = (key: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || initialVisible) + 10,
    }));
  };

  const handleShowLess = (key: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [key]: initialVisible,
    }));
  };

  // Функція для групування об'єктів за рівнем пошкодження
  const getDamagedCount = (
    items: InfrastructureItem[],
    damageLevel?: number
  ) => {
    if (damageLevel === undefined) {
      return items.filter((item) => (item.damage || 0) > 0).length;
    }
    return items.filter((item) => item.damage === damageLevel).length;
  };

  // Якщо даних немає - показуємо повідомлення
  if (!analysisData) {
    return (
      <div className="w-64 flex flex-col p-4 overflow-auto max-h-screen bg-black text-white shadow-2xl rounded-l-2xl">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">
          Оцінка пошкоджень
        </h1>
        <p className="text-gray-400 text-sm">
          Виділіть на карті зони пошкодження та проведіть аналіз для перегляду
          результатів.
        </p>
      </div>
    );
  }

  return (
    <div className="w-64 flex flex-col p-4 overflow-auto max-h-screen bg-black text-white shadow-2xl rounded-l-2xl">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        Оцінка пошкоджень
      </h1>

      {Object.entries(analysisData.results).map(([key, value]) => {
        const damagedCount = getDamagedCount(value.items);
        const filteredItems = value.items.filter(
          (place: InfrastructureItem) => place.name !== "Unnamed"
        );
        const visibleCount = visibleCounts[key] || initialVisible;


        return (
          <div key={key} className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-800 p-3 rounded-xl shadow-md flex flex-col mb-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-md font-semibold text-blue-500">
                  {categoryNameMap[key] || key}
                </h2>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-300">
                    Кількість: {value.count}
                  </div>
                  {damagedCount > 0 && (
                    <div className="text-sm text-red-400">
                      Пошкоджено: {damagedCount}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col pl-2">
              <AnimatePresence>
                {filteredItems
                  .slice(0, visibleCount)
                  .map((place: InfrastructureItem, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center gap-2 ${getDamageColorClass(
                        place.damage
                      )} hover:bg-opacity-80 transition-all mb-2 rounded-lg p-2 shadow-sm cursor-pointer border-l-4`}
                    >
                      {getIcon(key)}

                      <div className="flex flex-col">
                        <span className="text-gray-100 text-sm">
                          {place.name}
                        </span>
                        {(place.damage || 0) > 0 && (
                          <span className="text-xs font-semibold text-red-400">
                            Пошкодження: {place.damage}%
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>

              <div className="flex flex-col items-center gap-1 mt-2">
                {visibleCount < filteredItems.length && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center text-blue-400 hover:text-blue-600 font-semibold cursor-pointer"
                    onClick={() => handleShowMore(key)}
                  >
                    ➕ Показати більше
                  </motion.div>
                )}

                {visibleCount > initialVisible && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center text-red-400 hover:text-red-600 font-semibold cursor-pointer"
                    onClick={() => handleShowLess(key)}
                  >
                    ➖ Показати менше
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RightPanel;
