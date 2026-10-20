/**
 * Native HTTP Client (Cero SDKs comerciales de terceros según Regla 4.2)
 * Maneja peticiones HTTP RESTful con formateo JSON y errores estructurados.
 */

export interface HttpResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<HttpResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: `Error al consultar endpoint (${response.statusText})`,
          },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Error de conexión de red',
        },
      };
    }
  }

  async post<T, R>(endpoint: string, body: T, headers: Record<string, string> = {}): Promise<HttpResponse<R>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: `Error en petición POST (${response.statusText})`,
          },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Fallo en transmisión de datos',
        },
      };
    }
  }
}

export const httpClient = new HttpClient();
