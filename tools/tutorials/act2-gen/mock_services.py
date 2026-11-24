import json, socketserver, threading
from http.server import BaseHTTPRequestHandler, HTTPServer
class H(BaseHTTPRequestHandler):
    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(n).decode("utf-8")
        with open("requests.log", "a", encoding="utf-8") as f:
            f.write(f"{self.command} {self.path} | X-Demo={self.headers.get('X-Demo')} | Content-Type={self.headers.get('Content-Type')} | body={body}\n")
        code = 404 if self.path.startswith("/missing") else 200
        out = b'{"ok": true}' if code == 200 else b'{"error": "not found"}'
        self.send_response(code); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(out)
    def log_message(self, *a): pass
class S(socketserver.StreamRequestHandler):
    def handle(self):
        w = lambda s: (self.wfile.write((s + "\r\n").encode()), self.wfile.flush())
        w("220 mock ready")
        data, indata = [], False
        while True:
            line = self.rfile.readline()
            if not line: return
            t = line.decode("utf-8", "replace").rstrip("\r\n")
            if indata:
                if t == ".":
                    open("mail.txt", "a", encoding="utf-8").write("\n".join(data) + "\n=====\n"); data, indata = [], False; w("250 queued")
                else: data.append(t)
                continue
            u = t.upper()
            if u.startswith(("EHLO", "HELO")): w("250 mock")
            elif u.startswith(("MAIL", "RCPT")): w("250 ok"); data.append("## " + t)
            elif u == "DATA": w("354 go"); indata = True
            elif u == "QUIT": w("221 bye"); return
            else: w("250 ok")
class T(socketserver.ThreadingMixIn, socketserver.TCPServer): allow_reuse_address = True
threading.Thread(target=lambda: T(("127.0.0.1", 1025), S).serve_forever(), daemon=True).start()
HTTPServer(("127.0.0.1", 8099), H).serve_forever()
