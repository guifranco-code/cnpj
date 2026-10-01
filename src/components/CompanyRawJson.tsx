import React, { useState } from 'react';
import { Code, Copy, Check, Download } from 'lucide-react';
import { CNPJResponse } from '../types/cnpj';

interface CompanyRawJsonProps {
  data: CNPJResponse;
  onShowToast: (msg: string) => void;
}

export const CompanyRawJson: React.FC<CompanyRawJsonProps> = ({
  data,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      onShowToast('JSON copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Falha ao copiar JSON.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cnpj-${data.cnpj}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onShowToast('Arquivo JSON baixado!');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Code className="w-4 h-4 text-emerald-400" />
          <span>brasilapi-cnpj-{data.cnpj}.json</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar</span>
          </button>
        </div>
      </div>

      <div className="p-4 overflow-x-auto max-h-[600px] text-xs font-mono text-slate-200 selection:bg-slate-700">
        <pre className="whitespace-pre">{jsonString}</pre>
      </div>
    </div>
  );
};
