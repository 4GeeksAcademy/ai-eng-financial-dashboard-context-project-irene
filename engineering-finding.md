# Hallazgos y reglas de ingeniería

Hallazgos derivados de la revisión estática del frontend, backend y configuración de integración.

## Frontend

- **Hallazgo:** el periodo del encabezado está fijado en `2024 - Full Year`, aunque el backend genera fechas dinámicas. [frontend/src/App.tsx](frontend/src/App.tsx), [backend/app/routes.py](backend/app/routes.py)
  **Regla propuesta:** no fijar etiquetas de periodo que puedan contradecir los datos; derivarlas del rango recibido o de una fuente única.
- **Hallazgo:** `YYYY-MM-DD` se convierte con `new Date()` y se agrupa usando getters locales, lo que puede desplazar el día/mes en ciertas zonas horarias. [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)
  **Regla propuesta:** tratar fechas sin hora de forma consistente (UTC o componentes de fecha explícitos) y probar límites de mes y zona horaria. [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts)
- **Hallazgo:** `App` carga datos y mantiene estados de carga/error, mientras utilidades y componentes gestionan cálculos y presentación. [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts), [frontend/src/components/dashboard/kpi-row.tsx](frontend/src/components/dashboard/kpi-row.tsx)
  **Regla propuesta:** conservar esa separación y los estados de carga/error al ampliar la interfaz.

## Backend

- **Hallazgo:** los modelos Pydantic y parámetros tipados definen el contrato y validan las entradas de API. [backend/app/routes.py](backend/app/routes.py)
  **Regla propuesta:** añadir o cambiar campos, filtros y respuestas mediante modelos/parámetros tipados, actualizando las pruebas de rutas. [backend/tests/test_routes.py](backend/tests/test_routes.py)
- **Hallazgo:** `generate_mock_movements` llama a `random.seed(seed)`, modificando el estado aleatorio global. [backend/app/routes.py](backend/app/routes.py)
  **Regla propuesta:** usar un generador local con semilla para conservar reproducibilidad sin afectar otros consumidores de aleatoriedad.
- **Hallazgo:** los endpoints filtran movimientos y devuelven listas en orden cronológico. [backend/app/routes.py](backend/app/routes.py)
  **Regla propuesta:** preservar filtros y orden, y cubrir ambos comportamientos con pruebas.

## Integración

- **Hallazgo:** el contrato de movimientos está definido tanto en Pydantic como en TypeScript. [backend/app/routes.py](backend/app/routes.py), [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts)
  **Regla propuesta:** mantener sincronizados campos y valores permitidos en ambos lados cada vez que cambie el contrato.
- **Hallazgo:** Vite reenvía `/api` a `http://backend:8000`, nombre resoluble dentro de la red de Docker Compose. [frontend/vite.config.ts](frontend/vite.config.ts), [docker-compose.yml](docker-compose.yml)
  **Regla propuesta:** al cambiar servicios, proxy o puertos, revisar conjuntamente Compose y la configuración de Vite.
- **Hallazgo:** hay pruebas de utilidades frontend y de endpoints backend, pero no se encontró una prueba que cubra el flujo de petición y renderizado completo. [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts), [backend/tests/test_routes.py](backend/tests/test_routes.py)
  **Regla propuesta:** añadir cobertura de integración cuando cambie el flujo entre API y pantalla.