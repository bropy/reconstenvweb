'use client';

import DashBoard from "./components/DashBoard";
import NewBoardMenu from "./components/NewBoardMenu";
import { useState } from "react";
import { motion } from "framer-motion"; 
import Footer from "./components/Footer";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-indigo-800 to-indigo-1200 text-white mt-12">
      <motion.div
        className="flex justify-center items-center py-12 text-3xl font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center">
          Реальний кошторис забудови, в один клік
          <br />
          <span className="text-indigo-300">без зайвих кроків!</span>
        </h1>
      </motion.div>

      {/* Основний контент */}
      <div className="flex-grow">
        <DashBoard setOpen={setOpen} />
      </div>

      {/* Меню для створення нового проекту */}
      <NewBoardMenu open={open} setOpen={setOpen} />

      <Footer/>
    </div>
  );
}
