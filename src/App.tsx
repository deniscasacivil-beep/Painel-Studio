import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardCard } from "./components/DashboardCard";
import {
  LayoutDashboard,
  AlertCircle,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import type { DashboardLink, Category } from "./types";
import * as Icons from "lucide-react";

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const [customLinks, setCustomLinks] = useState<DashboardLink[]>([]);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchScriptData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;

      const WEB_APP_URL =
        "https://script.google.com/macros/s/AKfycbx_k4XYcG6PdFEFlAv-F41SF1lX9iS77Vk3aMem0BSRN5CR0Gi9yweiuXL3GRu1vPSebA/exec";
      const response = await fetch(WEB_APP_URL);
      if (!response.ok) {
        throw new Error("Erro na comunicação com a planilha");
      }

      const rawText = await response.text();
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("Erro ao analisar resposta:", rawText);
        throw new Error(
          "O serviço retornou um erro interno.",
        );
      }

      const rows = data.data || data;
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("Planilha vazia ou formato inválido.");
      }

      let parsedCategories: Category[] = [
        { id: "todos", label: "Todos os Painéis", icon: BarChart3 },
      ];
      let parsedLinks: DashboardLink[] = [];

      // Detect "Headers as Categories, Rows as Cards" format
      if (Array.isArray(rows[0])) {
        const headers = rows[0];
        headers.forEach((header: string, colIndex: number) => {
          if (!header || String(header).trim() === "") return;
          const catId = String(header)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");

          parsedCategories.push({
            id: catId,
            label: String(header).trim(),
            icon: LayoutDashboard, // Default generic icon
          });

          for (let i = 1; i < rows.length; i++) {
            const cellValue = rows[i][colIndex];
            if (cellValue && String(cellValue).trim() !== "") {
              const cellText = String(cellValue).trim();

              // Try to extract URL from cell text (e.g. "Painel https://link...")
              let title = cellText;
              let url = "#";
              const urlMatch = cellText.match(/(https?:\/\/[^\s]+)/);
              if (urlMatch) {
                url = urlMatch[1];
                title = cellText.replace(urlMatch[1], "").trim();
                title = title.replace(/^[\n-]+|[\n-]+$/g, "").trim(); // Remove leading/trailing dashes or newlines
              }

              parsedLinks.push({
                id: `card-${colIndex}-${i}`,
                title: title || "Dashboard",
                description: "",
                category: catId,
                url: url,
                // @ts-ignore
                icon: Icons.LineChart,
                tags: [],
                status: "Ativo",
              });
            }
          }
        });
      } else if (typeof rows[0] === "object") {
        const headers = Object.keys(rows[0]);
        headers.forEach((header: string, colIndex: number) => {
          if (!header || String(header).trim() === "") return;
          const catId = String(header)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");

          parsedCategories.push({
            id: catId,
            label: String(header).trim(),
            icon: LayoutDashboard, // Default generic icon
          });

          for (let i = 0; i < rows.length; i++) {
            const cellValue = rows[i][header];
            if (cellValue && String(cellValue).trim() !== "") {
              const cellText = String(cellValue).trim();

              // Try to extract URL from cell text
              let title = cellText;
              let url = "#";
              const urlMatch = cellText.match(/(https?:\/\/[^\s]+)/);
              if (urlMatch) {
                url = urlMatch[1];
                title = cellText.replace(urlMatch[1], "").trim();
                title = title.replace(/^[\n-]+|[\n-]+$/g, "").trim();
              }

              parsedLinks.push({
                id: `card-${colIndex}-${i}`,
                title: title || "Dashboard",
                description: "",
                category: catId,
                url: url,
                // @ts-ignore
                icon: Icons.LineChart,
                tags: [],
                status: "Ativo",
              });
            }
          }
        });
      }

      if (parsedCategories.length > 1) {
        setCustomCategories(parsedCategories);
        setCustomLinks(parsedLinks);
      } else {
        throw new Error("Não foram encontradas colunas/categorias válidas.");
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Falha ao carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScriptData();
  }, []);

  const currentLinks = customLinks;
  const currentCategories =
    customCategories.length > 0
      ? customCategories
      : [{ id: "todos", label: "Todos os Painéis", icon: BarChart3 }];

  // Filter logic
  const filteredLinks =
    activeCategory === "todos"
      ? currentLinks
      : currentLinks.filter((link) => link.category === activeCategory);

  const activeCategoryLabel =
    currentCategories.find((c) => c.id === activeCategory)?.label ||
    "Todos os Painéis";

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        categories={currentCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main Container */}
      <main className="flex-grow flex flex-col min-w-0 h-full relative">
        <Header
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          activeCategoryLabel={activeCategoryLabel}
        />

        {/* Scrollable Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full flex-grow">
          {/* Header context for the content area */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-black text-navy uppercase tracking-tighter mb-3 flex items-center gap-3">
                <LayoutDashboard
                  className="text-gold"
                  size={32}
                  strokeWidth={3}
                />
                Painéis Analíticos
              </h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Acesse de forma centralizada todos os observatórios, indicadores
                e relatórios gerenciais da Secretaria Municipal da Casa Civil.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start border border-red-200">
              <AlertCircle size={20} className="mr-3 flex-shrink-0" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          {/* Dashboards Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw className="animate-spin text-navy" size={32} />
              <span className="ml-3 text-navy font-bold">
                Carregando painéis...
              </span>
            </div>
          ) : filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredLinks.map((dashboard) => (
                <DashboardCard
                  key={dashboard.id}
                  dashboard={dashboard}
                  onNotification={showNotification}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center mt-6">
              <LayoutDashboard size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-navy mb-2">
                Nenhum painel encontrado nesta categoria.
              </h3>
              <p className="text-slate-500 text-sm">
                Os dashboards para esta área estão atualmente em desenvolvimento
                ou migração.
              </p>
              <button
                onClick={() => setActiveCategory("todos")}
                className="mt-6 bg-navy text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-800 transition-colors"
              >
                Voltar para Todos os Painéis
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 shadow-2xl rounded-lg p-4 z-50 flex items-start max-w-sm animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle
            size={20}
            className="text-orange-400 mr-3 mt-0.5 flex-shrink-0"
          />
          <div className="text-white text-sm font-medium">{notification}</div>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-slate-400 hover:text-white transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
