-- ====================================================================
-- 🌱 DATOS INICIALES (SEED DATA) PARA CLOUDFLARE D1 / SQLITE
-- Cuentas de Streaming y Combos en Pesos Colombianos (COP)
-- Total: 16 Plataformas y 28 Combos (44 Productos)
-- ====================================================================

-- 1. Insertar Plataformas Principales (16)
INSERT INTO plataformas (id, nombre, categoria, precio, entrega_inmediata, subtitulo, logo_url, activo) VALUES
('pruebastripe', 'Cuenta Demo / Prueba ($1.000 COP)', 'CINE', 1000, 1, 'Prueba $1.000 COP • Demo Entrega Inmediata', '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png', 1),
('netflix', 'Netflix', 'CINE', 17000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png', 1),
('disney', 'Disney premium', 'CINE', 16000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png', 1),
('max', 'Max', 'CINE', 10000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png', 1),
('prime', 'Prime video', 'CINE', 11000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png', 1),
('paramount', 'Paramount', 'CINE', 15000, 1, 'Entrega Inmediata • 4K UHD', 'simple-icons:paramountplus', 1),
('crunchyroll', 'Crunchyroll', 'CINE', 10000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png', 1),
('plex', 'Plex', 'IPTV', 10000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-primordial-plus-doodle/icons8-primordial-plus-96.png', 1),
('vix', 'Vix', 'CINE', 11000, 1, 'Entrega Inmediata • 4K UHD', 'ph:television-simple-bold', 1),
('canva', 'Canva Pro', 'TRABAJO', 15000, 1, 'Entrega Inmediata • Pro Habilitado', '/icons/icons8-canva-windows-11-color/icons8-canva-96.png', 1),
('capcut', 'Capcut', 'TRABAJO', 22000, 1, 'Entrega Inmediata • Pro Habilitado', 'ph:video-camera-fill', 1),
('gemini', 'Gemini', 'TRABAJO', 18000, 1, 'Entrega Inmediata • Pro Habilitado', 'logos:google-gemini', 1),
('jellyfin', 'Jellyfin', 'IPTV', 15000, 1, 'Entrega Inmediata • 4K UHD', '/icons/jellyfin.png', 1),
('iptv', 'Iptv', 'IPTV', 15000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-primordial-plus-64.png', 1),
('spotify', 'Spotify', 'MUSICA', 15000, 1, 'Entrega Inmediata • Sin Anuncios', '/icons/icons8-spotify-94.png', 1),
('youtube', 'Youtube', 'CINE', 15000, 1, 'Entrega Inmediata • 4K UHD', '/icons/icons8-youtube-color/icons8-youtube-96.png', 1)
ON CONFLICT(id) DO UPDATE SET
  nombre=excluded.nombre,
  categoria=excluded.categoria,
  precio=excluded.precio,
  subtitulo=excluded.subtitulo,
  logo_url=excluded.logo_url,
  activo=1;

-- 2. Insertar Combos Destacados (28)
INSERT INTO combos (nombre, plataformas_nombres, precio, ahorro, destacado, entrega_inmediata) VALUES
('Combo #1 (Netflix original + Disney premium)', 'Netflix original + Disney premium', 32000, 4800, 1, 1),
('Combo #2 (Netflix original + Prime video)', 'Netflix original + Prime video', 23000, 3450, 1, 1),
('Combo #3 (Netflix original + Max)', 'Netflix original + Max', 22000, 3300, 1, 1),
('Combo #4 (Netflix original + Crunchyroll)', 'Netflix original + Crunchyroll', 22000, 3300, 0, 1),
('Combo #5 (Netflix original + Paramount)', 'Netflix original + Paramount', 29000, 4350, 0, 1),
('Combo #6 (Disney premium + Prime video)', 'Disney premium + Prime video', 22000, 3300, 0, 1),
('Combo #7 (Disney premium + Max)', 'Disney premium + Max', 21000, 3150, 0, 1),
('Combo #8 (Disney premium + Paramount)', 'Disney premium + Paramount', 38000, 5700, 0, 1),
('Combo #9 (Prime video + Max)', 'Prime video + Max', 12000, 1800, 0, 1),
('Combo #10 (Prime video + Paramount)', 'Prime video + Paramount', 20000, 3000, 0, 1),
('Combo #11 (Max + Crunchyroll)', 'Max + Crunchyroll', 11000, 1650, 0, 1),
('Combo #12 (Netflix original + Disney premium + Prime video)', 'Netflix original + Disney premium + Prime video', 39000, 5850, 0, 1),
('Combo #13 (Netflix original + Disney premium + Max)', 'Netflix original + Disney premium + Max', 37000, 5550, 0, 1),
('Combo #14 (Netflix original + Disney premium + Crunchyroll)', 'Netflix original + Disney premium + Crunchyroll', 37000, 5550, 0, 1),
('Combo #15 (Netflix original + Prime video + Max)', 'Netflix original + Prime video + Max', 28000, 4200, 0, 1),
('Combo #16 (Netflix original + Prime video + Crunchyroll)', 'Netflix original + Prime video + Crunchyroll', 28000, 4200, 0, 1),
('Combo #17 (Netflix original + Prime video + Paramount)', 'Netflix original + Prime video + Paramount', 35000, 5250, 0, 1),
('Combo #18 (Disney premium + Prime video + Max)', 'Disney premium + Prime video + Max', 27000, 4050, 0, 1),
('Combo #19 (Disney premium + Prime video + Crunchyroll)', 'Disney premium + Prime video + Crunchyroll', 27000, 4050, 0, 1),
('Combo #20 (Disney premium + Max + Vix)', 'Disney premium + Max + Vix', 29000, 4350, 0, 1),
('Combo #21 (Max + Vix + Prime video)', 'Max + Vix + Prime video', 21000, 3150, 0, 1),
('Combo #22 (Netflix original + Disney premium + Max + Prime video)', 'Netflix original + Disney premium + Max + Prime video', 43000, 6450, 0, 1),
('Combo #23 (Netflix original + Disney premium + Max + Vix)', 'Netflix original + Disney premium + Max + Vix', 44000, 6600, 0, 1),
('Combo #24 (Netflix original + Prime video + Max + Paramount)', 'Netflix original + Prime video + Max + Paramount', 42000, 6300, 0, 1),
('Combo #25 (Prime video + Disney premium + Vix + Paramount)', 'Prime video + Disney premium + Vix + Paramount', 43000, 6450, 0, 1),
('Combo #26 (Disney premium + Max + Prime video + Crunchyroll)', 'Disney premium + Max + Prime video + Crunchyroll', 35000, 5250, 0, 1),
('Combo #27 (Max + Vix + Prime video + Paramount)', 'Max + Vix + Prime video + Paramount', 35000, 5250, 0, 1),
('Combo #28 (Netflix original + Prime video + Paramount + Vix + Max)', 'Netflix original + Prime video + Paramount + Vix + Max', 50000, 7500, 0, 1);
