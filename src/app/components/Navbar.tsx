"use client";
import Logo from "./Logo"

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-gradient-to-t from-indigo-1200 to-indigo-1300 text-white backdrop-blur-md shadow-md flex items-center justify-between px-6 md:px-8 z-50 rounded-b-3xl">
      <Logo/>
      
      <div className="flex space-x-8 mr-24">
        <NavButton text="Допомога" />
        <NavButton text="Партнерам" />
        <NavButton text="ОВДП" />
      </div>
    </nav>
  );
}

// Окрема кнопка для Navbar-а
function NavButton({ text }: { text: string }) {
  return (
    <button className="relative group text-lg font-medium hover:text-indigo-300 transition-colors duration-300">
      <span className="z-10">{text}</span>

      {/* Лінія під кнопкою */}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 group-hover:w-full transition-all duration-300"></span>
    </button>
  );
}
