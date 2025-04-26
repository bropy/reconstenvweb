'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import places from "../data/Places_response.json";

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
                <div className="text-sm text-blue-500">Count: {value.count}</div>
              </div>
            </motion.div>

            <div className="flex flex-col pl-2">
              <AnimatePresence>
                {filteredItems.slice(0, visibleCount).map((place: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 transition-all mb-2 rounded-lg p-2 shadow-sm cursor-pointer"
                  >
                    <div className="w-2 h-2 min-w-2 min-h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{place.name}</span>
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
