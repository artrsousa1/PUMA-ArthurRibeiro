docker compose -f docker/compose.yml -p testes up test -d

echo "Waiting for container to be ready..."
while ! nc -z localhost 5433; do
  sleep 0.1
done

echo "Waiting for Postgres to be ready..."
while ! docker exec db-test pg_isready -q; do
  sleep 0.1
done

DATABASE_PORT=5433 npx prisma migrate deploy
DATABASE_PORT=5433 npx prisma generate