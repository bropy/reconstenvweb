"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { TiThMenu } from "react-icons/ti";
import Media from "react-responsive";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="w-full h-16 bg-gradient-to-t from-indigo-1200 to-indigo-1300 text-white backdrop-blur-md shadow-md flex items-center justify-between px-2 md:px-8 z-50 rounded-b-3xl">
      <Media query="(max-width: 800px)">
        {(matches) =>
          matches ? (
            <>
              <AnimatePresence mode="wait">
                {navOpen ? (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex space-x-8 ml-6"
                  >
                    <NavButton text="Допомога" />
                    <NavButton text="Партнерам" />
                    <NavButton text="ОВДП" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Logo />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                onClick={() => setNavOpen(!navOpen)}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer"
              >
                <TiThMenu className="text-4xl mr-4" />
              </motion.div>
            </>
          ) : (
            <>
              <Logo />
              <motion.div
                className="flex space-x-8 mr-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <NavButton text="Допомога" />
                <NavButton text="Партнерам" />
                <NavButton text="ОВДП" />
              </motion.div>
            </>
          )
        }
      </Media>
    </nav>
  );
}

function NavButton({ text }: { text: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative group text-lg font-medium hover:text-indigo-300 transition-colors duration-300"
    >
      <span className="z-10">{text}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 group-hover:w-full transition-all duration-300"></span>
    </motion.button>
  );
}
