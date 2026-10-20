import crypto from 'node:crypto';

export class PasswordHasher {
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    try {
      if (!storedHash.includes(':')) {
        // Soporte legacy o fallback simple en desarrollo inicial
        const a = Buffer.from(password);
        const b = Buffer.from(storedHash);
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
      }

      const [salt, key] = storedHash.split(':');
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKey = crypto.scryptSync(password, salt, 64);

      return crypto.timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }
}
