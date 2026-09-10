// Configure Tailwind CSS theme variables dynamically (Light Lux Porcelana Palette)
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        darkMode: 'class',
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
            }
        }
    };
}

// Database of Streaming Products with Rich Metadata & Variants
let products = [
    { 
        id: 1, 
        name: 'Netflix Ultra HD 4K', 
        brand: 'Netflix',
        category: 'cine', 
        brandGlow: 'brand-glow-netflix',
        logoText: '🎬',
        logoBg: 'bg-red-500/10 text-red-500 border-red-500/20',
        available: true, 
        bestseller: true,
        badges: ['4K UHD', 'Entrega Inmediata', 'Renovable'],
        searchTags: ['netflix', 'cine', 'series', 'peliculas', '4k', 'stranger things'],
        modes: {
            pantalla: {
                label: '1 Pantalla (Perfil con PIN)',
                devices: '1 Dispositivo simultáneo',
                quality: '4K Ultra HD + HDR',
                access: 'Perfil privado con PIN de 4 dígitos',
                prices: { '1m': 17000, '3m': 45000, '6m': 85000 },
                regularPrices: { '1m': 28000, '3m': 75000, '6m': 140000 }
            },
            cuenta: {
                label: 'Cuenta Completa (Hogar)',
                devices: '4 Dispositivos simultáneos',
                quality: '4K Ultra HD + Dolby Atmos',
                access: 'Correo y clave propia renovable',
                prices: { '1m': 45000, '3m': 120000, '6m': 225000 },
                regularPrices: { '1m': 70000, '3m': 180000, '6m': 330000 }
            }
        },
        includes: [
            'Acceso al catálogo global completo de Netflix sin restricciones',
            'Descargas habilitadas para ver offline en dispositivos móviles',
            'Calidad Ultra HD 4K con soporte HDR10+ y audio espacial',
            'Recomendaciones personalizadas según tus gustos'
        ]
    },
    { 
        id: 2, 
        name: 'Disney+ Premium', 
        brand: 'Disney+',
        category: 'cine', 
        brandGlow: 'brand-glow-disney',
        logoText: '⭐',
        logoBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        available: true, 
        bestseller: true,
        badges: ['Deportes ESPN', '4K UHD', 'Entrega Inmediata'],
        searchTags: ['disney', 'marvel', 'star wars', 'espn', 'futbol', 'deportes', 'pixar'],
        modes: {
            pantalla: {
                label: '1 Pantalla (Perfil con PIN)',
                devices: '1 Dispositivo simultáneo',
                quality: '4K UHD + IMAX Enhanced',
                access: 'Perfil con PIN y deportes ESPN incluidos',
                prices: { '1m': 16000, '3m': 42000, '6m': 80000 },
                regularPrices: { '1m': 26000, '3m': 70000, '6m': 130000 }
            },
            cuenta: {
                label: 'Cuenta Completa (Hogar)',
                devices: '4 Dispositivos simultáneos',
                quality: '4K UHD + Dolby Vision & ESPN Live',
                access: 'Cuenta familiar directa a tu correo',
                prices: { '1m': 42000, '3m': 110000, '6m': 210000 },
                regularPrices: { '1m': 65000, '3m': 160000, '6m': 300000 }
            }
        },
        includes: [
            'Eventos deportivos en vivo de ESPN (Champions League, F1, Tenis, UFC)',
            'Catálogo completo de Marvel Studios, Star Wars, Pixar y National Geographic',
            'Transmisión en directo de canales deportivos y programas exclusivos',
            'Sonido Dolby Atmos e IMAX Enhanced en títulos compatibles'
        ]
    },
    { 
        id: 3, 
        name: 'Max (HBO Max)', 
        brand: 'Max',
        category: 'cine', 
        brandGlow: 'brand-glow-max',
        logoText: '🍿',
        logoBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        available: true, 
        bestseller: false,
        badges: ['Peliculas Cine', '4K UHD', 'Entrega Inmediata'],
        searchTags: ['max', 'hbo', 'house of the dragon', 'cine', 'series', 'champions'],
        modes: {
            pantalla: {
                label: '1 Pantalla (Perfil con PIN)',
                devices: '1 Dispositivo simultáneo',
                quality: '4K Ultra HD & Full HD',
                access: 'Perfil personal exclusivo con PIN',
                prices: { '1m': 12000, '3m': 32000, '6m': 60000 },
                regularPrices: { '1m': 20000, '3m': 55000, '6m': 100000 }
            },
            cuenta: {
                label: 'Cuenta Completa (Hogar)',
                devices: '3 Dispositivos simultáneos',
                quality: '4K UHD 60fps + Dolby Atmos',
                access: 'Acceso a la cuenta completa con tu correo',
                prices: { '1m': 28000, '3m': 75000, '6m': 140000 },
                regularPrices: { '1m': 45000, '3m': 110000, '6m': 200000 }
            }
        },
        includes: [
            'Estrenos de cine directo de Warner Bros 45 días después de las salas',
            'Series exclusivas de HBO (La Casa del Dragón, The Last of Us, Succession)',
            'Contenido infantil de Cartoon Network y universo DC Universe',
            'Calidad Ultra HD 4K con Dolby Vision en dispositivos compatibles'
        ]
    },
    { 
        id: 4, 
        name: 'Amazon Prime Video', 
        brand: 'Prime Video',
        category: 'cine', 
        brandGlow: 'brand-glow-prime',
        logoText: '📦',
        logoBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        available: true, 
        bestseller: false,
        badges: ['Envíos & Cine', '4K UHD', 'Renovable'],
        searchTags: ['prime', 'amazon', 'boys', 'rings of power', 'cine', 'series'],
        modes: {
            pantalla: {
                label: '1 Pantalla (Perfil con PIN)',
                devices: '1 Dispositivo simultáneo',
                quality: '4K Ultra HD + HDR10+',
                access: 'Perfil asignado con PIN de seguridad',
                prices: { '1m': 9000, '3m': 24000, '6m': 45000 },
                regularPrices: { '1m': 15000, '3m': 40000, '6m': 75000 }
            },
            cuenta: {
                label: 'Cuenta Completa (Hogar)',
                devices: '3 Dispositivos simultáneos',
                quality: '4K UHD + HDR10+',
                access: 'Cuenta familiar directa con tu correo',
                prices: { '1m': 22000, '3m': 58000, '6m': 105000 },
                regularPrices: { '1m': 35000, '3m': 90000, '6m': 160000 }
            }
        },
        includes: [
            'Producciones originales de Amazon Originals (The Boys, El Señor de los Anillos)',
            'Alquiler y tienda de películas de estreno reciente',
            'X-Ray interactivo con información de actores y datos curiosos en pantalla',
            'Suscripción Twitch Prime gratis según disponibilidad'
        ]
    },
    { 
        id: 5, 
        name: 'Crunchyroll Mega Fan', 
        brand: 'Crunchyroll',
        category: 'cine', 
        brandGlow: 'brand-glow-crunchyroll',
        logoText: '🍥',
        logoBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        available: true, 
        bestseller: true,
        badges: ['Simulcast Anime', 'Full HD', 'Sin Anuncios'],
        searchTags: ['crunchyroll', 'anime', 'otaku', 'dragon ball', 'naruto', 'one piece', 'simulcast'],
        modes: {
            pantalla: {
                label: '1 Pantalla (Perfil con PIN)',
                devices: '1 Dispositivo simultáneo',
                quality: 'Full HD 1080p sin comerciales',
                access: 'Perfil personal con PIN de seguridad',
                prices: { '1m': 8000, '3m': 21000, '6m': 38000 },
                regularPrices: { '1m': 14000, '3m': 35000, '6m': 65000 }
            },
            cuenta: {
                label: 'Cuenta Completa (Hogar)',
                devices: '4 Dispositivos simultáneos',
                quality: 'Mega Fan Full HD + Offline',
                access: 'Cuenta Mega Fan con tu propio correo',
                prices: { '1m': 18000, '3m': 48000, '6m': 88000 },
                regularPrices: { '1m': 30000, '3m': 78000, '6m': 140000 }
            }
        },
        includes: [
            'Estrenos en Simulcast 1 hora después de su transmisión en Japón',
            'Catálogo masivo de anime subtitulado y doblado al español latino',
            'Descargas sin conexión en dispositivos móviles con plan Mega Fan',
            'Lectura de manga digital según la disponibilidad del catálogo'
        ]
    },
    { 
        id: 6, 
        name: 'Spotify Premium Familiar', 
        brand: 'Spotify',
        category: 'musica', 
        brandGlow: 'brand-glow-spotify',
        logoText: '🎵',
        logoBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        available: true, 
        bestseller: true,
        badges: ['Audio 320kbps', 'Tu Propia Cuenta', 'Sin Anuncios'],
        searchTags: ['spotify', 'musica', 'audio', 'podcast', 'playlists', 'canciones'],
        modes: {
            pantalla: {
                label: 'Cupo Familiar (Tu Correo)',
                devices: '1 Dispositivo personal activo',
                quality: 'Audio Premium 320 kbps HQ',
                access: 'Te unimos a la familia en tu cuenta propia',
                prices: { '1m': 10000, '3m': 27000, '6m': 50000 },
                regularPrices: { '1m': 18000, '3m': 48000, '6m': 90000 }
            },
            cuenta: {
                label: 'Cuenta Familiar Completa',
                devices: '6 Miembros simultáneos',
                quality: 'Audio Extreme 320kbps + Spotify Kids',
                access: 'Plan familiar completo con 6 cupos gestionables',
                prices: { '1m': 30000, '3m': 82000, '6m': 155000 },
                regularPrices: { '1m': 50000, '3m': 130000, '6m': 240000 }
            }
        },
        includes: [
            'Música ilimitada sin interrupciones publicitarias en tu cuenta personal',
            'Descargas de tus canciones y podcasts favoritos para escuchar sin internet',
            'Calidad de sonido superior a 320 kbps con ecualizador personalizado',
            'Compatibilidad total con parlantes inteligentes, Smart TV y CarPlay'
        ]
    },
    { 
        id: 7, 
        name: 'Combo Trío: Netflix + Disney+ + Max', 
        brand: 'Combo',
        category: 'combo', 
        brandGlow: 'brand-glow-combo',
        logoText: '🔥',
        logoBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        available: true, 
        bestseller: true,
        badges: ['Ahorra 40%', '4K Ultra HD', 'Combo Estrella'],
        searchTags: ['combo', 'netflix', 'disney', 'max', 'ahorro', 'trio', 'paquete'],
        modes: {
            pantalla: {
                label: '3 Pantallas (1 por Servicio)',
                devices: '3 Servicios simultáneos',
                quality: '4K Ultra HD en todos los servicios',
                access: 'Perfiles individuales con PIN de seguridad',
                prices: { '1m': 39000, '3m': 105000, '6m': 195000 },
                regularPrices: { '1m': 65000, '3m': 175000, '6m': 320000 }
            },
            cuenta: {
                label: '3 Cuentas Completas',
                devices: 'Hogar Completo Multi-pantalla',
                quality: '4K UHD + ESPN Live + Dolby Atmos',
                access: 'Cuentas familiares independientes',
                prices: { '1m': 99000, '3m': 275000, '6m': 510000 },
                regularPrices: { '1m': 160000, '3m': 420000, '6m': 780000 }
            }
        },
        includes: [
            'El combo de entretenimiento más cotizado de Colombia',
            'Incluye todo el catálogo de Netflix, Disney+ con deportes ESPN y series HBO Max',
            'Ahorra hasta más del 40% comparado con comprar cada servicio individualmente',
            'Soporte técnico prioritario y renovación unificada el mismo día'
        ]
    },
    { 
        id: 8, 
        name: 'Combo Dúo: Netflix + Prime Video', 
        brand: 'Combo',
        category: 'combo', 
        brandGlow: 'brand-glow-combo',
        logoText: '🍿',
        logoBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        available: true, 
        bestseller: false,
        badges: ['Ahorra 30%', '4K Ultra HD', 'Entrega 10 min'],
        searchTags: ['combo', 'netflix', 'prime', 'ahorro', 'duo'],
        modes: {
            pantalla: {
                label: '2 Pantallas (1 por Servicio)',
                devices: '2 Servicios simultáneos',
                quality: '4K Ultra HD & Full HD',
                access: 'Perfiles individuales con PIN',
                prices: { '1m': 23000, '3m': 62000, '6m': 115000 },
                regularPrices: { '1m': 38000, '3m': 98000, '6m': 180000 }
            },
            cuenta: {
                label: '2 Cuentas Completas',
                devices: 'Hogar Completo',
                quality: '4K UHD + HDR10+',
                access: 'Cuentas completas independientes',
                prices: { '1m': 62000, '3m': 165000, '6m': 310000 },
                regularPrices: { '1m': 95000, '3m': 250000, '6m': 460000 }
            }
        },
        includes: [
            'Suma de producciones originales de Netflix y Amazon Prime Video',
            'Ideal para amantes del cine independiente, series originales y documentales',
            'Descuento integrado permanente y garantía respaldada por el canal oficial'
        ]
    }
];

