import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface PosterImageProps {
  src: string;
  alt: string;
  platformColor?: string;
  className?: string;
}

export const PosterImage: React.FC<PosterImageProps> = ({
  src,
  alt,
  platformColor = 'bg-blue-600',
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 p-4 text-center ${className}`}>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
          <Film className="w-5 h-5 text-blue-400" />
        </div>
        <span className="text-[11px] font-extrabold text-white line-clamp-2 drop-shadow-sm">{alt}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
          <Film className="w-6 h-6 text-slate-700 animate-pulse" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
        crossOrigin="anonymous"
        className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${className}`}
      />
    </div>
  );
};
