import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

store = Path('/data/requests.jsonl')
store.parent.mkdir(parents=True, exist_ok=True)

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/events':
            self.send_error(404)
            return
        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length).decode('utf-8')
        record = {'path':self.path, 'body':json.loads(body)}
        with store.open('a', encoding='utf-8') as handle:
            handle.write(json.dumps(record) + '\n')
        payload = json.dumps({'received':True}).encode()
        self.send_response(200)
        self.send_header('Content-Type','application/json')
        self.send_header('Content-Length',str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
    def do_GET(self):
        if self.path != '/requests':
            self.send_error(404)
            return
        records = [json.loads(line) for line in store.read_text().splitlines()] if store.exists() else []
        payload = json.dumps(records).encode()
        self.send_response(200)
        self.send_header('Content-Type','application/json')
        self.send_header('Content-Length',str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

ThreadingHTTPServer(('0.0.0.0',8080), Handler).serve_forever()
