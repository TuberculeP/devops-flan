#!/bin/bash

# Define webhook URL
WEBHOOK_URL="https://n8n.sunny-space.fr/webhook/devops-flan-on-build-fail"

# Build Docker Compose
docker compose up -d || {
  error_message="$(docker compose logs --tail 50)"
  curl -X POST -H "Content-Type: application/json" -d "{\"error\": \"$error_message\"}" $WEBHOOK_URL
  exit 1
}