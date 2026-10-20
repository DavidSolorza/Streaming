import { Review } from '../domain/entities/Review';
import { ApiHttpClient } from '@/core/http/apiHttpClient';

const STORAGE_KEY = 'cuentas_jp_reviews_v2';

const SEED_REVIEWS: Review[] = [
  { id: '1', name: 'Camila Torres', city: 'Bogotá D.C.', product: 'Canva Pro (12 Meses)', comment: '¡Excelente servicio! Pagué por Nequi mi suscripción de Canva Pro.', rating: 5, date: 'Hace 2 días', avatarBg: 'bg-teal-500/20 text-teal-700 border-teal-300', initials: 'CT', isApproved: true },
  { id: '2', name: 'Mateo Bermúdez', city: 'Medellín', product: 'Netflix Original & Disney+', comment: 'Llevo 8 meses renovando mis pantallas con JP. La atención por WhatsApp es súper rápida.', rating: 5, date: 'Hace 4 días', avatarBg: 'bg-red-500/20 text-red-700 border-red-300', initials: 'MB', isApproved: true },
  { id: '3', name: 'Daniela Morales', city: 'Cali', product: 'Combo VIP (Max + Crunchyroll)', comment: 'Compré el combo para ver mis series y animes favoritos. El ahorro es gigante.', rating: 5, date: 'Hace 1 semana', avatarBg: 'bg-purple-500/20 text-purple-700 border-purple-300', initials: 'DM', isApproved: true },
  { id: '4', name: 'Santiago Ríos', city: 'Bucaramanga', product: 'CapCut Pro & Gemini AI', comment: 'Trabajo creando contenido y necesitaba CapCut sin marca de agua e IA.', rating: 5, date: 'Hace 1 semana', avatarBg: 'bg-blue-500/20 text-blue-700 border-blue-300', initials: 'SR', isApproved: true },
];

export class ReviewRepository {
  static async getReviews(): Promise<Review[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    const res = await ApiHttpClient.get<any[]>('/reviews?all=true');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const mapped = res.data.map(this.mapFromDb);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped)); } catch {}
      return mapped;
    }

    return SEED_REVIEWS;
  }

  static async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Reciente',
      isApproved: true,
    };
    try {
      const res = await ApiHttpClient.post<any>('/reviews', {
        authorName: newReview.name,
        city: newReview.city,
        comment: newReview.comment,
        rating: newReview.rating,
      });
      if (res.success && res.data?.id) newReview.id = String(res.data.id);
    } catch {}
    const current = await this.getReviews();
    const updated = [newReview, ...current.filter(r => r.id !== newReview.id)];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    return newReview;
  }

  static async toggleApproval(id: string, isApproved: boolean): Promise<boolean> {
    try {
      await ApiHttpClient.put(`/reviews/${id}`, { isApproved });
    } catch {}
    const current = await this.getReviews();
    const updated = current.map(r => r.id === id ? { ...r, isApproved } : r);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    return true;
  }

  static async deleteReview(id: string): Promise<boolean> {
    try {
      await ApiHttpClient.request(`/reviews/${id}`, { method: 'DELETE' });
    } catch {}
    const current = await this.getReviews();
    const updated = current.filter(r => r.id !== id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    return true;
  }

  private static mapFromDb(db: any): Review {
    const isApproved = db.is_approved !== undefined ? Number(db.is_approved) !== 0 : true;
    return {
      id: String(db.id),
      name: db.author_name || db.customer_name || 'Cliente Verificado',
      city: db.city || 'Colombia',
      product: db.product || 'Servicio Streaming',
      comment: db.comment,
      rating: Number(db.rating) || 5,
      date: 'Verificado',
      avatarBg: 'bg-teal-500/20 text-teal-700 border-teal-300',
      initials: (db.author_name ? db.author_name.slice(0, 2) : 'JP').toUpperCase(),
      isApproved,
    };
  }
}