// Estrenos del Mes en Tendencia (Carousel del Hero - Light Porcelana palette)
const trendingItems = [
    { title: 'La Casa del Dragón', platform: 'Max', color: 'bg-white border-slate-900/[0.08] text-purple-700 shadow-luxury', icon: '🐉', tag: 'Max' },
    { title: 'Stranger Things 5', platform: 'Netflix', color: 'bg-white border-slate-900/[0.08] text-red-600 shadow-luxury', icon: '⚡', tag: 'Netflix' },
    { title: 'Deadpool & Wolverine', platform: 'Disney+', color: 'bg-white border-slate-900/[0.08] text-sky-600 shadow-luxury', icon: '⚔️', tag: 'Disney+' },
    { title: 'The Boys T4', platform: 'Prime Video', color: 'bg-white border-slate-900/[0.08] text-cyan-600 shadow-luxury', icon: '🦸', tag: 'Prime' },
    { title: 'Champions League ESPN', platform: 'Disney+', color: 'bg-white border-slate-900/[0.08] text-emerald-600 shadow-luxury', icon: '⚽', tag: 'Disney+' },
    { title: 'Dragon Ball Daima', platform: 'Crunchyroll', color: 'bg-white border-slate-900/[0.08] text-orange-600 shadow-luxury', icon: '🍥', tag: 'Crunchyroll' }
];

