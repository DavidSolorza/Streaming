export interface PaymentConfig {
  storeName: string;
  storeSubtitle: string;
  announcementText: string;
  whatsappNumber: string;
  nequiNumber: string;
  nequiHolder: string;
  bancolombiaAccount: string;
  bancolombiaHolder: string;
  daviplataNumber: string;
  daviplataHolder: string;
  paymentNote?: string;
}

export interface AdminCredentials {
  passwordHash: string; // Plain string or hashed string for local admin session
}
