// environment.ts is in .gitignore, so Docker, GitHub Actions and Vercel don't have it.
// This script creates it from the TMDB_TOKEN environment variable before the build.
import { existsSync, writeFileSync } from 'node:fs';

const file = 'src/environments/environment.ts';
const token = process.env.TMDB_TOKEN;

// On your computer the file already exists with your token, so it is never overwritten
if (existsSync(file) && !token) {
  console.log(`${file} already exists, keeping it.`);
  process.exit(0);
}

if (!token) {
  // Enough for the CI: the E2E tests fake every TMDB answer
  console.warn('TMDB_TOKEN is not set: the app will build, but TMDB requests will fail.');
}

writeFileSync(
  file,
  `export const environment = {
  tmdbApiUrl: 'https://api.themoviedb.org/3',
  tmdbImageUrl: 'https://image.tmdb.org/t/p',
  tmdbToken: '${token ?? 'missing-token'}',
};
`,
);
console.log(`${file} created.`);
