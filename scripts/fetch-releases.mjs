// Met à jour src/data/releases.json avec les releases GitHub de Hydra ETL.
// Le build lit ce fichier si l'API GitHub ne répond pas (voir src/lib/releases.ts).
// Usage : node scripts/fetch-releases.mjs
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fetchReleases } from '../src/lib/releases-api.mjs';

const out = fileURLToPath(new URL('../src/data/releases.json', import.meta.url));
const releases = await fetchReleases();
await writeFile(out, JSON.stringify(releases, null, 2) + '\n', 'utf8');
console.log(`${releases.length} releases written to src/data/releases.json (latest: ${releases[0]?.tag})`);
