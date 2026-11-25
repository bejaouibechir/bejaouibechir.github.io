// Met à jour src/data/releases.json avec les releases GitHub de Hydra ETL.
// Le build lit ce fichier si l'API GitHub ne répond pas (voir src/lib/releases.ts).
// Usage : node scripts/fetch-releases.mjs
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fetchReleases } from '../src/lib/releases-api.mjs';

const out = fileURLToPath(new URL('../src/data/releases.json', import.meta.url));
const releases = await fetchReleases();
await writeFile(out, JSON.stringify(releases, null, 2) + '\n', 'utf8');
// Version seule, pour le JSON-LD de BaseLayout : importer releases.json dans
// le layout injecterait 77 Ko de notes de version dans chaque page.
const latest = releases.find((r) => !r.prerelease) ?? releases[0];
const versionOut = fileURLToPath(new URL('../src/data/version.json', import.meta.url));
await writeFile(versionOut, JSON.stringify({
  version: latest?.tag?.replace(/^v/, '') ?? '',
  released: latest?.published ?? '',
  url: latest?.url ?? '',
}, null, 2) + '\n', 'utf8');

console.log(`${releases.length} releases written to src/data/releases.json (latest: ${releases[0]?.tag})`);
