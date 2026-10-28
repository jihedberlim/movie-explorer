// English is the source: the other languages must have exactly the same keys,
// so a missing translation is a build error instead of a blank text on the screen
const en = {
  'nav.home': 'Home',
  'nav.search': 'Search',
  'nav.discover': 'Discover',
  'nav.watchlist': 'Watchlist',
  'theme.toLight': 'Switch to light mode',
  'theme.toDark': 'Switch to dark mode',
  'language.change': 'Change language',
  'footer.dataFrom': 'Data and images from',
  'footer.disclaimer': 'This product uses the TMDB API but is not endorsed or certified by TMDB.',
  'toast.close': 'Close',
  'error.load': 'Failed to load. Please check your connection and try again.',

  'title.search': 'Search',
  'title.discover': 'Discover',
  'title.details': 'Details',
  'title.watchlist': 'My Watchlist',
  'title.notFound': 'Page Not Found',

  'home.featured': 'Featured',
  'home.trending': 'Trending this week',
  'home.topRated': 'Top rated movies',
  'home.upcoming': 'Coming soon',
  'home.seeDetails': 'See details',
  'carousel.empty': 'Nothing to show here right now.',
  'card.add': 'Add {title} to watchlist',
  'card.remove': 'Remove {title} from watchlist',

  'search.placeholder': 'Search movies and TV shows...',
  'search.label': 'Search movies and TV shows',
  'search.hint': 'Type the name of a movie or TV show to search.',
  'search.noResults': 'No results for "{query}".',

  'discover.type': 'Type',
  'discover.movies': 'Movies',
  'discover.tv': 'TV shows',
  'discover.genre': 'Genre',
  'discover.allGenres': 'All genres',
  'discover.year': 'Year',
  'discover.anyYear': 'Any year',
  'discover.sortBy': 'Sort by',
  'discover.popular': 'Most popular',
  'discover.topRated': 'Top rated',
  'discover.newest': 'Newest',
  'discover.noResults': 'No titles match these filters.',
  'discover.clear': 'Clear filters',

  'details.inWatchlist': '✓ In your watchlist',
  'details.addToWatchlist': '+ Add to watchlist',
  'details.trailer': 'Trailer',
  'details.cast': 'Cast',
  'details.similar': 'Similar titles',
  'details.loadError': "We couldn't load this title.",
  'details.tryAgain': 'Try again',
  'details.or': 'or',
  'details.goHome': 'go to the home page',

  'watchlist.title': 'My watchlist',
  'watchlist.empty': 'Your watchlist is empty.',
  'watchlist.findSomething': 'Find something to watch',
  'watchlist.all': 'All ({count})',
  'watchlist.toWatch': 'To watch ({count})',
  'watchlist.watched': 'Watched ({count})',
  'watchlist.markWatched': '✓ Watched',
  'watchlist.unwatch': '↺ Unwatch',
  'watchlist.remove': 'Remove',
  'watchlist.removeLabel': 'Remove {title}',
  'watchlist.nothingHere': 'Nothing here yet.',

  'notFound.title': 'Page not found',
  'notFound.text':
    "This scene didn't make the final cut. The page you are looking for doesn't exist or was moved.",
  'notFound.goHome': 'Go to the home page',
  'notFound.discover': 'Discover titles',
};

export type TranslationKey = keyof typeof en;
export type Translations = Record<TranslationKey, string>;

const pt: Translations = {
  'nav.home': 'Início',
  'nav.search': 'Buscar',
  'nav.discover': 'Explorar',
  'nav.watchlist': 'Minha lista',
  'theme.toLight': 'Mudar para o modo claro',
  'theme.toDark': 'Mudar para o modo escuro',
  'language.change': 'Mudar idioma',
  'footer.dataFrom': 'Dados e imagens do',
  'footer.disclaimer':
    'Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.',
  'toast.close': 'Fechar',
  'error.load': 'Falha ao carregar. Verifique sua conexão e tente de novo.',

  'title.search': 'Buscar',
  'title.discover': 'Explorar',
  'title.details': 'Detalhes',
  'title.watchlist': 'Minha lista',
  'title.notFound': 'Página não encontrada',

  'home.featured': 'Destaque',
  'home.trending': 'Em alta nesta semana',
  'home.topRated': 'Filmes mais bem avaliados',
  'home.upcoming': 'Em breve',
  'home.seeDetails': 'Ver detalhes',
  'carousel.empty': 'Nada para mostrar aqui agora.',
  'card.add': 'Adicionar {title} à minha lista',
  'card.remove': 'Remover {title} da minha lista',

  'search.placeholder': 'Busque filmes e séries...',
  'search.label': 'Buscar filmes e séries',
  'search.hint': 'Digite o nome de um filme ou série para buscar.',
  'search.noResults': 'Nenhum resultado para "{query}".',

  'discover.type': 'Tipo',
  'discover.movies': 'Filmes',
  'discover.tv': 'Séries',
  'discover.genre': 'Gênero',
  'discover.allGenres': 'Todos os gêneros',
  'discover.year': 'Ano',
  'discover.anyYear': 'Qualquer ano',
  'discover.sortBy': 'Ordenar por',
  'discover.popular': 'Mais populares',
  'discover.topRated': 'Mais bem avaliados',
  'discover.newest': 'Mais recentes',
  'discover.noResults': 'Nenhum título combina com esses filtros.',
  'discover.clear': 'Limpar filtros',

  'details.inWatchlist': '✓ Na sua lista',
  'details.addToWatchlist': '+ Adicionar à lista',
  'details.trailer': 'Trailer',
  'details.cast': 'Elenco',
  'details.similar': 'Títulos semelhantes',
  'details.loadError': 'Não conseguimos carregar este título.',
  'details.tryAgain': 'Tentar de novo',
  'details.or': 'ou',
  'details.goHome': 'ir para a página inicial',

  'watchlist.title': 'Minha lista',
  'watchlist.empty': 'Sua lista está vazia.',
  'watchlist.findSomething': 'Encontre algo para assistir',
  'watchlist.all': 'Todos ({count})',
  'watchlist.toWatch': 'Para assistir ({count})',
  'watchlist.watched': 'Assistidos ({count})',
  'watchlist.markWatched': '✓ Assistido',
  'watchlist.unwatch': '↺ Desmarcar',
  'watchlist.remove': 'Remover',
  'watchlist.removeLabel': 'Remover {title}',
  'watchlist.nothingHere': 'Nada aqui ainda.',

  'notFound.title': 'Página não encontrada',
  'notFound.text':
    'Esta cena não entrou na versão final. A página que você procura não existe ou foi movida.',
  'notFound.goHome': 'Ir para a página inicial',
  'notFound.discover': 'Explorar títulos',
};

