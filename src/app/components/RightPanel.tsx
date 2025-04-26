'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import places from "../data/Places_response.json";
import {
  FaSchool,
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
import { FaPills } from "react-icons/fa6"; 

const getIcon = (category: string) => {
  switch (category) {
    case "schools":
      return <FaSchool className="text-blue-500" />;
    case "hospitals":
      return <FaHospital className="text-red-500" />;
    case "pharmacies":
      return <FaPills className="text-green-500" />;
    case "kindergartens":
      return <FaSchool className="text-pink-400" />;
    case "clinics":
      return <FaClinicMedical className="text-purple-400" />;
    case "universities":
      return <FaUniversity className="text-indigo-400" />;
    case "banks":
      return <FaBan className="text-yellow-500" />;
    case "post_offices":
      return <FaEnvelope className="text-orange-400" />;
    case "police_stations":
      return <FaShieldAlt className="text-blue-700" />;
    case "fire_stations":
      return <FaFireExtinguisher className="text-red-700" />;
    case "parks":
      return <FaTree className="text-green-700" />;
    case "supermarkets":
      return <FaShoppingCart className="text-amber-600" />;
    default:
      return (
        <div className="w-2 h-2 min-w-2 min-h-2 bg-amber-500 rounded-full" />
      ); // маленьке коло, якщо іконки нема
  }
};


type Props = {};

function RightPanel({}: Props) {
  const [visibleCounts, setVisibleCounts] = useState<{ [key: string]: number }>({});

  const initialVisible = 3; // Скільки елементів видно спочатку

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

  const getIcon = (category: string) => {
  const commonClasses = "w-5 h-5 min-w-5 min-h-5 text-blue-500"; // Ось тут ставимо фіксований розмір

  switch (category) {
    case "schools":
      return <FaSchool className={`${commonClasses} text-blue-500`} />;
    case "hospitals":
      return <FaHospital className={`${commonClasses} text-red-500`} />;
    case "pharmacies":
      return <FaPills className={`${commonClasses} text-green-500`} />;
    case "kindergartens":
      return <FaSchool className={`${commonClasses} text-pink-400`} />;
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

  return (
    <div className="w-64 flex flex-col p-4 overflow-auto max-h-screen bg-white shadow-2xl rounded-l-2xl">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Кількість будівель</h1>

      {Object.entries(places.results).map(([key, value]) => {
        const filteredItems = value.items.filter(
          (place: any) => place.name !== "Unnamed"
        );
        const visibleCount = visibleCounts[key] || initialVisible;

        return (
          <div key={key} className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-blue-100 p-3 rounded-xl shadow-md flex flex-col mb-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-md font-semibold text-blue-700">{key}</h2>
                <div className="text-sm text-blue-500">
                  Count: {value.count}
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col pl-2">
              <AnimatePresence>
                {filteredItems
                  .slice(0, visibleCount)
                  .map((place: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 transition-all mb-2 rounded-lg p-2 shadow-sm cursor-pointer"
                    >
                      {getIcon(key)}

                      <span className="text-gray-700 text-sm">
                        {place.name}
                      </span>
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
                    ➕ Show more
                  </motion.div>
                )}

                {visibleCount > initialVisible && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center text-red-400 hover:text-red-600 font-semibold cursor-pointer"
                    onClick={() => handleShowLess(key)}
                  >
                    ➖ Show less
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
