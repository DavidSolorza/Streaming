import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  onRatingChange: (val: number) => void;
}

export const NewCommentRatingSelector: React.FC<RatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-1 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
      <label className="text-xs font-black text-slate-700 block uppercase tracking-wider">
        ¿Cómo calificas nuestro servicio?
      </label>
      <div className="flex items-center justify-center space-x-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform transform hover:scale-125 focus:outline-none"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 fill-slate-100'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-[11px] text-slate-500 font-bold block pt-1">
        {rating === 5 && '⭐ Excelencia total (5/5)'}
        {rating === 4 && '👍 Muy buen servicio (4/5)'}
        {rating === 3 && '😐 Servicio aceptable (3/5)'}
        {rating <= 2 && '👎 Por mejorar (1-2/5)'}
      </span>
    </div>
  );
};
