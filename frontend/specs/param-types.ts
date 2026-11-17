// Parámetros de query verificados contra OpenAPI /docs
// Fecha de verificación: 2026-11-17

import type {
  BusinessType,
  Category,
  OperationType,
} from '../src/lib/financial-types'

/**
 * Fechas opcionales como string en formato YYYY-MM-DD.
 * Se envían como query parameters start_date y end_date.
 * Cuando son null/undefined, el endpoint no filtra por fecha.
 *
 * Verificado contra: GET /api/metrics, GET /api/metrics/alerts,
 *   GET /api/metrics/categories/top, GET /api/metrics/summary
 */
export interface DateRangeFilter {
  start_date?: string
  end_date?: string
}

/**
 * Parámetros para GET /api/metrics/alerts
 * - threshold: number, default=0.3, ge=0
 * - group_by: string, default="month". Valores: "day" | "week" | "month"
 * - business_type: string | null. Valores: "B2B" | "B2C"
 * - start_date, end_date: string | null
 */
export interface AlertsParams extends DateRangeFilter {
  threshold?: number
  group_by?: 'day' | 'week' | 'month'
  business_type?: BusinessType
}

/**
 * Parámetros para GET /api/metrics/categories/top
 * - operation_type: string, default="outcome". Valores: "income" | "outcome"
 * - limit: integer, default=5, ge=1, le=20
 * - business_type: string | null
 * - start_date, end_date: string | null
 */
export interface TopCategoriesParams extends DateRangeFilter {
  operation_type?: OperationType
  limit?: number
  business_type?: BusinessType
}

/**
 * Parámetros para GET /api/metrics/summary
 * - group_by: string, default="month". Valores: "day" | "week" | "month"
 * - category: string | null
 * - operation_type: string | null
 * - business_type: string | null
 * - start_date, end_date: string | null
 */
export interface SummaryParams extends DateRangeFilter {
  group_by?: 'day' | 'week' | 'month'
  category?: Category
  operation_type?: OperationType
  business_type?: BusinessType
}

/**
 * Parámetros para GET /api/metrics/comparison
 * - start_date: string (required)
 * - end_date: string (required)
 * - business_type: string | null
 */
export interface ComparisonParams {
  start_date: string   // required
  end_date: string     // required
  business_type?: BusinessType
}