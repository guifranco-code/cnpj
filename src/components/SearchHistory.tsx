import React from 'react';
import { History, X, Trash2, ArrowUpRight, Building2, CheckCircle2, Clock } from 'lucide-react';
import { SearchHistoryItem } from '../types/cnpj';
import { formatCNPJ } from '../utils/cnpjUtils';

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchHistoryItem[];
  onSelect: (cnpj: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Agora mesmo';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Há ${days} d`;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  isOpen,
  onClose,
  items,
  onSelect,
  onRemove,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">Histórico de Consultas</h2>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Nenhuma consulta recente
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Conforme você realizar consultas de CNPJs, elas serão salvas localmente no seu navegador para acesso rápido.
                  </p>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 transition-all cursor-pointer shadow-xs"
                  onClick={() => {
                    onSelect(item.cnpj);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                          {formatCNPJ(item.cnpj)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            item.situacao === 'ATIVA'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {item.situacao}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {item.razao_social}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {item.municipio && item.uf && (
                          <span>
                            {item.municipio}/{item.uf}
                          </span>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{timeAgo(item.searchedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(item.id);
                        }}
                        className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors"
                        title="Remover do histórico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="p-1 text-slate-400 group-hover:text-slate-800 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar todo o histórico</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
