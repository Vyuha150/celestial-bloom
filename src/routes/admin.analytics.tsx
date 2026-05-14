import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { adminProducts, categoryMix, revenueSeries, trafficSources } from "@/data/admin";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});

const COLORS = ["oklch(0.72 0.12 75)", "oklch(0.88 0.06 85)", "oklch(0.65 0.15 200)", "oklch(0.6 0.18 160)", "oklch(0.55 0.2 320)", "oklch(0.7 0.05 30)"];

const cohort = [
  { week: "W1", retained: 100 }, { week: "W2", retained: 78 }, { week: "W3", retained: 64 },
  { week: "W4", retained: 56 }, { week: "W6", retained: 48 }, { week: "W8", retained: 42 }, { week: "W12", retained: 38 },
];

function Analytics() {
  const topProducts = [...adminProducts].sort((a, b) => b.sales30d - a.sales30d).slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow">Insights</p>
        <h1 className="text-display text-4xl mt-1">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Customer-, product- and channel-level analytics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Revenue & orders">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueSeries}>
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
        </Panel>

        <Panel title="Category mix">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryMix} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60} stroke="oklch(0.18 0.03 270)">
                {categoryMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top products (30d units)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
              <XAxis type="number" stroke="oklch(0.65 0.02 80)" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="oklch(0.65 0.02 80)" fontSize={11} width={120} />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="sales30d" fill="oklch(0.72 0.12 75)" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cohort retention (12 weeks)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cohort}>
              <defs>
                <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="oklch(0.65 0.02 80)" fontSize={11} />
              <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} unit="%" />
              <Tooltip contentStyle={tooltip} />
              <Area type="monotone" dataKey="retained" stroke="oklch(0.65 0.15 200)" fill="url(#c)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Traffic sources">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trafficSources}>
              <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
              <XAxis dataKey="src" stroke="oklch(0.65 0.02 80)" fontSize={11} />
              <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} unit="%" />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="v" fill="oklch(0.88 0.06 85)" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Funnel">
          <div className="space-y-3 py-2">
            {[
              { s: "Visited site", v: 18420 },
              { s: "Viewed product", v: 9248 },
              { s: "Added to cart", v: 3120 },
              { s: "Reached checkout", v: 1840 },
              { s: "Completed purchase", v: 980 },
            ].map((row, i, arr) => {
              const pct = (row.v / arr[0].v) * 100;
              return (
                <div key={row.s}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{row.s}</span>
                    <span className="text-muted-foreground">{row.v.toLocaleString()} · {pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-obsidian border border-border">
                    <div className="h-full" style={{ width: `${pct}%`, background: "var(--gradient-gold)" }} />
                  </div>
                </div>
              );
            })}
          </div>
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
