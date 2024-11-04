echo ".env created"
cp .env.local .env

echo "Building docker container..."
docker compose -f docker/compose.yml up -d

