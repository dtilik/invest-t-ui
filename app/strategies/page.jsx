'use client'

import { useState, useEffect } from "react";
import { PlusIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import DashboardLayoutWrapper from "../dashboard-layout";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { StrategyCard } from "../../components/dashboard/strategy-card";

// Mock strategy data - would be fetched from your API
const mockStrategies = [
  {
    id: "strat-1",
    name: "Momentum Strategy",
    type: "simple_momentum",
    status: "active",
    description: "A momentum-based strategy that follows price trends",
    parameters: {
      lookback_period: 14,
      buy_threshold: 0.5,
      sell_threshold: 0.5
    },
    performance: {
      winRate: 62.5,
      profitFactor: 2.1,
      trades: 56,
      successfulTrades: 35,
    },
    lastUpdated: "2024-04-15T14:30:00Z",
  },
  {
    id: "strat-2",
    name: "Mean Reversion",
    type: "mean_reversion",
    status: "active",
    description: "Strategy that trades reversions to the mean price",
    parameters: {
      window: 20,
      std_dev_threshold: 1.5
    },
    performance: {
      winRate: 58.3,
      profitFactor: 1.7,
      trades: 48,
      successfulTrades: 28,
    },
    lastUpdated: "2024-04-12T09:15:00Z",
  },
  {
    id: "strat-3",
    name: "MACD Crossover",
    type: "custom",
    status: "inactive",
    description: "Signals based on MACD indicator crossovers",
    parameters: {
      fast_period: 12,
      slow_period: 26,
      signal_period: 9
    },
    performance: {
      winRate: 53.1,
      profitFactor: 1.3,
      trades: 32,
      successfulTrades: 17,
    },
    lastUpdated: "2024-03-25T11:45:00Z",
  },
];

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "simple_momentum",
    description: "",
    parameters: {}
  });

  // Simulate API fetch
  useEffect(() => {
    // This would be replaced by actual API calls
    setTimeout(() => {
      setStrategies(mockStrategies);
      setLoading(false);
    }, 800);
  }, []);

  // Filter strategies based on search term
  const filteredStrategies = strategies.filter(
    (strategy) =>
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateStrategy = () => {
    setEditingStrategy(null);
    setFormData({
      name: "",
      type: "simple_momentum",
      description: "",
      parameters: {
        lookback_period: 14,
        buy_threshold: 0.5,
        sell_threshold: 0.5
      }
    });
    setShowCreateForm(true);
  };

  const handleEditStrategy = (strategyId) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      setEditingStrategy(strategy);
      setFormData({
        name: strategy.name,
        type: strategy.type,
        description: strategy.description,
        parameters: { ...strategy.parameters }
      });
      setShowCreateForm(true);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // This would be an actual API call to refresh strategies
    setTimeout(() => {
      setStrategies(mockStrategies);
      setLoading(false);
    }, 800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleParameterChange = (paramName, value) => {
    setFormData({
      ...formData,
      parameters: {
        ...formData.parameters,
        [paramName]: value
      }
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // This would be an API call to create/update the strategy
    console.log("Submitting strategy:", formData);
    
    if (editingStrategy) {
      // Update existing strategy
      const updatedStrategies = strategies.map(s => 
        s.id === editingStrategy.id ? { ...s, ...formData, lastUpdated: new Date().toISOString() } : s
      );
      setStrategies(updatedStrategies);
    } else {
      // Create new strategy
      const newStrategy = {
        id: `strat-${strategies.length + 1}`,
        ...formData,
        status: "inactive",
        performance: {
          winRate: 0,
          profitFactor: 0,
          trades: 0,
          successfulTrades: 0,
        },
        lastUpdated: new Date().toISOString()
      };
      setStrategies([...strategies, newStrategy]);
    }
    
    setShowCreateForm(false);
  };

  const renderParameterInputs = () => {
    if (formData.type === "simple_momentum") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Lookback Period
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.lookback_period || 14}
              onChange={(e) => handleParameterChange("lookback_period", parseInt(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">Number of candles to analyze</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Buy Threshold
            </label>
            <input
              type="number"
              step="0.1"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.buy_threshold || 0.5}
              onChange={(e) => handleParameterChange("buy_threshold", parseFloat(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">Threshold for buy signals</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Sell Threshold
            </label>
            <input
              type="number"
              step="0.1"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.sell_threshold || 0.5}
              onChange={(e) => handleParameterChange("sell_threshold", parseFloat(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">Threshold for sell signals</p>
          </div>
        </>
      );
    } else if (formData.type === "mean_reversion") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Window Size
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.window || 20}
              onChange={(e) => handleParameterChange("window", parseInt(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">Size of the moving average window</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Standard Deviation Threshold
            </label>
            <input
              type="number"
              step="0.1"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.std_dev_threshold || 1.5}
              onChange={(e) => handleParameterChange("std_dev_threshold", parseFloat(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">Number of standard deviations for signal generation</p>
          </div>
        </>
      );
    } else if (formData.type === "custom") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Fast Period
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.fast_period || 12}
              onChange={(e) => handleParameterChange("fast_period", parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Slow Period
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.slow_period || 26}
              onChange={(e) => handleParameterChange("slow_period", parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Signal Period
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.parameters.signal_period || 9}
              onChange={(e) => handleParameterChange("signal_period", parseInt(e.target.value))}
            />
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <DashboardLayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trading Strategies</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={handleCreateStrategy}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Strategy
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search strategies..."
              className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="simple_momentum">Momentum</option>
            <option value="mean_reversion">Mean Reversion</option>
            <option value="custom">Custom</option>
          </select>
          <select 
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Create/Edit Strategy Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingStrategy ? "Edit Strategy" : "Create New Strategy"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Strategy Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Enter strategy name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Strategy Type
                    </label>
                    <select
                      name="type"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="simple_momentum">Momentum</option>
                      <option value="mean_reversion">Mean Reversion</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Brief description of the strategy"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <h3 className="text-md font-medium mb-2">Parameters</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {renderParameterInputs()}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingStrategy ? "Update Strategy" : "Create Strategy"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Strategies list */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredStrategies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No strategies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onEdit={handleEditStrategy}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayoutWrapper>
  );
}
