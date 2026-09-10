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

  if (hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-800 p-4 text-center ${className}`}>
        <Film className="w-8 h-8 text-slate-500 mb-2" />
        <span className="text-[10px] font-bold text-slate-400 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-800 overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <Film className="w-6 h-6 text-slate-700 animate-bounce" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};
