version: '3.8'

services:
  gateway:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - AUTH_SERVICE_URL=http://auth-service:3001
      - USER_SERVICE_URL=http://user-service:3002
      - PROPERTY_SERVICE_URL=http://property-service:3003
      - CONTRACT_SERVICE_URL=http://contract-service:3004
      - PAYMENT_SERVICE_URL=http://payment-service:3005
      - NOTIFICATION_SERVICE_URL=http://notification-service:3006
      - THROTTLE_TTL=60000
      - THROTTLE_LIMIT=100
    networks:
      - kitdash-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  kitdash-network:
    driver: bridge