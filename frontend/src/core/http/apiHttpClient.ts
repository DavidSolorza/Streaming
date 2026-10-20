import { AdminRouteGuard } from '../guardians/adminRouteGuard';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export class ApiHttpClient {
  private static getBaseUrl(): string {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return '/api';
    }
    return 'http://localhost:3001/api';
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = AdminRouteGuard.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const baseUrl = this.getBaseUrl();
      const res = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await res.json();
      return json as ApiResponse<T>;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Error de conexión con el servidor',
        code: 'NETWORK_ERROR'
      };
    }
  }

  static get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}
