import React, { useState } from 'react';
import { Briefcase, Search, Copy, Check, Filter } from 'lucide-react';
import { CNPJResponse } from '../types/cnpj';

interface CompanyActivitiesProps {
  data: CNPJResponse;
  onShowToast: (msg: string) => void;
}

export const CompanyActivities: React.FC<CompanyActivitiesProps> = ({
  data,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const handleCopyCode = async (code: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(code));
      setCopiedCode(code);
      onShowToast(`CNAE ${code} copiado!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      onShowToast('Falha ao copiar código.');
    }
  };

  const secundarias = data.cnaes_secundarios || [];

  const filteredSecundarias = secundarias.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      String(item.codigo).includes(query) ||
      item.descricao.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Atividade Principal */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          <Briefcase className="w-4 h-4" />
          <span>Atividade Econômica Principal (CNAE)</span>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
              Código: {data.cnae_fiscal}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {data.cnae_fiscal_descricao || 'Não informada'}
            </h4>
          </div>

          <button
            type="button"
            onClick={(e) => handleCopyCode(data.cnae_fiscal, e)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            title="Copiar código CNAE principal"
          >
            {copiedCode === data.cnae_fiscal ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{copiedCode === data.cnae_fiscal ? 'Copiado!' : 'Copiar Código'}</span>
          </button>
        </div>
      </div>

      {/* Atividades Secundárias */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <span>Atividades Secundárias</span>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {secundarias.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Demais ramos operacionais e atividades secundárias registradas
            </p>
          </div>

          {secundarias.length > 3 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por código ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          )}
        </div>

        {secundarias.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            Nenhuma atividade econômica secundária cadastrada para este CNPJ.
          </div>
        ) : filteredSecundarias.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            Nenhuma atividade encontrada com o termo "{searchTerm}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-2.5 px-3 w-32 font-mono">Código CNAE</th>
                  <th className="py-2.5 px-3">Descrição da Atividade</th>
                  <th className="py-2.5 px-3 w-20 text-right no-print">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSecundarias.map((item) => (
                  <tr
                    key={item.codigo}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700 tabular-nums">
                      {item.codigo}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-medium">
                      {item.descricao}
                    </td>
                    <td className="py-3 px-3 text-right no-print">
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(item.codigo, e)}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition-opacity"
                        title="Copiar código"
                      >
                        {copiedCode === item.codigo ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
