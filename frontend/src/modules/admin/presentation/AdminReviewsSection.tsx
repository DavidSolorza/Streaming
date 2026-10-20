import React, { useState, useEffect } from 'react';
import { Star, PlusCircle, RefreshCw } from 'lucide-react';
import { Review } from '@/modules/testimonials/domain/entities/Review';
import { ReviewRepository } from '@/modules/testimonials/infrastructure/reviewRepository';
import { AdminReviewCard } from './AdminReviewCard';

export const AdminReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newProduct, setNewProduct] = useState('Netflix Original & Disney+');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const loadReviews = async () => {
    setLoading(true);
    const data = await ReviewRepository.getReviews();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => { loadReviews(); }, []);

  const handleToggle = async (r: Review) => {
    await ReviewRepository.toggleApproval(r.id, !r.isApproved);
    loadReviews();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta reseña?')) return;
    await ReviewRepository.deleteReview(id);
    loadReviews();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;
    await ReviewRepository.addReview({
      name: newName.trim(),
      city: 'Colombia',
      product: newProduct,
      comment: newComment.trim(),
      rating: newRating,
      avatarBg: 'bg-blue-500/20 text-blue-700 border-blue-300',
      initials: newName.trim().slice(0, 2).toUpperCase(),
      isApproved: true,
      isUserCreated: true,
    });
    setNewName(''); setNewComment(''); setShowAddForm(false);
    loadReviews();
  };

  return (
    <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            Gestión de Reseñas y Testimonios (Supabase)
          </h3>
          <p className="text-xs text-slate-500 font-medium">Controla las opiniones visibles en la página web pública.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadReviews} disabled={loading} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sincronizar
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm">
            <PlusCircle className="w-3.5 h-3.5" /> {showAddForm ? 'Cerrar Formulario' : 'Nueva Reseña'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input required placeholder="Nombre del cliente" value={newName} onChange={e => setNewName(e.target.value)} className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white" />
            <input required placeholder="Producto (ej: Netflix + Disney)" value={newProduct} onChange={e => setNewProduct(e.target.value)} className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white" />
            <select value={newRating} onChange={e => setNewRating(Number(e.target.value))} className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value={5}>5 Estrellas (Excelente)</option>
              <option value={4}>4 Estrellas (Muy Bueno)</option>
            </select>
          </div>
          <textarea required rows={2} placeholder="Comentario u opinión verificada..." value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white" />
          <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm">Guardar en Base de Datos</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reviews.map(r => (
          <AdminReviewCard key={r.id} review={r} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </div>
    </section>
  );
};
