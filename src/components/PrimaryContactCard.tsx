import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  PhoneCall,
  Send,
  AlertCircle,
  Building,
  Compass,
} from 'lucide-react';
import { CNPJResponse } from '../types/cnpj';
import { formatCEP, formatFullAddress, formatFullPhone } from '../utils/cnpjUtils';

interface PrimaryContactCardProps {
  data: CNPJResponse;
  onShowToast: (msg: string) => void;
  onOpenMap?: () => void;
}

export const PrimaryContactCard: React.FC<PrimaryContactCardProps> = ({
  data,
  onShowToast,
  onOpenMap,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const phone1 = formatFullPhone(data.ddd_telefone_1);
  const phone2 = formatFullPhone(data.ddd_telefone_2);
  const fax = formatFullPhone(data.ddd_fax);
  const fullAddress = formatFullAddress(data);

  const mapsQuery = encodeURIComponent(
    `${data.descricao_tipo_de_logradouro ? data.descricao_tipo_de_logradouro + ' ' : ''}${data.logradouro}, ${data.numero} ${data.bairro} ${data.municipio} ${data.uf} ${data.cep}`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(label);
      onShowToast(`${label} copiado!`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      onShowToast('Não foi possível copiar para a área de transferência.');
    }
  };

  return (
    <div className="bg-white border-2 border-emerald-500/20 bg-gradient-to-b from-emerald-50/20 via-white to-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header bar of the contact block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Contato e Localização Principal
          </h3>
          <span className="text-xs text-slate-500 hidden sm:inline">
            · Retornado diretamente da base da Receita Federal
          </span>
        </div>

        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
          E-mail · Telefone · Endereço
        </span>
      </div>

      {/* 3 Main Highlights Grid: Email, Telefone, Endereço */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. E-MAIL */}
        <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between transition-colors group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>E-mail</span>
              </span>

              {data.email && (
                <button
                  type="button"
                  onClick={() => handleCopy(data.email!.toLowerCase(), 'E-mail')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors no-print"
                  title="Copiar e-mail"
                >
                  {copiedKey === 'E-mail' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {data.email ? (
              <div className="space-y-1">
                <a
                  href={`mailto:${data.email.toLowerCase()}`}
                  className="block text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors break-all leading-snug"
                >
                  {data.email.toLowerCase()}
                </a>
                <p className="text-xs text-slate-500">Endereço eletrônico declarado</p>
              </div>
            ) : (
              <div className="space-y-1 py-1">
                <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Não cadastrado na Receita</span>
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  A empresa não declarou e-mail no registro cadastral original.
                </p>
              </div>
            )}
          </div>

          {data.email && (
            <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center gap-2 no-print">
              <a
                href={`mailto:${data.email.toLowerCase()}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Enviar E-mail</span>
              </a>
            </div>
          )}
        </div>

        {/* 2. TELEFONE */}
        <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between transition-colors group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Telefone</span>
              </span>

              {phone1 && (
                <button
                  type="button"
                  onClick={() => handleCopy(phone1, 'Telefone')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors no-print"
                  title="Copiar telefone principal"
                >
                  {copiedKey === 'Telefone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {phone1 ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <a
                    href={`tel:${data.ddd_telefone_1?.replace(/\D/g, '')}`}
                    className="text-base sm:text-lg font-bold font-mono text-slate-900 hover:text-blue-700 tabular-nums transition-colors"
                  >
                    {phone1}
                  </a>
                </div>

                {phone2 && (
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                    <span className="font-mono tabular-nums">Tel 2: {phone2}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(phone2, 'Telefone 2')}
                      className="text-slate-400 hover:text-slate-700 no-print"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {fax && (
                  <p className="text-[11px] font-mono text-slate-400 tabular-nums">
                    Fax: {fax}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1 py-1">
                <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Não informado na Receita</span>
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Nenhum número de telefone vinculado a este CNPJ.
                </p>
              </div>
            )}
          </div>

          {phone1 && (
            <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center gap-2 no-print">
              <a
                href={`tel:${data.ddd_telefone_1?.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Ligar Agora</span>
              </a>
            </div>
          )}
        </div>

        {/* 3. ENDEREÇO */}
        <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between transition-colors group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Endereço Cadastrado</span>
              </span>

              <button
                type="button"
                onClick={() => handleCopy(fullAddress, 'Endereço')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors no-print"
                title="Copiar endereço completo"
              >
                {copiedKey === 'Endereço' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                {data.descricao_tipo_de_logradouro ? `${data.descricao_tipo_de_logradouro} ` : ''}
                {data.logradouro}, {data.numero || 'S/N'}
                {data.complemento ? ` (${data.complemento})` : ''}
              </p>

              <div className="text-xs text-slate-600 space-y-0.5">
                <p>
                  {data.bairro && <span>{data.bairro} · </span>}
                  <span className="font-medium text-slate-800">
                    {data.municipio} - {data.uf}
                  </span>
                </p>
                <p className="font-mono text-slate-500 tabular-nums">
                  CEP: {formatCEP(data.cep)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2 no-print">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver no Google Maps</span>
            </a>

            {onOpenMap && (
              <button
                type="button"
                onClick={onOpenMap}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                title="Abrir mapa interativo com controle de raio e CNAE"
              >
                <Compass className="w-3 h-3 text-emerald-600" />
                <span>Raio de Busca</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
