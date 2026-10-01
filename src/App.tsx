import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Layers,
  MapPin,
  Briefcase,
  Users,
  FileSpreadsheet,
  Code,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CNPJSearchInput } from './components/CNPJSearchInput';
import { CompanyHeader } from './components/CompanyHeader';
import { PrimaryContactCard } from './components/PrimaryContactCard';
import { CompanyOverview } from './components/CompanyOverview';
import { CompanyActivities } from './components/CompanyActivities';
import { CompanyLocation } from './components/CompanyLocation';
import { CompanyQSA } from './components/CompanyQSA';
import { CompanyTaxRegime } from './components/CompanyTaxRegime';
import { CompanyRawJson } from './components/CompanyRawJson';
import { SearchHistory } from './components/SearchHistory';
import { AboutModal } from './components/AboutModal';
import { Toast } from './components/Toast';
import { GoogleMapsQuotaBanner } from './components/GoogleMapsQuotaBanner';
import { CNAERadiusMap } from './components/CNAERadiusMap';
import { CNPJResponse, SearchHistoryItem } from './types/cnpj';
import { fetchCNPJ, BrasilApiError } from './services/brasilApi';
import { cleanCNPJ, formatCNPJ } from './utils/cnpjUtils';

type ActiveTab = 'visao-geral' | 'atividades' | 'localizacao' | 'qsa' | 'tributario' | 'json';

const STORAGE_KEY = 'consulta_cnpj_history_v1';
const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCtZ_6Hae23S4pC_5UugMJcJkBFF1MFgBg';

