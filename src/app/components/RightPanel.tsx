import { useState } from "react";
import places from "../data/Places_response.json";

type Props = {};

function RightPanel({}: Props) {
  // Стан для зберігання кількості видимих елементів по категоріях
  const [visibleCounts, setVisibleCounts] = useState<{ [key: string]: number }>(
    {}
  );

  const handleShowMore = (key: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || 3) + 10, 
    }));
  };

  return (
    <div className="w-64 flex flex-col p-2 overflow-auto max-h-screen">
      <h1 className="m-2">Кількість будівель</h1>
      {Object.entries(places.results).map(([key, value]) => {
        const filteredItems = value.items.filter(
          (place: any) => place.name !== "Unnamed"
        );
        const visibleCount = visibleCounts[key] || 3;

        return (
          <div key={key}>
            <div className="bg-gray-300 p-2 rounded-md flex flex-col mb-2">
              <div className="flex justify-between w-full items-center">
                <h2>{key}</h2>
                <div>Count: {value.count}</div>
              </div>
            </div>
            <div className="flex flex-col pl-4">
              {filteredItems
                .slice(0, visibleCount)
                .map((place: any, index: number) => (
                  <div
                    key={index}
                    className="flex bg-amber-200 mb-2 rounded-md p-2"
                  >
                    <span>{place.name}</span>
                  </div>
                ))}
              {visibleCount < filteredItems.length && (
                <div
                  className=" text-gray-400 font-bold px-2 rounded cursor-pointer hover:text-gray-600 mb-2"
                  onClick={() => handleShowMore(key)}
                >
                  Show more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RightPanel;
