// components/Footer.tsx
"use client";
import Logo from "./Logo";

import { FaLinkedin, FaFacebookSquare, FaYoutubeSquare } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white pt-6 pb-2">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6">
        {/* Лінки */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <FooterLink text="Про нас" />
          <FooterLink text="Контакти" />
          <FooterLink text="Політика конфіденційності" />
        </div>

        <Logo />

        {/* Іконки */}
        <div className="flex space-x-6">
          <FaLinkedin className="w-8 h-8 text-white hover:text-indigo-300 transition-colors duration-300" />
          <FaFacebookSquare className="w-8 h-8 text-white hover:text-indigo-300 transition-colors duration-300" />
          <FaYoutubeSquare className="w-8 h-8 text-white hover:text-indigo-300 transition-colors duration-300" />
        </div>
      </div>

      {/* Копірайт */}
      <div className="mt-6 text-center text-xs md:text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Всі права захищені.
      </div>
    </footer>
  );
}

// Компонент для лінків у футері
function FooterLink({ text }: { text: string }) {
  return (
    <a
      href="#"
      className="text-white hover:text-indigo-400 transition-colors duration-300 text-sm md:text-base"
    >
      {text}
    </a>
  );
}
