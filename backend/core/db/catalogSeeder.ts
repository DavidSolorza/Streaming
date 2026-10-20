import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export interface RawCatalogItem {
  name: string;
  brand?: string;
  category?: string;
  iconName?: string;
  badges?: string[];
  modes?: {
    pantalla?: { prices?: Record<string, number> };
    cuenta?: { prices?: Record<string, number> };
  };
}

export class CatalogSeeder {
  static seedFromCatalogJson(db: DatabaseSync, jsonPath?: string): { platforms: number; combos: number } {
    const defaultPath = path.resolve(process.cwd(), 'src/modules/catalog/infrastructure/excelCatalogData.json');
    const targetPath = jsonPath || defaultPath;
    if (!fs.existsSync(targetPath)) return { platforms: 0, combos: 0 };

    const items: RawCatalogItem[] = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    let platformCount = 0;
    let comboCount = 0;

    const upsertPlatform = db.prepare(`
      INSERT INTO plataformas (id, nombre, categoria, precio, entrega_inmediata, subtitulo, logo_url, activo)
      VALUES (?, ?, ?, ?, 1, ?, ?, 1)
      ON CONFLICT(id) DO UPDATE SET
        nombre = excluded.nombre,
        categoria = excluded.categoria,
        precio = excluded.precio,
        subtitulo = excluded.subtitulo,
        logo_url = excluded.logo_url,
        activo = 1
    `);

    const upsertCombo = db.prepare(`
      INSERT INTO combos (nombre, plataformas_nombres, precio, ahorro, destacado, entrega_inmediata)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    // Limpiar combos antiguos para evitar duplicados en recarga
    db.exec('DELETE FROM combos');

    for (const item of items) {
      const price = item.modes?.pantalla?.prices?.['1m'] || item.modes?.cuenta?.prices?.['1m'] || 15000;

      if (item.category === 'combo') {
        const platformsMatch = item.name.match(/\((.*?)\)/);
        const platformsNames = platformsMatch ? platformsMatch[1] : item.name;
        const ahorro = Math.round(price * 0.15);
        const destacado = comboCount < 3 ? 1 : 0;
        upsertCombo.run(item.name, platformsNames, price, ahorro, destacado);
        comboCount++;
      } else {
        const id = this.normalizeId(item.name, item.brand);
        const categoria = this.normalizeCategory(item.name, item.category);
        const subtitulo = item.badges?.slice(0, 2).join(' • ') || 'Entrega Inmediata 4K';
        const logoUrl = item.iconName || '/icons/icons8-tv-color/icons8-tv-96.png';

        upsertPlatform.run(id, item.name, categoria, price, subtitulo, logoUrl);
        platformCount++;
      }
    }

    return { platforms: platformCount, combos: comboCount };
  }

  private static normalizeId(name: string, brand?: string): string {
    const n = name.toLowerCase();
    const b = (brand || '').toLowerCase();
    if (n.includes('demo') || n.includes('prueba') || n.includes('1.000')) return 'pruebastripe';
    if (n.includes('plex')) return 'plex';
    if (n.includes('jellyfin')) return 'jellyfin';
    if (n.includes('vix')) return 'vix';
    if (n.includes('paramount')) return 'paramount';
    if (n.includes('netflix')) return 'netflix';
    if (n.includes('disney')) return 'disney';
    if (n.includes('max') || n.includes('hbo')) return 'max';
    if (n.includes('prime')) return 'prime';
    if (n.includes('crunchyroll')) return 'crunchyroll';
    if (n.includes('canva')) return 'canva';
    if (n.includes('capcut')) return 'capcut';
    if (n.includes('gemini')) return 'gemini';
    if (n.includes('spotify')) return 'spotify';
    if (n.includes('youtube')) return 'youtube';
    if (n.includes('iptv') || b.includes('iptv')) return 'iptv';
    return n.replace(/[^a-z0-9]/g, '');
  }

  private static normalizeCategory(name: string, rawCat?: string): string {
    const n = name.toLowerCase();
    if (n.includes('iptv') || n.includes('plex') || n.includes('jellyfin')) return 'IPTV';
    const c = (rawCat || 'cine').toUpperCase();
    if (['CINE', 'MUSICA', 'TRABAJO', 'IPTV'].includes(c)) return c;
    return 'CINE';
  }
}