// State variables for dynamic filtering & card selections
let productModes = {};      // stores 'pantalla' or 'cuenta' per productId
let productDurations = {};  // stores '1m', '3m', or '6m' per productId
let cart = [];
let selectedBuilderItems = [];
let currentCategory = 'all';
let currentSearchQuery = '';
let activeModalProductId = null;
let activeModalTab = 'includes';

// Initialize default selections for each product
function initProductStates() {
    products.forEach(p => {
        if (!productModes[p.id]) productModes[p.id] = 'pantalla';
        if (!productDurations[p.id]) productDurations[p.id] = '1m';
    });
}

// Render Trending Carousel in Hero Section
function renderTrendingCarousel() {
    const container = document.getElementById('trending-carousel');
    if (!container) return;
    container.innerHTML = '';

    trendingItems.forEach(item => {
        const div = document.createElement('div');
        div.className = `flex-shrink-0 cursor-pointer p-3.5 rounded-2xl ${item.color} hover:scale-105 transition-all duration-200 flex items-center gap-3 hover:border-blue-600/30`;
        div.onclick = () => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = item.tag;
                handleSearchInput(item.tag);
                document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
            }
        };

        div.innerHTML = `
            <span class="text-2xl">${item.icon}</span>
            <div>
                <h4 class="text-xs font-bold text-slate-900 tracking-tight">${item.title}</h4>
                <span class="text-[10px] font-semibold text-slate-500">Disponible en ${item.platform}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

// Main Render Function for Catalog Products (Porcelana Light Palette: Canvas #F8FAFC, Surface #FFFFFF)
function renderProducts(categoryFilter = currentCategory, searchQuery = currentSearchQuery) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let filtered = products;

    // Filter by Category Chip
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by Real-Time Predictive Search Query
    if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(query);
            const brandMatch = p.brand.toLowerCase().includes(query);
            const tagMatch = p.searchTags && p.searchTags.some(t => t.toLowerCase().includes(query));
            return nameMatch || brandMatch || tagMatch;
        });
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center bg-white border border-slate-900/[0.08] shadow-luxury rounded-3xl p-8">
                <span class="text-4xl block mb-3">🔍</span>
                <h3 class="text-base font-bold text-slate-900 mb-1">No se encontraron productos</h3>
                <p class="text-xs text-slate-500 mb-4">Prueba buscando otro servicio como "Netflix", "Disney" o "Anime".</p>
                <button onclick="clearSearch()" class="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                    Mostrar Todos los Servicios
                </button>
            </div>
        `;
        return;
    }

    filtered.forEach(product => {
        const isAgotado = !product.available;
        const currentMode = productModes[product.id] || 'pantalla';
        const currentDuration = productDurations[product.id] || '1m';

        const modeData = product.modes[currentMode];
        const currentPrice = modeData.prices[currentDuration];
        const regularPrice = modeData.regularPrices[currentDuration];
        
        // Calculate Discount Percentage
        const discountPct = Math.round(((regularPrice - currentPrice) / regularPrice) * 100);

        const card = document.createElement('div');
        card.className = `bg-white border ${isAgotado ? 'border-slate-900/[0.05] opacity-60' : 'border-slate-900/[0.08]'} ${product.brandGlow} rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative group shadow-luxury hover:shadow-luxury-hover`;

        card.innerHTML = `
            <div>
                <!-- Encabezado Visual con Logo y Badges Superior -->
                <div class="flex justify-between items-start mb-5">
                    <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-900/[0.08] flex items-center justify-center text-2xl font-black shadow-sm">
                        ${product.logoText}
                    </div>
                    <div class="flex flex-col items-end gap-1.5">
                        ${product.bestseller ? '<span class="bg-amber-500/10 text-amber-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/20 shadow-sm">🔥 Más Vendido</span>' : ''}
                        <span class="${isAgotado ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-500/20'} text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                            ${isAgotado ? 'Agotado' : 'Entrega Inmediata'}
                        </span>
                    </div>
                </div>

                <!-- Título y Badges de Especificación Corta -->
                <h3 class="font-extrabold text-lg text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">${product.name}</h3>
                
                <div class="flex flex-wrap gap-1.5 mb-5">
                    ${product.badges.map(b => `<span class="bg-slate-100 border border-slate-900/[0.08] text-[10px] font-semibold text-slate-600 px-2 py-0.5 rounded-md">${b}</span>`).join('')}
                </div>

                <!-- 1. Selector de Modalidad (Toggle Switch Integrado en fondo Sand #F1F5F9) -->
                <div class="mb-4 bg-slate-100 p-1 rounded-xl border border-slate-900/[0.08] flex text-[11px] font-bold">
                    <button onclick="setCardMode(${product.id}, 'pantalla')" class="flex-1 py-1.5 px-2 rounded-lg transition-all ${currentMode === 'pantalla' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                        1 Pantalla (PIN)
                    </button>
                    <button onclick="setCardMode(${product.id}, 'cuenta')" class="flex-1 py-1.5 px-2 rounded-lg transition-all ${currentMode === 'cuenta' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                        Cuenta Completa
                    </button>
                </div>

                <!-- 2. Selector de Duración (Píldoras Interactivas) -->
                <div class="mb-5">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Duración del Servicio:</span>
                        ${currentDuration === '3m' ? '<span class="text-[10px] font-extrabold text-emerald-600">Ahorra 15%</span>' : ''}
                        ${currentDuration === '6m' ? '<span class="text-[10px] font-extrabold text-emerald-600">Ahorra 25%</span>' : ''}
                    </div>
                    <div class="grid grid-cols-3 gap-1.5 text-xs font-bold">
                        <button onclick="setCardDuration(${product.id}, '1m')" class="py-2 rounded-xl border transition ${currentDuration === '1m' ? 'bg-white border-blue-700 text-slate-900 shadow-sm' : 'bg-slate-100 border-slate-900/[0.08] text-slate-600 hover:text-slate-900'}">
                            1 Mes
                        </button>
                        <button onclick="setCardDuration(${product.id}, '3m')" class="py-2 rounded-xl border transition ${currentDuration === '3m' ? 'bg-white border-blue-700 text-slate-900 shadow-sm' : 'bg-slate-100 border-slate-900/[0.08] text-slate-600 hover:text-slate-900'}">
                            3 Meses
                        </button>
                        <button onclick="setCardDuration(${product.id}, '6m')" class="py-2 rounded-xl border transition ${currentDuration === '6m' ? 'bg-white border-blue-700 text-slate-900 shadow-sm' : 'bg-slate-100 border-slate-900/[0.08] text-slate-600 hover:text-slate-900'}">
                            6 Meses
                        </button>
                    </div>
                </div>

                <!-- Resumen de Especificaciones Rápidas -->
                <div class="bg-slate-50 border border-slate-900/[0.08] rounded-2xl p-3.5 mb-5 space-y-2 text-xs">
                    <div class="flex items-center gap-2 text-slate-600">
                        <span class="text-blue-700 font-bold">📺</span>
                        <span>${modeData.devices}</span>
                    </div>
                    <div class="flex items-center gap-2 text-slate-600">
                        <span class="text-blue-700 font-bold">✨</span>
                        <span>${modeData.quality}</span>
                    </div>
                    <div class="flex items-center gap-2 text-slate-600">
                        <span class="text-blue-700 font-bold">🔑</span>
                        <span class="truncate">${modeData.access}</span>
                    </div>
                </div>
            </div>

            <!-- Caja de Precios y Botones de Acción -->
            <div class="pt-4 border-t border-slate-900/[0.08]">
                <div class="flex items-baseline justify-between mb-4">
                    <div>
                        <span class="text-xs text-slate-400 line-through block leading-none">$${regularPrice.toLocaleString()} COP</span>
                        <span class="text-xl font-black text-slate-900">$${currentPrice.toLocaleString()} <span class="text-xs font-normal text-slate-500">COP</span></span>
                    </div>
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-500/20 text-[10px] font-extrabold px-2 py-1 rounded-lg">
                        -${discountPct}% OFF
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <button onclick="openDetailModal(${product.id})" class="bg-canvas hover:bg-surface-raised text-content-primary border border-white/[0.08] text-xs font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-1">
                        Ver Detalles
                    </button>
                    <button onclick="${isAgotado ? '' : `addSelectedVariantToCart(${product.id})`}" class="${isAgotado ? 'bg-surface-raised text-content-muted cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-blueHover text-white shadow-lg shadow-brand-blue/20'} text-xs font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-1">
                        ${isAgotado ? 'Agotado' : 'Comprar / Añadir'}
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Handlers for Mode and Duration toggle per card
function setCardMode(productId, mode) {
    productModes[productId] = mode;
    renderProducts();
}

function setCardDuration(productId, duration) {
    productDurations[productId] = duration;
    renderProducts();
}

// Filter Categories by Chip
function filterCategory(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.chip-btn').forEach(btn => {
        btn.className = "chip-btn px-4 py-2.5 rounded-xl text-xs font-bold text-content-secondary hover:text-content-primary bg-canvas border border-white/[0.08] transition";
    });
    if (btnElement) {
        btnElement.className = "chip-btn px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-blue text-white transition shadow-md shadow-brand-blue/20";
    }
    renderProducts();
}

// Real-Time Predictive Search Handler
function handleSearchInput(query) {
    currentSearchQuery = query;
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) {
        if (query && query.length > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }
    renderProducts();
}

function clearSearch() {
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    currentSearchQuery = '';
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) clearBtn.classList.add('hidden');
    renderProducts();
}

// Modal/Drawer of Product Details Logic
function openDetailModal(productId) {
    activeModalProductId = productId;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentMode = productModes[productId] || 'pantalla';
    const currentDuration = productDurations[productId] || '1m';
    const modeData = product.modes[currentMode];
    const price = modeData.prices[currentDuration];

    const modal = document.getElementById('product-detail-modal');
    document.getElementById('modal-product-title').innerText = product.name;
    document.getElementById('modal-brand-icon').innerText = product.logoText;

    // Populate Features List in Tab 1
    const featuresList = document.getElementById('modal-features-list');
    featuresList.innerHTML = product.includes.map(inc => `
        <div class="flex items-start gap-2 bg-canvas p-3 rounded-xl border border-white/[0.08]">
            <span class="text-emerald-400 font-bold text-sm">✓</span>
            <span class="text-content-secondary">${inc}</span>
        </div>
    `).join('');

    // Update Bottom Fixed Recap Bar
    const durationLabel = currentDuration === '1m' ? '1 Mes' : (currentDuration === '3m' ? '3 Meses' : '6 Meses');
    const modeLabel = currentMode === 'pantalla' ? '1 Pantalla' : 'Cuenta Completa';
    document.getElementById('modal-recap-text').innerText = `${modeLabel} — ${durationLabel}: $${price.toLocaleString()} COP`;

    // Action buttons in modal
    document.getElementById('modal-add-cart-btn').onclick = () => {
        addSelectedVariantToCart(productId);
        closeDetailModal();
    };

    document.getElementById('modal-buy-whatsapp-btn').onclick = () => {
        const message = `Hola 👋 Deseo comprar inmediatamente *${product.name}* (${modeLabel} por ${durationLabel}) por un valor de *$${price.toLocaleString()} COP*. ¿Me das los medios de pago?`;
        window.open(`https://wa.me/573214465418?text=${encodeURIComponent(message)}`, '_blank');
    };

    switchModalTab('includes');
    modal.classList.remove('hidden');
}

