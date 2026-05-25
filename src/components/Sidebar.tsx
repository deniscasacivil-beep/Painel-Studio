import React from "react";
import { ChevronLeft, ChartLine } from "lucide-react";
import { Category } from "../types";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  categories,
  activeCategory,
  setActiveCategory,
}: SidebarProps) {
  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`bg-navy text-white flex-shrink-0 flex flex-col absolute md:relative min-h-screen z-50 transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Toggle Button (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden md:flex absolute -right-3 top-6 bg-white py-1 px-1 text-navy rounded-full items-center justify-center shadow-md border border-gray-200 hover:bg-gray-100 z-50 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
        >
          <ChevronLeft size={16} strokeWidth={3} />
        </button>

        {/* Brand / Logo Area */}
        <div className="p-6 text-center border-b border-blue-900 transition-all duration-300 flex flex-col items-center">
          <div className="bg-white p-2 rounded-lg mb-4 inline-flex items-center justify-center shadow-lg h-20 w-20 overflow-hidden">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/30/Bras%C3%A3o_de_Ol%C3%ADmpia%2C_SP.jpg"
              alt="Brasão de Olímpia"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <h2
            className={`text-[10px] font-bold tracking-widest uppercase text-blue-100 leading-tight px-2 transition-all duration-300 ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}
          >
            Painéis Integrados
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2 mt-2 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full flex items-center transition-all duration-200 rounded-lg whitespace-nowrap overflow-hidden
                ${isCollapsed ? "justify-center p-3" : "p-3"} 
                ${
                  activeCategory === cat.id
                    ? "bg-gold text-navy font-semibold"
                    : "text-blue-100 hover:bg-blue-800"
                }`}
              title={isCollapsed ? cat.label : ""}
            >
              <cat.icon
                size={20}
                className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}
              />
              <span
                className={`text-sm transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={`p-6 bg-blue-950 text-[10px] text-blue-300 mt-auto border-t border-blue-900 transition-all duration-300 flex flex-col ${isCollapsed ? "items-center text-center" : "items-start text-left"}`}
        >
          {isCollapsed ? (
            <ChartLine
              size={20}
              className="text-blue-300"
              title="Secretaria Municipal da Casa Civil"
            />
          ) : (
            <>
              <p className="font-bold mb-3">
                Secretaria Municipal da Casa Civil
              </p>
              <ChartLine size={16} className="text-blue-300" />
            </>
          )}
        </div>
      </aside>
    </>
  );
}
