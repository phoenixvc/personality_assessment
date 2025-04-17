#!/bin/bash
# Docker Compose Helper Script for PersonalityFramework
# This script provides commands for working with Docker Compose

function show_usage {
  echo "Usage: ./docker-compose.sh [command]"
  echo ""
  echo "Commands:"
  echo "  up      - Start all services (default)"
  echo "  down    - Stop all services"
  echo "  build   - Rebuild all services"
  echo "  restart - Restart all services"
  echo "  logs    - Show logs from all services"
  echo "  status  - Show status of services"
  echo "  clean   - Remove all containers, images, and volumes"
  echo ""
}

function execute_docker_compose {
  local docker_command=\
  local arguments=\
  
  local full_command="docker-compose \ \"
  echo "Executing: \"
  eval \
}

# Default command is "up"
COMMAND=\

case \ in
  up)
    execute_docker_compose "up -d"
    echo ""
    echo "Services are starting..."
    echo "API will be available at: http://localhost:5000"
    echo "Web UI will be available at: http://localhost:3000"
    ;;
  down)
    execute_docker_compose "down"
    ;;
  build)
    execute_docker_compose "build --no-cache"
    ;;
  restart)
    execute_docker_compose "restart"
    ;;
  logs)
    execute_docker_compose "logs -f"
    ;;
  status)
    execute_docker_compose "ps"
    ;;
  clean)
    execute_docker_compose "down -v --rmi all --remove-orphans"
    ;;
  *)
    show_usage
    ;;
esac