const es: Translations = {
  'nav.home': 'Inicio',
  'nav.search': 'Buscar',
  'nav.discover': 'Explorar',
  'nav.watchlist': 'Mi lista',
  'theme.toLight': 'Cambiar al modo claro',
  'theme.toDark': 'Cambiar al modo oscuro',
  'language.change': 'Cambiar idioma',
  'footer.dataFrom': 'Datos e imágenes de',
  'footer.disclaimer':
    'Este producto usa la API de TMDB, pero no está avalado ni certificado por TMDB.',
  'toast.close': 'Cerrar',
  'error.load': 'Error al cargar. Revisa tu conexión e inténtalo de nuevo.',

  'title.search': 'Buscar',
  'title.discover': 'Explorar',
  'title.details': 'Detalles',
  'title.watchlist': 'Mi lista',
  'title.notFound': 'Página no encontrada',

  'home.featured': 'Destacado',
  'home.trending': 'Tendencias de la semana',
  'home.topRated': 'Películas mejor valoradas',
  'home.upcoming': 'Próximamente',
  'home.seeDetails': 'Ver detalles',
  'carousel.empty': 'Nada que mostrar aquí por ahora.',
  'card.add': 'Añadir {title} a mi lista',
  'card.remove': 'Quitar {title} de mi lista',

  'search.placeholder': 'Busca películas y series...',
  'search.label': 'Buscar películas y series',
  'search.hint': 'Escribe el nombre de una película o serie para buscar.',
  'search.noResults': 'No hay resultados para "{query}".',

  'discover.type': 'Tipo',
  'discover.movies': 'Películas',
  'discover.tv': 'Series',
  'discover.genre': 'Género',
  'discover.allGenres': 'Todos los géneros',
  'discover.year': 'Año',
  'discover.anyYear': 'Cualquier año',
  'discover.sortBy': 'Ordenar por',
  'discover.popular': 'Más populares',
  'discover.topRated': 'Mejor valoradas',
  'discover.newest': 'Más recientes',
  'discover.noResults': 'Ningún título coincide con estos filtros.',
  'discover.clear': 'Limpiar filtros',

  'details.inWatchlist': '✓ En tu lista',
  'details.addToWatchlist': '+ Añadir a mi lista',
  'details.trailer': 'Tráiler',
  'details.cast': 'Reparto',
  'details.similar': 'Títulos similares',
  'details.loadError': 'No pudimos cargar este título.',
  'details.tryAgain': 'Reintentar',
  'details.or': 'o',
  'details.goHome': 'ir a la página de inicio',

  'watchlist.title': 'Mi lista',
  'watchlist.empty': 'Tu lista está vacía.',
  'watchlist.findSomething': 'Encuentra algo para ver',
  'watchlist.all': 'Todos ({count})',
  'watchlist.toWatch': 'Por ver ({count})',
  'watchlist.watched': 'Vistos ({count})',
  'watchlist.markWatched': '✓ Visto',
  'watchlist.unwatch': '↺ Desmarcar',
  'watchlist.remove': 'Quitar',
  'watchlist.removeLabel': 'Quitar {title}',
  'watchlist.nothingHere': 'Nada aquí todavía.',

  'notFound.title': 'Página no encontrada',
  'notFound.text':
    'Esta escena no llegó al montaje final. La página que buscas no existe o fue movida.',
  'notFound.goHome': 'Ir a la página de inicio',
  'notFound.discover': 'Explorar títulos',
};

// The codes are the ones TMDB expects in its "language" param
export type Language = 'en-US' | 'pt-BR' | 'es-ES';

export interface LanguageOption {
  code: Language;
  label: string;
  shortLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en-US', label: 'English', shortLabel: 'EN', flag: 'flags/us.svg' },
  { code: 'pt-BR', label: 'Português', shortLabel: 'PT', flag: 'flags/br.svg' },
  { code: 'es-ES', label: 'Español', shortLabel: 'ES', flag: 'flags/es.svg' },
];

export const TRANSLATIONS: Record<Language, Translations> = {
  'en-US': en,
  'pt-BR': pt,
  'es-ES': es,
};
