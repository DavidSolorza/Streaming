import { IncomingMessage, ServerResponse } from 'node:http';
import { TokenService } from '../security/tokenService.ts';
import type { TokenPayload } from '../security/tokenService.ts';

export class AuthGuardian {
  static verify(req: IncomingMessage, res: ServerResponse): TokenPayload | null {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.rejectUnauthorized(res, 'Token de autorización requerido.');
      return null;
    }

    const token = authHeader.substring(7).trim();
    const payload = TokenService.verifyToken(token);

    if (!payload) {
      this.rejectUnauthorized(res, 'Token inválido o expirado.');
      return null;
    }

    return payload;
  }

  private static rejectUnauthorized(res: ServerResponse, message: string): void {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: message,
      code: 'UNAUTHORIZED'
    }));
  }
}
