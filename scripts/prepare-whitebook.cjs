const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'DSL-whitebook');
const output = path.join(root, 'src', 'whitebook-pages');
const media = path.join(root, 'public', 'dsl', 'media');
const downloads = path.join(root, 'public', 'dsl', 'downloads');
const chapters = [
  '01-basics', '02-jobs-part1', '02-jobs-part2',
  '03-workflows', '04-actions', '05-parameters-secrets'
];
const examples = {
  '01-02': ['01-basics', 'first_project'],
  '02-01': ['02-jobs-part1', 'mongodb_schema'],
  '02-02': ['02-jobs-part1', 'csv_to_mysql_upsert'],
  '02-03': ['02-jobs-part1', 'multi_source_job'],
  '02-04': ['02-jobs-part2', 'transformations_playground'],
  '02-05': ['02-jobs-part2', 'large_volume_engine'],
  '02-06': ['02-jobs-part2', 'transformation_recipes'],
  '03-01': ['03-workflows', 'workflow_rollback'],
  '03-02': ['03-workflows', 'project_thread'],
  '04-01': ['04-actions', 'workflow_actions'],
  '05-01': ['05-parameters-secrets', 'project_environments']
};
const labs = {
  '01-02': '07-read-hydra-error-messages',
  '02-01': '08-read-csv-files-of-all-shapes',
  '02-02': '09-read-from-a-sql-database',
  '02-03': '10-mongodb-documents-and-schema-drift',
  '02-04': '11-load-modes-and-atomicity',
  '02-05': '12-build-a-complete-job',
  '02-06': '13-clean-a-messy-file',
  '02-11': '14-window-functions',
  '02-08': '15-join-merge-union',
  '02-09': '16-pandas-vs-duckdb',
  '02-12': '17-three-ways',
  '03-01': '18-draw-your-workflow',
  '03-02': '19-when-things-go-wrong',
  '03-03': '20-rollback-in-action',
  '03-04': '21-orchestrate-a-project',
  '03-05': '22-master-and-subprojects',
  '03-06': '23-a-project-that-runs-itself',
  '04-03': '24-scripts-around-your-jobs',
  '04-04': '25-reversible-actions',
  '05-01': '26-one-project-three-environments',
  '05-02': '27-secrets-without-leaks'
};

fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(media, { recursive: true });
fs.mkdirSync(downloads, { recursive: true });

const copiedImages = new Set();
function rewriteImage(_match, alt, rawPath) {
  const normalized = rawPath.trim().replaceAll('\\', '/');
  let relative;
  const marker = '/DSL-whitebook/';
  const at = normalized.toLowerCase().indexOf(marker.toLowerCase());
  if (at >= 0) {
    relative = normalized.slice(at + marker.length);
  } else if (normalized.includes('/marktext/images/')) {
    relative = 'images/01-basics/workflow-editor.png';
  } else if (/^(images|0[1-5]-[^/]+)\//.test(normalized)) {
    relative = normalized;
  } else {
    throw new Error('Unrecognized Whitebook image: ' + rawPath);
  }
  const from = path.join(source, ...relative.split('/'));
  if (!fs.existsSync(from)) throw new Error('Missing Whitebook image: ' + from);
  const to = path.join(media, ...relative.split('/'));
  if (!copiedImages.has(relative)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    copiedImages.add(relative);
  }
  return '![' + alt + '](/dsl/media/' + relative.split('/').map(encodeURIComponent).join('/') + ')';
}
function exampleLinks(id) {
  const pair = examples[id];
  if (!pair) return '';
  const [section, name] = pair;
  const github = 'https://github.com/bejaouibechir/bejaouibechir.github.io/tree/main/codes/' + section + '/' + name;
  const zip = '/dsl/downloads/' + section + '/' + name + '.zip';
  return '[Browse the code on GitHub](' + github + ') · [Download the ZIP](' + zip + ')';
}
for (const id of Object.keys(examples)) {
  const [section, name] = examples[id];
  const from = path.join(root, 'codes', section, name + '.zip');
  if (!fs.existsSync(from)) throw new Error('Missing example ZIP: ' + from);
  const to = path.join(downloads, section, name + '.zip');
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

for (const chapter of chapters) {
  const from = path.join(source, chapter + '.md');
  let content = fs.readFileSync(from, 'utf8');
  content = content.replace(/!\[([^\]]*)\]\(([^)\r\n]+)\)/g, rewriteImage);
  content = content.replace(/(<img\b[^>]*\bsrc=["'])(file:\/\/\/[^"']+)(["'])/gi, (_match, prefix, imagePath, suffix) => {
    const markdown = rewriteImage('', '', imagePath);
    return prefix + markdown.slice(4, -1) + suffix;
  });
  content = content.replace(/\]\(\[[^\]]+\]\((https?:\/\/[^)]+)\)\)/g, ']($1)');
  const lines = content.split(/\r?\n/);
  const lastGithub = new Map();
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/\[GITHUB gh-(\d\d-\d\d)/);
    if (match) lastGithub.set(match[1], i);
  }
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const lab = line.match(/\[LAB lab-(\d\d-\d\d)/);
    if (lab && labs[lab[1]]) {
      const url = 'https://killercoda.com/hydra-etl/scenario/' + labs[lab[1]];
      line = line.replace(/https:\/\/(?:killercoda\.com\/hydra-etl\/scenario|github\.com\/bejaouibechir\/bejaouibechir\.github\.io\/tree\/main\/codes)\/[^)\]]+/g, url);
      if (line.endsWith(')]')) line = line.slice(0, -1);
      result.push(line);
      if (!line.includes(url)) result.push('', '[Open the Killercoda lab](' + url + ')', '');
      continue;
    }
    result.push(line);
    const match = line.match(/\[GITHUB gh-(\d\d-\d\d)/);
    if (match && lastGithub.get(match[1]) === i) {
      const links = exampleLinks(match[1]);
      if (links) result.push('', links, '');
    }
    if (chapter === '01-basics' && line.includes('A complete Job example on github:')) {
      result.push('', exampleLinks('01-02'), '');
    }
  }
  fs.writeFileSync(path.join(output, chapter + '.md'), result.join('\n'), 'utf8');
}

const pdf = 'Hydra_DSL_v_1.0_White_book.pdf';
fs.copyFileSync(path.join(source, pdf), path.join(root, 'public', 'dsl', pdf));
console.log('Prepared ' + chapters.length + ' Whitebook chapters, ' + copiedImages.size + ' images, ' + Object.keys(examples).length + ' ZIP downloads and the English PDF.');
