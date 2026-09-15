import { transform } from '../node_modules/.pnpm/@astrojs+compiler@2.13.1/node_modules/@astrojs/compiler/dist/node/index.js';
import fs from 'fs';
const files=process.argv.slice(2);
let bad=0;
for (const f of files){
  try{
    const r=await transform(fs.readFileSync(f,'utf8'),{filename:f,sourcemap:false});
    const errs=(r.diagnostics||[]).filter(d=>d.severity===1);
    console.log((errs.length? '  ECHEC ':'  ok    ')+f+(errs.length? ' -> '+JSON.stringify(errs):''));
    if(errs.length) bad++;
  }catch(e){ console.log('  ECHEC '+f+' -> '+e.message); bad++; }
}
console.log(bad? '\n*** '+bad+' fichier(s) en echec':'\nCompilation Astro : tous les fichiers passent');
process.exit(bad?1:0);
