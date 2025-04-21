'use client'

import { useState, useEffect } from "react";
import DashboardLayoutWrapper from "../dashboard-layout";
import { 
  PerformanceOverview, 
  EquityChart,
  StrategyPerformance,
  TradingActivityChart
} from "../../components/dashboard/performance-chart";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

// Mock performance data
const mockPerformanceData = {
  totalPnL: 125430.75,
  winRate: 58.7,
  totalTrades: 126,
  profitFactor: 1.85,
  maxDrawdown: 12.4,
  sharpeRatio: 1.32
};

// Mock equity curve data
const generateEquityCurveData = () => {
  const data = [];
  let equity = 1000000; // Starting equity
  let benchmark = 1000000; // Starting benchmark value
  
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Simulate some daily returns
    const dailyReturn = (Math.random() * 0.02) - 0.01; // -1% to +1%
    const benchmarkReturn = (Math.random() * 0.015) - 0.005; // Slightly lower volatility
    
    equity = equity * (1 + dailyReturn);
    benchmark = benchmark * (1 + benchmarkReturn);
    
    data.push({
      date: date.toISOString().split('T')[0],
      equity: Math.round(equity),
      benchmark: Math.round(benchmark)
    });
  }
  
  return data;
};

// Mock strategy performance data
const mockStrategyData = [
  { name: "Momentum", winRate: 62.5, trades: 56, profitFactor: 2.1 },
  { name: "Mean Reversion", winRate: 58.3, trades: 48, profitFactor: 1.7 },
  { name: "MACD Crossover", winRate: 53.1, trades: 32, profitFactor: 1.3 }
];

// Mock trading activity data
const generateTradingActivityData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Generate random trading activity
    const profitTrades = Math.floor(Math.random() * 5) + 1;
    const lossTrades = Math.floor(Math.random() * 4);
    
    data.push({
      date: date.toISOString().split('T')[0],
      profit: profitTrades * (Math.random() * 5000 + 1000),
      loss: lossTrades * (Math.random() * 3000 + 500) * -1,
      trades: profitTrades + lossTrades
    });
  }
  
  return data;
};

export default function PerformancePage() {
  const [performanceData, setPerformanceData] = useState(null);
  const [equityData, setEquityData] = useState([]);
  const [strategyData, setStrategyData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [timeRange, setTimeRange] = useState("1m"); // 1d, 1w, 1m, 3m, ytd, 1y
  const [loading, setLoading] = useState(true);

  // Simulate API fetch
  useEffect(() => {
    // This would be replaced by actual API calls
    setLoading(true);
    
    setTimeout(() => {
      setPerformanceData(mockPerformanceData);
      setEquityData(generateEquityCurveData());
      setStrategyData(mockStrategyData);
      setActivityData(generateTradingActivityData());
      setLoading(false);
    }, 800);
  }, [timeRange]);

  return (
    <DashboardLayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <div className="flex items-center space-x-2 rounded-md border bg-background p-1">
            {["1d", "1w", "1m", "3m", "ytd", "1y"].map((range) => (
              <button
                key={range}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <PerformanceOverview data={performanceData} />
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <EquityChart data={equityData} title="Equity Curve" />
              <StrategyPerformance data={strategyData} title="Strategy Comparison" />
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TradingActivityChart data={activityData} title="Daily Trading Activity" />
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Symbols</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">Symbol</div>
                      <div className="flex items-center space-x-8">
                        <div className="font-medium text-right w-20">P&L</div>
                        <div className="font-medium text-right w-20">Win Rate</div>
                        <div className="font-medium text-right w-20">Trades</div>
                      </div>
                    </div>
                    
                    {/* Symbol performance rows */}
                    {[
                      { symbol: "SBER", pnl: 42580.50, winRate: 65.2, trades: 23 },
                      { symbol: "GAZP", pnl: 31240.75, winRate: 57.9, trades: 19 },
                      { symbol: "LKOH", pnl: 28650.25, winRate: 60.0, trades: 15 },
                      { symbol: "YNDX", pnl: 15320.00, winRate: 53.8, trades: 13 },
                      { symbol: "GMKN", pnl: -5420.75, winRate: 36.4, trades: 11 }
                    ].map((item) => (
                      <div key={item.symbol} className="flex items-center justify-between py-2">
                        <div className="font-medium">{item.symbol}</div>
                        <div className="flex items-center space-x-8">
                          <div className={`text-right w-20 ${item.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                            {item.pnl >= 0 ? "+" : ""}{item.pnl.toLocaleString()} ₽
                          </div>
                          <div className="text-right w-20">{item.winRate}%</div>
                          <div className="text-right w-20">{item.trades}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Trading Journal</h2>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Strategy</th>
                      <th className="text-right p-2">Entry</th>
                      <th className="text-right p-2">Exit</th>
                      <th className="text-right p-2">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: "2024-04-19", symbol: "SBER", type: "BUY", strategy: "Momentum", entry: 270.45, exit: 283.20, pnl: 12.75 },
                      { date: "2024-04-18", symbol: "GAZP", type: "SELL", strategy: "Mean Reversion", entry: 168.35, exit: 162.80, pnl: 5.55 },
                      { date: "2024-04-18", symbol: "LKOH", type: "BUY", strategy: "Momentum", entry: 6580.00, exit: 6640.50, pnl: 60.50 },
                      { date: "2024-04-17", symbol: "YNDX", type: "BUY", strategy: "MACD Crossover", entry: 2485.80, exit: 2510.25, pnl: 24.45 },
                      { date: "2024-04-17", symbol: "GMKN", type: "SELL", strategy: "Mean Reversion", entry: 13450.00, exit: 13520.25, pnl: -70.25 }
                    ].map((trade, index) => (
                      <tr key={index} className="border-t even:bg-muted/20">
                        <td className="p-2">{trade.date}</td>
                        <td className="p-2">{trade.symbol}</td>
                        <td className="p-2">
                          <span className={`rounded px-1 py-0.5 text-xs font-medium ${
                            trade.type === "BUY" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="p-2">{trade.strategy}</td>
                        <td className="p-2 text-right">{trade.entry.toFixed(2)}</td>
                        <td className="p-2 text-right">{trade.exit.toFixed(2)}</td>
                        <td className={`p-2 text-right ${trade.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                          {trade.pnl >= 0 ? "+" : ""}{trade.pnl.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayoutWrapper>
  );
}
