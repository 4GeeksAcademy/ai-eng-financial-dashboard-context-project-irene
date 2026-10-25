# Estado del proyecto

## Funciona según el código revisado

> Esta sección describe comportamiento implementado y comprobaciones reflejadas en el código/pruebas existentes; no afirma que las pruebas o servicios se hayan ejecutado en esta revisión.

- El backend genera 360 movimientos financieros simulados y los ordena cronológicamente. Las pruebas comprueban cantidad y orden. Referencias: [backend/app/routes.py](../backend/app/routes.py), [backend/tests/test_routes.py](../backend/tests/test_routes.py).
- `GET /api/metrics` devuelve movimientos y admite filtros de fecha, categoría y tipo de operación. Hay pruebas para esos filtros. Referencias: [backend/app/routes.py](../backend/app/routes.py), [backend/tests/test_routes.py](../backend/tests/test_routes.py).
- El dashboard carga `GET /api/metrics`, calcula ingresos, gastos, beneficio y margen, y presenta gráficos mensuales de ingresos/gastos y margen. Las utilidades tienen pruebas para cálculos y formato. Referencias: [frontend/src/App.tsx](../frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts), [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts).
- El backend implementa endpoints adicionales para facetas, agregados, categorías principales, comparación, alertas y movimientos B2B/B2C; hay pruebas de estas rutas. El dashboard actual no las consume. Referencias: [backend/app/routes.py](../backend/app/routes.py), [backend/tests/test_routes.py](../backend/tests/test_routes.py), [frontend/src/App.tsx](../frontend/src/App.tsx).
- Vite reenvía `/api` al servicio `backend` en la configuración de desarrollo y Compose publica frontend en 5173 y backend en 8000. Referencias: [frontend/vite.config.ts](../frontend/vite.config.ts), [docker-compose.yml](../docker-compose.yml), [verificacion.md](../verificacion.md).

## Limitaciones actuales comprobables

- La fuente de datos es simulada; el código revisado no muestra persistencia ni conexión a datos financieros reales. Referencia: [backend/app/routes.py](../backend/app/routes.py).
- La interfaz solo solicita `/api/metrics` sin parámetros y no ofrece controles para los filtros ni las capacidades de las rutas adicionales. Referencia: [frontend/src/App.tsx](../frontend/src/App.tsx).
- El encabezado está fijado en `2024 - Full Year`, mientras que las fechas de los movimientos son dinámicas. La verificación registró que, al 17-10-2026, los datos abarcaban 2025-10 a 2026-09. Referencias: [frontend/src/App.tsx](../frontend/src/App.tsx), [backend/app/routes.py](../backend/app/routes.py), [verificacion.md](../verificacion.md).
- La agrupación de fechas `YYYY-MM-DD` usa `new Date()` y getters locales, lo que puede cambiar el día o mes según la zona horaria. Referencias: [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts), [engineering-finding.md](../engineering-finding.md).
- La generación con semilla llama a `random.seed(seed)` y modifica el estado aleatorio global. Referencias: [backend/app/routes.py](../backend/app/routes.py), [engineering-finding.md](../engineering-finding.md).
- Las pruebas cubren utilidades y endpoints, pero no se encontró una prueba de integración del flujo petición-renderizado. Las pruebas existentes no se ejecutaron durante esta revisión. Referencias: [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts), [backend/tests/test_routes.py](../backend/tests/test_routes.py), [engineering-finding.md](../engineering-finding.md).

## Próximos pasos sugeridos

1. Derivar el periodo del encabezado del rango de datos, en lugar de dejarlo fijo.
2. Manejar las fechas sin hora de forma independiente de la zona horaria y añadir pruebas en límites de mes.
3. Sustituir la semilla global por un generador aleatorio local.
4. Si se decide exponer los filtros o endpoints existentes en el producto, conectar la interfaz a ellos y cubrir el flujo con pruebas.
5. Ejecutar las pruebas backend/frontend y el build frontend para confirmar el estado operativo; añadir integración UI/API si se amplía ese flujo.

Estos pasos son sugerencias derivadas de los hallazgos documentados, no funcionalidades ya acordadas. Referencias: [engineering-finding.md](../engineering-finding.md), [verificacion.md](../verificacion.md), [Agents.md](../Agents.md).
