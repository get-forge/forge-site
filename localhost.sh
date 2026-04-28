#!/bin/bash
# Serve the static site so Chrome loads CSS and assets (file:// blocks them).
cd "$(dirname "$0")"
echo "Open: http://localhost:8080/"
python3 localhost.py
