#!/usr/bin/env python3
"""
Static file server that also serves index.js when a path ending with /index
is requested (no extension), so ESM resolution works for dayjs plugins.
Serves from public/ at the repo root so /assets/ and /partials/ resolve correctly.
"""
import http.server
import os
import socketserver
import urllib.parse

# Serve the static site from public/ (document root for /assets/, /partials/, etc.)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(SCRIPT_DIR, "public")
os.chdir(PUBLIC_DIR)


class StaticSiteRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Stub consent-country so JS fetch() doesn't hang (returns immediately)
        parsed = urllib.parse.unquote(self.path)
        if parsed == "/api/consent-country" or parsed.startswith("/api/consent-country?"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"eu":false}')
            return
        # ESM resolution: path with no extension -> try .js (e.g. dayjs/constant, dayjs/utils, dayjs/locale/en)
        if "?" not in parsed and parsed.rstrip("/"):
            last_segment = parsed.rstrip("/").split("/")[-1]
            if "." not in last_segment:
                js_path = (parsed.rstrip("/") + ".js").lstrip("/")
                local = os.path.join(PUBLIC_DIR, *js_path.split("/"))
                if os.path.isfile(local):
                    self.send_response(200)
                    self.send_header("Content-Type", "application/javascript")
                    self.send_header("Cache-Control", "no-cache")
                    self.end_headers()
                    with open(local, "rb") as f:
                        self.wfile.write(f.read())
                    return
        # If path ends with /index (no .js), serve index.js with JS content-type
        if parsed.endswith("/index") and "?" not in parsed:
            js_path = (parsed + ".js").lstrip("/")
            local = os.path.join(PUBLIC_DIR, *js_path.split("/"))
            if os.path.isfile(local):
                self.send_response(200)
                self.send_header("Content-Type", "application/javascript")
                self.send_header("Cache-Control", "no-cache")
                self.end_headers()
                with open(local, "rb") as f:
                    self.wfile.write(f.read())
                return
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


if __name__ == "__main__":
    with socketserver.ThreadingTCPServer(("", 8080), StaticSiteRequestHandler) as httpd:
        httpd.allow_reuse_address = True
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