function closeDetailModal() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.add('hidden');
}

function switchModalTab(tabName) {
    activeModalTab = tabName;
    const tabs = ['includes', 'devices', 'rules'];

    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        const content = document.getElementById(`tab-content-${t}`);
        if (btn && content) {
            if (t === tabName) {
                btn.className = "modal-tab-btn py-2.5 px-4 text-brand-blue border-b-2 border-brand-blue transition font-bold";
                content.classList.remove('hidden');
            } else {
                btn.className = "modal-tab-btn py-2.5 px-4 text-content-secondary hover:text-content-primary transition font-bold";
                content.classList.add('hidden');
            }
        }
    });
}

// Hero Video Controls
function toggleHeroMute() {
    const video = document.getElementById('hero-video');
    const muteIcon = document.getElementById('mute-icon');
    const muteText = document.getElementById('mute-text');
    if (!video) return;

    video.muted = !video.muted;
    if (video.muted) {
        if (muteIcon) muteIcon.innerText = '🔇';
        if (muteText) muteText.innerText = 'Sin sonido';
    } else {
        if (muteIcon) muteIcon.innerText = '🔊';
        if (muteText) muteText.innerText = 'Con sonido';
    }
}

function toggleHeroPlay() {
    const video = document.getElementById('hero-video');
    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');
    if (!video) return;

    if (video.paused) {
        video.play();
        if (playIcon) playIcon.innerText = '⏸️';
        if (playText) playText.innerText = 'Pausar';
    } else {
        video.pause();
        if (playIcon) playIcon.innerText = '▶️';
        if (playText) playText.innerText = 'Reproducir';
    }
}

