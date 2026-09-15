-- ====================================================================
-- 🌱 DATOS INICIALES (SEED DATA) PARA CLOUDFLARE D1
-- Cuentas de Streaming y Combos en Pesos Colombianos (COP)
-- ====================================================================

-- 1. Insertar Plataformas Principales
INSERT INTO plataformas (id, nombre, categoria, precio, entrega_inmediata, subtitulo, logo_url, activo) VALUES
('netflix', 'Netflix Original 4K', 'CINE', 17000, 1, '1 Pantalla Ultra HD con PIN privado', '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png', 1),
('disney', 'Disney+ Premium', 'CINE', 16000, 1, '4K UHD + ESPN + IMAX Enhanced', '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png', 1),
('max', 'Max (HBO)', 'CINE', 15000, 1, 'Películas Warner, DC y series 4K', '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png', 1),
('prime', 'Amazon Prime Video', 'CINE', 14000, 1, 'Amazon Originals + Envíos Rápidos', '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png', 1),
('crunchyroll', 'Crunchyroll Mega Fan', 'CINE', 12000, 1, 'Simulcast Anime sin anuncios', '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png', 1),
('spotify', 'Spotify Premium', 'MUSICA', 12000, 1, 'Música ilimitada sin anuncios', '/icons/icons8-spotify-color/icons8-spotify-96.png', 1),
('youtube', 'YouTube Premium', 'MUSICA', 13000, 1, 'Sin anuncios + YouTube Music 4K', '/icons/icons8-youtube-color/icons8-youtube-96.png', 1),
('canva', 'Canva Pro Educativo/Teams', 'TRABAJO', 15000, 1, 'Plantillas Pro + Quitar Fondo + IA', '/icons/icons8-canva-color/icons8-canva-96.png', 1),
('capcut', 'CapCut Pro', 'TRABAJO', 18000, 1, 'Efectos Pro + Exportación 4K sin marca', '/icons/icons8-capcut-color/icons8-capcut-96.png', 1),
('gemini', 'Google Gemini Advanced Pro', 'TRABAJO', 22000, 1, 'IA de Última Generación 2TB Drive', '/icons/icons8-google-gemini-color/icons8-google-gemini-96.png', 1),
('iptv', 'IPTV MagisTV Premium 3 Pantallas', 'IPTV', 25000, 1, '+1200 Canales En Vivo + Cine VOD', '/icons/icons8-tv-color/icons8-tv-96.png', 1)
ON CONFLICT(id) DO UPDATE SET
  nombre=excluded.nombre,
  precio=excluded.precio,
  subtitulo=excluded.subtitulo,
  entrega_inmediata=excluded.entrega_inmediata;

-- 2. Insertar Combos Destacados
INSERT INTO combos (nombre, plataformas_nombres, precio, ahorro, destacado, entrega_inmediata) VALUES
('Combo #1 Dúo Estelar', 'Netflix 4K + Disney+ Premium', 29000, 4000, 1, 1),
('Combo #2 Dúo Cine & Deporte', 'Max (HBO) + Disney+ Premium (ESPN)', 27000, 4000, 1, 1),
('Combo #3 Trío Películas Premium', 'Netflix 4K + Max (HBO) + Prime Video', 39000, 7000, 1, 1),
('Combo #4 Pack Pro Creadores', 'Canva Pro + CapCut Pro + Google Gemini AI', 45000, 10000, 0, 1),
('Combo #5 Pack Otaku Anime & Música', 'Crunchyroll Mega Fan + Spotify Premium', 20000, 4000, 0, 1);
