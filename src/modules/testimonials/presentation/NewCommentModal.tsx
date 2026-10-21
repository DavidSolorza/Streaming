import React, { useState } from 'react';
import { X, MessageSquarePlus, CheckCircle2, Sparkles } from 'lucide-react';
import { Testimonial } from './TestimonialCard';
import { eventBus } from '../../../core/bus/eventBus';
import { NewCommentRatingSelector } from './NewCommentRatingSelector';
import { NewCommentFormFields } from './NewCommentFormFields';

interface NewCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (testimonial: Testimonial) => void;
}

const PRODUCT_OPTIONS = [
  'Netflix Original 4K', 'Disney+ Premium', 'Max (HBO) VIP',
  'Canva Pro 12 Meses', 'Spotify Premium', 'Combo VIP (Varios)',
  'IPTV Latino Full', 'CapCut Pro & AI', 'Otro Servicio'
];

const AVATAR_COLORS = [
  'bg-blue-500/20 text-blue-700 border-blue-300',
  'bg-teal-500/20 text-teal-700 border-teal-300',
  'bg-purple-500/20 text-purple-700 border-purple-300',
  'bg-emerald-500/20 text-emerald-700 border-emerald-300',
  'bg-indigo-500/20 text-indigo-700 border-indigo-300',
  'bg-rose-500/20 text-rose-700 border-rose-300'
];

export const NewCommentModal: React.FC<NewCommentModalProps> = ({ isOpen, onClose, onAddComment }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [product, setProduct] = useState(PRODUCT_OPTIONS[0]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Por favor ingresa tu nombre.');
    if (!city.trim()) return setError('Por favor ingresa tu ciudad (ej. Medellín, Bogotá).');
    if (!comment.trim() || comment.trim().length < 10) return setError('Tu opinión debe tener al menos 10 caracteres.');

    const nameParts = name.trim().split(' ');
    const initials = nameParts.length > 1 ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
    const colorIndex = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % AVATAR_COLORS.length;

    onAddComment({
      id: `user-comment-${Date.now()}`,
      name: name.trim(),
      city: city.trim(),
      product,
      comment: comment.trim(),
      rating,
      date: 'Hace un momento',
      avatarBg: AVATAR_COLORS[colorIndex],
      initials,
      isUserCreated: true
    });

    eventBus.emit('NOTIFICATION:SHOW', { message: '¡Tu comentario ha sido publicado exitosamente!', type: 'success', title: 'Opinión Registrada' });
    setName(''); setCity(''); setProduct(PRODUCT_OPTIONS[0]); setRating(5); setComment(''); setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-1.5">Dejar tu Comentario <Sparkles className="w-4 h-4 text-amber-400" /></h3>
              <p className="text-xs text-slate-300 font-medium">Comparte tu experiencia con Cuentas JP</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar modal de comentario" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <NewCommentRatingSelector rating={rating} onRatingChange={setRating} />
          <NewCommentFormFields
            name={name} city={city} product={product} comment={comment} productOptions={PRODUCT_OPTIONS}
            onNameChange={setName} onCityChange={setCity} onProductChange={setProduct} onCommentChange={setComment}
          />
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-extrabold transition-all">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all">
              <CheckCircle2 className="w-4 h-4" /><span>Publicar Comentario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
