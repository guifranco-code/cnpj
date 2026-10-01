export interface CNAECategory {
  code: string;
  title: string;
  description: string;
  searchKeywords: string;
  suggestedPlaceType?: string;
  badgeColor?: string;
}

export const POPULAR_CNAES: CNAECategory[] = [
  {
    code: '47.11-3',
    title: 'Supermercados & Varejo',
    description: 'Comércio varejista de mercadorias em geral (Supermercados e Hipermercados)',
    searchKeywords: 'supermercado mercado hipermercado',
    suggestedPlaceType: 'supermarket',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    code: '56.11-2',
    title: 'Restaurantes & Alimentação',
    description: 'Restaurantes, lanchonetes e outros serviços de alimentação e bebidas',
    searchKeywords: 'restaurante lanchonete refeições',
    suggestedPlaceType: 'restaurant',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    code: '47.71-7',
    title: 'Farmácias & Drogarias',
    description: 'Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas',
    searchKeywords: 'farmácia drogaria',
    suggestedPlaceType: 'pharmacy',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    code: '62.01-5',
    title: 'TI & Software',
    description: 'Desenvolvimento de programas de computador sob encomenda e serviços de TI',
    searchKeywords: 'empresa de software tecnologia informática TI',
    suggestedPlaceType: 'point_of_interest',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    code: '64.22-1',
    title: 'Bancos & Finanças',
    description: 'Bancos múltiplos, comerciais e instituições financeiras',
    searchKeywords: 'banco agência bancária cooperativa de crédito',
    suggestedPlaceType: 'bank',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    code: '86.10-1',
    title: 'Hospitais & Saúde',
    description: 'Atividades de atendimento hospitalar, clínicas e saúde integrada',
    searchKeywords: 'hospital clínica médica pronto atendimento saúde',
    suggestedPlaceType: 'hospital',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    code: '45.20-0',
    title: 'Oficinas & Automotivo',
    description: 'Manutenção, reparação de veículos automotores e auto centers',
    searchKeywords: 'oficina mecânica auto center reparação automotiva',
    suggestedPlaceType: 'car_repair',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    code: '68.21-8',
    title: 'Imobiliárias',
    description: 'Intermediação na compra, venda e locação de imóveis',
    searchKeywords: 'imobiliária corretores de imóveis locação venda',
    suggestedPlaceType: 'real_estate_agency',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    code: '47.44-0',
    title: 'Material de Construção',
    description: 'Comércio varejista de materiais de construção em geral',
    searchKeywords: 'material de construção ferragens tintas',
    suggestedPlaceType: 'hardware_store',
    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  {
    code: '47.81-0',
    title: 'Moda & Vestuário',
    description: 'Comércio varejista de artigos do vestuário e acessórios',
    searchKeywords: 'loja de roupas boutique vestuário moda',
    suggestedPlaceType: 'clothing_store',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    code: '96.02-5',
    title: 'Beleza & Estética',
    description: 'Cabeleireiros, manicure, pedicure e serviços de estética',
    searchKeywords: 'salão de beleza barbearia estética manicure',
    suggestedPlaceType: 'beauty_salon',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    code: '69.20-6',
    title: 'Contabilidade & Auditoria',
    description: 'Atividades de contabilidade, consultoria tributária e auditoria',
    searchKeywords: 'escritório de contabilidade assessoria contábil',
    suggestedPlaceType: 'accounting',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
  },
];