// Cart System
function addSelectedVariantToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.available) return;

    const currentMode = productModes[productId] || 'pantalla';
    const currentDuration = productDurations[productId] || '1m';
    const modeData = product.modes[currentMode];
    const price = modeData.prices[currentDuration];

    const modeLabel = currentMode === 'pantalla' ? '1 Pantalla' : 'Cuenta Completa';
    const durationLabel = currentDuration === '1m' ? '1 Mes' : (currentDuration === '3m' ? '3 Meses' : '6 Meses');

    const cartItemId = `${productId}-${currentMode}-${currentDuration}`;
    const existing = cart.find(item => item.cartItemId === cartItemId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            cartItemId,
            id: product.id,
            name: `${product.name} (${modeLabel} - ${durationLabel})`,
            price: price,
            image: product.logoText,
            quantity: 1
        });
    }

    updateCartUI();
    toggleCart();
}

function updateCartUI() {
    const counter = document.getElementById('cart-counter');
    const mobileCounter = document.getElementById('mobile-cart-counter');
    const itemsContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (counter) counter.innerText = totalItems;
    if (mobileCounter) mobileCounter.innerText = totalItems;

    if (!itemsContainer) return;
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="text-content-secondary text-center py-10 text-xs font-semibold">Tu carrito está vacío.</p>';
        if (totalContainer) totalContainer.innerText = '$0 COP';
        return;
    }

    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between bg-canvas p-3.5 rounded-2xl border border-white/[0.08]';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-xl">${item.image}</span>
                <div>
                    <h4 class="text-xs font-extrabold text-content-primary">${item.name}</h4>
                    <span class="text-xs text-content-secondary font-medium">$${item.price.toLocaleString()} x ${item.quantity}</span>
                </div>
            </div>
            <button onclick="removeFromCart('${item.cartItemId}')" class="text-content-secondary hover:text-rose-400 text-sm font-black px-2 py-1 transition">&times;</button>
        `;
        itemsContainer.appendChild(div);
    });

    if (totalContainer) totalContainer.innerText = `$${totalPrice.toLocaleString()} COP`;
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartUI();
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) drawer.classList.toggle('hidden');
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Agrega al menos un servicio al carrito para continuar.');
        return;
    }

    const contactInput = document.getElementById('customer-contact');
    const contactInfo = contactInput ? contactInput.value.trim() : '';

    let message = "Hola 👋 ¡Quiero adquirir los siguientes servicios en Cuentas Stream:\n\n";
    let total = 0;
    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()} COP\n`;
        total += item.price * item.quantity;
    });
    message += `\n*Total a pagar:* $${total.toLocaleString()} COP\n`;
    if (contactInfo) {
        message += `*Datos de Contacto:* ${contactInfo}\n`;
    }
    message += `Quedo atento a los datos para realizar la transferencia. ¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/573214465418?text=${encodedMessage}`, '_blank');
}

