import { CustomerProfile } from '../domain/entities/CustomerProfile';

const CUSTOMER_PROFILE_KEY = 'cuentas_jp_customer_profile';

export class CustomerProfileStorage {
  static getProfile(): CustomerProfile {
    try {
      const data = localStorage.getItem(CUSTOMER_PROFILE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          name: parsed.name || '',
          contact: parsed.contact || '',
          rememberMe: parsed.rememberMe ?? true,
        };
      }
    } catch {}
    return { name: '', contact: '', rememberMe: true };
  }

  static saveProfile(profile: CustomerProfile): void {
    try {
      if (profile.rememberMe) {
        localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(CUSTOMER_PROFILE_KEY);
      }
    } catch (e) {
      console.warn('Error al guardar perfil de cliente:', e);
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(CUSTOMER_PROFILE_KEY);
    } catch {}
  }
}
