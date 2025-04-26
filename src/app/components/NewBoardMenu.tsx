import { useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Якщо ти на Next.js 13+

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

function NewBoardMenu({ open, setOpen }: Props) {
  const cityInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [noName, setNoName] = useState(false);

  const createProject = () => {
    const cityName = cityInputRef.current?.value.trim();

    if (cityName) {
      console.log("City:", cityName);
      // Наприклад, можна передати місто через query параметр
      router.push(`/map?city=${encodeURIComponent(cityName)}`);
    } else {
      setNoName(true);
      alert("Будь ласка, введіть назву міста");
    }
  };

  return (
    <>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-80">
            <h1 className="text-2xl font-bold text-center">Новий проект</h1>
            <label className="text-gray-700 font-medium">
              Напишіть ім'я міста
            </label>
            <input
              type="text"
              ref={cityInputRef}
              className={`${
                noName ? "border-red-400 " : "border-gray-300"
              } border  rounded-md p-2 focus:outline-none focus:ring-2 ${
                noName
                  ? "border-red-300 focus:ring-red-500 text-red-700"
                  : "border-gray-300 focus:ring-blue-500 text-gray-400"
              } `}
              placeholder="Назва міста"
            />
            <div className="flex w-full">
              <button
                className="bg-gray-300 text-white py-2 rounded-md hover:bg-gray-400 transition w-full mr-1"
                onClick={() => {
                  setOpen(false);
                  setNoName(false);
                }}
              >
                Відмінити
              </button>
              <button
                className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition w-full ml-1"
                onClick={createProject}
              >
                Створити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NewBoardMenu;
