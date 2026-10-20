/* Hydra Academy : parcours video. Source unique pour /academy et pour la
   video d'appel de l'accueil.

   Les videos sont hebergees sur YouTube (lecteur youtube-nocookie, charge au
   clic seulement). Les vignettes sont servies par le site : aucune requete
   vers YouTube tant que le visiteur ne clique pas.

   Ajouter un parcours : un objet de plus dans `tracks`. Ajouter une video :
   un objet de plus dans `videos`, vignette 1280x720 dans public/academy/. */

const KC = 'https://killercoda.com/hydra-etl/scenario/';

export const tracks = [
  {
    id: 'cli',
    title: 'Hydra CLI',
    lead: 'From an empty folder to a tested job and an HTTP API, with hdrctl. Each video follows a Killercoda lab you can run in your browser.',
    playlist: 'https://www.youtube.com/playlist?list=PLOVsdMXCxpho',
    videos: [
      {
        youtube: 'S9ACiT1dCJU',
        title: 'Getting started with hdrctl on Killercoda',
        duration: '3:36',
        thumb: '/academy/cli1.jpg',
        summary: 'A first look at hdrctl, the Hydra ETL command line, in a free Killercoda playground.',
        steps: [
          'Open the Hydra ETL labs on Killercoda',
          'Check the installed version with <code>hdrctl --version</code>',
          'List the commands with <code>hdrctl --help</code>',
          'Get help on one command with <code>hdrctl init -h</code>',
          'Switch the CLI to Spanish with <code>--lang es</code>',
        ],
        lab: { label: 'Lab 1 — Meet hdrctl', url: KC + '01-meet-hdrctl' },
      },
      {
        youtube: '9cCMWptQEgE',
        title: 'Create a project with hdrctl init and explore its structure',
        duration: '4:35',
        thumb: '/academy/cli2.jpg',
        summary: 'hdrctl init scaffolds a complete Hydra ETL project in one command. What it creates, and what each file does.',
        steps: [
          'Create a project with <code>hdrctl init</code>',
          'Read its structure: <code>Data/</code>, <code>output/</code>, <code>workflows/</code>, <code>jobs/job1/</code>, <code>.hydra/</code>',
          'The four files of a job: sources, destinations, transformations, pipeline',
          'Edit them in the Killercoda Editor, with the HYDRA ETL extension',
        ],
        lab: { label: 'Lab 1 — Meet hdrctl', url: KC + '01-meet-hdrctl' },
      },
      /* KpIMYQMjOFo (cli3) : retire le 21/10/2026 — la piste son est celle de la
         video 2, pas celle de hdrctl validate. A remettre une fois remplacee. */
      {
        youtube: 't74dE_-Nyhg',
        title: 'Check a MySQL job before running it with hdrctl test',
        duration: '3:29',
        thumb: '/academy/cli4.jpg',
        summary: 'hdrctl test goes through a job section by section and tells you what is wrong before you run it.',
        steps: [
          'Create a MySQL project; credentials come from environment variables',
          'Break the load mode: <code>upsret</code> instead of <code>upsert</code>',
          'Read the error: <code>Input should be \'append\', \'replace\' or \'upsert\'</code>',
          'Fix it and test again until everything passes',
        ],
        lab: { label: 'Lab 3 — hdrctl test', url: KC + '03-test-is-not-validate' },
      },
      {
        youtube: 'RkcdctjkmHg',
        title: 'Hydra ETL over HTTP: hdrctl serve and the REST API',
        duration: '2:57',
        thumb: '/academy/cli5.jpg',
        summary: 'hdrctl serve starts a REST API, so any HTTP client can drive Hydra ETL.',
        steps: [
          'Start the API with <code>hdrctl serve --no-studio --port 5678</code>',
          'Call <code>/api/health</code> with curl',
          'Validate a job over HTTP, then read the error returned as JSON',
          'Try Hydra DSL in the playground on hydraetl.com',
        ],
        lab: { label: 'Lab 4 — hdrctl over HTTP', url: KC + '04-hdrctl-over-http' },
      },
    ],
  },
];

/* Parcours prevus : une ligne sur la page, pas de cartes vides. */
export const upcoming = ['Hydra Studio', 'Workflows', 'Actions'];

/* Video d'appel de l'accueil. */
export const teaser = tracks[0].videos.find((v) => v.youtube === '9cCMWptQEgE');
