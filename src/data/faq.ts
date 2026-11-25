/* Questions transverses : celles qu'aucune page ne possede en propre.
   Regle de la page : /faq route, elle ne republie pas. Une question deja
   traitee par une lecon reste sur la lecon ; ici on repond court et on lie.
   Les questions de migration propres a un outil appartiennent a /migrate/<outil>/.
   `anchor` est stable : ne pas le changer, des liens pointent dessus. */

export type FaqEntry = {
  anchor: string;
  q: string;
  a: string;
  routeSlug?: string;
  routeTitle?: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  blurb: string;
  entries: FaqEntry[];
};

export const faqGroups: FaqGroup[] = [
  {
    id: 'licensing',
    title: 'Licensing and commercial use',
    blurb: 'What the AGPL asks of you, and when it does not fit.',
    entries: [
      {
        anchor: 'hosted-service-agpl',
        q: 'Do I have to publish my changes if I offer Hydra ETL as a hosted service?',
        a: 'Yes, if you modified Hydra ETL itself. Making a modified version available to others, including over a network as a hosted service, means publishing your modified source under the AGPL. If that does not fit, a commercial license is available instead.',
        routeSlug: '/license/',
        routeTitle: 'License',
      },
      {
        anchor: 'commercial-pricing',
        q: 'How much does a commercial license cost?',
        a: 'There is no published price list. A commercial license is arranged by email, with a reply within two business days. Tell them what you are building and how Hydra ETL is embedded or offered, and you will get terms for that case.',
        routeSlug: '/license/',
        routeTitle: 'License',
      },
    ],
  },

  {
    id: 'install',
    title: 'Installing and running it',
    blurb: 'Python, shells, virtual environments and the differences between operating systems.',
    entries: [
      {
        anchor: 'quotes-around-extras',
        q: 'Why does pip install hydra-etl[server] fail in zsh or PowerShell?',
        a: 'Those shells treat square brackets as their own syntax and never pass them to pip. Quote the whole argument — `pip install "hydra-etl[server]"` — and the shell hands the literal string through. The same applies to every extra.',
        routeSlug: '/install/',
        routeTitle: 'Install Hydra',
      },
      {
        anchor: 'activate-virtualenv',
        q: 'How do I activate the virtual environment on Windows compared with macOS or Linux?',
        a: 'One command differs per terminal. macOS and Linux: `source .venv/bin/activate`. Windows PowerShell: `.\\.venv\\Scripts\\Activate.ps1`. Windows cmd.exe: `.venv\\Scripts\\activate.bat`. If PowerShell refuses to run the script, allow it for that window with `Set-ExecutionPolicy -Scope Process RemoteSigned`.',
        routeSlug: '/install/',
        routeTitle: 'Install Hydra',
      },
      {
        anchor: 'python-version',
        q: 'Which Python version does Hydra ETL need?',
        a: 'Python 3.9 or later. If `hdrctl` starts and then raises ModuleNotFoundError, an older Hydra in your system Python is shadowing the one in your environment: remove the global install and open a fresh terminal.',
        routeSlug: '/install/',
        routeTitle: 'Install Hydra',
      },
      {
        anchor: 'install-without-virtualenv',
        q: 'Can I install Hydra ETL without setting up a virtual environment?',
        a: 'Yes, as a standalone tool with uv: `uv tool install "hydra-etl[server]"` puts `hdrctl` on your PATH in its own isolated runtime. If the command is still not found afterwards, run `uv tool update-shell` and open a new terminal.',
        routeSlug: '/install/',
        routeTitle: 'Install Hydra',
      },
      {
        anchor: 'docker-per-os',
        q: 'What changes when I run Hydra ETL in Docker on Windows, macOS or Linux?',
        a: 'The image is the same; the host handling differs. On Linux your user needs to be in the docker group. On Windows, Docker Desktop with Linux containers, and PowerShell mounts with `${PWD}`. On Apple Silicon the image runs natively on arm64.',
        routeSlug: '/install/',
        routeTitle: 'Install Hydra',
      },
      {
        anchor: 'shell-action-dimmed-faq',
        q: 'Why is the Bash action greyed out in the palette?',
        a: 'A shell action depends on the host operating system, and Studio dims the one your machine cannot run — Bash is marked Unix in the palette. For a workflow that has to run anywhere, use the Python action instead.',
        routeSlug: '/studio/log-python-and-shell-actions/',
        routeTitle: 'Run Log, Python and shell actions in a Hydra Studio workflow',
      },
    ],
  },

  {
    id: 'studio-vs-cli',
    title: 'Studio or the command line',
    blurb: 'Two surfaces, the same files and the same engine.',
    entries: [
      {
        anchor: 'studio-or-cli',
        q: 'Should I build my pipelines in Studio or with hdrctl?',
        a: 'Both read and write the same YAML files and run the same engine, so it is a question of moment, not of capability. Studio suits designing and reading a job; `hdrctl` suits version control, scripting and unattended runs. You can move between them freely.',
        routeSlug: '/studio/10-run-the-job/',
        routeTitle: 'Run a Hydra job from Studio: four ways, one engine',
      },
      {
        anchor: 'studio-disk-sync',
        q: 'What happens if I edit a job in Studio and in my editor at the same time?',
        a: 'Studio and the job files stay in step both ways, and the latest change wins. The Sync button compares the two: if only the disk changed, the canvas is rebuilt and node positions are kept; if both changed, the most recent one wins.',
        routeSlug: '/changelog/',
        routeTitle: 'Changelog — v0.12.3',
      },
      {
        anchor: 'run-headless',
        q: 'Can I run Hydra ETL in CI without installing Studio?',
        a: 'Yes. The core package carries `hdrctl` and the engine; Studio and the HTTP server come from the `server` extra. In a pipeline, `hdrctl validate` checks the manifests and `hdrctl run` executes them, with no browser and no server started.',
        routeSlug: '/cli/guides/launch-a-job-from-the-cli-and-the-api/',
        routeTitle: 'Launch a Hydra job from the CLI and the API',
      },
      {
        anchor: 'same-project-layout',
        q: 'Does a project created in Studio differ from one created with hdrctl?',
        a: 'No. Same folders, same YAML. A project made in Studio opens with `hdrctl` and the reverse, which is what lets a team design in Studio, commit the files, and run them from a scheduler.',
        routeSlug: '/studio/01-open-a-project/',
        routeTitle: 'Create a project in Hydra Studio and add its first workflow',
      },
      {
        anchor: 'vscode-instead-of-studio',
        q: 'Can I use the VS Code extension instead of Studio?',
        a: 'For writing YAML, yes: it gives completion, validation and ready-to-fill skeletons for the manifests. It runs nothing, so it replaces the canvas for authoring but not for executing or inspecting a run.',
        routeSlug: '/vscode/',
        routeTitle: 'VS Code extension',
      },
    ],
  },

  {
    id: 'concepts',
    title: 'Projects, jobs, workflows, threads',
    blurb: 'Four words that are easy to confuse, and what each one owns.',
    entries: [
      {
        anchor: 'hierarchy',
        q: 'What is the difference between a project, a workflow and a job?',
        a: 'A project is a set of workflows; a workflow is a set of jobs and actions. A job is the unit that moves data: one folder holding four manifests — sources, transformations, destinations and pipeline.',
        routeSlug: '/cli/workflow/',
        routeTitle: 'hdrctl workflow',
      },
      {
        anchor: 'job-step-vs-action-step',
        q: 'What is the difference between a job step and an action step?',
        a: 'A job step has `type: job` and points at a job folder with a path; it moves data. An action step has `type: action` and names an action — log, Python, shell, webhook, email — and does something around the data rather than to it.',
        routeSlug: '/studio/08-see-the-yaml/',
        routeTitle: 'Read the YAML Hydra Studio generates (Hydra DSL panel)',
      },
      {
        anchor: 'thread-vs-workflow',
        q: 'What does thread.yaml do that a workflow file does not?',
        a: '`workflows/thread.yaml` orders the project\'s workflows — stages, loops, delays, fallbacks. A workflow file orders the steps inside one workflow, through `depends_on`. One is the order between workflows, the other the order within one.',
        routeSlug: '/studio/orchestrate-from-thread-yaml/',
        routeTitle: 'Orchestrate a Hydra project from thread.yaml',
      },
      {
        anchor: 'sub-project-step',
        q: 'How is calling another project different from adding a step?',
        a: 'A step of `type: project` runs another Hydra project — its own `thread.yaml`, or only the workflows you list — with cycle checks, and its results readable by the steps that follow. An ordinary step stays inside the current project.',
        routeSlug: '/cli/guides/call-a-project-from-a-project/',
        routeTitle: 'Call a Hydra project from another project',
      },
      {
        anchor: 'trigger-levels',
        q: 'What is the difference between a workflow trigger and triggers.yaml?',
        a: 'A `trigger` inside a workflow starts that one workflow. `triggers.yaml`, at the root of the project, starts the whole project — its thread, or the workflows you list — and knows more events: cron, interval, file arrival, marker, source change, webhook, end of another project.',
        routeSlug: '/cli/guides/declare-project-triggers/',
        routeTitle: 'Declare project triggers in triggers.yaml',
      },
      {
        anchor: 'job-definition',
        q: 'What exactly makes up a job?',
        a: 'A folder with four manifests: `sources.yaml`, `transformations.yaml`, `destinations.yaml` and `pipeline.yaml`. The pipeline names which source feeds which steps and which destination receives them; the others describe each part.',
        routeSlug: '/cli/guides/anatomy-of-a-job/',
        routeTitle: 'What a Hydra job is made of: four YAML files',
      },
    ],
  },

  {
    id: 'config',
    title: 'Parameters, environments and secrets',
    blurb: 'Where a value can live, and which one wins when several do.',
    entries: [
      {
        anchor: 'parameter-precedence',
        q: 'Which parameter value wins when the same one is set in several places?',
        a: 'Strongest first: values set during the run — `--param`, and `set_param` or `assign_param` in a workflow; then `environments/<env>.yaml` for the selected environment; then the default in `parameters.yaml`.',
        routeSlug: '/dsl/05-parameters-secrets/',
        routeTitle: 'Parameters and secrets',
      },
      {
        anchor: 'env-var-precedence',
        q: 'In what order are environment variables read?',
        a: 'Six layers, strongest first: `--env-file` (or `HYDRA_ENV_FILE`) for one run; `.env` in the job folder; `.env` at the project root; `~/.hydra/env.<env>`; `~/.hydra/env`; and finally variables already set in the system.',
        routeSlug: '/dsl/05-parameters-secrets/',
        routeTitle: 'Parameters and secrets',
      },
      {
        anchor: 'secret-lookup-order',
        q: 'Where does Hydra look for a secret, and in what order?',
        a: 'Five places, in order: an environment variable with the normalised name (dots and hyphens become underscores, upper case); one with the exact name; the secrets file of the selected environment; the project secrets file; then the SOPS provider. The first match ends the search.',
        routeSlug: '/dsl/05-parameters-secrets/',
        routeTitle: 'Parameters and secrets',
      },
      {
        anchor: 'placeholder-order',
        q: 'Are secrets resolved before or after parameters?',
        a: 'Before. In a job file, `${ENV:…}` and `${SECRET:…}` are resolved first, then `{{ param:… }}` and `{{ env:… }}`. So a secret can supply part of a value that a parameter later completes, but not the other way round.',
        routeSlug: '/dsl/05-parameters-secrets/',
        routeTitle: 'Parameters and secrets',
      },
      {
        anchor: 'closest-file-wins',
        q: 'Can a job have its own parameters, separate from the project?',
        a: 'Yes. `parameters.yaml` and `environments/` can sit at the project root, in `workflows/`, or inside a job folder. When the same name is declared at several levels, the file closest to the job wins.',
        routeSlug: '/dsl/05-parameters-secrets/',
        routeTitle: 'Parameters and secrets',
      },
      {
        anchor: 'required-env-var',
        q: 'How do I make a run fail when an environment variable is missing?',
        a: 'Write it as `${ENV:NAME}`. That form is for anything the job cannot work without, and a missing value stops the run instead of quietly producing an empty one.',
        routeSlug: '/dsl/05-parameters-secrets/',
        routeTitle: 'Parameters and secrets',
      },
    ],
  },

  {
    id: 'production',
    title: 'Running unattended',
    blurb: 'What happens when nobody is watching the terminal.',
    entries: [
      {
        anchor: 'overlapping-runs',
        q: 'What happens if a scheduled run starts while the previous one is still going?',
        a: 'A project runs once at a time, enforced by `.hydra/run.lock` across processes. What the second call does is up to the `overlap` setting: skip it, wait for the first to finish, or fail.',
        routeSlug: '/dsl/03-workflows/',
        routeTitle: 'Workflows',
      },
      {
        anchor: 'secrets-in-logs',
        q: 'Can a secret end up in a log?',
        a: 'Every secret value Hydra reads is masked in what it displays or keeps: logs, error messages, the output of shell and Python actions, webhook and email log lines, undo reports, and the runs stored by the API.',
        routeSlug: '/dsl/05-parameters-secrets/',
        routeTitle: 'Parameters and secrets',
      },
    ],
  },

  {
    id: 'migration',
    title: 'Coming from another tool',
    blurb: 'Questions that hold whatever you are leaving. For a named tool, go to its page.',
    entries: [
      {
        anchor: 'try-without-disruption',
        q: 'How do I try Hydra ETL without disturbing my current pipelines?',
        a: 'Pick your current tool from the migration index and follow its guide: each one covers what overlaps, where the products differ, and how to try Hydra without interrupting an existing pipeline.',
        routeSlug: '/migrate/',
        routeTitle: 'Where Hydra ETL fits in your data stack',
      },
      {
        anchor: 'all-at-once-or-gradually',
        q: 'Should I move everything at once or one pipeline at a time?',
        a: 'One at a time. The decision belongs to each data flow, not to the platform: some flows fit Hydra well, others are better left where they are. Treating it as an all-or-nothing migration turns a series of small choices into one large risk.',
        routeSlug: '/migrate/meltano/',
        routeTitle: 'Hydra ETL vs Meltano',
      },
      {
        anchor: 'safe-cutover',
        q: 'What does a safe cutover look like?',
        a: 'A reversible pilot. Keep the current system running until the new output and the failure behaviour are both verified — not just that the rows match, but that a failure does what you expect. Only then move the schedule.',
        routeSlug: '/migrate/airbyte/',
        routeTitle: 'Hydra ETL vs Airbyte',
      },
      {
        anchor: 'simulator-benchmark',
        q: 'Can I use the browser simulator to benchmark Hydra against my current tool?',
        a: 'No. The simulator is a teaching aid, not an engine run or an independent benchmark. Use it to understand how a pipeline is described; measure performance on your own data with a real run.',
        routeSlug: '/playground/',
        routeTitle: 'Playground',
      },
    ],
  },
];

export const faqCount = faqGroups.reduce((n, g) => n + g.entries.length, 0);
