import { IncomingMessage, ServerResponse } from 'node:http';
import { CatalogHandlers } from './features/catalog/application/catalogHandlers.ts';
import { OrderHandlers } from './features/orders/application/orderHandlers.ts';
import { AdminHandlers } from './features/admin/application/adminHandlers.ts';
import { ReviewHandlers } from './features/reviews/application/reviewHandlers.ts';
import { CheckoutService } from './features/orders/application/checkoutService.ts';
import { AuthGuardian } from './core/guardians/authGuardian.ts';

export class ServerRouter {
  private catalog: CatalogHandlers;
  private orders: OrderHandlers;
  private admin: AdminHandlers;
  private reviews: ReviewHandlers;
  private checkout: CheckoutService;

  constructor(
    catalog: CatalogHandlers,
    orders: OrderHandlers,
    admin: AdminHandlers,
    reviews: ReviewHandlers,
    checkout: CheckoutService
  ) {
    this.catalog = catalog;
    this.orders = orders;
    this.admin = admin;
    this.reviews = reviews;
    this.checkout = checkout;
  }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const path = url.pathname;
    const method = req.method || 'GET';

    try {
      if (path === '/api/catalog' && method === 'GET') {
        const data = await this.catalog.getCatalog();
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/plataformas' && method === 'GET') {
        const { plataformas } = await this.catalog.getCatalog();
        return this.sendJson(res, 200, { success: true, data: plataformas });
      }
      if (path === '/api/combos' && method === 'GET') {
        const { combos } = await this.catalog.getCatalog();
        return this.sendJson(res, 200, { success: true, data: combos });
      }
      if (path === '/api/plataformas' && (method === 'PUT' || method === 'POST')) {
        const auth = AuthGuardian.verify(req, res);
        if (!auth) return;
        const body = await this.readJsonBody(req);
        const data = await this.catalog.updatePlatform(body.id, body.precio, body.activo !== false);
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/orders/checkout' && method === 'POST') {
        const body = await this.readJsonBody(req);
        const data = this.checkout.processCheckout(body.customerName, body.customerContact, body.items);
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/orders' && method === 'POST') {
        const body = await this.readJsonBody(req);
        const data = await this.orders.createOrder(body);
        return this.sendJson(res, 201, { success: true, data });
      }
      if (path === '/api/orders' && method === 'GET') {
        const auth = AuthGuardian.verify(req, res);
        if (!auth) return;
        const data = await this.orders.getAllOrders();
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/stats' && method === 'GET') {
        const data = await this.orders.getOrderStats();
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/reviews' && method === 'GET') {
        const onlyApproved = url.searchParams.get('all') !== 'true';
        const data = await this.reviews.getAllReviews(onlyApproved);
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/reviews' && method === 'POST') {
        const body = await this.readJsonBody(req);
        const data = await this.reviews.createReview(body);
        return this.sendJson(res, 201, { success: true, data });
      }
      if (path.startsWith('/api/reviews/') && (method === 'PUT' || method === 'PATCH')) {
        const id = parseInt(path.replace('/api/reviews/', ''), 10);
        const body = await this.readJsonBody(req);
        const isApproved = body.isApproved !== false;
        const data = await this.reviews.toggleVisibility(id, isApproved);
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path.startsWith('/api/reviews/') && method === 'DELETE') {
        const id = parseInt(path.replace('/api/reviews/', ''), 10);
        const data = await this.reviews.deleteReview(id);
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/admin/login' && method === 'POST') {
        const body = await this.readJsonBody(req);
        const result = await this.admin.login(body.password || '');
        return this.sendJson(res, result.success ? 200 : 401, result);
      }
      if (path === '/api/admin/config' && method === 'GET') {
        const data = await this.admin.getStoreConfig();
        return this.sendJson(res, 200, { success: true, data });
      }
      if (path === '/api/admin/config' && (method === 'PUT' || method === 'POST')) {
        const auth = AuthGuardian.verify(req, res);
        if (!auth) return;
        const body = await this.readJsonBody(req);
        const data = await this.admin.updateStoreConfig(body);
        return this.sendJson(res, 200, { success: true, data });
      }
      this.sendJson(res, 404, { success: false, error: 'Ruta no encontrada', path });
    } catch (err: any) {
      console.error('[Router] Error en petición:', err);
      this.sendJson(res, 500, { success: false, error: err.message || 'Error interno del servidor' });
    }
  }

  private sendJson(res: ServerResponse, status: number, body: any): void {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  }

  private readJsonBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try { resolve(body ? JSON.parse(body) : {}); } catch (e) { reject(new Error('JSON malformado')); }
      });
      req.on('error', reject);
    });
  }
}
