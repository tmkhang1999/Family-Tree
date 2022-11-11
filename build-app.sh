#!/bin/bash

set -e

printf "[1] Stopping web and db...\n"
docker stop family-tree family-tree-db || true

printf "\n[2] Removing web and db...\n"
docker rm family-tree family-tree-db || true

printf "\n[3] Pruning any dangling Docker images and volumes...\n"
docker image prune -f
docker volume prune -f

printf "\n[4] Pulling Docker image from ghcr...\n"
docker compose pull

printf "\n[5] Starting the containers...\n"
docker compose up -d