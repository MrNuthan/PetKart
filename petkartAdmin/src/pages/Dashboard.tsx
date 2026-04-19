import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { adminService, type Analytics } from "../services/adminService";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService
      .fetchAnalytics()
      .then(setAnalytics)
      .catch((err) => {
        console.error("Failed to load analytics", err);
        setError("Failed to load dashboard data.");
      });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-rose-400 font-medium">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      positive: true,
    },
    {
      label: "Total Orders",
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      positive: true,
    },
    {
      label: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      positive: true,
    },
    {
      label: "Total Products",
      value: analytics.totalProducts.toLocaleString(),
      icon: Package,
      positive: true,
    },
  ];

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                <stat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Revenue Growth</h3>
              <p className="text-sm text-slate-500 mt-1">
                Last 7 days performance
              </p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                  dx={-10}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  cursor={{
                    stroke: "#4f46e5",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  itemStyle={{ color: "#fff", fontWeight: 700 }}
                  labelStyle={{
                    color: "#94a3b8",
                    marginBottom: "4px",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    fontWeight: 800,
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <h3 className="text-xl font-bold mb-8">Recent Activity</h3>
          <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
            {analytics.recentActivity.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex gap-6 relative"
              >
                <div className="w-4 h-4 mt-1 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 shrink-0 z-10 shadow-sm" />
                <div>
                  <p className="text-sm font-bold">
                    Order #{activity.id} — {activity.customer}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-medium">
                      ₹{activity.amount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(activity.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
            {analytics.recentActivity.length === 0 && (
              <p className="text-sm text-slate-500 pl-10">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
