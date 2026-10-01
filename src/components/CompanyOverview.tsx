import React from 'react';
import {
  Coins,
  Scale,
  Building,
  ShieldCheck,
  Calendar,
  Layers,
  FileCheck,
  BadgeAlert,
} from 'lucide-react';
import { CNPJResponse } from '../types/cnpj';
import { formatCurrency, formatDate } from '../utils/cnpjUtils';

interface CompanyOverviewProps {
  data: CNPJResponse;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* 4-Box Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Capital Social */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Capital Social</span>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono text-slate-900 tabular-nums">
            {formatCurrency(data.capital_social)}
          </div>
          <p className="mt-1 text-xs text-slate-500">Valor declarado na Receita Federal</p>
        </div>

        {/* Porte Empresarial */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Porte da Empresa</span>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold text-slate-900">
            {data.porte || 'DEMAIS'}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {data.porte === 'ME'
              ? 'Microempresa (receita até R$ 360k/ano)'
              : data.porte === 'EPP'
              ? 'Empresa de Pequeno Porte (até R$ 4,8M/ano)'
              : 'Médio / Grande Porte'}
          </p>
        </div>

        {/* Tipo de Estabelecimento */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Estabelecimento</span>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold text-slate-900">
            {data.descricao_identificador_matriz_filial || 'MATRIZ'}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {data.identificador_matriz_filial === 1
              ? 'Sede principal da organização'
              : 'Unidade filial / subsidiária'}
          </p>
        </div>

        {/* Regime Tributário Simples / MEI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Simples / MEI</span>
          </div>
          <div className="mt-2 text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{data.opcao_pelo_simples ? 'Optante Simples' : 'Não optante'}</span>
            {data.opcao_pelo_mei && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                MEI
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {data.opcao_pelo_simples
              ? `Desde ${formatDate(data.data_opcao_pelo_simples)}`
              : 'Regime Lucro Presumido ou Real'}
          </p>
        </div>
      </div>

      {/* Detailed Legal and Institutional Data */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Scale className="w-4 h-4 text-slate-700" />
          <span>Natureza Jurídica e Estrutura Legal</span>
        </h3>

        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500">Natureza Jurídica</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {data.natureza_juridica}
              {data.codigo_natureza_juridica ? (
                <span className="ml-1 text-xs font-mono font-normal text-slate-500">
                  ({data.codigo_natureza_juridica})
                </span>
              ) : null}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-slate-500">Início da Atividade</dt>
            <dd className="mt-1 font-semibold text-slate-900 font-mono tabular-nums">
              {formatDate(data.data_inicio_atividade)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-slate-500">Data da Situação Cadastral</dt>
            <dd className="mt-1 font-semibold text-slate-900 font-mono tabular-nums">
              {formatDate(data.data_situacao_cadastral)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-slate-500">Motivo da Situação Cadastral</dt>
            <dd className="mt-1 text-slate-800">
              {data.descricao_motivo_situacao_cadastral || 'Sem motivo especificado'}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-slate-500">Qualificação do Responsável</dt>
            <dd className="mt-1 text-slate-800">
              Código {data.qualificacao_do_responsavel || 0}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-slate-500">E-mail Cadastrado</dt>
            <dd className="mt-1 font-semibold text-slate-900 break-all">
              {data.email ? (
                <a
                  href={`mailto:${data.email.toLowerCase()}`}
                  className="text-emerald-700 hover:underline"
                >
                  {data.email.toLowerCase()}
                </a>
              ) : (
                <span className="text-slate-400 font-normal italic">Não informado</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-slate-500">Telefone Principal</dt>
            <dd className="mt-1 font-semibold font-mono text-slate-900 tabular-nums">
              {data.ddd_telefone_1 ? (
                <a
                  href={`tel:${data.ddd_telefone_1.replace(/\D/g, '')}`}
                  className="text-blue-700 hover:underline"
                >
                  {data.ddd_telefone_1.length >= 10
                    ? `(${data.ddd_telefone_1.slice(0, 2)}) ${data.ddd_telefone_1.slice(2)}`
                    : data.ddd_telefone_1}
                </a>
              ) : (
                <span className="text-slate-400 font-normal italic">Não informado</span>
              )}
            </dd>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <dt className="text-xs font-medium text-slate-500">Endereço Completo</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {[
                data.descricao_tipo_de_logradouro ? `${data.descricao_tipo_de_logradouro} ` : '',
                data.logradouro,
                data.numero ? `, ${data.numero}` : '',
                data.complemento ? ` (${data.complemento})` : '',
                data.bairro ? ` - ${data.bairro}` : '',
                `, ${data.municipio} - ${data.uf}`,
              ].join('')}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-slate-500">Ente Federativo Responsável</dt>
            <dd className="mt-1 text-slate-800">
              {data.ente_federativo_responsavel || 'Não aplicável (Privada)'}
            </dd>
          </div>

          {data.situacao_especial && (
            <div className="md:col-span-2">
              <dt className="text-xs font-medium text-slate-500">Situação Especial</dt>
              <dd className="mt-1 text-amber-700 font-semibold flex items-center gap-1.5">
                <BadgeAlert className="w-4 h-4" />
                <span>
                  {data.situacao_especial}{' '}
                  {data.data_situacao_especial && `em ${formatDate(data.data_situacao_especial)}`}
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
