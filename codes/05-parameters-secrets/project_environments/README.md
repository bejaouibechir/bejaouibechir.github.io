# project_environments

A runnable Hydra project for [gh-05-01] in the Parameters and Secrets chapter. One workflow runs two CSV jobs. The first job filters orders; the second publishes the filtered result only when the selected environment enables it.

## Run

Install the version used to verify this example:

~~~bash
python -m pip install -r requirements.txt
~~~

From this project directory:

~~~bash
hdrctl run . --env dev
hdrctl run . --env prod
python scripts/check_outputs.py
~~~

The same workflow and job files run in both environments. No database, secret or external service is required.

## What changes

| Parameter | Default | dev | prod | Used in |
| --- | --- | --- | --- | --- |
| country | FR | FR | US | Source file path |
| min_amount | 50 | 50 | 100 | Filter expression |
| env_label | local | dev | prod | Output file paths |
| publish_enabled | false | false | true | Workflow when condition |

The first job reads data/orders_FR.csv in dev and data/orders_US.csv in prod. Dev keeps IDs 2 and 3 and skips the publish job. Prod keeps IDs 5 and 6 and runs the publish job. The expected/ folder contains the three expected CSV outputs.

The key DSL lines are:

~~~yaml
table: "../../data/orders_{{ param:country }}.csv"
expr: "amount >= {{ param:min_amount }}"
when: "{{ param:publish_enabled }} == True"
~~~

To see a one-run override without editing the environment file, try:

~~~bash
hdrctl run . --env dev --param min_amount=100 --param env_label=dev_override
~~~

This writes outputs/filtered_dev_override.csv with only ID 3. It does not change environments/dev.yaml.
