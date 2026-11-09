export const whitebookChapters = [
  {
    slug: '01-basics',
    number: '01',
    title: 'Basics',
    description: 'The four job files, projects, workflows, validation and your first run.',
  },
  {
    slug: '02-jobs-part1',
    number: '02A',
    title: 'Jobs: sources and destinations',
    description: 'Connectors, schemas, loading modes and complete job examples.',
  },
  {
    slug: '02-jobs-part2',
    number: '02B',
    title: 'Jobs: transformations',
    description: 'Clean, combine, aggregate and reshape data with the Hydra DSL.',
  },
  {
    slug: '03-workflows',
    number: '03',
    title: 'Workflows',
    description: 'Dependencies, failure handling, rollback, threads and triggers.',
  },
  {
    slug: '04-actions',
    number: '04',
    title: 'Actions',
    description: 'Flow control, notifications, scripts, parameters and undo actions.',
  },
  {
    slug: '05-parameters-secrets',
    number: '05',
    title: 'Parameters and secrets',
    description: 'Environments, overrides, secret lookup and safe configuration.',
  },
] as const;

export type WhitebookChapter = (typeof whitebookChapters)[number];
export const whitebookPdf = '/dsl/Hydra_DSL_v_1.0_White_book.pdf';
