// components/Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Логотип або текст */}
        <div className="text-xl font-semibold">
          Логотип
        </div>

        {/* Лінки */}
        <div className="flex space-x-6">
          <FooterLink text="Про нас" />
          <FooterLink text="Контакти" />
          <FooterLink text="Політика конфіденційності" />
        </div>
      </div>

      {/* Копірайт */}
      <div className="mt-6 text-center text-sm">
        &copy; {new Date().getFullYear()} Ваш сайт. Всі права захищені.
      </div>
    </footer>
  );
}

// Компонент для лінків у футері
function FooterLink({ text }: { text: string }) {
  return (
    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
      {text}
    </a>
  );
}
