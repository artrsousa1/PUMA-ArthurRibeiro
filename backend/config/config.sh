echo "Creating .env file..."
cp .env.local .env

docker compose -f docker/compose.yml -p puma up db -d

echo "Waiting for container to be ready..."
while ! nc -z localhost 5432; do
  sleep 0.1
done

echo "Waiting for Postgres to be ready..."
while ! docker exec db-puma pg_isready -q; do
  sleep 0.1
done

npx prisma migrate deploy
npx prisma generate

echo "Database is running on port 5433"