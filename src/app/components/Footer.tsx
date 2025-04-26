// components/Footer.tsx
'use client';
import Logo from "./Logo";

import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutubeSquare } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className=" bg-indigo-900 text-white pt-6 pb-2">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Лінки */}
        <div className="flex space-x-6 flex-col">
          <FooterLink text="Про нас" />
          <FooterLink text="Контакти" />
          <FooterLink text="Політика конфіденційності" />
        </div>

        <Logo />

        <div className="flex space-x-6 ">
          <FaLinkedin className="w-10 h-10 m text-white hover:text-indigo-300" />
          <FaFacebookSquare className="w-10 h-10 m text-white hover:text-indigo-300" />
          <FaYoutubeSquare className="w-10 h-10 m text-white hover:text-indigo-300" />
        </div>
      </div>

      {/* Копірайт */}
      <div className="mt-6 text-center text-sm">
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
      className="text-white hover:text-indigo-400 transition-colors duration-300"
    >
      {text}
    </a>
  );
}
