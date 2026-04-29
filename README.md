# Gateway Service

API Gateway do KitDash - ponto único de entrada para todos os microsserviços.

## Descrição

O Gateway é responsável por:
- Roteamento de requisições para os microsserviços
- Rate limiting
- Health checks

## Rotas

| Rota | Serviço |
|-----|---------|
| `/api/auth/*` | auth-service |
| `/api/users/*` | user-service |
| `/api/properties/*` | property-service |
| `/api/contracts/*` | contract-service |
| `/api/payments/*` | payment-service |
| `/api/notifications/*` | notification-service |
| `/api/health` | Health check do gateway e serviços |

## Variáveis de Ambiente

```
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
PROPERTY_SERVICE_URL=http://localhost:3003
CONTRACT_SERVICE_URL=http://localhost:3004
PAYMENT_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## Como Rodar

### Local (sem Docker)

```bash
# Instalar dependências
npm install

# Copiar .env.example para .env
cp .env.example .env

# Executar em desenvolvimento
npm run start:dev

# ou produt
npm run build && npm run start:prod
```

### Com Docker

```bash
# Build e execução
docker build -t kitdash/gateway .
docker run -p 3000:3000 --env-file .env kitdash/gateway

# ou com docker-compose
docker-compose up
```

## Scripts

| Script | Descrição |
|--------|------------|
| `npm run start` | Iniciar aplicação |
| `npm run start:dev` | Iniciar em modo desenvolvimento |
| `npm run build` | Compilar TypeScript |
| `npm run lint` | Verificar código |
| `npm test` | Executar testes |

## Endpoints

- `GET /api/health` - Health check do gateway

---

## Deploy (Vercel)

### Variáveis de Ambiente (Vercel)

Configure no dashboard da Vercel:

```
PORT=3000
AUTH_SERVICE_URL=https://seu-auth-service.vercel.app
USER_SERVICE_URL=https://seu-user-service.vercel.app
PROPERTY_SERVICE_URL=https://seu-property-service.vercel.app
CONTRACT_SERVICE_URL=https://seu-contract-service.vercel.app
PAYMENT_SERVICE_URL=https://seu-payment-service.vercel.app
NOTIFICATION_SERVICE_URL=https://seu-notification-service.vercel.app
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### Deploy Automático

O deploy é feito automaticamente via GitHub Actions ao fazer push para main.

## CI/CD

Pipeline configurado em `.github/workflows/`:
- **CI:** Lint, Build, Test (a cada PR e push)
- **Deploy:** Automático para Vercel (após merge na main)