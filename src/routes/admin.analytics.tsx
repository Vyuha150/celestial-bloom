import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { getDashboard, getCohortRetention, getFunnel } from "@/admin/api";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});

const COLORS = ["oklch(0.72 0.12 75)", "oklch(0.88 0.06 85)", "oklch(0.65 0.15 200)", "oklch(0.6 0.18 160)", "oklch(0.55 0.2 320)", "oklch(0.7 0.05 30)"];

function Analytics() {
  const { data: dashboard, isLoading: loadingDash } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getDashboard });
  const { data: cohorts, isLoading: loadingCohorts } = useQuery({ queryKey: ["admin", "cohorts"], queryFn: getCohortRetention });
  const { data: funnel, isLoading: loadingFunnel } = useQuery({ queryKey: ["admin", "funnel"], queryFn: getFunnel });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow">Insights</p>
        <h1 className="text-display text-4xl mt-1">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Customer-, product- and channel-level analytics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Revenue & orders">
          {loadingDash || !dashboard ? (
            <Loading />
          ) : dashboard.revenueTrend.length === 0 ? (
            <Empty label="No orders yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dashboard.revenueTrend}>
                <defs>
                  <linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.88 0.06 85)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.88 0.06 85)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
                <XAxis dataKey="d" stroke="oklch(0.65 0.02 80)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} />
                <Tooltip contentStyle={tooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.12 75)" fill="url(#r)" />
                <Area type="monotone" dataKey="orders" stroke="oklch(0.88 0.06 85)" fill="url(#o)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Category mix">
          {loadingDash || !dashboard ? (
            <Loading />
          ) : dashboard.categoryMix.length === 0 ? (
            <Empty label="No sales yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={dashboard.categoryMix} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60} stroke="oklch(0.18 0.03 270)">
                  {dashboard.categoryMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Top products (30d revenue)">
          {loadingDash || !dashboard ? (
            <Loading />
          ) : dashboard.topProducts.length === 0 ? (
            <Empty label="No sales yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboard.topProducts} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
                <XAxis type="number" stroke="oklch(0.65 0.02 80)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="oklch(0.65 0.02 80)" fontSize={11} width={120} />
                <Tooltip contentStyle={tooltip} />
                <Bar dataKey="revenue" fill="oklch(0.72 0.12 75)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Cohort retention (repeat purchase within 60d)">
          {loadingCohorts || !cohorts ? (
            <Loading />
          ) : cohorts.length === 0 ? (
            <Empty label="No customer cohorts yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cohorts}>
                <defs>
                  <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
                <XAxis dataKey="cohort" stroke="oklch(0.65 0.02 80)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} unit="%" />
                <Tooltip contentStyle={tooltip} />
                <Area type="monotone" dataKey="repeatRatePct" stroke="oklch(0.65 0.15 200)" fill="url(#c)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Traffic sources">
          {loadingDash || !dashboard ? (
            <Loading />
          ) : dashboard.trafficSources.length === 0 ? (
            <Empty label="No traffic recorded yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboard.trafficSources}>
                <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
                <XAxis dataKey="src" stroke="oklch(0.65 0.02 80)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} unit="%" />
                <Tooltip contentStyle={tooltip} />
                <Bar dataKey="v" fill="oklch(0.88 0.06 85)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Funnel (30d)">
          {loadingFunnel || !funnel ? (
            <Loading />
          ) : (
            <div className="space-y-3 py-2">
              {funnel.map((row, i) => {
                const base = funnel[0]?.count || 1;
                const pct = (row.count / base) * 100;
                return (
                  <div key={row.stage}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{row.stage}</span>
                      <span className="text-muted-foreground">{row.count.toLocaleString()} · {pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 bg-obsidian border border-border">
                      <div className="h-full" style={{ width: `${pct}%`, background: "var(--gradient-gold)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

const tooltip: React.CSSProperties = {
  background: "oklch(0.18 0.03 270)",
  border: "1px solid oklch(0.28 0.02 270)",
  fontSize: 12,
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-midnight/40 p-5">
      <h3 className="text-display text-xl mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Loading() {
  return <div className="h-[280px] flex items-center justify-center text-xs text-muted-foreground">Loading…</div>;
}
function Empty({ label }: { label: string }) {
  return <div className="h-[280px] flex items-center justify-center text-xs text-muted-foreground">{label}</div>;
}
