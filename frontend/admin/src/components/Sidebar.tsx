import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  PawPrint,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: ShoppingBag, label: "Orders", path: "/orders" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: MessageSquare, label: "Reviews", path: "/reviews" },
];

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 z-40">
      <div className="p-8 flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
        >
          <PawPrint className="text-white w-6 h-6" />
        </motion.div>
        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
          PetKart<span className="text-indigo-600">Admin</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Main Menu
          </p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
              )
            }
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-semibold text-sm">{item.label}</span>
            <ChevronRight
              className={cn(
                "ml-auto w-4 h-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1",
                "text-current"
              )}
            />
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/10 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
