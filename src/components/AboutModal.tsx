import React from 'react';
import { X, ExternalLink, ShieldCheck, Database, Server, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl z-10 space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Sobre a Consulta & BrasilAPI</h3>
            <p className="text-xs text-slate-500">
              Infraestrutura aberta de dados públicos para o ecossistema brasileiro
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="flex gap-3">
            <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900">Origem dos Dados</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Os registros cadastrais são oriundos da base oficial do Cadastro Nacional da Pessoa Jurídica (CNPJ) mantida pela <strong>Secretaria Especial da Receita Federal do Brasil</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Server className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900">O que é a BrasilAPI?</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                A <strong>BrasilAPI</strong> é um projeto open-source comunitário de alta disponibilidade que transforma dados governamentais e de serviços brasileiros em APIs RESTful modernas, rápidas e gratuitas.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900">Segurança & Privacidade</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Todas as consultas utilizam exclusivamente informações públicas de pessoas jurídicas garantidas pela legislação de transparência. Nenhuma consulta é armazenada em servidores proprietários ou comercializada.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <a
            href="https://brasilapi.com.br/docs#tag/CNPJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>Documentação Oficial BrasilAPI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
