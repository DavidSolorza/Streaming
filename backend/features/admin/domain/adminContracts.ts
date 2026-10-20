export interface StoreConfigDTO {
  whatsappNumber: string;
  nequiNumber: string;
  nequiHolder: string;
  bancolombiaAccount: string;
  bancolombiaHolder: string;
  daviplataNumber: string;
  daviplataHolder: string;
}

export interface IAdminRepository {
  getStoreConfig(): StoreConfigDTO;
  updateStoreConfig(config: Partial<StoreConfigDTO>): StoreConfigDTO;
  getAdminPasswordHash(): string;
  setAdminPassword(hash: string): void;
}
