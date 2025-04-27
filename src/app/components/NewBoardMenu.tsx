// components/NewBoardMenu.tsx
"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

function NewBoardMenu({ open, setOpen }: Props) {
  const cityInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [noName, setNoName] = useState(false);

  const createProject = () => {
    // const cityName = cityInputRef.current?.value.trim();
    const cityName = "Харків"; // For demo

    if (cityName) {
      console.log("City:", cityName);
      router.push(`/map?city=${encodeURIComponent(cityName)}`);
    } else {
      setNoName(true);
      alert("Будь ласка, введіть назву міста");
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 text-white p-6 rounded-2xl shadow-2xl flex flex-col gap-5 w-full max-w-sm">
            <h1 className="text-3xl font-bold text-center">Новий проект</h1>

            <label className="text-indigo-100 font-semibold text-sm">
              Напишіть ім&apos;я міста
            </label>

            <input
              type="text"
              ref={cityInputRef}
              className={`rounded-lg p-3 text-lg font-semibold focus:outline-none transition-all ${
                noName
                  ? "bg-red-100 text-red-700 placeholder-red-400 focus:ring-2 focus:ring-red-400"
                  : "bg-white/20 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-400"
              }`}
              placeholder="Харків (демо)"
              readOnly
            />

            <div className="flex gap-4 mt-2">
              <button
                className="w-1/2 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-lg transition-all text-white font-semibold text-lg"
                onClick={() => {
                  setOpen(false);
                  setNoName(false);
                }}
              >
                Відмінити
              </button>

              <button
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-600 hover:to-indigo-800 transition-all font-semibold text-white text-lg"
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
