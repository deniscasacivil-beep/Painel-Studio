import React from "react";
import { ArrowRight } from "lucide-react";
import { DashboardLink } from "../types";

export const DashboardCard: React.FC<{
  dashboard: DashboardLink;
  onNotification?: (message: string) => void;
}> = ({ dashboard, onNotification }) => {
  const isMaintenance = dashboard.status === "Em manutenção";

  const hasNoLink = !dashboard.url || dashboard.url === "#";

  return (
    <a
      href={isMaintenance || hasNoLink ? "#" : dashboard.url}
      target={isMaintenance || hasNoLink ? "_self" : "_blank"}
      rel="noopener noreferrer"
      onClick={(e) => {
        if (isMaintenance) {
          e.preventDefault();
        } else if (hasNoLink) {
          e.preventDefault();
          if (onNotification) {
            onNotification(
              "Este painel ainda não possui um link associado na planilha.",
            );
          }
        }
      }}
      className={`block bg-navy rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-black/50 border ${isMaintenance ? "border-orange-500/30" : "border-blue-800 hover:border-gold"} p-5 flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden group h-40 cursor-pointer`}
    >
      {/* Subtle background blur/gradient element */}
      <div
        className={`absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full opacity-30 transition-all duration-700 group-hover:scale-[2] group-hover:opacity-60 blur-3xl ${isMaintenance ? "bg-orange-500" : "bg-gold"}`}
      ></div>

      {/* Decorative vertical band matching HTML style */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${isMaintenance ? "bg-orange-400" : "bg-blue-500 transition-all duration-500 group-hover:w-1.5 group-hover:bg-gold"}`}
      ></div>

      <div className="flex justify-between items-start mb-3 pl-3 relative z-10 min-h-8">
        <div></div>
        {dashboard.status && dashboard.status !== "Ativo" && (
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
            ${isMaintenance ? "bg-orange-900/50 text-orange-400" : "bg-green-900/50 text-green-400"}
          `}
          >
            {dashboard.status}
          </span>
        )}
      </div>

      <div className="pl-3 flex-grow relative z-10">
        <h3 className="text-lg font-bold text-white leading-tight mb-2 tracking-tight group-hover:text-gold transition-colors">
          {dashboard.title}
        </h3>
        {dashboard.description && (
          <p className="text-sm text-blue-100 mb-3 font-normal line-clamp-2 leading-relaxed opacity-80">
            {dashboard.description}
          </p>
        )}
      </div>

      <div className="pl-3 mt-auto relative z-10 flex justify-between items-end">
        <div className="flex flex-wrap gap-2">
          {dashboard.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-900/50 border border-blue-800 text-blue-200 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>

        {!isMaintenance && (
          <span className="text-blue-300 group-hover:text-white transition-colors duration-300 ml-4 flex-shrink-0">
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </span>
        )}
      </div>
    </a>
  );
};
