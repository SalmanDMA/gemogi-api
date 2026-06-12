#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready..."
sleep 2

echo "🌱 Running database seeds..."
node dist/database/seeds/run-seed.js

echo "🚀 Starting application..."
exec node dist/main.js
