import { CNPJResponse } from '../types/cnpj';

/**
 * Removes non-numeric characters from CNPJ string
 */
export function cleanCNPJ(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formats a raw 14-digit string to 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const digits = cleanCNPJ(value);
  if (!digits) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Formats CEP to 00000-000
 */
export function formatCEP(cep: string | number | undefined): string {
  if (!cep) return '-';
  const clean = String(cep).replace(/\D/g, '').padStart(8, '0');
  if (clean.length !== 8) return String(cep);
  return `${clean.slice(0, 5)}-${clean.slice(5)}`;
}

/**
 * Validates CNPJ using official Brazilian check digits algorithm
 */
export function isValidCNPJ(cnpjInput: string): boolean {
  const cnpj = cleanCNPJ(cnpjInput);

  if (cnpj.length !== 14) return false;

  // Check for repeated identical characters (00000000000000, 11111111111111, etc.)
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  // Validate first check digit
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;

  // Validate second check digit
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(1))) return false;

  return true;
}

/**
 * Formats currency to Brazilian Real format
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats date from YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return dateStr;
}

/**
 * Calculates years/months since opening date
 */
export function calculateAge(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return '';

  const start = new Date(year, month - 1, day);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < start.getDate())) {
    years--;
    months += 12;
  }

  if (years <= 0) {
    return months <= 1 ? 'Menos de 1 mês' : `${months} meses`;
  }
  return years === 1 ? '1 ano' : `${years} anos`;
}

/**
 * Formats telephone cleanly whether it comes as 10 digits (DDD+8), 11 digits (DDD+9), or standard length
 */
export function formatFullPhone(phoneStr: string | null | undefined): string | null {
  if (!phoneStr) return null;
  const digits = phoneStr.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.length === 11) {
    // DDD + 9 digits: (XX) 9XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    // DDD + 8 digits: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 9) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return phoneStr;
}

/**
 * Returns formatted full address string
 */
export function formatFullAddress(data: CNPJResponse): string {
  const parts: string[] = [];

  const street = [
    data.descricao_tipo_de_logradouro ? `${data.descricao_tipo_de_logradouro} ` : '',
    data.logradouro,
    data.numero ? `, ${data.numero}` : '',
    data.complemento ? ` (${data.complemento})` : '',
  ].join('');

  if (street.trim()) parts.push(street.trim());
  if (data.bairro) parts.push(`Bairro: ${data.bairro}`);
  if (data.municipio && data.uf) parts.push(`${data.municipio} - ${data.uf}`);
  if (data.cep) parts.push(`CEP: ${formatCEP(data.cep)}`);

  return parts.join(', ');
}

/**
 * Formats telephone (legacy backward compatibility)
 */
export function formatPhone(ddd: string | undefined, phone: string | undefined): string {
  if (!phone && !ddd) return '-';
  const combined = `${ddd || ''}${phone || ''}`;
  const formatted = formatFullPhone(combined);
  return formatted || '-';
}

/**
 * Generates an executive text summary of company data for easy clipboard copying
 */
export function generateFormattedSummary(data: CNPJResponse): string {
  const phone1 = formatFullPhone(data.ddd_telefone_1);
  const phone2 = formatFullPhone(data.ddd_telefone_2);
  const phones = [phone1, phone2].filter(Boolean).join(' / ') || 'Não informado na Receita';

  const lines = [
    `RELATÓRIO DE CONSULTA CADASTRAL - CNPJ`,
    `Fonte: BrasilAPI / Receita Federal`,
    `----------------------------------------`,
    `CNPJ: ${formatCNPJ(data.cnpj)}`,
    `Razão Social: ${data.razao_social}`,
    `Nome Fantasia: ${data.nome_fantasia || 'Não informado'}`,
    `Situação Cadastral: ${data.descricao_situacao_cadastral} (em ${formatDate(data.data_situacao_cadastral)})`,
    `Tipo: ${data.descricao_identificador_matriz_filial}`,
    `Data de Início da Atividade: ${formatDate(data.data_inicio_atividade)} (${calculateAge(data.data_inicio_atividade)})`,
    `Porte: ${data.porte}`,
    `Natureza Jurídica: ${data.natureza_juridica} (${data.codigo_natureza_juridica})`,
    `Capital Social: ${formatCurrency(data.capital_social)}`,
    ``,
    `CONTATO E LOCALIZAÇÃO:`,
    `E-mail: ${data.email || 'Não informado na Receita Federal'}`,
    `Telefone: ${phones}`,
    `Endereço: ${formatFullAddress(data)}`,
    ``,
    `ATIVIDADE PRINCIPAL (CNAE):`,
    `${data.cnae_fiscal} - ${data.cnae_fiscal_descricao}`,
    ``,
    `ENQUADRAMENTO TRIBUTÁRIO:`,
    `Optante pelo Simples Nacional: ${data.opcao_pelo_simples ? 'Sim' : 'Não'}`,
    `Optante pelo MEI: ${data.opcao_pelo_mei ? 'Sim' : 'Não'}`,
  ];

  if (data.qsa && data.qsa.length > 0) {
    lines.push(``);
    lines.push(`QUADRO SOCIETÁRIO (${data.qsa.length}):`);
    data.qsa.forEach((s) => {
      lines.push(`- ${s.nome_socio} (${s.qualificacao_socio}) | CPF/CNPJ: ${s.cnpj_cpf_do_socio}`);
    });
  }

  return lines.join('\n');
}
