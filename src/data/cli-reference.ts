import snapshot from './cli-help.json';
import { cliEditorial } from './cli-editorial';

export const cliVersion = snapshot.version;

const rootOrder = [
  'init', 'validate', 'test', 'run', 'list', 'job', 'workflow',
  'env', 'param', 'secret', 'trigger', 'watch', 'serve', 'mcp', 'clear',
];

export type CliEntry = {
  key: string;
  path: string[];
  url: string;
  usage: string;
  help: string;
  children: string[];
  objective: string;
  example: string;
  explanation: string;
  tip: string;
  pitfall: string;
};

export const cliEntries: CliEntry[] = snapshot.commands.map((command) => {
  const key = command.path.join(' ');
  const editorial = cliEditorial[key];
  if (!editorial) throw new Error(`Missing editorial content for hdrctl ${key}`);
  return {
    ...command,
    ...editorial,
    key,
    url: `/cli/${command.path.join('/')}/`,
  };
});

export const cliByKey = new Map(cliEntries.map((entry) => [entry.key, entry]));
export const cliRoots = rootOrder.map((name) => {
  const entry = cliByKey.get(name);
  if (!entry) throw new Error(`Missing CLI root command: ${name}`);
  return entry;
});

export const cliChildren = (entry: CliEntry): CliEntry[] =>
  entry.children.map((name) => {
    const child = cliByKey.get(`${entry.key} ${name}`);
    if (!child) throw new Error(`Missing CLI subcommand: ${entry.key} ${name}`);
    return child;
  });

export const cliNext = (entry: CliEntry): CliEntry | undefined => {
  const ordered = cliRoots.flatMap((root) => [root, ...cliChildren(root)]);
  return ordered[ordered.findIndex((item) => item.key === entry.key) + 1];
};
