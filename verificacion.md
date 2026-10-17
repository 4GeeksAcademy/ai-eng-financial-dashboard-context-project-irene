# Verificación de afirmaciones

| Afirmación original | Archivos revisados | Resultado | Corrección si fue necesaria |
|---|---|---|---|
| El backend genera 360 movimientos simulados y los devuelve ordenados por fecha. | `backend/app/routes.py`, `backend/tests/test_routes.py` | Parcialmente confirmado | Genera y ordena 360; `get_metrics` puede devolver menos al aplicar filtros opcionales. |
| El frontend calcula los KPI y agrupa los movimientos por mes para los gráficos. | `frontend/src/App.tsx`, `frontend/src/lib/financial-utils.ts` | Confirmado | — |
| El dashboard solo consume `GET /api/metrics`, aunque el backend ofrece más endpoints. | `frontend/src/App.tsx`, `backend/app/routes.py` | Confirmado | — |
| En Docker, Vite reenvía las peticiones `/api` al servicio `backend`. | `frontend/vite.config.ts`, `docker-compose.yml` | Confirmado | — |
| El periodo que muestra el dashboard coincide con las fechas de los datos simulados. | `frontend/src/App.tsx`, `backend/app/routes.py` | Incorrecto | La interfaz muestra `2024 - Full Year`. `_year_for_month` usa el año actual para meses anteriores al actual y el año anterior para el mes actual y posteriores; el 17-10-2026 los datos abarcan 2025-10 a 2026-09. |