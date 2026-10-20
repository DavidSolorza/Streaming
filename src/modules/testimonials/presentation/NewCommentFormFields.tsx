import React from 'react';
import { User, MapPin, Tv, MessageSquarePlus } from 'lucide-react';

interface FieldsProps {
  name: string;
  city: string;
  product: string;
  comment: string;
  productOptions: string[];
  onNameChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onProductChange: (v: string) => void;
  onCommentChange: (v: string) => void;
}

export const NewCommentFormFields: React.FC<FieldsProps> = ({
  name, city, product, comment, productOptions,
  onNameChange, onCityChange, onProductChange, onCommentChange
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-extrabold text-slate-700 block mb-1 flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-blue-600" /> Tu Nombre:
        </label>
        <input
          type="text"
          placeholder="Ej. Andrés Morales"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          maxLength={40}
        />
      </div>

      <div>
        <label className="text-xs font-extrabold text-slate-700 block mb-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600" /> Ciudad / Municipio:
        </label>
        <input
          type="text"
          placeholder="Ej. Medellín, Antioquia"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          maxLength={40}
        />
      </div>
    </div>

    <div>
      <label className="text-xs font-extrabold text-slate-700 block mb-1 flex items-center gap-1">
        <Tv className="w-3.5 h-3.5 text-blue-600" /> Servicio o Cuenta Adquirida:
      </label>
      <select
        value={product}
        onChange={(e) => onProductChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
      >
        {productOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>

    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
          <MessageSquarePlus className="w-3.5 h-3.5 text-blue-600" /> Tu Opinión o Reseña:
        </label>
        <span className="text-[10px] text-slate-400 font-bold">{comment.length}/300</span>
      </div>
      <textarea
        rows={3}
        placeholder="Escribe tu experiencia con el servicio, la velocidad de entrega y la atención por WhatsApp..."
        value={comment}
        onChange={(e) => onCommentChange(e.target.value.slice(0, 300))}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
      />
    </div>
  </>
);
