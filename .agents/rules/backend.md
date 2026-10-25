# Reglas del backend

## Objetivos
- Exponer métricas financieras validadas mediante FastAPI y conservar filtros y orden cronológico.

## Justificación
- `routes.py` define modelos Pydantic, tipos permitidos, generación simulada y endpoints con filtros. [backend/app/routes.py](../../backend/app/routes.py)
- Las pruebas comprueban cantidad, orden, salud y filtros de la API. [backend/tests/test_routes.py](../../backend/tests/test_routes.py)

## Reglas
- Definir respuestas con modelos Pydantic y parámetros con tipos explícitos; al cambiar el contrato, actualizar los tipos del frontend.
- Mantener los valores del dominio (`income`, `outcome`, `B2B`, `B2C`) y validar los filtros.
- Mantener el orden cronológico después de filtrar listas de movimientos.
- Conservar la reproducibilidad de los datos simulados sin alterar el estado aleatorio global; usar un generador local con semilla.
- Añadir o ajustar pruebas de rutas para los cambios de filtros, respuestas y orden.

## Ejemplos

Correcto, ordena los resultados tras aplicar filtros:

```python
return ensure_chronological_order(filtered)
```

Incorrecto, reinicia el generador aleatorio global:

```python
random.seed(seed)
```

El segundo ejemplo aparece actualmente en `generate_mock_movements`; conviene sustituirlo por un generador local para no afectar otros usos de aleatoriedad. [backend/app/routes.py](../../backend/app/routes.py)