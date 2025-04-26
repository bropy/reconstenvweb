'use client';

export default function Navbar() {
  return (
    <nav className="w-full h-14 bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-between px-6 md:px-8 z-50">
      {/* Логотип */}
      <div className="text-xl font-semibold text-indigo-600 tracking-wide">
        Логотип
      </div>

      {/* Кнопки */}
      <div className="flex space-x-6">
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
    <button className="text-gray-800 font-medium hover:text-indigo-500 transition-colors duration-300 relative group">
      {/* Текст кнопки */}
      {text}

      {/* Лінія під кнопкою */}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
    </button>
  );
}
