'use client';

import { useState } from "react";
import { motion } from "framer-motion";

const steps = ["Будинки", "Школи", "Дороги", "Лікарні"];

export default function TimeLineSelector() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-80 flex flex-col items-center space-y-6">
      <h2 className="text-xl font-bold text-gray-800">TimeLine</h2>

      <div className="relative flex flex-col items-start w-full">
        {/* Вертикальна лінія */}
        <div className="absolute top-6 left-7 w-1 bg-gray-300 h-[calc(100%-24px)] rounded-full" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center w-full mb-8 last:mb-0 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            onClick={() => setCurrentIndex(index)}
          >
            {/* Крапка з номером */}
            <motion.div
              animate={{
                backgroundColor: currentIndex === index ? "#0ea5e9" : "#9ca3af",
                scale: currentIndex === index ? 1.2 : 1,
                boxShadow: currentIndex === index
                  ? "0 0 10px rgba(14, 165, 233, 0.6)"
                  : "none",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="z-10 w-8 h-8 min-w-8 min-h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ml-3"
            >
              {index + 1}
            </motion.div>

            {/* Текст справа */}
            <motion.div
              animate={{
                backgroundColor: currentIndex === index ? "rgba(14, 165, 233, 0.15)" : "transparent",
                color: currentIndex === index ? "#0ea5e9" : "#374151",
              }}
              transition={{ duration: 0.3 }}
              className="ml-6 px-4 py-2 rounded-lg text-sm font-medium w-full"
            >
              {step}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
