import http from 'node:http';
import { SQLiteClient } from './core/db/sqliteClient.ts';
import { SchemaInitializer } from './core/db/schemaInitializer.ts';
import { CorsGuardian } from './core/guardians/corsGuardian.ts';
import { RateLimitGuardian } from './core/guardians/rateLimitGuardian.ts';
import { OrderAuditReceptor } from './core/receptors/orderAuditReceptor.ts';
import { PlatformChangeReceptor } from './core/receptors/platformChangeReceptor.ts';
import { SQLiteCatalogRepository } from './features/catalog/infrastructure/sqliteCatalogRepository.ts';
import { CatalogHandlers } from './features/catalog/application/catalogHandlers.ts';
import { SQLiteOrderRepository } from './features/orders/infrastructure/sqliteOrderRepository.ts';
import { OrderHandlers } from './features/orders/application/orderHandlers.ts';
import { CheckoutService } from './features/orders/application/checkoutService.ts';
import { SQLiteAdminRepository } from './features/admin/infrastructure/sqliteAdminRepository.ts';
import { AdminHandlers } from './features/admin/application/adminHandlers.ts';
import { SQLiteReviewRepository } from './features/reviews/infrastructure/sqliteReviewRepository.ts';
import { ReviewHandlers } from './features/reviews/application/reviewHandlers.ts';
import { ServerRouter } from './router.ts';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

function bootstrap() {
  console.log('[Server] Inicializando base de datos SQLite...');
  const db = SQLiteClient.getInstance();
  SchemaInitializer.initialize(db);

  console.log('[Server] Registrando Receptores del Bus Service...');
  OrderAuditReceptor.register();
  PlatformChangeReceptor.register();

  console.log('[Server] Configurando Inyección de Dependencias (Composition Root)...');
  const adminRepo = new SQLiteAdminRepository();
  const adminHandlers = new AdminHandlers(adminRepo);

  const catalogRepo = new SQLiteCatalogRepository();
  const catalogHandlers = new CatalogHandlers(catalogRepo, adminRepo);

  const orderRepo = new SQLiteOrderRepository();
  const orderHandlers = new OrderHandlers(orderRepo);
  const checkoutService = new CheckoutService(orderRepo, adminRepo);

  const reviewRepo = new SQLiteReviewRepository();
  const reviewHandlers = new ReviewHandlers(reviewRepo);

  const router = new ServerRouter(catalogHandlers, orderHandlers, adminHandlers, reviewHandlers, checkoutService);

  const server = http.createServer(async (req, res) => {
    if (CorsGuardian.applySecurityHeaders(req, res)) return;
    if (!RateLimitGuardian.check(req, res)) return;
    await router.handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`[Server] 🚀 Backend SQLite & Bus Service activo en http://localhost:${PORT}`);
  });

  process.on('SIGINT', () => {
    console.log('[Server] Cerrando conexiones SQLite...');
    SQLiteClient.close();
    server.close(() => process.exit(0));
  });
}

bootstrap();
