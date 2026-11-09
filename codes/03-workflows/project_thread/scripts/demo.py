"""Run normal and timeout scenarios with the published Hydra project runner."""
import json
import time
from pathlib import Path
from hydra_etl.workflow.project import ProjectRunner, prepare_project

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_NORMAL = [('load_referentials', 1), ('load_sales', 1), ('load_stock', 1),
                   ('load_sales', 2), ('load_stock', 2), ('build_reports', 1)]
EXPECTED_SLOW = [('load_referentials', 1), ('load_sales', 1), ('load_sales_backup', 1),
                 ('load_stock', 1), ('load_sales', 2), ('load_sales_backup', 2),
                 ('load_stock', 2), ('build_reports', 1)]

def scenario(name, delay):
    events = []
    def on_event(kind, value):
        if kind in ('start', 'fallback', 'timeout', 'delay', 'loop'):
            item = {'kind': kind, 'time': time.time()}
            if isinstance(value, dict):
                item.update({key: value[key] for key in ('name', 'use', 'trigger', 'iteration', 'seconds', 'stage')
                             if key in value})
            elif kind == 'loop':
                item['iteration'] = value.iteration
            events.append(item)
    result = ProjectRunner(prepare_project(ROOT), params={'sales_delay': delay}).run(on_event)
    runs = [{'name': run.name, 'status': run.status, 'stage': run.stage,
             'iteration': run.iteration, 'replaces': run.replaces,
             'timed_out': run.timed_out, 'error': run.error} for run in result.runs]
    report = {'scenario': name, 'sales_delay': delay, 'success': result.success,
              'duration_seconds': round(result.duration, 3), 'runs': runs, 'events': events}
    output = ROOT / 'runs' / (name + '.json')
    output.parent.mkdir(exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(name + ': ' + ', '.join(f"{r['name']}={r['status']}" for r in runs))
    print('Written:', output)
    return report

def verify(report, slow):
    expected = EXPECTED_SLOW if slow else EXPECTED_NORMAL
    runs = report['runs']
    if not report['success'] or [(r['name'], r['iteration']) for r in runs] != expected:
        raise RuntimeError('Unexpected workflow order or project status')
    fallback = [event for event in report['events'] if event['kind'] == 'fallback']
    timeout = [event for event in report['events'] if event['kind'] == 'timeout']
    loops = [event for event in report['events'] if event['kind'] == 'loop']
    delays = [event for event in report['events'] if event['kind'] == 'delay']
    if len(loops) != 1 or len(delays) != 1 or delays[0]['seconds'] != 0.2:
        raise RuntimeError('Expected one loop transition and one stage delay')
    if slow:
        if len(fallback) != 2 or len(timeout) != 2 or any(e['trigger'] != 'timeout' for e in fallback):
            raise RuntimeError('Expected two timeout-triggered fallbacks')
        if [r['status'] for r in runs if r['name'] == 'load_sales'] != ['recovered', 'recovered']:
            raise RuntimeError('Timed out sales workflows were not recovered')
    elif fallback or timeout or any(r['status'] != 'success' for r in runs):
        raise RuntimeError('The normal run unexpectedly used a fallback')
    starts = {(e['name'], e['iteration']): e['time'] for e in report['events'] if e['kind'] == 'start'}
    for iteration in (1, 2):
        if abs(starts[('load_sales', iteration)] - starts[('load_stock', iteration)]) > 0.5:
            raise RuntimeError('Sales and stock did not start together')
    print('PASS:', report['scenario'])

def main():
    normal = scenario('normal', 0.1)
    verify(normal, False)
    slow = scenario('timeout_fallback', 1.5)
    verify(slow, True)

if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        raise SystemExit('FAIL: ' + str(exc)) from None
