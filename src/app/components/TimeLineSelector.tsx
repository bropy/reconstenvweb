"use client";

import { useState } from "react";

const steps = ["Будинки", "Школи лікарні", "Дороги"];

export default function TimeLineSelector() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="bg-gray-300 p-2 rounded-md w-64 flex flex-col items-center">
      <h2 className="mb-4 bg-gray-500 text-white w-full text-center py-2 rounded-md">
        TimeLine
      </h2>
      <div className="relative flex flex-col items-center w-full">
        {/* Вертикальна лінія */}
        <div className="absolute top-3 left-4 w-2 h-30 bg-gray-600"></div>

        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center w-full mb-4 relative cursor-pointer ms-0"
            onClick={() => setCurrentIndex(index)}
          >
            {/* Крапка */}
            <div
              className={`z-10 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                currentIndex === index ? "bg-sky-600" : "bg-black"
              } ml-2`}
            >{index+1}</div>

            {/* Текст */}
            <div
              className={`ml-2 p-2 rounded-md flex-1 ${
                currentIndex === index ? "bg-sky-200" : ""
              }`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
