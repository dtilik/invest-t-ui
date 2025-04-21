import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { formatCurrency, formatPercent } from "../../lib/utils";

export function AccountCard({ account }) {
  const {
    name,
    balance,
    currency = "RUB",
    change = 0,
    changePercent = 0,
    accountType = "Sandbox",
    accountId = "123456789",
  } = account || {};

  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <p className="text-xs text-muted-foreground">ID: {accountId}</p>
        </div>
        <div className="rounded bg-secondary px-2 py-1 text-xs">
          {accountType}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(balance, currency)}
        </div>
        <div className="mt-1 flex items-center space-x-2">
          <div
            className={`flex items-center text-sm ${
              isPositive ? "text-profit" : "text-loss"
            }`}
          >
            {isPositive ? (
              <TrendingUpIcon className="mr-1 h-4 w-4" />
            ) : (
              <TrendingDownIcon className="mr-1 h-4 w-4" />
            )}
            <span>
              {formatCurrency(Math.abs(change), currency)} (
              {formatPercent(Math.abs(changePercent))})
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <div className="flex justify-between w-full">
          <div className="text-xs text-muted-foreground">Available Cash</div>
          <div className="text-xs font-medium">
            {formatCurrency(balance * 0.9, currency)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