// Payment Modal Handlers (Nequi / Daviplata / PSE)
function openPaymentModal() {
    if (cart.length === 0) {
        alert('Agrega al menos un servicio al carrito para continuar al pago.');
        return;
    }
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.remove('hidden');
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.add('hidden');
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert(`¡Copiado al portapapeles: ${text}!`);
        }).catch(() => {
            alert(`Número: ${text}`);
        });
    } else {
        alert(`Número: ${text}`);
    }
}

function confirmPaymentWhatsApp() {
    const contactInput = document.getElementById('customer-contact');
    const contactInfo = contactInput ? contactInput.value.trim() : '';

    let message = "Hola 👋 Ya realicé mi pago en Cuentas Stream para los siguientes servicios:\n\n";
    let total = 0;
    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()} COP\n`;
        total += item.price * item.quantity;
    });
    message += `\n*Total pagado:* $${total.toLocaleString()} COP\n`;
    if (contactInfo) {
        message += `*Contacto:* ${contactInfo}\n`;
    }
    message += `\nAdjunto el comprobante de transferencia para la activación de mis credenciales.`;

    window.open(`https://wa.me/573214465418?text=${encodeURIComponent(message)}`, '_blank');
}

// FAQ Accordion Handler
function toggleFaq(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    if (!content) return;

    const isHidden = content.classList.contains('hidden');
    if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.innerText = '−';
    } else {
        content.classList.add('hidden');
        if (icon) icon.innerText = '+';
    }
}

