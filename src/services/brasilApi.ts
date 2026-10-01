import { CNPJResponse } from '../types/cnpj';
import { cleanCNPJ } from '../utils/cnpjUtils';

const cache = new Map<string, CNPJResponse>();

export class BrasilApiError extends Error {
  status?: number;
  type?: string;

  constructor(message: string, status?: number, type?: string) {
    super(message);
    this.name = 'BrasilApiError';
    this.status = status;
    this.type = type;
  }
}

export async function fetchCNPJ(cnpjInput: string): Promise<CNPJResponse> {
  const cnpj = cleanCNPJ(cnpjInput);

  if (cnpj.length !== 14) {
    throw new BrasilApiError('O CNPJ deve conter exatamente 14 dígitos numéricos.', 400);
  }

  // Check in-memory cache
  if (cache.has(cnpj)) {
    return cache.get(cnpj)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    let response: Response;
    try {
      response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });
    } catch {
      // If direct request failed (e.g. adblocker, local network restrictions), try local dev proxy
      response = await fetch(`/api/brasilapi/api/cnpj/v1/${cnpj}`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Erro na consulta (Código ${response.status}).`;
      let errorType = 'unknown';

      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.type) {
          errorType = errorData.type;
        }
      } catch {
        if (response.status === 404) {
          errorMessage = 'CNPJ não encontrado na base de dados da Receita Federal via BrasilAPI.';
        } else if (response.status === 429) {
          errorMessage = 'Limite de requisições excedido temporariamente. Aguarde alguns instantes.';
        } else if (response.status >= 500) {
          errorMessage = 'Instabilidade temporária nos servidores da BrasilAPI ou Receita Federal.';
        }
      }

      throw new BrasilApiError(errorMessage, response.status, errorType);
    }

    const data: CNPJResponse = await response.json();

    // Cache successful response
    cache.set(cnpj, data);

    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof BrasilApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new BrasilApiError(
        'Tempo limite de resposta excedido. A BrasilAPI demorou para responder. Tente novamente.',
        408
      );
    }

    const message = err instanceof Error ? err.message : 'Falha na conexão de rede com a BrasilAPI.';
    throw new BrasilApiError(`Não foi possível conectar à BrasilAPI: ${message}`);
  }
}
