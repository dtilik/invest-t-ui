import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom tooltip for the charts
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-md shadow-sm">
        <p className="text-xs font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {prefix}{entry.value.toLocaleString()}{suffix}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// Performance overview card with multiple metrics
export function PerformanceOverview({ data }) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    { name: 'Total P&L', value: data.totalPnL, prefix: '₽', suffix: '', color: data.totalPnL >= 0 ? 'text-profit' : 'text-loss' },
    { name: 'Win Rate', value: data.winRate, suffix: '%', color: data.winRate >= 50 ? 'text-profit' : 'text-muted-foreground' },
    { name: 'Total Trades', value: data.totalTrades, suffix: '', color: 'text-foreground' },
    { name: 'Profit Factor', value: data.profitFactor.toFixed(2), suffix: '', color: data.profitFactor >= 1 ? 'text-profit' : 'text-loss' },
    { name: 'Max Drawdown', value: data.maxDrawdown, suffix: '%', color: 'text-loss' },
    { name: 'Sharpe Ratio', value: data.sharpeRatio.toFixed(2), suffix: '', color: data.sharpeRatio >= 1 ? 'text-profit' : 'text-muted-foreground' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-1">
              <p className="text-xs text-muted-foreground">{metric.name}</p>
              <p className={`text-2xl font-semibold ${metric.color}`}>
                {metric.prefix}{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}{metric.suffix}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Equity chart component
export function EquityChart({ data, title = "Equity Curve" }) {
  const chartData = useMemo(() => {
    if (!data || !data.length) return [];
    return data.map(item => ({
      date: typeof item.date === 'string' ? item.date : new Date(item.date).toLocaleDateString(),
      equity: item.equity,
      benchmark: item.benchmark || null
    }));
  }, [data]);

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis 
                  tickFormatter={(value) => value.toLocaleString()}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip prefix="₽" />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="equity"
                  name="Portfolio Value"
                  stroke="#10b981"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
                {chartData[0]?.benchmark && (
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    name="Benchmark"
                    stroke="#6b7280"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Performance metrics by strategy
export function StrategyPerformance({ data, title = "Strategy Performance" }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                <YAxis 
                  yAxisId="left"
                  orientation="left" 
                  stroke="#8884d8"
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="winRate"
                  name="Win Rate (%)"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="trades"
                  name="# of Trades"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Trading Activity chart component
export function TradingActivityChart({ data, title = "Trading Activity" }) {
  const chartData = useMemo(() => {
    if (!data || !data.length) return [];
    return data;
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="loss"
                  name="Loss"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
