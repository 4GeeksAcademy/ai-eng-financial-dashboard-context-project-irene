# Contexto técnico

## Stack

- **Frontend:** React 19, TypeScript, Vite y Tailwind CSS. Usa Recharts para gráficos, Lucide React para iconos y Vitest para pruebas. Referencias: [frontend/package.json](../frontend/package.json), [frontend/vite.config.ts](../frontend/vite.config.ts).
- **Backend:** FastAPI con Uvicorn. Las dependencias de Python están declaradas en [backend/requirements.txt](../backend/requirements.txt); la aplicación registra el router definido en [backend/app/routes.py](../backend/app/routes.py) desde [backend/app/main.py](../backend/app/main.py).
- **Entorno:** Docker Compose define los servicios `frontend` y `backend`. Referencia: [docker-compose.yml](../docker-compose.yml).

## Estructura relevante

- `frontend/src/App.tsx`: carga `/api/metrics`, mantiene estados de carga/error y conecta cálculos con componentes del dashboard.
- `frontend/src/components/dashboard/`: componentes de KPI y gráficos.
- `frontend/src/lib/`: tipos y utilidades financieras; las pruebas de utilidades están junto a estas.
- `backend/app/main.py`: crea la aplicación FastAPI e incluye el router.
- `backend/app/routes.py`: modelos, generación de movimientos simulados y endpoints.
- `backend/tests/`: pruebas de endpoints.

## Comandos

- Arrancar frontend y backend: `docker compose up --build` ([README.es.md](../README.es.md)).
- Pruebas backend: `docker compose exec backend pytest -q` ([Agents.md](../Agents.md)).
- Pruebas frontend: `docker compose exec frontend npm test` ([Agents.md](../Agents.md); script en [frontend/package.json](../frontend/package.json)).
- Build frontend: `docker compose exec frontend npm run build` ([Agents.md](../Agents.md); script en [frontend/package.json](../frontend/package.json)).
- Lint frontend: `npm run lint` desde `frontend` (script definido en [frontend/package.json](../frontend/package.json)).

## Comunicación frontend-backend

1. El frontend solicita `GET /api/metrics` desde `frontend/src/App.tsx`.
2. La base de URL se toma de `VITE_API_BASE_URL` y, si no está definida, queda vacía; en ese caso la llamada usa la ruta relativa `/api/metrics`.
3. El servidor de desarrollo de Vite reenvía las rutas `/api` a `http://backend:8000` ([frontend/vite.config.ts](../frontend/vite.config.ts)). `backend` es el nombre del servicio en Compose y el puerto 8000 se publica en el host ([docker-compose.yml](../docker-compose.yml)).
4. FastAPI define `/api/metrics` y otros endpoints en [backend/app/routes.py](../backend/app/routes.py). El dashboard actual consume solo `/api/metrics`.

El README documenta el frontend en `http://localhost:5173`, el backend en `http://localhost:8000` y la documentación de API en `http://localhost:8000/docs` ([README.es.md](../README.es.md)). El proxy descrito es la configuración del servidor de desarrollo de Vite; no se debe asumir que representa una configuración de proxy de producción.
