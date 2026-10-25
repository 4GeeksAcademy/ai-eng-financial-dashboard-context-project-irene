# Guía para agentes

Los agentes que trabajen en este proyecto deben:

- Revisar las instrucciones y reglas disponibles en `.agents/rules/`.
- Consultar las skills disponibles en `.agents/skills/` cuando sean pertinentes.
- Consultar el banco de memoria en `memory-bank/` si existe.
- Antes de trabajar en frontend, leer `.agents/rules/fronted.md`; antes de trabajar en backend, leer `.agents/rules/backend.md`. Para cambios que afecten a ambas capas o a su contrato, leer las dos reglas.
- Antes de analizar, modificar archivos o generar documentación, revisar las versiones actuales de las reglas, skills y documentos de memoria pertinentes para respetar las convenciones y el contexto del proyecto.

## Proyecto

Panel de métricas financieras que actualmente usa datos simulados. El backend genera 360 movimientos; la pantalla presenta métricas calculadas a partir de ellos. [backend/app/routes.py](backend/app/routes.py), [frontend/src/App.tsx](frontend/src/App.tsx)

## Stack y estructura

- Frontend: React + TypeScript en `frontend/src`; backend: FastAPI en `backend/app`. [frontend/src/App.tsx](frontend/src/App.tsx), [backend/app/main.py](backend/app/main.py)
- Docker Compose define los servicios frontend y backend. Vite reenvía `/api` al servicio `backend` durante el desarrollo. [docker-compose.yml](docker-compose.yml), [frontend/vite.config.ts](frontend/vite.config.ts)
- Mantener la carga y el estado en `App`, los cálculos en utilidades y la presentación en componentes. [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)

## Comandos

- Arranque: `docker compose up --build`. [README.es.md](README.es.md)
- Pruebas backend: `docker compose exec backend pytest -q`.
- Pruebas frontend: `docker compose exec frontend npm test`.
- Build frontend: `docker compose exec frontend npm run build`.
- Los comandos de prueba/build están disponibles según [backend/requirements.txt](backend/requirements.txt) y [frontend/package.json](frontend/package.json); verificar que pasen ejecutándolos, no asumirlo.

## Convenciones y reglas de dominio

- Mantener alineados los modelos Pydantic y tipos TypeScript. Conservar valores del dominio como `income`, `outcome`, `B2B` y `B2C`. [backend/app/routes.py](backend/app/routes.py), [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts)
- La API genera movimientos simulados, aplica filtros opcionales y devuelve resultados en orden cronológico. [backend/app/routes.py](backend/app/routes.py), [backend/tests/test_routes.py](backend/tests/test_routes.py)
- Al cambiar el contrato, actualizar frontend, backend y pruebas; revisar Vite y Compose si cambia la comunicación. [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts), [backend/tests/test_routes.py](backend/tests/test_routes.py), [frontend/vite.config.ts](frontend/vite.config.ts), [docker-compose.yml](docker-compose.yml)
- No fijar un periodo en la UI que contradiga las fechas dinámicas. Agrupar fechas `YYYY-MM-DD` sin desplazamientos por zona horaria. [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)

## Banco de memoria

- Consultar los documentos pertinentes antes de trabajar: [memory-bank/producto.md](memory-bank/producto.md), [memory-bank/techContext.md](memory-bank/techContext.md) y [memory-bank/progress.md](memory-bank/progress.md).
- Después de cada nueva implementación, actualizar los documentos del banco de memoria que hayan quedado afectados para reflejar el comportamiento, el contexto técnico o el estado actual del proyecto.
- Registrar como hechos solo lo respaldado por el código o por verificaciones realizadas; etiquetar claramente propuestas y próximos pasos como sugerencias.

## Límites conocidos

- El dashboard consume `GET /api/metrics`, aunque el backend ofrece otras rutas. [frontend/src/App.tsx](frontend/src/App.tsx), [backend/app/routes.py](backend/app/routes.py)
- El código revisado no muestra persistencia en base de datos ni una prueba del flujo completo de UI/red. [backend/app/routes.py](backend/app/routes.py), [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts), [backend/tests/test_routes.py](backend/tests/test_routes.py)

## Verificación

- Ejecutar las pruebas disponibles y el build frontend; no asumir que pasan sin ejecutarlos.
- Comprobar manualmente `http://localhost:5173`, `http://localhost:8000/health`, `http://localhost:8000/api/metrics` y `http://localhost:8000/docs`. [README.es.md](README.es.md), [backend/tests/test_routes.py](backend/tests/test_routes.py)
