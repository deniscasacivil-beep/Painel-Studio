import React from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  toggleMobileMenu: () => void;
  activeCategoryLabel: string;
}

export function Header({ toggleMobileMenu, activeCategoryLabel }: HeaderProps) {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 shadow-sm flex-shrink-0">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-navy hover:bg-gray-100 p-2 rounded-md"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-navy uppercase tracking-tight flex items-center">
          <span className="text-gray-600">{activeCategoryLabel}</span>
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <span className="hidden sm:inline-block bg-blue-100 text-navy px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          Ano 2026
        </span>
      </div>
    </header>
  );
}
