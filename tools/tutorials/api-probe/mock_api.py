import json
from http.server import BaseHTTPRequestHandler, HTTPServer
ROWS=[{"id":i,"name":n,"price":p} for i,(n,p) in enumerate([("Pen",1.5),("Book",12.0),("Lamp",30.0),("Mug",8.25)],1)]
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/products"):
            b=json.dumps({"items":ROWS}).encode(); self.send_response(200)
        else:
            b=b'{"error":"not found"}'; self.send_response(404)
        self.send_header("Content-Type","application/json"); self.end_headers(); self.wfile.write(b)
    def log_message(self,*a): pass
HTTPServer(("127.0.0.1",8099),H).serve_forever()
