config:
	@cp backend/.env.local backend/.env
	@echo 'Config file created'
	@echo 'Initializing the database...'
	@sudo docker compose -f backend/docker/compose.yml up -d --build
	@while !nc -z localhost 5432; do sleep 1; done
	@echo 'Migrating the database...'
	@cd backend && npx prisma migrate deploy
	@cd backend && npx prisma generate

start:
	@sudo docker compose -f backend/docker/compose.yml up -d
	@echo 'PostgresSQL is running on port 5432'

stop:
	@docker compose -f backend/docker/compose.yml down
	@echo 'PostgresSQL is stopped'