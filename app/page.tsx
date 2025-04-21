'use client'

import { useState, useEffect } from "react";
import DashboardLayoutWrapper from "./dashboard-layout";
import { AccountCard } from "../components/dashboard/account-card";
import { StrategyCard } from "../components/dashboard/strategy-card";
import { PriceChart } from "../components/dashboard/price-chart";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

// Types for our data models
interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  change: number;
  changePercent: number;
  accountType: string;
  accountId: string;
}

interface StrategyPerformance {
  winRate: number;
  profitFactor: number;
  trades: number;
  successfulTrades: number;
}

interface Strategy {
  id: string;
  name: string;
  type: string;
  status: string;
  performance: StrategyPerformance;
  lastUpdated: string;
}

interface PriceData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Mock data - would be fetched from your API in production
const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Main Trading Account",
    balance: 1548750.25,
    currency: "RUB",
    change: 12500.75,
    changePercent: 0.81,
    accountType: "Sandbox",
    accountId: "SB12345678",
  },
  {
    id: "acc-2",
    name: "Algorithmic Trading",
    balance: 568200.50,
    currency: "RUB",
    change: -3250.25,
    changePercent: -0.57,
    accountType: "Sandbox",
    accountId: "SB87654321",
  },
];

const mockStrategies: Strategy[] = [
  {
    id: "strat-1",
    name: "Momentum Strategy",
    type: "simple_momentum",
    status: "active",
    performance: {
      winRate: 62.5,
      profitFactor: 2.1,
      trades: 56,
      successfulTrades: 35,
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "strat-2",
    name: "Mean Reversion",
    type: "mean_reversion",
    status: "active",
    performance: {
      winRate: 58.3,
      profitFactor: 1.7,
      trades: 48,
      successfulTrades: 28,
    },
    lastUpdated: new Date().toISOString(),
  },
];

// Mock price data
const generateMockPriceData = (): PriceData[] => {
  const data: PriceData[] = [];
  const basePrice = 450;
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const volatility = 10;
    const randomChange = (Math.random() * volatility * 2) - volatility;
    const open = basePrice + randomChange;
    const high = open + Math.random() * 5;
    const low = open - Math.random() * 5;
    const close = (open + high + low + (Math.random() * 10 - 5)) / 3;
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: open,
      high: high,
      low: low,
      close: close,
      volume: Math.floor(Math.random() * 1000) + 500,
    });
  }
  
  return data;
};

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate API fetch
  useEffect(() => {
    // This would be replaced by actual API calls
    setTimeout(() => {
      setAccounts(mockAccounts);
      setStrategies(mockStrategies);
      setPriceData(generateMockPriceData());
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditStrategy = (strategyId: string): void => {
    console.log(`Editing strategy ${strategyId}`);
    // This would open a strategy editor dialog or navigate to strategy edit page
  };

  if (loading) {
    return (
      <DashboardLayoutWrapper>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayoutWrapper>
    );
  }

  return (
    <DashboardLayoutWrapper>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Create New Account
                </button>
                <button className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                  Add New Strategy
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Active Strategies</h2>
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onEdit={handleEditStrategy}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Market Data</h2>
            <PriceChart data={priceData} title="SBER" />
          </div>
        </div>
      </div>
    </DashboardLayoutWrapper>
  );
}
