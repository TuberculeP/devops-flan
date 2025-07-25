FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Étape finale, beaucoup plus légère
FROM node:23-slim

WORKDIR /app

COPY --from=builder /app /app

# Healthcheck useful
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# use app internal port if set, otherwise default to 3000
EXPOSE ${APP_INTERNAL_PORT:-3000}

CMD ["npm", "start"]