// Combo Builder System
function toggleBuilderItem(btn, platformName) {
    btn.classList.toggle('border-brand-blue');
    btn.classList.toggle('bg-brand-blue/15');
    
    if (selectedBuilderItems.includes(platformName)) {
        selectedBuilderItems = selectedBuilderItems.filter(i => i !== platformName);
    } else {
        selectedBuilderItems.push(platformName);
    }
}

function checkoutBuilderWhatsApp() {
    if (selectedBuilderItems.length === 0) {
        alert('Selecciona al menos una plataforma para armar tu combo personalizado.');
        return;
    }
    const message = `Hola 👋 Quisiera cotizar un combo personalizado con las siguientes plataformas: ${selectedBuilderItems.join(', ')}. ¿Qué precio especial me pueden ofrecer?`;
    window.open(`https://wa.me/573214465418?text=${encodeURIComponent(message)}`, '_blank');
}

// Announcement Banner Toggle
function toggleAnnouncement() {
    const banner = document.getElementById('announcement-banner');
    if (banner) banner.style.display = 'none';
}

// Admin CMS Modal Functions
function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.classList.remove('hidden');
        renderAdminProductList();
    }
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.classList.add('hidden');
        renderProducts();
    }
}

function renderAdminProductList() {
    const container = document.getElementById('admin-product-list');
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
        const modeKey = productModes[product.id] || 'pantalla';
        const durationKey = productDurations[product.id] || '1m';
        const currentPrice = product.modes[modeKey].prices[durationKey];

        const div = document.createElement('div');
        div.className = 'bg-canvas p-4 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3';
        div.innerHTML = `
            <div class="flex items-center gap-3 w-full sm:w-auto">
                <span class="text-xl">${product.logoText}</span>
                <input type="text" value="${product.name}" onchange="updateProductName(${product.id}, this.value)" class="bg-surface border border-white/[0.08] text-xs font-bold text-content-primary rounded-xl px-3 py-2 w-full focus:outline-none focus:border-brand-blue">
            </div>
            <div class="flex items-center gap-4 w-full sm:w-auto justify-between">
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-content-muted">$</span>
                    <input type="number" value="${currentPrice}" onchange="updateProductPrice(${product.id}, this.value)" class="bg-surface border border-white/[0.08] text-xs font-bold text-content-primary rounded-xl px-3 py-2 w-28 focus:outline-none focus:border-brand-blue" title="Precio variante actual">
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" ${product.available ? 'checked' : ''} onchange="toggleProductStock(${product.id})" class="sr-only peer">
                    <div class="w-10 h-6 bg-surface-raised peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-mint"></div>
                </label>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateProductPrice(id, newPrice) {
    const p = products.find(prod => prod.id === id);
    if (p) {
        const modeKey = productModes[id] || 'pantalla';
        const durationKey = productDurations[id] || '1m';
        p.modes[modeKey].prices[durationKey] = Number(newPrice);
    }
}

function updateProductName(id, newName) {
    const p = products.find(prod => prod.id === id);
    if (p) p.name = newName;
}

function toggleProductStock(id) {
    const p = products.find(prod => prod.id === id);
    if (p) p.available = !p.available;
}

// Window Onload Initialization
window.onload = function() {
    initProductStates();
    renderTrendingCarousel();
    renderProducts();
};