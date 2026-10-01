export interface CNAEItem {
  codigo: number;
  descricao: string;
}

export interface QSAMember {
  nome_socio: string;
  cnpj_cpf_do_socio: string;
  qualificacao_socio: string;
  codigo_qualificacao_socio?: number;
  data_entrada_sociedade: string;
  faixa_etaria?: string;
  codigo_faixa_etaria?: number;
  pais?: string | null;
  codigo_pais?: number | null;
  identificador_de_socio?: number;
  cpf_representante_legal?: string;
  nome_representante_legal?: string;
  qualificacao_representante_legal?: string;
  codigo_qualificacao_representante_legal?: number;
}

export interface TaxRegime {
  ano: number;
  forma_de_tributacao: string;
  quantidade_de_escrituracoes: number;
  cnpj_da_scp?: string | null;
}

export interface CNPJResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  descricao_motivo_situacao_cadastral: string;
  identificador_matriz_filial: number;
  descricao_identificador_matriz_filial: string;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  cnaes_secundarios?: CNAEItem[];
  natureza_juridica: string;
  codigo_natureza_juridica: number;
  porte: string;
  codigo_porte: number;
  capital_social: number;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  codigo_municipio?: number;
  codigo_municipio_ibge?: number;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string;
  ddd_fax?: string;
  email?: string | null;
  opcao_pelo_simples?: boolean | null;
  data_opcao_pelo_simples?: string | null;
  data_exclusao_do_simples?: string | null;
  opcao_pelo_mei?: boolean | null;
  data_opcao_pelo_mei?: string | null;
  data_exclusao_do_mei?: string | null;
  qsa?: QSAMember[];
  regime_tributario?: TaxRegime[];
  situacao_especial?: string;
  data_situacao_especial?: string | null;
  ente_federativo_responsavel?: string;
  qualificacao_do_responsavel?: number;
  descricao_tipo_de_logradouro?: string;
}

export interface SearchHistoryItem {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  situacao: string;
  municipio: string;
  uf: string;
  searchedAt: number;
}
