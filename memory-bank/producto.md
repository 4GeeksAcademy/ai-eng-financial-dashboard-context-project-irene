# Resumen del producto

## Descripción

Aplicación web de métricas financieras con frontend en React y TypeScript y backend en FastAPI. El dashboard obtiene movimientos desde `GET /api/metrics` y calcula indicadores y agregados para mostrarlos en pantalla.

## Funcionalidad implementada

- Presenta cuatro indicadores: ingresos totales, gastos totales, beneficio (ingresos menos gastos) y margen de beneficio.
- Muestra dos gráficos mensuales: evolución de ingresos frente a gastos y evolución del margen de beneficio.
- La API genera 360 movimientos financieros simulados y los ordena cronológicamente. Cada movimiento tiene fecha, importe, tipo de operación, categoría y tipo de negocio (`B2B` o `B2C`).
- La API permite filtrar movimientos por fecha, categoría y tipo de operación. La pantalla actual solicita `/api/metrics` sin parámetros, por lo que esos filtros no están expuestos en el dashboard.
- El frontend contempla estados de carga y error al solicitar los datos.

## Límites y observaciones verificadas

- Los movimientos son simulados; el código revisado no muestra persistencia ni conexión a una fuente de datos financieros real.
- Aunque la API tiene rutas adicionales para facetas y resúmenes, el dashboard actual solo consume `GET /api/metrics`.
- El encabezado muestra `2024 - Full Year`, pero las fechas generadas son dinámicas y no corresponden necesariamente a ese periodo.
- El código no permite afirmar quiénes son los usuarios previstos ni qué decisiones de negocio pretende facilitar el producto.
