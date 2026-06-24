# Docker Setup

## Servicios

- api
- postgres

## Comandos

```bash
docker compose up --build
```

## Migraciones

```bash
docker compose exec api npx prisma migrate dev
```

## Seed

```bash
docker compose exec api npm run seed
```

## Docker base recomendado

### `docker-compose.yml`

```yml
services:
  api:
    build: .
    container_name: mini-crm-api
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:16
    container_name: mini-crm-db
    restart: always
    environment:
      POSTGRES_USER: crm_user
      POSTGRES_PASSWORD: crm_password
      POSTGRES_DB: mini_crm
    ports:
      - "5432:5432"
    volumes:
      - crm_data:/var/lib/postgresql/data

volumes:
  crm_data:
