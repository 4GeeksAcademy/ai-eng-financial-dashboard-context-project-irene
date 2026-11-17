import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type TopCategoryItem, type FacetsResponse } from '@/lib/financial-types'
import { formatCurrency, formatPercent } from '@/lib/financial-utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

interface B2BB2CComparisonProps {
  onNavigateBack: () => void
}

/* ------------------------------------------------------------------ */
/*  Data-fetch helpers                                                 */
/* ------------------------------------------------------------------ */

async function fetchTopCategories(
  businessType: string,
  startDate?: string,
  endDate?: string,
): Promise<TopCategoryItem[]> {
  const params = new URLSearchParams({
    operation_type: 'income',
    limit: '5',
    business_type: businessType,
  })
  if (startDate) params.set('start_date', startDate)
  if (endDate) params.set('end_date', endDate)

  const res = await fetch(`${API_BASE_URL}/api/metrics/categories/top?${params}`)
  if (!res.ok) throw new Error(`Failed to fetch top categories for ${businessType}: ${res.status}`)
  return res.json()
}

async function fetchFacets(): Promise<FacetsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/metrics/facets`)
  if (!res.ok) throw new Error(`Failed to fetch facets: ${res.status}`)
  return res.json()
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface CategoryTableProps {
  title: string
  items: TopCategoryItem[] | null
  loading: boolean
  totalIncome: number
}

function CategoryTable({ title, items, loading, totalIncome }: CategoryTableProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription>Top 5 income categories — total {formatCurrency(totalIncome)}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </div>
        ) : items === null ? (
          <p className="text-sm text-muted-foreground">Could not load data.</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No income categories available for this group.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-2 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-2 py-2 text-right font-medium text-muted-foreground">Total</th>
                  <th className="px-2 py-2 text-right font-medium text-muted-foreground">% of group</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.category} className="border-b border-border last:border-0">
                    <td className="px-2 py-2 text-left capitalize">{item.category}</td>
                    <td className="px-2 py-2 text-right font-mono">{formatCurrency(item.total_amount)}</td>
                    <td className="px-2 py-2 text-right font-mono text-muted-foreground">
                      {totalIncome > 0 ? formatPercent((item.total_amount / totalIncome) * 100) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface IncomeComparisonChartProps {
  b2bTotal: number
  b2cTotal: number
}

function IncomeComparisonChart({ b2bTotal, b2cTotal }: IncomeComparisonChartProps) {
  const data = [
    { name: 'B2B', income: b2bTotal },
    { name: 'B2C', income: b2cTotal },
  ]

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Income Comparison: B2B vs B2C</CardTitle>
        <CardDescription>Total income by business line</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 13, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const val = payload[0].value as number
                return (
                  <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
                    <p className="font-semibold text-foreground mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--chart-income)' }} />
                      <span className="text-muted-foreground">Income:</span>
                      <span className="font-medium text-foreground ml-auto pl-4">{formatCurrency(val)}</span>
                    </div>
                  </div>
                )
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-muted-foreground capitalize">{value}</span>
              )}
            />
            <Bar
              dataKey="income"
              name="income"
              fill="var(--chart-income)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function B2BB2CComparison({ onNavigateBack }: B2BB2CComparisonProps) {
  const [b2bCategories, setB2bCategories] = useState<TopCategoryItem[] | null>(null)
  const [b2bLoading, setB2bLoading] = useState(true)
  const [b2cCategories, setB2cCategories] = useState<TopCategoryItem[] | null>(null)
  const [b2cLoading, setB2cLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ min: string; max: string } | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const b2bTotal = b2bCategories?.reduce((sum, item) => sum + item.total_amount, 0) ?? 0
  const b2cTotal = b2cCategories?.reduce((sum, item) => sum + item.total_amount, 0) ?? 0

  /* load date range hint from facets */
  useEffect(() => {
    fetchFacets()
      .then((f) => setDateRange({ min: f.min_date, max: f.max_date }))
      .catch(() => { /* non-critical, facets are just a hint */ })
  }, [])

  const loadData = useCallback(async (sd: string, ed: string) => {
    setB2bLoading(true)
    setB2cLoading(true)

    const start = sd || undefined
    const end = ed || undefined

    try {
      const [b2b, b2c] = await Promise.all([
        fetchTopCategories('B2B', start, end),
        fetchTopCategories('B2C', start, end),
      ])
      setB2bCategories(b2b)
      setB2cCategories(b2c)
    } catch {
      setB2bCategories(null)
      setB2cCategories(null)
    } finally {
      setB2bLoading(false)
      setB2cLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(startDate, endDate)
  }, [startDate, endDate, loadData])

  const hasAnyData = b2bCategories !== null && b2cCategories !== null

  return (
    <div className="flex flex-col gap-8">
      {/* Navigation & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="b2b-start" className="text-xs text-muted-foreground">From:</label>
            <input
              id="b2b-start"
              type="date"
              value={startDate}
              min={dateRange?.min ?? ''}
              max={dateRange?.max ?? ''}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="b2b-end" className="text-xs text-muted-foreground">To:</label>
            <input
              id="b2b-end"
              type="date"
              value={endDate}
              min={dateRange?.min ?? ''}
              max={dateRange?.max ?? ''}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
            />
          </div>
          {dateRange && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Available: {dateRange.min} – {dateRange.max}
            </span>
          )}
        </div>
      </div>

      {/* Two category tables side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryTable
          title="B2B — Top Income Categories"
          items={b2bCategories}
          loading={b2bLoading}
          totalIncome={b2bTotal}
        />
        <CategoryTable
          title="B2C — Top Income Categories"
          items={b2cCategories}
          loading={b2cLoading}
          totalIncome={b2cTotal}
        />
      </div>

      {/* Comparison bar chart */}
      {hasAnyData && (
        <IncomeComparisonChart b2bTotal={b2bTotal} b2cTotal={b2cTotal} />
      )}

      {/* Empty state when both failed to load */}
      {!hasAnyData && !b2bLoading && !b2cLoading && (
        <Card className="border-border/60">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Could not load comparison data. Check the backend API.
          </CardContent>
        </Card>
      )}
    </div>
  )
}