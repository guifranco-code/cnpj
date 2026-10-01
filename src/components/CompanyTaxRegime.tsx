import React from 'react';
import { ShieldCheck, CalendarCheck, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { CNPJResponse } from '../types/cnpj';
import { formatDate } from '../utils/cnpjUtils';

interface CompanyTaxRegimeProps {
  data: CNPJResponse;
}

export const CompanyTaxRegime: React.FC<CompanyTaxRegimeProps> = ({ data }) => {
  const regimeHistory = data.regime_tributario || [];

  return (
    <div className="space-y-6">
      {/* Cards de Enquadramento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simples Nacional */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simples Nacional</span>
            </h4>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                data.opcao_pelo_simples
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {data.opcao_pelo_simples ? 'Optante' : 'Não Optante'}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            {data.opcao_pelo_simples ? (
              <p>
                Optante desde:{' '}
                <span className="font-semibold text-slate-900 font-mono">
                  {formatDate(data.data_opcao_pelo_simples)}
                </span>
              </p>
            ) : (
              <p>Esta empresa não é enquadrada no regime diferenciado do Simples Nacional.</p>
            )}

            {data.data_exclusao_do_simples && (
              <p className="text-amber-700">
                Data de exclusão:{' '}
                <span className="font-semibold font-mono">
                  {formatDate(data.data_exclusao_do_simples)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* MEI */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-indigo-600" />
              <span>Simei (MEI)</span>
            </h4>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                data.opcao_pelo_mei
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {data.opcao_pelo_mei ? 'Optante MEI' : 'Não Optante'}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            {data.opcao_pelo_mei ? (
              <p>
                Enquadrada no SIMEI desde:{' '}
                <span className="font-semibold text-slate-900 font-mono">
                  {formatDate(data.data_opcao_pelo_mei)}
                </span>
              </p>
            ) : (
              <p>Não enquadrada como Microempreendedor Individual (MEI).</p>
            )}

            {data.data_exclusao_do_mei && (
              <p className="text-amber-700">
                Data de exclusão do MEI:{' '}
                <span className="font-semibold font-mono">
                  {formatDate(data.data_exclusao_do_mei)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Histórico de Regime Tributário (ECF) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-700" />
            <span>Histórico de Regime Tributário (ECF)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Forma de apuração e tributação reportada na Escrituração Contábil Fiscal
          </p>
        </div>

        {regimeHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            Nenhum histórico de apuração de regime tributário (ECF) registrado nesta base.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-2.5 px-3 font-mono">Ano-Calendário</th>
                  <th className="py-2.5 px-3">Forma de Tributação</th>
                  <th className="py-2.5 px-3 text-right">Escriturações Entregues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regimeHistory.map((reg, idx) => (
                  <tr key={`${reg.ano}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                      {reg.ano}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                        {reg.forma_de_tributacao}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-slate-600 text-right tabular-nums">
                      {reg.quantidade_de_escrituracoes}
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
