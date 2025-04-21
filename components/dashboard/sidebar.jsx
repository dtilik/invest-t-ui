'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  LineChartIcon, 
  BarChart2Icon, 
  SettingsIcon, 
  UsersIcon, 
  ActivityIcon, 
  HistoryIcon,
  DollarSignIcon
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: UsersIcon,
  },
  {
    title: "Strategies",
    href: "/strategies",
    icon: LineChartIcon,
  },
  {
    title: "Trades",
    href: "/trades",
    icon: ActivityIcon,
  },
  {
    title: "Performance",
    href: "/performance",
    icon: BarChart2Icon,
  },
  {
    title: "History",
    href: "/history",
    icon: HistoryIcon,
  },
  {
    title: "Positions",
    href: "/positions",
    icon: DollarSignIcon,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 border-r bg-background px-3 py-8">
      <div className="flex items-center gap-2 px-4 mb-8">
        <DollarSignIcon className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Invest-T</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
