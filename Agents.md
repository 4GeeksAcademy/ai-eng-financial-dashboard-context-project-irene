# Reglas del proyecto

## Proyectos
- Panel de métricas financieras que actualmente usa datos simulados. [backend/app/routes.py](backend/app/routes.py)

## Stack y estructura
- Frontend: React + TypeScript en `frontend/src`; backend: FastAPI en `backend/app`. [frontend/src/App.tsx](frontend/src/App.tsx), [backend/app/main.py](backend/app/main.py)
- Compose define frontend y backend; Vite reenvía `/api` a `backend`. [docker-compose.yml](docker-compose.yml), [frontend/vite.config.ts](frontend/vite.config.ts)

## Comandos
- Arranque: `docker compose up --build`. [README.es.md](README.es.md)
- Pruebas/build disponibles: `docker compose exec backend pytest -q`, `docker compose exec frontend npm test`, `docker compose exec frontend npm run build`. [backend/requirements.txt](backend/requirements.txt), [frontend/package.json](frontend/package.json)

## Convenciones
- Mantener la carga/estado en `App`, los cálculos en utilidades y la presentación en componentes. [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)
- Mantener alineados los modelos Pydantic y tipos TypeScript; conservar valores de dominio como `income`, `outcome`, `B2B` y `B2C`. [backend/app/routes.py](backend/app/routes.py), [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts)

## Reglas de dominio
- La API genera 360 movimientos simulados; aplica filtros opcionales y devuelve movimientos ordenados por fecha. [backend/app/routes.py](backend/app/routes.py)
- No fijar un periodo de UI que contradiga las fechas dinámicas; agrupar `YYYY-MM-DD` sin desplazamientos por zona horaria. [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)

## Forma de trabajo
- Antes de trabajar en frontend, leer [.agents/rules/fronted.md](.agents/rules/fronted.md); antes de trabajar en backend, leer [.agents/rules/backend.md](.agents/rules/backend.md). Para cambios que afecten a ambas capas o su contrato, leer las dos reglas.
- Al cambiar el contrato, actualizar frontend, backend y sus pruebas. Revisar Vite y Compose si cambia la comunicación. [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts), [backend/tests/test_routes.py](backend/tests/test_routes.py), [frontend/vite.config.ts](frontend/vite.config.ts)

## Límites
- El dashboard consume `/api/metrics`; el backend ofrece otras rutas. En el código revisado no aparece persistencia en base de datos ni prueba del flujo completo de UI/red. [frontend/src/App.tsx](frontend/src/App.tsx), [backend/app/routes.py](backend/app/routes.py), [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts)

## Verificación
- Ejecutar las pruebas disponibles y el build frontend con los comandos anteriores; no asumir que pasan sin ejecutarlos.
- Comprobar manualmente `http://localhost:5173`, `http://localhost:8000/health`, `http://localhost:8000/api/metrics` y `http://localhost:8000/docs`. [README.es.md](README.es.md), [backend/tests/test_routes.py](backend/tests/test_routes.py)