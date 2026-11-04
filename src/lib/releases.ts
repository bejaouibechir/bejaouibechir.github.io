// Releases de Hydra ETL pour la page /changelog/.
// Au build, on lit l'API GitHub ; si elle ne répond pas (réseau, limite de débit),
// on garde le dernier relevé enregistré dans src/data/releases.json
// (mis à jour par `node scripts/fetch-releases.mjs`).
import snapshot from '../data/releases.json';
import { fetchReleases } from './releases-api.mjs';

export interface Release {
  tag: string;
  name: string;
  published: string;
  url: string;
  prerelease: boolean;
  html: string;
}

let cache: Promise<{ releases: Release[]; source: 'api' | 'snapshot' }> | undefined;

export function getReleases() {
  cache ??= (async () => {
    try {
      const releases = (await fetchReleases()) as Release[];
      if (releases.length) return { releases, source: 'api' as const };
    } catch (e) {
      console.warn(`[changelog] GitHub API unavailable (${(e as Error).message}); using src/data/releases.json`);
    }
    return { releases: snapshot as Release[], source: 'snapshot' as const };
  })();
  return cache;
}

/** Le corps d'une release passe sous le titre de la version : h2 -> h3, h3 -> h4. */
export function demoteHeadings(html: string): string {
  return html.replace(/<(\/?)h([1-5])(\s|>)/g, (_m, slash, n, after) => `<${slash}h${Math.min(Number(n) + 1, 6)}${after}`);
}

export function anchorOf(tag: string): string {
  return tag.replace(/\./g, '-');
}
