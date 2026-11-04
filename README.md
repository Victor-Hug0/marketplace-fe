# E-mall

Frontend do marketplace. O navegador fala só com o Next. O servidor Next chama a API Laravel com Bearer, e os tokens ficam em cookie `httpOnly`.

## Ambiente local

```bash
cp .env.example .env.local
npm install
npm run dev
```

`API_URL` é a origem da API, sem barra no final. Neste momento a API local está em `http://127.0.0.1:8000`. O Docker Compose do backend publica em `8080`.

## Verificação

```bash
npm run lint
npm run lint:prettier
npm run typecheck
npm test
npm run catalog
```

`npm run catalog` lê `GET /api/v1/categories` com o cliente do servidor. `npm run generate:api` regenera `lib/api/generated/schema.ts` a partir do OpenAPI do backend, no caminho `../marketplace-php/public/docs/openapi.yaml`.
