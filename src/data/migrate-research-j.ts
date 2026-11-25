import type { ResearchSection } from './migrate-research-a';

export const researchJ: Record<string, ResearchSection[]> = {
  prefect: [
    { title: 'Decide what you are comparing before you compare it', paragraphs: [
      'Prefect and Hydra ETL are not competitors in the usual sense. Prefect is a general workflow orchestrator: it schedules Python, retries it, observes it and places it on infrastructure. Hydra is a pipeline language with an engine behind it. The overlap is one specific case, a flow whose every task reads, reshapes or writes data, and outside that case the comparison produces nonsense.',
      'So the first piece of work is a classification, not an evaluation. Open the flow, read the body of each task, and label it: reads data, reshapes data, writes data, or something else. The fourth label is the one that matters. A single task that calls an external API for enrichment, posts to Slack or retrains a model means the flow is doing orchestration, and migrating it wholesale will fail.',
      'When the fourth label appears, the useful question changes. It is no longer whether to replace Prefect but which segment of the flow Hydra should own, with Prefect keeping the rest. That answer is usually more valuable than a migration, and it is reachable in an afternoon.',
    ], source: { label: 'Prefect: flows', url: 'https://docs.prefect.io/v3/concepts/flows' } },

    { title: 'The YAML in prefect.yaml is not the YAML in a Hydra job', paragraphs: [
      'This is the single most common confusion in a Prefect-to-Hydra evaluation, and it inflates the apparent similarity of the two tools. Prefect supports defining deployments in YAML: a prefect.yaml file sets the entrypoint, the work pool, the schedule, the parameters and how flow code is retrieved at run time.',
      'Every one of those fields is about running the flow. None of them is about the data. Rename a column in the source and prefect.yaml is byte-for-byte identical; the breakage is inside a Python task and surfaces when that task executes, mid-run, possibly after earlier tasks have already written.',
      'A Hydra job inverts this. The column names, the transformation order, the join keys and the load mode are all in the manifests, which is precisely why hdrctl validate can reject the project before a connection is opened. When a team says it already works declaratively because it has prefect.yaml, the honest response is that it declares deployment, not transformation, and that these are different problems.',
    ], source: { label: 'Prefect: define deployments with YAML', url: 'https://docs.prefect.io/v3/how-to-guides/deployments/prefect-yaml' } },

    { title: 'Where each tool detects an error', paragraphs: [
      'Prefect tasks are atomic units of work with transactional semantics, and Prefect tracks their state carefully. What the orchestrator cannot do is look inside the Python and tell you that step four references a column step two never produced. That knowledge lives in the code, and the code finds out by running.',
      'The practical cost is proportional to chain length. On a two-task flow it is negligible. On a six-step chain where the mismatch is at step five, three steps have already executed and two may have written before anything complains.',
      'hdrctl validate reads the whole project and cross-checks it without touching data: sources against transformations, transformations against destinations, load modes against the keys they need. It is a second-long operation that moves a class of failure from run time to review time. For a pipeline modified by someone who did not write it, that shift is the main argument for the declarative form.',
    ], source: { label: 'Prefect: tasks', url: 'https://docs.prefect.io/v3/concepts/tasks' } },

    { title: 'Retry semantics differ in unit, not only in configuration', paragraphs: [
      'A Prefect flow of five tasks can retry the third task alone. The first two keep their results, the retry has its own backoff policy, and nothing upstream re-executes. Flows that call rate-limited APIs often depend on exactly this: the expensive extraction is not repeated when a later step is flaky.',
      'Hydra retries a workflow step, and inside a job the load is all or nothing. The guarantee that you get in exchange is about the destination: a failed job leaves the target untouched, with no partial write to reconcile. The guarantee you lose is the fine-grained resumption.',
      'Neither model contains the other, so the migration question is empirical. Write down what happens today when the third task fails. Reproduce that exact failure against the Hydra job. If the result is materially worse for your situation, the conclusion is not that the migration failed but that the retry belongs in Prefect, with Hydra called from inside it.',
    ], source: { label: 'Prefect: tasks', url: 'https://docs.prefect.io/v3/concepts/tasks' } },

    { title: 'Work pools are an infrastructure layer Hydra does not have', paragraphs: [
      'Work pools sit between Prefect’s orchestration layer and the infrastructure where flows actually run, and their primary purpose is dynamic infrastructure provisioning and configuration. One deployment can target a container, another a Kubernetes job, another a serverless runtime, without the flow code changing.',
      'Hydra offers nothing in this category and does not pretend to. hdrctl is a process that runs where you start it. Jobs can be launched by cron, by hdrctl watch, by a webhook or by hdrctl serve, but no component provisions compute on their behalf.',
      'This is decisive for some teams and irrelevant for others. If a flow exists partly because each run needs different compute, that requirement survives the migration untouched, and the correct architecture is a Prefect deployment on the appropriate work pool whose task invokes hdrctl. If every run has always executed on the same machine, the work pool was configuration overhead and removing it is a genuine simplification.',
    ], source: { label: 'Prefect: work pools', url: 'https://docs.prefect.io/v3/concepts/work-pools' } },

    { title: 'The inventory of what does not travel', paragraphs: [
      'A Prefect deployment carries schedule, parameters, work pool, infrastructure overrides and, in Prefect Cloud, a version history of that configuration. A Hydra job carries the pipeline. The gap between those two lists is where migrations go wrong, and it is knowable in advance.',
      'Result persistence and task caching are the usual casualties. A flow that caches an expensive extraction to stay inside an API quota loses that protection the moment extraction becomes a Hydra source, because a Hydra job re-reads its source every run. Concurrency limits that exist to protect a database fall in the same category: they are properties of the orchestrator, not of the pipeline.',
      'Build the list before the pilot: caching, concurrency limits, result storage, infrastructure overrides, event-driven automations. For each item, write either where it will live afterwards or why it is a reason to keep that part in Prefect. A migration that discovers this list after cutover is a migration that caused an incident.',
    ], source: { label: 'Prefect: deployments', url: 'https://docs.prefect.io/v3/concepts/deployments' } },

    { title: 'Coexistence is the expected outcome, not a compromise', paragraphs: [
      'The arrangement most teams land on keeps Prefect in front. The deployment, the work pool, the schedule and the alert routing stay exactly where they are, and one task runs hdrctl as a subprocess or calls the Hydra REST API exposed by hdrctl serve. What changed is that the transformation left Python and became four manifests.',
      'The reason to prefer this over a full migration is reversibility. If the YAML form turns out to be wrong for the problem, restoring the previous task bodies from source control returns the flow to its earlier behaviour, and nothing about the infrastructure was touched. A full migration that also moves the schedule has no such exit.',
      'It is also the arrangement that keeps each tool on the problem it is good at. Prefect answers where and when; Hydra answers what. Teams that try to make one tool answer both questions usually end up reimplementing half of the other.',
    ], source: { label: 'Prefect: deployments', url: 'https://docs.prefect.io/v3/concepts/deployments' } },

    { title: 'Comparing observability honestly', paragraphs: [
      'Observability comparisons tend to list features. The useful test is narrower: what does each tool put in front of a person debugging a failed run at three in the morning, and how long does it take them to find the cause.',
      'Prefect shows a run graph with task states, logs and timings, across every deployment in the workspace, and its automations can react to those states. That breadth is real and it grows with the number of flows. If an incident spans several systems, Prefect’s view is the one that shows the shape of it.',
      'Hydra reports job and workflow status and, on a validation or run failure, names the manifest and the key at fault. The scope is one project, which is narrower, but the error points at a line a reviewer can read without knowing Python. Which is more useful depends on whether your failures are usually about orchestration or usually about data shape.',
    ], source: { label: 'Prefect: flows', url: 'https://docs.prefect.io/v3/concepts/flows' } },

    { title: 'Who maintains the pipeline in a year', paragraphs: [
      'Most of the durable difference between these tools is not technical, and it is worth stating plainly rather than burying it in a feature table. In Prefect the pipeline is code: it is tested like code, reviewed like code, and changed by someone who can read Python comfortably. In Hydra it is a manifest: read like configuration, checked by a validator, and changeable by someone who cannot.',
      'That distinction decides who can safely modify a pipeline after the person who built it has moved on. If the answer in your organisation is always an engineer, the Python form costs nothing and gives more power. If the answer is sometimes an analyst, an operations engineer or a consultant working on a short engagement, the manifest form removes a dependency.',
      'This is a staffing question wearing a tooling costume, and it is the one most evaluations skip. It will outlast any benchmark either tool can win.',
    ], source: { label: 'Prefect: flows', url: 'https://docs.prefect.io/v3/concepts/flows' } },

    { title: 'What a sound pilot looks like', paragraphs: [
      'A pilot that proves nothing is the normal failure. It usually looks like this: rebuild a flow in Hydra, run it, see rows appear, declare success. Nothing was compared, so nothing was learned, and the first real incident is the actual test.',
      'A sound pilot starts from recorded Prefect runs: row counts in and out, destination schema, load mode, duration, and the observed behaviour on failure. It writes to a separate destination so the existing table is never at risk. It compares against those recorded numbers rather than against expectation.',
      'Then it breaks things on purpose. Remove a column from the source, make a row unparseable, revoke the destination credential. Confirm that the destination is untouched and that the error names the manifest and key at fault, and compare each case with what the Prefect flow did in the same situation. A pilot that has not failed on purpose has not been tested.',
    ], source: { label: 'Prefect: deployments', url: 'https://docs.prefect.io/v3/concepts/deployments' } },
  ],
};
