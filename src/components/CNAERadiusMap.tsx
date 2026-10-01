// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Circle,
  useMap,
  useMapsLibrary,
  ControlPosition,
  MapControl,
} from '@vis.gl/react-google-maps';
import {
  Search,
  MapPin,
  Sliders,
  Building2,
  Navigation,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { POPULAR_CNAES, CNAECategory } from '../data/cnaeCategories';
import { CNPJResponse } from '../types/cnpj';

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  distanceKm: number;
  rating?: number;
  types?: string[];
}

interface CNAERadiusMapProps {
  apiKey: string;
  activeCompany?: CNPJResponse | null;
  onConsultCNPJByName?: (name: string) => void;
  onShowToast: (msg: string) => void;
}

// Default fallback center: Praça da Sé, São Paulo, SP
const DEFAULT_CENTER = { lat: -23.55052, lng: -46.633308 };

// Calculate distance between two lat/lng coordinates in km using Haversine formula
function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Inner map child to access useMap
const MapContent: React.FC<{
  center: { lat: number; lng: number };
  radiusMeters: number;
  places: PlaceResult[];
  selectedPlace: PlaceResult | null;
  onSelectPlace: (place: PlaceResult | null) => void;
  onConsultCNPJByName?: (name: string) => void;
}> = ({
  center,
  radiusMeters,
  places,
  selectedPlace,
  onSelectPlace,
  onConsultCNPJByName,
}) => {
  const map = useMap();

  // Adjust map viewport to cover circle radius whenever center or radius changes
  useEffect(() => {
    if (!map) return;
    map.panTo(center);
  }, [map, center]);

  const coverageAreaKm2 = (Math.PI * Math.pow(radiusMeters / 1000, 2)).toFixed(1);

  return (
    <>
      {/* Search Center Origin Marker */}
      <AdvancedMarker
        position={center}
        title="Centro da Busca (Clique no mapa para mover)"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-lg text-white group cursor-pointer hover:scale-110 transition-transform">
          <Navigation className="w-4 h-4 text-emerald-400 rotate-45" />
        </div>
      </AdvancedMarker>

      {/* Radius Circle Overlay */}
      <Circle
        center={center}
        radius={radiusMeters}
        strokeColor="#059669"
        strokeOpacity={0.9}
        strokeWeight={2}
        fillColor="#10b981"
        fillOpacity={0.16}
        editable={false}
      />

      {/* Found Establishments Markers */}
      {places.map((place) => (
        <AdvancedMarker
          key={place.id}
          position={place.location}
          title={place.name}
          onClick={() => onSelectPlace(place)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md text-white cursor-pointer hover:scale-115 transition-transform hover:bg-emerald-700">
            <Building2 className="w-4 h-4" />
          </div>
        </AdvancedMarker>
      ))}

      {/* InfoWindow for Selected Place */}
      {selectedPlace && (
        <InfoWindow
          position={selectedPlace.location}
          onCloseClick={() => onSelectPlace(null)}
        >
          <div className="p-1 max-w-xs space-y-2 text-slate-900 font-sans">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {selectedPlace.distanceKm} km do centro
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {selectedPlace.name}
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedPlace.address || 'Endereço não disponível'}
            </p>

            {selectedPlace.rating && (
              <p className="text-xs text-amber-700 font-medium">
                ★ {selectedPlace.rating.toFixed(1)} no Google
              </p>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${selectedPlace.name} ${selectedPlace.address}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {onConsultCNPJByName && (
                <button
                  type="button"
                  onClick={() => onConsultCNPJByName(selectedPlace.name)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
                >
                  Consultar CNPJ
                </button>
              )}
            </div>
          </div>
        </InfoWindow>
      )}

      {/* Map Control: Quick Legend Bar */}
      <MapControl position={ControlPosition.BOTTOM_LEFT}>
        <div className="m-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-white" />
            <span className="font-medium">Centro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white" />
            <span className="font-medium">Empresas ({places.length})</span>
          </div>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-mono">Área: {coverageAreaKm2} km²</span>
        </div>
      </MapControl>
    </>
  );
};

const CNAERadiusMapInner: React.FC<CNAERadiusMapProps> = ({
  activeCompany,
  onConsultCNPJByName,
  onShowToast,
}) => {
  const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
  const [centerLabel, setCenterLabel] = useState<string>('São Paulo, SP');
  const [radiusMeters, setRadiusMeters] = useState<number>(3000); // 3 km default
  const [selectedCNAE, setSelectedCNAE] = useState<CNAECategory | null>(POPULAR_CNAES[0]);
  const [customKeyword, setCustomKeyword] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);

  const placesLib = useMapsLibrary('places');

  // If a company is already selected, try to set its location when component mounts
  useEffect(() => {
    if (activeCompany && activeCompany.municipio) {
      setCenterLabel(`${activeCompany.razao_social} (${activeCompany.municipio}/${activeCompany.uf})`);

      // If active company has CNAE, find match or set custom keyword
      if (activeCompany.cnae_fiscal && activeCompany.cnae_fiscal_descricao) {
        setCustomKeyword(activeCompany.cnae_fiscal_descricao);
      }
    }
  }, [activeCompany]);

  // Radius preset options in kilometers
  const RADIUS_PRESETS = [
    { label: '1 km', value: 1000 },
    { label: '3 km', value: 3000 },
    { label: '5 km', value: 5000 },
    { label: '10 km', value: 10000 },
    { label: '20 km', value: 20000 },
    { label: '50 km', value: 50000 },
  ];

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      onShowToast('Geolocalização não é suportada neste navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenter(newCoords);
        setCenterLabel('Sua localização atual');
        onShowToast('Centro ajustado para sua localização atual!');
      },
      () => {
        onShowToast('Não foi possível obter sua localização.');
      },
      { timeout: 8000 }
    );
  };

  // Search places using modern Places API New (Place.searchByText)
  const handlePerformSearch = useCallback(async () => {
    if (!placesLib) {
      onShowToast('Carregando biblioteca Places do Google Maps...');
      return;
    }

    setIsSearching(true);
    setSelectedPlace(null);

    try {
      const { Place } = placesLib as any;

      // Determine query text based on CNAE or custom keyword
      const queryText = customKeyword.trim()
        ? customKeyword.trim()
        : selectedCNAE
        ? selectedCNAE.searchKeywords
        : 'empresas';

      const request = {
        textQuery: queryText,
        locationBias: {
          center: center,
          radius: radiusMeters,
        },
        language: 'pt-BR',
        region: 'br',
        maxResultCount: 20,
        fields: ['id', 'displayName', 'formattedAddress', 'location', 'rating', 'types'],
      };

      const response = await Place.searchByText(request);
      const results: PlaceResult[] = [];

      if (response && response.places) {
        for (const p of response.places) {
          if (p.location) {
            const lat = typeof p.location.lat === 'function' ? p.location.lat() : p.location.lat;
            const lng = typeof p.location.lng === 'function' ? p.location.lng() : p.location.lng;

            const dist = computeDistanceKm(center.lat, center.lng, lat, lng);

            // Filter places within or near the radius (allow a small margin)
            if (dist <= (radiusMeters / 1000) * 1.25) {
              results.push({
                id: p.id || `${lat}-${lng}`,
                name: p.displayName || 'Empresa Local',
                address: p.formattedAddress || '',
                location: { lat, lng },
                distanceKm: dist,
                rating: p.rating,
                types: p.types,
              });
            }
          }
        }
      }

      // Sort by proximity
      results.sort((a, b) => a.distanceKm - b.distanceKm);
      setPlaces(results);

      if (results.length === 0) {
        onShowToast(`Nenhum estabelecimento encontrado com este CNAE no raio de ${(radiusMeters / 1000).toFixed(1)} km.`);
      } else {
        onShowToast(`${results.length} empresas encontradas no raio selecionado!`);
      }
    } catch (err: unknown) {
      console.error('Error during Places search:', err);
      const msg = String(err);
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      onShowToast('Erro ao buscar empresas no Google Maps. Verifique os critérios.');
    } finally {
      setIsSearching(false);
    }
  }, [placesLib, center, radiusMeters, selectedCNAE, customKeyword, onShowToast]);

  // Map Click to Change Center
  const handleMapClick = (e: any) => {
    if (e.detail && e.detail.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      setCenter({ lat, lng });
      setCenterLabel(`Ponto marcado (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Controle de Raio de Busca & CNAE no Google Maps
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Defina o raio geográfico e filtre estabelecimentos e empresas pelo ramo de atividade econômica (CNAE).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Usar Minha Localização</span>
            </button>
          </div>
        </div>

        {/* 2-Column Controls: 1. CNAE Selector | 2. Radius Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: CNAE Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Ramo de Atividade (CNAE)</span>
              </label>

              {activeCompany && activeCompany.cnae_fiscal_descricao && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomKeyword(activeCompany.cnae_fiscal_descricao);
                    setSelectedCNAE(null);
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  Usar CNAE da empresa consultada
                </button>
              )}
            </div>

            {/* Quick CNAE Category Select */}
            <select
              value={selectedCNAE?.code || ''}
              onChange={(e) => {
                const found = POPULAR_CNAES.find((c) => c.code === e.target.value);
                setSelectedCNAE(found || null);
                if (found) {
                  setCustomKeyword('');
                }
              }}
              className="w-full py-2.5 px-3.5 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
            >
              <option value="">-- Selecione uma categoria CNAE frequente --</option>
              {POPULAR_CNAES.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  [{cat.code}] {cat.title} ({cat.description.slice(0, 50)}...)
                </option>
              ))}
            </select>

            {/* Free text custom CNAE / Keyword input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customKeyword}
                onChange={(e) => {
                  setCustomKeyword(e.target.value);
                  setSelectedCNAE(null);
                }}
                placeholder="Ou digite outro CNAE, palavra-chave ou atividade..."
                className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>

            {selectedCNAE && !customKeyword && (
              <p className="text-xs text-slate-500 italic">
                {selectedCNAE.description}
              </p>
            )}
          </div>

          {/* Column 2: Radius Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Raio de Busca</span>
              </label>

              <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                {(radiusMeters / 1000).toFixed(1)} km
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1">Predefinições:</span>
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setRadiusMeters(preset.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    radiusMeters === preset.value
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Clique em qualquer ponto do mapa para mudar o centro da pesquisa.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Centro atual: <strong>{centerLabel}</strong></span>
          </div>

          <button
            type="button"
            onClick={handlePerformSearch}
            disabled={isSearching}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            {isSearching ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Buscando no Raio...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Buscar Empresas no Raio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Google Maps Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-[550px] min-h-[450px] w-full relative">
          <Map
            defaultCenter={center}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
            style={{ width: '100%', height: '100%' }}
          >
            <MapContent
              center={center}
              radiusMeters={radiusMeters}
              places={places}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
              onConsultCNPJByName={onConsultCNPJByName}
            />
          </Map>
        </div>
      </div>

      {/* Results List Section */}
      {places.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Empresas Encontradas no Raio de {(radiusMeters / 1000).toFixed(1)} km
              </h3>
              <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {places.length}
              </span>
            </div>
            <span className="text-xs text-slate-500">Ordenadas por proximidade</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedPlace?.id === place.id
                    ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 tabular-nums">
                      {place.distanceKm} km
                    </span>
                    {place.rating && (
                      <span className="text-xs font-semibold text-amber-700">
                        ★ {place.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {place.name}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {place.address}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    Clique para focar no mapa
                  </span>

                  {onConsultCNPJByName && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConsultCNPJByName(place.name);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-900 hover:text-white hover:bg-slate-900 border border-slate-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Consultar CNPJ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CNAERadiusMap: React.FC<CNAERadiusMapProps> = (props) => {
  return (
    <APIProvider apiKey={props.apiKey}>
      <CNAERadiusMapInner {...props} />
    </APIProvider>
  );
};
