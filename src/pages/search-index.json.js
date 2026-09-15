/* Index de recherche genere au build (et servi a chaud en dev). */
import { buildIndex } from '../lib/search-index.js';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(buildIndex()), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
