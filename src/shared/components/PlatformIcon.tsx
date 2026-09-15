import React from 'react';
import { Icon } from '@iconify/react';

// Mapeo exhaustivo de marcas y nombres de iconos hacia las imágenes locales ubicadas en /public/icons/
export const PLATFORM_ICONS: Record<string, string> = {
  // Amazon Prime Video
  'amazon prime': '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',
  'prime video': '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',
  'simple-icons:amazonprime': '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',

  // Canva
  'canva': '/icons/icons8-canva-windows-11-color/icons8-canva-96.png',
  'canva pro': '/icons/icons8-canva-windows-11-color/icons8-canva-96.png',
  'simple-icons:canva': '/icons/icons8-canva-windows-11-color/icons8-canva-96.png',

  // Crunchyroll
  'crunchyroll': '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png',
  'simple-icons:crunchyroll': '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png',

  // Disney+
  'disney+': '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
  'disney premium': '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
  'disney': '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
  'logos:disney-plus': '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',

  // HBO Max / Max
  'max': '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
  'hbo max': '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
  'max (hbo)': '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
  'simple-icons:max': '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',

  // Netflix
  'netflix': '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png',
  'logos:netflix-icon': '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png',

  // Primordial / Plex / IPTV
  'primordial': '/icons/icons8-primordial-plus-doodle/icons8-primordial-plus-96.png',
  'primordial plus': '/icons/icons8-primordial-plus-doodle/icons8-primordial-plus-96.png',
  'plex': '/icons/icons8-primordial-plus-doodle/icons8-primordial-plus-96.png',
  'iptv & media': '/icons/icons8-primordial-plus-doodle/icons8-primordial-plus-96.png',
  'iptv latino': '/icons/icons8-primordial-plus-64.png',
  'iptv': '/icons/icons8-primordial-plus-64.png',
  'simple-icons:plex': '/icons/icons8-primordial-plus-doodle/icons8-primordial-plus-96.png',

  // Spotify
  'spotify': '/icons/icons8-spotify-94.png',
  'logos:spotify-icon': '/icons/icons8-spotify-94.png',

  // YouTube
  'youtube': '/icons/icons8-youtube-color/icons8-youtube-96.png',
  'youtube premium': '/icons/icons8-youtube-color/icons8-youtube-96.png',
  'logos:youtube-icon': '/icons/icons8-youtube-color/icons8-youtube-96.png',

  // Jellyfin
  'jellyfin': '/icons/jellyfin.png',
  'jellyfin media': '/icons/jellyfin.png',
  'simple-icons:jellyfin': '/icons/jellyfin.png',
};

interface PlatformIconProps {
  icon?: string;
  name?: string;
  className?: string;
  alt?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  icon,
  name,
  className = 'w-6 h-6',
  alt = 'icono de plataforma'
}) => {
  // Intentar resolver por nombre de marca o por string de icono
  const keyByName = name ? PLATFORM_ICONS[name.toLowerCase().trim()] : undefined;
  const keyByIcon = icon ? PLATFORM_ICONS[icon.toLowerCase().trim()] : undefined;

  // Si icon ya es una ruta relativa o URL directa de imagen
  const isDirectUrl = icon && (icon.startsWith('/') || icon.startsWith('http') || icon.includes('.png') || icon.includes('.svg'));

  const resolvedSrc = keyByName || keyByIcon || (isDirectUrl ? icon : undefined);

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={alt || name || 'icono de plataforma'}
        className={`${className} object-contain inline-block shrink-0`}
        loading="lazy"
      />
    );
  }

  // Fallback a Iconify si viene un nombre de icono de Iconify sin mapeo local
  if (icon) {
    return <Icon icon={icon} className={className} />;
  }

  // Fallback por defecto si no se proporcionó nada
  return <Icon icon="ph:television-fill" className={className} />;
};
