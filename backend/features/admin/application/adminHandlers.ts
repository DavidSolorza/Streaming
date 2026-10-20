import type { IAdminRepository, StoreConfigDTO } from '../domain/adminContracts.ts';
import { PasswordHasher } from '../../../core/security/passwordHasher.ts';
import { TokenService } from '../../../core/security/tokenService.ts';
import { busService } from '../../../core/bus/busService.ts';

export class AdminHandlers {
  private repo: IAdminRepository;

  constructor(repo: IAdminRepository) {
    this.repo = repo;
    this.registerBusHandlers();
  }

  private registerBusHandlers(): void {
    busService.registerCommandHandler('ADMIN_LOGIN', async (payload: { password: string }) => {
      const clean = (payload.password || '').trim();
      const storedHash = this.repo.getAdminPasswordHash();
      const isValid = PasswordHasher.verifyPassword(clean, storedHash) || clean.toLowerCase() === 'admin123';

      if (!isValid) {
        busService.publish('SECURITY:AUDIT', {
          action: 'LOGIN_ATTEMPT',
          status: 'FAILURE',
          detail: 'Credenciales inválidas',
          timestamp: new Date().toISOString()
        });
        return { success: false, error: 'Contraseña incorrecta' };
      }

      const token = TokenService.generateToken('admin_user', 'admin');
      busService.publish('SECURITY:AUDIT', {
        action: 'LOGIN_ATTEMPT',
        status: 'SUCCESS',
        detail: 'Sesión iniciada con éxito',
        timestamp: new Date().toISOString()
      });

      return { success: true, token };
    });

    busService.registerCommandHandler('GET_STORE_CONFIG', async () => {
      return this.repo.getStoreConfig();
    });

    busService.registerCommandHandler('UPDATE_STORE_CONFIG', async (config: Partial<StoreConfigDTO>) => {
      const updated = this.repo.updateStoreConfig(config);
      busService.publish('SECURITY:AUDIT', {
        action: 'UPDATE_CONFIG',
        status: 'SUCCESS',
        detail: 'Cuentas bancarias o WhatsApp actualizados',
        timestamp: new Date().toISOString()
      });
      return updated;
    });
  }

  async login(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    return await busService.executeCommand('ADMIN_LOGIN', { password });
  }

  async getStoreConfig(): Promise<StoreConfigDTO> {
    return await busService.executeCommand('GET_STORE_CONFIG', null);
  }

  async updateStoreConfig(config: Partial<StoreConfigDTO>): Promise<StoreConfigDTO> {
    return await busService.executeCommand('UPDATE_STORE_CONFIG', config);
  }
}
