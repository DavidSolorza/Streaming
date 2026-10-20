import crypto from 'node:crypto';

export interface TokenPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export class TokenService {
  private static readonly SECRET = process.env.JWT_SECRET || 'streaming_colombia_secure_hmac_secret_key_2026';
  private static readonly DEFAULT_EXPIRATION_HOURS = 24;

  static generateToken(sub: string, role = 'admin'): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.DEFAULT_EXPIRATION_HOURS * 3600;

    const payload: TokenPayload = { sub, role, iat: now, exp };
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.SECRET)
      .update(`${header}.${payloadEncoded}`)
      .digest('base64url');

    return `${header}.${payloadEncoded}.${signature}`;
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [header, payloadEncoded, signature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', this.SECRET)
        .update(`${header}.${payloadEncoded}`)
        .digest('base64url');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
      }

      const payload: TokenPayload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf8'));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return null; // Expirado
      }

      return payload;
    } catch {
      return null;
    }
  }
}
