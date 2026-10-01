import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  Share2,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { CNPJResponse } from '../types/cnpj';
import {
  formatCNPJ,
  formatDate,
  calculateAge,
  generateFormattedSummary,
} from '../utils/cnpjUtils';

interface CompanyHeaderProps {
  data: CNPJResponse;
  onShowToast: (msg: string) => void;
  onPrint: () => void;
  onOpenMap?: () => void;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  data,
  onShowToast,
  onPrint,
  onOpenMap,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedCnpj, setCopiedCnpj] = useState(false);

  const formattedCnpj = formatCNPJ(data.cnpj);
  const age = calculateAge(data.data_inicio_atividade);

  const handleCopyCNPJ = async () => {
    try {
      await navigator.clipboard.writeText(formattedCnpj);
      setCopiedCnpj(true);
      onShowToast(`CNPJ ${formattedCnpj} copiado!`);
      setTimeout(() => setCopiedCnpj(false), 2000);
    } catch {
      onShowToast('Não foi possível copiar para a área de transferência.');
    }
  };

  const handleCopySummary = async () => {
    try {
      const summary = generateFormattedSummary(data);
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      onShowToast('Relatório completo copiado para a área de transferência!');
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      onShowToast('Não foi possível copiar para a área de transferência.');
    }
  };

  const handleDownloadJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `cnpj-${data.cnpj}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Arquivo JSON baixado com sucesso!');
  };

  const handleShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('cnpj', data.cnpj);
    try {
      await navigator.clipboard.writeText(url.toString());
      onShowToast('Link da consulta copiado para compartilhar!');
    } catch {
      onShowToast('Erro ao copiar link.');
    }
  };

  const isAtiva = data.descricao_situacao_cadastral === 'ATIVA';
  const isBaixada = data.descricao_situacao_cadastral === 'BAIXADA';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left Side: Title, Trade Name, Metadata */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isAtiva
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : isBaixada
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {isAtiva ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : isBaixada ? (
                <XCircle className="w-3.5 h-3.5 text-red-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>
                {data.descricao_situacao_cadastral || 'SITUAÇÃO NÃO INFORMADA'}
              </span>
            </span>

            <span className="text-xs text-slate-500 font-medium">
              desde {formatDate(data.data_situacao_cadastral)}
            </span>

            {data.descricao_motivo_situacao_cadastral &&
              data.descricao_motivo_situacao_cadastral !== 'SEM MOTIVO' && (
                <span className="text-xs text-slate-500">
                  · {data.descricao_motivo_situacao_cadastral}
                </span>
              )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              {data.razao_social}
            </h1>
            {data.nome_fantasia && (
              <p className="text-base text-slate-600 font-medium mt-0.5">
                Nome Fantasia: {data.nome_fantasia}
              </p>
            )}
          </div>

          {/* Clean unboxed metadata row with typographic separators */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 font-medium pt-1">
            <button
              type="button"
              onClick={handleCopyCNPJ}
              className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-900 font-semibold hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
              title="Clique para copiar CNPJ"
            >
              <span>CNPJ: {formattedCnpj}</span>
              {copiedCnpj ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{data.descricao_identificador_matriz_filial || 'MATRIZ'}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Porte: {data.porte || 'Não especificado'}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>
                Início: {formatDate(data.data_inicio_atividade)}
                {age ? ` (${age})` : ''}
              </span>
            </span>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-wrap lg:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 lg:pt-0 no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              {copiedSummary ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>{copiedSummary ? 'Copiado!' : 'Copiar Resumo'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Baixar arquivo JSON completo"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Baixar JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMap && (
              <button
                type="button"
                onClick={onOpenMap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                title="Abrir no Google Maps para explorar empresas por CNAE no raio"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Raio no Mapa</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              title="Copiar link direto para esta consulta"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Compartilhar Link</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              title="Imprimir ficha cadastral"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
