import React, { useState, useEffect } from 'react';
import { Star, RefreshCw, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Review } from '@/modules/testimonials/domain/entities/Review';
import { ReviewRepository } from '@/modules/testimonials/infrastructure/reviewRepository';
import { AdminReviewCard } from './AdminReviewCard';

export const AdminReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  const loadReviews = async () => {
    setLoading(true);
    const data = await ReviewRepository.getReviews(true);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => { loadReviews(); }, []);

  const handleToggle = async (r: Review) => {
    await ReviewRepository.toggleApproval(r.id, !r.isApproved);
    await loadReviews();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Deseas eliminar definitivamente esta reseña? Esta acción no se puede deshacer.')) return;
    await ReviewRepository.deleteReview(id);
    await loadReviews();
  };

  const visibleCount = reviews.filter(r => r.isApproved !== false).length;
  const hiddenCount = reviews.filter(r => r.isApproved === false).length;

  const filteredReviews = reviews.filter(r => {
    if (filter === 'visible') return r.isApproved !== false;
    if (filter === 'hidden') return r.isApproved === false;
    return true;
  });

  return (
    <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            Moderación de Reseñas de Clientes
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Las opiniones son publicadas por los clientes desde la tienda pública. Aquí puedes moderar su visibilidad o eliminarlas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadReviews}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            title="Recargar desde la base de datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70">
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todas ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('visible')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
              filter === 'visible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'text-slate-500 hover:text-emerald-700'
            }`}
          >
            <Eye className="w-3 h-3 text-emerald-600" />
            Visibles ({visibleCount})
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
              filter === 'hidden' ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'text-slate-500 hover:text-amber-700'
            }`}
          >
            <EyeOff className="w-3 h-3 text-amber-600" />
            Ocultas ({hiddenCount})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-semibold px-2">
          Los clientes opinan desde la sección pública "Opiniones".
        </span>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs font-medium space-y-1">
          <ShieldAlert className="w-6 h-6 mx-auto text-slate-400 mb-2" />
          <p className="font-bold text-slate-700">No hay opiniones en esta categoría</p>
          <p>Las reseñas que envíen tus clientes aparecerán aquí automáticamente para su moderación.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredReviews.map(r => (
            <AdminReviewCard key={r.id} review={r} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
};
