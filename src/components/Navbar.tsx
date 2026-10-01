import React from 'react';
import { Building2, History, Info, Printer, MapPin, Search } from 'lucide-react';

interface NavbarProps {
  currentMode: 'cnpj' | 'map';
  onSelectMode: (mode: 'cnpj' | 'map') => void;
  onOpenHistory: () => void;
  onOpenAbout: () => void;
  onPrint?: () => void;
  hasData: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenHistory,
  onOpenAbout,
  onPrint,
  hasData,
  historyCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectMode('cnpj')}
          className="flex items-center gap-2.5 text-slate-900 group cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Consulta<span className="text-emerald-600">CNPJ</span>
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onSelectMode('cnpj')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${
              currentMode === 'cnpj'
                ? 'text-slate-900 font-bold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Consulta CNPJ</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('map')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${
              currentMode === 'map'
                ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mapa & Raio CNAE</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1"
          >
            <span>Histórico</span>
            {historyCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                {historyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-slate-900 transition-colors flex items-center gap-1 py-1"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Sobre a API</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Mobile mode switch button */}
          <div className="md:hidden flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onSelectMode('cnpj')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                currentMode === 'cnpj'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              CNPJ
            </button>
            <button
              type="button"
              onClick={() => onSelectMode('map')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                currentMode === 'map'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Mapa
            </button>
          </div>

          {hasData && (
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Imprimir ou exportar PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHistory}
            className="md:hidden inline-flex items-center gap-1.5 p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Abrir histórico"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
