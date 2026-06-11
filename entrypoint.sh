#!/bin/sh
set -e

echo "Running PocketBase migrations..."
/pocketbase migrate up

echo "Starting PocketBase..."
exec /pocketbase serve --http=0.0.0.0:8090