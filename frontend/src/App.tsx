import { useCallback, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import { AlertTable } from "@/components/dashboard/alert-table";
import { B2BB2CComparison } from "@/components/dashboard/b2b-b2c-comparison";
import {
  type AlertEntry,
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

async function fetchAlerts(threshold: number): Promise<AlertEntry[]> {
  const params = new URLSearchParams({ threshold: String(threshold) });
  const response = await fetch(`${API_BASE_URL}/api/metrics/alerts?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.status}`);
  }
  return response.json();
}

type View = "dashboard" | "b2b-comparison";

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertEntry[] | null>(null);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [threshold, setThreshold] = useState(0.3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialData()
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loadAlerts = useCallback(async (newThreshold: number) => {
    setAlertsLoading(true);
    try {
      const data = await fetchAlerts(newThreshold);
      setAlerts(data);
    } catch {
      setAlerts(null);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts(threshold);
  }, [threshold, loadAlerts]);

  function handleThresholdChange(value: number) {
    setThreshold(value);
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {view === "dashboard" && (
            <>
              <DashboardHeader
                period="2024 - Full Year"
                showComparisonLink
                onNavigateToComparison={() => setView("b2b-comparison")}
              />

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
                  {error}
                </div>
              ) : null}

              <section aria-label="Key performance indicators">
                <KPIRow metrics={metrics} loading={loading} />
              </section>

              <section
                aria-label="Financial charts"
                className="grid grid-cols-1 gap-4 xl:grid-cols-2"
              >
                <IncomeOutcomeChart data={monthlyData} loading={loading} />
                <ProfitPercentChart data={monthlyData} loading={loading} />
              </section>

              <section aria-label="Anomaly alerts">
                <AlertTable
                  alerts={alerts}
                  loading={alertsLoading}
                  threshold={threshold}
                  onThresholdChange={handleThresholdChange}
                />
              </section>
            </>
          )}

          {view === "b2b-comparison" && (
            <B2BB2CComparison onNavigateBack={() => setView("dashboard")} />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
