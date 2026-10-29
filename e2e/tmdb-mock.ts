import { Page } from '@playwright/test';

// Fake TMDB answers, so the E2E tests never depend on the real API (or on internet)

const interstellar = {
  id: 157336,
  title: 'Interstellar',
  media_type: 'movie',
  overview: 'A team of explorers travel through a wormhole in space.',
  poster_path: '/interstellar.jpg',
  backdrop_path: '/interstellar-wide.jpg',
  vote_average: 8.5,
  release_date: '2014-11-05',
  genre_ids: [12, 18, 878],
};

const dune = {
  id: 438631,
  title: 'Dune',
  media_type: 'movie',
  overview: 'Paul Atreides travels to the most dangerous planet in the universe.',
  poster_path: '/dune.jpg',
  backdrop_path: '/dune-wide.jpg',
  vote_average: 7.8,
  release_date: '2021-09-15',
  genre_ids: [12, 878],
};

const interstellarDetails = {
  ...interstellar,
  runtime: 169,
  genres: [
    { id: 12, name: 'Adventure' },
    { id: 18, name: 'Drama' },
    { id: 878, name: 'Science Fiction' },
  ],
  credits: {
    cast: [{ id: 10297, name: 'Matthew McConaughey', character: 'Cooper', profile_path: null }],
  },
  // No trailer, so the tests don't load the YouTube player
  videos: { results: [] },
  similar: page([dune]),
};

const genres = {
  genres: [
    { id: 12, name: 'Adventure' },
    { id: 18, name: 'Drama' },
    { id: 878, name: 'Science Fiction' },
  ],
};

function page(results: object[]) {
  return { page: 1, results, total_pages: 1, total_results: results.length };
}

function answerFor(url: URL): object | null {
  const path = url.pathname.replace('/3', '');

  if (path === '/trending/all/week') {
    return page([interstellar, dune]);
  }
  if (path === '/movie/top_rated' || path === '/movie/upcoming') {
    return page([dune]);
  }
  if (path === '/search/multi') {
    const query = url.searchParams.get('query')?.toLowerCase() ?? '';
    return page('interstellar'.includes(query) ? [interstellar] : []);
  }
  if (path === '/movie/157336') {
    return interstellarDetails;
  }
  if (path.startsWith('/genre/')) {
    return genres;
  }
  if (path.startsWith('/discover/')) {
    return page([interstellar, dune]);
  }
  return null;
}

export async function mockTmdb(page: Page): Promise<void> {
  await page.route('https://api.themoviedb.org/3/**', (route) => {
    const answer = answerFor(new URL(route.request().url()));
    return answer
      ? route.fulfill({ json: answer })
      : route.fulfill({ status: 404, json: { status_message: 'Not mocked' } });
  });

  // Posters and fonts are not part of what we test, and skipping them keeps the tests offline
  await page.route('https://image.tmdb.org/**', (route) => route.fulfill({ status: 200 }));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
}
