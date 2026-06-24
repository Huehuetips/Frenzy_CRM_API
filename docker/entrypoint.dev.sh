#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Applying migrations..."
npx prisma migrate dev --name init

echo "Running seed..."
npx tsx prisma/seed.ts

echo "Starting dev server..."
exec npx tsx watch src/server.ts
