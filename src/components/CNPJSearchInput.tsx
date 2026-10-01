import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { cleanCNPJ, formatCNPJ, isValidCNPJ } from '../utils/cnpjUtils';

interface ExampleCompany {
  name: string;
  cnpj: string;
  tag: string;
}

const EXAMPLES: ExampleCompany[] = [
  { name: 'Banco do Brasil', cnpj: '00.000.000/0001-91', tag: 'Financeiro' },
  { name: 'Petrobras', cnpj: '33.000.167/0001-01', tag: 'Energia' },
  { name: 'Magazine Luiza', cnpj: '47.960.950/0001-21', tag: 'Varejo' },
  { name: 'Nubank (Nu Pagamentos)', cnpj: '18.236.120/0001-58', tag: 'Fintech' },
  { name: 'Embraer', cnpj: '07.689.002/0001-89', tag: 'Aeroespacial' },
];

interface CNPJSearchInputProps {
  onSearch: (cnpj: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export const CNPJSearchInput: React.FC<CNPJSearchInputProps> = ({
  onSearch,
  isLoading,
  initialValue = '',
}) => {
  const [value, setValue] = useState(formatCNPJ(initialValue));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValue) {
      setValue(formatCNPJ(initialValue));
    }
  }, [initialValue]);

  const rawDigits = cleanCNPJ(value);
  const isComplete = rawDigits.length === 14;
  const isChecksumValid = isComplete && isValidCNPJ(rawDigits);
  const isInvalidChecksum = isComplete && !isValidCNPJ(rawDigits);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = cleanCNPJ(e.target.value);
    if (raw.length <= 14) {
      setValue(formatCNPJ(raw));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const raw = cleanCNPJ(pasted);
    if (raw) {
      const truncated = raw.slice(0, 14);
      setValue(formatCNPJ(truncated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawDigits) return;
    onSearch(rawDigits);
  };

  const handleClear = () => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectExample = (cnpj: string) => {
    setValue(cnpj);
    onSearch(cleanCNPJ(cnpj));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-xl border border-slate-300 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 shadow-sm transition-all">
          <div className="pl-4 sm:pl-5 pr-2 text-slate-400 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="00.000.000/0000-00"
            className="w-full py-4 text-base sm:text-lg font-mono tracking-wider text-slate-900 placeholder:text-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0 tabular-nums"
            aria-label="Número do CNPJ"
            autoComplete="off"
            spellCheck="false"
          />

          <div className="flex items-center gap-1.5 pr-2 sm:pr-3">
            {/* Realtime validity status icon */}
            {isComplete && (
              <div
                className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                title={
                  isChecksumValid
                    ? 'Dígitos verificadores válidos'
                    : 'Dígitos verificadores inválidos na fórmula da Receita'
                }
              >
                {isChecksumValid ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Válido</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Inválido</span>
                  </span>
                )}
              </div>
            )}

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                title="Limpar campo"
                aria-label="Limpar campo"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || rawDigits.length === 0}
              className="px-4 sm:px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consultando...</span>
                </>
              ) : (
                <span>Consultar</span>
              )}
            </button>
          </div>
        </div>

        {isInvalidChecksum && (
          <p className="mt-2 text-xs text-amber-700 flex items-center gap-1.5 px-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Atenção: Os dígitos informados não conferem com o cálculo oficial do CNPJ. A consulta pode retornar "não encontrado".</span>
          </p>
        )}
      </form>

      {/* Quick Example Suggestions */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-slate-400 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Exemplos rápidos:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.cnpj}
              type="button"
              onClick={() => handleSelectExample(ex.cnpj)}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors hover:border-slate-300"
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
