# Venom Codes — WHMCS Client Portal

Production-oriented **pnpm monorepo**: React (Vite) client area, Express API that proxies [WHMCS External API](https://developers.whmcs.com/api/), shared OpenAPI types and generated API client.

## Packages

| Path | Description |
|------|-------------|
| `backend/` | Express 5 API — JWT auth, WHMCS `includes/api.php` integration |
| `frontend/` | React SPA (replaces default WHMCS client area UI) |
| `shared/api-spec/` | `openapi.yaml` + Orval config |
| `shared/api-client/` | Generated React Query client + `custom-fetch.ts` |
| `shared/api-types/` | Zod schemas / types generated from OpenAPI |

## Prerequisites

- Node.js 20+ (24 recommended)
- pnpm 9+
- WHMCS with **API credentials** (identifier + secret) and allowed API actions for your use case

## Configuration

1. Copy environment examples:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Set `backend/.env`:

   - `WHMCS_URL` — base URL of your WHMCS install (no trailing slash)
   - `WHMCS_IDENTIFIER` / `WHMCS_SECRET` — from WHMCS admin → API
   - `JWT_SECRET` — long random string (≥16 characters)
   - `FRONTEND_ORIGIN` — exact origin of the SPA (CORS), e.g. `https://portal.example.com`

3. **WHMCS**: Ensure External API allows the actions your routes call (`ValidateLogin`, `GetClientsDetails`, `GetClientsProducts`, etc.). Adjust WHMCS API role permissions as needed.

## Development

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

Run API (after `cp backend/.env.example backend/.env` and filling values; Node 20+ supports `--env-file`):

```bash
node --env-file=backend/.env ./backend/dist/index.mjs
```

Build backend first: `pnpm --filter @workspace/backend run build`.

Run frontend dev server (defaults: `PORT=5173`, `BASE_PATH=/`):

```powershell
$env:PORT="5173"; $env:BASE_PATH="/"; pnpm --filter @workspace/frontend run dev
```

Point the SPA at the API: same host reverse proxy (`/api` → backend) or set `VITE_API_BASE_URL` to the API origin.

## API code generation

```bash
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/api-client run build
```

Source of truth: `shared/api-spec/openapi.yaml`.

## Production deployment

1. Build static assets: `pnpm --filter @workspace/frontend run build` → `frontend/dist/`.
2. Build API: `pnpm --filter @workspace/backend run build` → `backend/dist/index.mjs`.
3. Run Node behind **nginx** / **Caddy** / **Apache**:

   - Serve SPA static files from `frontend/dist/`.
   - Reverse proxy `/api` to the Node process (port from `PORT`, default `8080`).
   - TLS termination at the proxy; set `FRONTEND_ORIGIN` to your public SPA URL.

4. Do **not** expose WHMCS API secrets to the browser; only the backend uses `WHMCS_IDENTIFIER` / `WHMCS_SECRET`.

## Notes

- WHMCS action names and parameters can differ by version; tune `backend/src/routes/*.routes.ts` and `backend/src/lib/whmcs-transforms.ts` for your WHMCS build.
- Cart/checkout endpoints return minimal placeholders unless you wire them to your billing/cart flow.

## License

MIT
