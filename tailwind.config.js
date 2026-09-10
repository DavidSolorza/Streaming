/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC',        // Fondo porcelana relajante
        surface: {
          DEFAULT: '#FFFFFF',   // Tarjetas y modales (Blanco pulido)
          raised: '#F1F5F9',    // Menús y superficies secundarias (Sand)
        },
        border: 'rgba(15, 23, 42, 0.08)',
        content: {
          primary: '#0F172A',     // Títulos y precios (Azul medianoche)
          secondary: '#64748B',   // Subtítulos y descripciones (Gris Pizarra)
          muted: '#94A3B8',       // Precios tachados y notas al pie
        },
        luxury: {
          sapphire: '#1D4ED8',    // Botón principal de compra (Azul Zafiro)
          sapphireDark: '#1E40AF',
          emerald: '#059669',     // Insignias de garantía
          emeraldBg: '#ECFDF5',   // Fondo suave para insignias
          sand: '#F1F5F9',        // Fondo de toggles y selectores
        },
        brand: {
          blue: '#1D4ED8',        // Mapeo retrocompatible
          blueHover: '#1E40AF',
          mint: '#059669',
          amber: '#D97706',
        }
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 4px 6px -2px rgba(15, 23, 42, 0.02)',
        'luxury-hover': '0 20px 35px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -3px rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}
