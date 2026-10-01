import React, { useState } from 'react';
import { Users, Search, Calendar, UserCheck, Shield } from 'lucide-react';
import { CNPJResponse, QSAMember } from '../types/cnpj';
import { formatDate } from '../utils/cnpjUtils';

interface CompanyQSAProps {
  data: CNPJResponse;
}

export const CompanyQSA: React.FC<CompanyQSAProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const qsaList = data.qsa || [];

  const filteredQsa = qsaList.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      item.nome_socio.toLowerCase().includes(query) ||
      item.qualificacao_socio.toLowerCase().includes(query) ||
      (item.cnpj_cpf_do_socio && item.cnpj_cpf_do_socio.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Quadro de Sócios e Administradores (QSA)</span>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {qsaList.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Membros societários e diretoria cadastrados perante a Receita Federal
          </p>
        </div>

        {qsaList.length > 3 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por sócio ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        )}
      </div>

      {qsaList.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          Nenhum registro no Quadro de Sócios e Administradores (QSA) retornado para esta empresa.
        </div>
      ) : filteredQsa.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          Nenhum membro encontrado com o termo "{searchTerm}".
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-2.5 px-3">Nome do Sócio / Administrador</th>
                <th className="py-2.5 px-3">Qualificação / Cargo</th>
                <th className="py-2.5 px-3 font-mono">CPF/CNPJ (Oculto)</th>
                <th className="py-2.5 px-3">Entrada</th>
                <th className="py-2.5 px-3">Faixa Etária</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQsa.map((member, index) => (
                <tr
                  key={`${member.nome_socio}-${index}`}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">
                      {member.nome_socio}
                    </div>
                    {member.nome_representante_legal && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        Rep. Legal: {member.nome_representante_legal}
                        {member.qualificacao_representante_legal &&
                          ` (${member.qualificacao_representante_legal})`}
                      </div>
                    )}
                    {member.pais && (
                      <div className="text-xs text-slate-500">
                        País: {member.pais}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.qualificacao_socio}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-600 tabular-nums">
                    {member.cnpj_cpf_do_socio || 'Não informado'}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-700 tabular-nums">
                    {formatDate(member.data_entrada_sociedade)}
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-600">
                    {member.faixa_etaria || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