export default function App() {
  const [mode, setMode] = useState<'cnpj' | 'map'>('cnpj');
  const [data, setData] = useState<CNPJResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('visao-geral');
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSearchedCnpj, setLastSearchedCnpj] = useState<string>('');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const saveToHistory = useCallback((company: CNPJResponse) => {
    setHistoryItems((prev) => {
      const clean = cleanCNPJ(company.cnpj);
      const filtered = prev.filter((item) => cleanCNPJ(item.cnpj) !== clean);
      const newItem: SearchHistoryItem = {
        id: `${clean}-${Date.now()}`,
        cnpj: clean,
        razao_social: company.razao_social,
        nome_fantasia: company.nome_fantasia,
        situacao: company.descricao_situacao_cadastral,
        municipio: company.municipio,
        uf: company.uf,
        searchedAt: Date.now(),
      };
      const updated = [newItem, ...filtered].slice(0, 25);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  }, []);

  const handleSearch = useCallback(
    async (cnpjInput: string) => {
      const clean = cleanCNPJ(cnpjInput);
      if (!clean) return;

      if (clean.length !== 14) {
        setError('O CNPJ deve conter exatamente 14 dígitos numéricos.');
        return;
      }

      setLoading(true);
      setError(null);
      setLastSearchedCnpj(clean);

      // Update URL query parameter without full page reload
      const url = new URL(window.location.href);
      url.searchParams.set('cnpj', clean);
      window.history.pushState({}, '', url.toString());

      try {
        const result = await fetchCNPJ(clean);
        setData(result);
        saveToHistory(result);
      } catch (err: unknown) {
        if (err instanceof BrasilApiError) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro inesperado ao consultar o CNPJ. Tente novamente.');
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [saveToHistory]
  );

  // Read URL query parameter on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cnpjParam = params.get('cnpj');
    if (cnpjParam) {
      const clean = cleanCNPJ(cnpjParam);
      if (clean.length === 14) {
        handleSearch(clean);
      }
    }
  }, [handleSearch]);

  const handlePrint = () => {
    window.print();
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistoryItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    showToast('Item removido do histórico.');
  };

  const handleClearAllHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Histórico limpo com sucesso.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <GoogleMapsQuotaBanner />

      <Navbar
        currentMode={mode}
        onSelectMode={setMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onPrint={handlePrint}
        hasData={!!data}
        historyCount={historyItems.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {mode === 'map' ? (
          /* Google Maps CNAE Radius View */
          <div className="space-y-6">
            <CNAERadiusMap
              apiKey={GOOGLE_MAPS_API_KEY}
              activeCompany={data}
              onConsultCNPJByName={(name) => {
                setMode('cnpj');
                showToast(`Para ${name}, informe o CNPJ de 14 dígitos.`);
              }}
              onShowToast={showToast}
            />
          </div>
        ) : (
          /* CNPJ Consultation View */
          <>
            {/* Top Search Area */}
            <section id="consulta" className="space-y-4 no-print text-center pt-2 pb-4">
              <div className="max-w-2xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                  Consulta Cadastral de Empresas no Brasil
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  Retorna <strong>E-mail</strong>, <strong>Telefone</strong>, <strong>Endereço completo</strong>, CNAE e Sócios via{' '}
                  <button
                    type="button"
                    onClick={() => setIsAboutOpen(true)}
                    className="underline font-semibold hover:text-emerald-700 decoration-slate-300 transition-colors"
                  >
                    BrasilAPI
                  </button>
                  .
                </p>
              </div>

              <CNPJSearchInput
                onSearch={handleSearch}
                isLoading={loading}
                initialValue={lastSearchedCnpj}
              />
            </section>

            {/* Error Alert Box */}
            {error && !loading && (
              <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-sm text-red-900 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-red-950">Não foi possível consultar este CNPJ</h4>
                    <p className="text-xs sm:text-sm text-red-800 leading-relaxed">{error}</p>
                  </div>

                  {lastSearchedCnpj && (
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSearch(lastSearchedCnpj)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-900 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Tentar Novamente</span>
                      </button>
                      <span className="text-xs text-red-600">
                        CNPJ testado: <span className="font-mono font-medium">{formatCNPJ(lastSearchedCnpj)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
                <div className="h-44 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="h-6 w-32 bg-slate-200 rounded-full" />
                  <div className="h-8 w-2/3 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-1/3 bg-slate-200 rounded" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                      <div className="h-7 w-32 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Populated Result View */}
            {data && !loading && (
              <div className="space-y-6">
                {/* Main Company Header Card */}
                <CompanyHeader
                  data={data}
                  onShowToast={showToast}
                  onPrint={handlePrint}
                  onOpenMap={() => setMode('map')}
                />

                {/* Prominent Contact & Address Highlight Card (E-mail, Telefone, Endereço) */}
                <PrimaryContactCard
                  data={data}
                  onShowToast={showToast}
                  onOpenMap={() => setMode('map')}
                />

                {/* Interactive Navigation Tabs */}
            <div className="no-print border-b border-slate-200 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1 sm:gap-2 min-w-max pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('visao-geral')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'visao-geral'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Visão Geral</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('atividades')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'atividades'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Atividades (CNAE)</span>
                  {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full ${
                        activeTab === 'atividades'
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {data.cnaes_secundarios.length + 1}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('localizacao')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'localizacao'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Localização & Contato</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qsa')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'qsa'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Sócios e Administradores</span>
                  {data.qsa && data.qsa.length > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full ${
                        activeTab === 'qsa'
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {data.qsa.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tributario')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'tributario'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Tributário & Simples</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('json')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'json'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>JSON Bruto</span>
                </button>
              </div>
            </div>

            {/* Tab Panels */}
            <div className="transition-all">
              {activeTab === 'visao-geral' && <CompanyOverview data={data} />}
              {activeTab === 'atividades' && (
                <CompanyActivities data={data} onShowToast={showToast} />
              )}
              {activeTab === 'localizacao' && (
                <CompanyLocation data={data} onShowToast={showToast} />
              )}
              {activeTab === 'qsa' && <CompanyQSA data={data} />}
              {activeTab === 'tributario' && <CompanyTaxRegime data={data} />}
              {activeTab === 'json' && (
                <CompanyRawJson data={data} onShowToast={showToast} />
              )}
            </div>

            {/* Print-only complete dossier layout */}
            <div className="hidden print:block space-y-6 pt-4">
              <CompanyOverview data={data} />
              <CompanyActivities data={data} onShowToast={showToast} />
              <CompanyLocation data={data} onShowToast={showToast} />
              <CompanyQSA data={data} />
              <CompanyTaxRegime data={data} />
            </div>
          </div>
        )}

        {/* Empty State before any search */}
        {!data && !loading && !error && (
          <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto text-slate-700">
              <Building2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Digite um CNPJ para visualizar a ficha cadastral
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Consulte dados completos como razão social, situação na Receita Federal, capital social, endereço, telefones, CNAE e quadro societário.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dados 100% públicos e em conformidade com a LGPD</span>
            </div>
          </div>
        )}
        </>
      )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto no-print text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Consulta CNPJ</span>
            <span>·</span>
            <span>Alimentado por BrasilAPI & Receita Federal do Brasil</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Sobre a API
            </button>
            <a
              href="https://brasilapi.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <span>BrasilAPI.com.br</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <SearchHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelect={handleSearch}
        onRemove={handleRemoveHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
