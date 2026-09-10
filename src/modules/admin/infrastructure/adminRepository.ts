import { PaymentConfig } from '../domain/entities/AdminConfig';
import { eventBus } from '@/core/bus/eventBus';

const PAYMENT_CONFIG_KEY = 'cuentas_stream_payment_config_v1';
const ADMIN_PASS_KEY = 'cuentas_stream_admin_pass_v1';
const ADMIN_SESSION_KEY = 'cuentas_stream_admin_session';

export const defaultPaymentConfig: PaymentConfig = {
  storeName: 'Cuentas Stream',
  storeSubtitle: 'Multiplataformas',
  announcementText: '⚡ ENTREGAS INMEDIATAS LAS 24 HORAS EN TODOS LOS SERVICIOS DE STREAMING - SOPORTE 100% GARANTIZADO',
  whatsappNumber: '573214465418',
  nequiNumber: '321 446 5418',
  nequiHolder: 'David Solorza',
  bancolombiaAccount: '912-000452-19',
  bancolombiaHolder: 'David Solorza',
  daviplataNumber: '321 446 5418',
  daviplataHolder: 'David Solorza',
  paymentNote: 'Recuerda enviar el comprobante con tu número de pedido para entrega en menos de 5 minutos.'
};

const DEFAULT_ADMIN_PASS = 'admin123';

export class AdminRepository {
  private static cachedConfig: PaymentConfig | null = null;

  /**
   * Obtiene la configuración de pago y contacto actual (con localStorage)
   */
  static getPaymentConfig(): PaymentConfig {
    if (this.cachedConfig) return this.cachedConfig;

    try {
      const stored = localStorage.getItem(PAYMENT_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cachedConfig = { ...defaultPaymentConfig, ...parsed };
        return this.cachedConfig!;
      }
    } catch (e) {
      console.warn('Error al leer configuración de pago en localStorage:', e);
    }

    this.cachedConfig = { ...defaultPaymentConfig };
    this.savePaymentConfig(this.cachedConfig);
    return this.cachedConfig;
  }

  /**
   * Guarda y sincroniza cambios en la configuración de pago y contacto
   */
  static savePaymentConfig(newConfig: PaymentConfig): PaymentConfig {
    this.cachedConfig = newConfig;
    try {
      localStorage.setItem(PAYMENT_CONFIG_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Error al guardar configuración de pago:', e);
    }
    eventBus.emit('ADMIN:CONFIG_CHANGED', newConfig);
    return newConfig;
  }

  /**
   * Obtiene la contraseña actual de administración
   */
  static getAdminPassword(): string {
    return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASS;
  }

  /**
   * Cambia la contraseña de administración
   */
  static setAdminPassword(newPass: string): void {
    localStorage.setItem(ADMIN_PASS_KEY, newPass);
  }

  /**
   * Verifica la contraseña de administración
   */
  static verifyPassword(passInput: string): boolean {
    const currentPass = this.getAdminPassword();
    return passInput.trim() === currentPass.trim();
  }

  /**
   * Manejo de Sesión Admin
   */
  static isAuthenticated(): boolean {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }

  static login(): void {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }

  static logout(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
