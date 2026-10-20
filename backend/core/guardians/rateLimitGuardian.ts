import { IncomingMessage, ServerResponse } from 'node:http';

interface ClientTraffic {
  count: number;
  resetTime: number;
}

export class RateLimitGuardian {
  private static trafficMap = new Map<string, ClientTraffic>();
  private static readonly WINDOW_MS = 60 * 1000; // 1 minuto
  private static readonly MAX_REQUESTS = 180; // 180 req/min

  static check(req: IncomingMessage, res: ServerResponse): boolean {
    const ip = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const client = this.trafficMap.get(ip);

    if (!client || now > client.resetTime) {
      this.trafficMap.set(ip, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }

    client.count++;
    if (client.count > this.MAX_REQUESTS) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Demasiadas solicitudes. Por favor espera un momento.',
        code: 'RATE_LIMIT_EXCEEDED'
      }));
      return false;
    }

    return true;
  }
}
