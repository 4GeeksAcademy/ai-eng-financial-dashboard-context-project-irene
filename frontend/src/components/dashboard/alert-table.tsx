import { type AlertEntry } from '@/lib/financial-types'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

interface AlertTableProps {
  alerts: AlertEntry[] | null
  loading: boolean
  threshold: number
  onThresholdChange: (value: number) => void
}

export function AlertTable({ alerts, loading, threshold, onThresholdChange }: AlertTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Anomaly Alerts</CardTitle>
            <CardDescription>
              Periods where outcome spending increased unexpectedly
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="threshold-input" className="text-sm text-muted-foreground">
              Threshold:
            </label>
            <input
              id="threshold-input"
              type="number"
              min={0.01}
              max={1.0}
              step={0.05}
              value={threshold}
              onChange={(e) => {
                const val = Number.parseFloat(e.target.value)
                if (!Number.isNaN(val) && val >= 0.01 && val <= 1.0) {
                  onThresholdChange(val)
                }
              }}
              className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : alerts === null ? (
          <p className="text-sm text-muted-foreground">
            Could not load alert data. Check the backend API.
          </p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No anomalies detected for the current threshold ({formatPercent(threshold)}).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Period</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Outcome</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Moving Avg (3)</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Increase</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.period} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 text-left">{alert.period}</td>
                    <td className="px-3 py-2 text-right font-mono">{formatCurrency(alert.outcome_total)}</td>
                    <td className="px-3 py-2 text-right font-mono">{formatCurrency(alert.baseline_average)}</td>
                    <td className="px-3 py-2 text-right font-mono text-destructive">
                      +{formatPercent(alert.increase_ratio)}
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