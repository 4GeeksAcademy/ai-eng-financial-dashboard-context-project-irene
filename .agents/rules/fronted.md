# Reglas del frontend

## Objetivos
- Mantener el dashboard financiero React + TypeScript y su flujo de carga, cálculo y presentación.

## Justificación
- `App` solicita `/api/metrics` y conserva los estados de carga y error; las utilidades calculan KPI y datos mensuales. [frontend/src/App.tsx](../../frontend/src/App.tsx), [frontend/src/lib/financial-utils.ts](../../frontend/src/lib/financial-utils.ts)
- Los datos y valores de dominio se tipan en TypeScript. [frontend/src/lib/financial-types.ts](../../frontend/src/lib/financial-types.ts)

## Reglas
- Mantener la petición y los estados de pantalla en `App`, los cálculos en `financial-utils` y la presentación en componentes.
- Mantener los tipos del frontend alineados con los modelos y valores de la API.
- Agrupar fechas `YYYY-MM-DD` sin desplazamientos de mes por zona horaria; añadir pruebas para los límites de mes.
- No mostrar periodos fijos que contradigan las fechas dinámicas del backend.
- Preservar los estados de carga y error al cambiar el flujo de datos.

## Ejemplos

Correcto, delega cálculos en utilidades:

```tsx
setMetrics(computeKPIs(movements));
setMonthlyData(computeMonthlyData(movements));
```

Incorrecto, fija un periodo que no corresponde con las fechas simuladas:

```tsx
<DashboardHeader period="2024 - Full Year" />
```

El segundo ejemplo aparece actualmente en `frontend/src/App.tsx`; el backend genera fechas dinámicas. [frontend/src/App.tsx](../../frontend/src/App.tsx), [backend/app/routes.py](../../backend/app/routes.py)