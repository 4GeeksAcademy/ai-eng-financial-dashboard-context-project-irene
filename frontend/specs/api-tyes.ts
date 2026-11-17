// Especificaciones verificadas contra OpenAPI /docs
// Fecha de verificación: 2026-11-17

import type {
  BusinessType,
  Category,
  OperationType,
} from '../src/lib/financial-types'

// --- GET /api/metrics/facets ---
// Response: MetricsFacets
export interface FacestsResponse {
  operation_types: OperationType[]
  business_types: BusinessType[]
  categories: Category[]
  min_date: string   // format: date (YYYY-MM-DD)
  max_date: string   // format: date (YYYY-MM-DD)
}

// --- GET /api/metrics/alerts ---
// Params: threshold (number, default=0.3), group_by (string, default="month"),
//         start_date (string | null), end_date (string | null), business_type (string | null)
// Response: list of MetricsAlert
export interface AlertEntry {
  period: string
  outcome_total: number
  baseline_average: number
  increase_ratio: number
}

export interface AlertsResponse extends Array<AlertEntry> {}

// --- GET /api/metrics/categories/top ---
// Params: operation_type (string, default="outcome"), limit (integer, default=5, ge=1, le=20),
//         start_date (string | null), end_date (string | null), business_type (string | null)
// Response: list of TopCategoryItem
export interface CategoryEntry {
  category: Category
  operation_type: OperationType
  total_amount: number
}

export interface TopCategoriesResponse extends Array<CategoryEntry> {}

// --- GET /api/metrics/summary ---
// Params: group_by (string, default="month"), start_date (string | null), end_date (string | null),
//         category (string | null), operation_type (string | null), business_type (string | null)
// Response: list of MetricsSummaryItem
export interface SummaryEntry {
  period: string
  income: number
  outcome: number
  net: number
}

export interface SummaryResponse extends Array<SummaryEntry> {}

// --- GET /api/metrics/comparison ---
// Params: start_date (string, required), end_date (string, required), business_type (string | null)
// Response: MetricsComparison
export interface ComparisonEntry {
  current_period: number
  previous_period: number
  delta_abs: number
  delta_pct: number | null
}