import React, { useState, useEffect } from "react";
import { PlayIcon, PauseIcon, SettingsIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { formatPercent } from "../../lib/utils";

export function StrategyCard({ strategy, onEdit }) {
  const [formattedDate, setFormattedDate] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    if (strategy?.lastUpdated) {
      setFormattedDate(new Date(strategy.lastUpdated).toLocaleString());
    }
  }, [strategy?.lastUpdated]);
  const {
    id,
    name,
    type,
    status = "active",
    performance = {
      winRate: 58.5,
      profitFactor: 1.8,
      trades: 42,
      successfulTrades: 24,
    },
    lastUpdated = new Date().toISOString(),
  } = strategy || {};

  const isActive = status === "active";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="font-medium">{name}</CardTitle>
          <p className="text-xs text-muted-foreground">Type: {type}</p>
        </div>
        <div className={`rounded px-2 py-1 text-xs ${
          isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : 
                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
        }`}>
          {isActive ? "Active" : "Paused"}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className={`text-lg font-semibold ${performance.winRate >= 50 ? "text-profit" : "text-loss"}`}>
              {formatPercent(performance.winRate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Profit Factor</p>
            <p className={`text-lg font-semibold ${performance.profitFactor >= 1 ? "text-profit" : "text-loss"}`}>
              {performance.profitFactor.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trades</p>
            <p className="text-lg font-semibold">{performance.trades}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Successful</p>
            <p className="text-lg font-semibold">{performance.successfulTrades}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-2">
        <div className="text-xs text-muted-foreground">
          {isMounted ? `Last updated: ${formattedDate}` : "Loading..."}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            title={isActive ? "Pause strategy" : "Activate strategy"}
          >
            {isActive ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            title="Edit strategy"
            onClick={() => onEdit && onEdit(id)}
          >
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
