import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Building,
} from 'lucide-react';
import { CNPJResponse } from '../types/cnpj';
import { formatCEP, formatFullAddress, formatFullPhone } from '../utils/cnpjUtils';

interface CompanyLocationProps {
  data: CNPJResponse;
  onShowToast: (msg: string) => void;
}

export const CompanyLocation: React.FC<CompanyLocationProps> = ({
  data,
  onShowToast,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const fullAddress = formatFullAddress(data);

  const mapsQuery = encodeURIComponent(
    `${data.descricao_tipo_de_logradouro ? data.descricao_tipo_de_logradouro + ' ' : ''}${data.logradouro}, ${data.numero} ${data.bairro} ${data.municipio} ${data.uf} ${data.cep}`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      onShowToast(`${label} copiado!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      onShowToast('Falha ao copiar.');
    }
  };

  const phone1 = formatFullPhone(data.ddd_telefone_1);
  const phone2 = formatFullPhone(data.ddd_telefone_2);
  const fax = formatFullPhone(data.ddd_fax);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Endereço */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Endereço Cadastral</span>
          </h3>

          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={() => handleCopy(fullAddress, 'Endereço')}
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              title="Copiar endereço completo"
            >
              {copiedItem === 'Endereço' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>Copiar</span>
            </button>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver no Maps</span>
            </a>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-xs text-slate-500 font-medium">Logradouro e Número</span>
            <p className="font-semibold text-slate-900 text-base">
              {data.descricao_tipo_de_logradouro ? `${data.descricao_tipo_de_logradouro} ` : ''}
              {data.logradouro}, {data.numero || 'S/N'}
            </p>
          </div>

          {data.complemento && (
            <div>
              <span className="text-xs text-slate-500 font-medium">Complemento</span>
              <p className="text-slate-800">{data.complemento}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Bairro</span>
              <p className="font-medium text-slate-800">{data.bairro || '-'}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">CEP</span>
              <p className="font-mono font-medium text-slate-800 tabular-nums">
                {formatCEP(data.cep)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Município / UF</span>
              <p className="font-medium text-slate-800">
                {data.municipio} - {data.uf}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Código IBGE</span>
              <p className="font-mono text-xs text-slate-600 tabular-nums">
                {data.codigo_municipio_ibge || data.codigo_municipio || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contato Oficial */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Canais de Contato</span>
          </h3>
        </div>

        <div className="space-y-4 text-sm">
          {/* Telefones */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500">Telefones Registrados</span>
            
            {phone1 ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {phone1}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 no-print">
                  <a
                    href={`tel:${data.ddd_telefone_1?.replace(/\D/g, '')}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 hover:bg-white rounded transition-colors"
                  >
                    Ligar
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(phone1, 'Telefone')}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Copiar telefone"
                  >
                    {copiedItem === 'Telefone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Nenhum telefone principal informado.</p>
            )}

            {phone2 && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="font-mono text-slate-900 tabular-nums">
                    {phone2}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(phone2, 'Telefone 2')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors no-print"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {fax && (
              <div className="text-xs text-slate-600 flex items-center gap-2 pt-1">
                <span className="text-slate-400">Fax:</span>
                <span className="font-mono tabular-nums">{fax}</span>
              </div>
            )}
          </div>

          {/* E-mail */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">E-mail Institucional</span>
            {data.email ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-medium text-slate-900 truncate">
                    {data.email.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 no-print">
                  <a
                    href={`mailto:${data.email.toLowerCase()}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 hover:bg-white rounded transition-colors"
                  >
                    Enviar
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(data.email!.toLowerCase(), 'E-mail')}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Copiar e-mail"
                  >
                    {copiedItem === 'E-mail' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">E-mail não declarado na Receita Federal.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
