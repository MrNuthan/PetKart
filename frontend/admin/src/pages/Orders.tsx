import React, { useEffect, useState } from "react";
import { Search, Filter, Eye, MoreVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { adminService, type AdminOrder } from "../services/adminService";

const statusColors: Record<string, string> = {
  Placed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Packed: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Shipped: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Out for Delivery": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await adminService.fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const updated = await adminService.updateOrderStatus(id, status);
      setOrders(orders.map((o) => (o.id === id ? updated : o)));
      if (selectedOrder?.id === id) setSelectedOrder(updated);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === "All" || o.status === filter;
    const matchesSearch =
      search === "" ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      `#ORD-${o.id}`.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search);
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        <span className="text-sm text-slate-500 font-medium">
          {orders.length} total orders
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-6 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Filter:
              </span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer"
              >
                <option>All</option>
                <option>Placed</option>
                <option>Packed</option>
                <option>Shipped</option>
                <option>Out for Delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Payment</th>
                <th className="px-8 py-5 text-right">Amount</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                      #ORD-{order.id}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                        {order.customer_name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold block">{order.customer_name}</span>
                        <span className="text-[10px] text-slate-400">{order.customer_email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {order.payment_method === "cod" ? "COD" : "Online"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-right">
                    ₹{Number(order.total_amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-none outline-none cursor-pointer transition-all active:scale-95",
                        statusColors[order.status] || "bg-slate-100 text-slate-700"
                      )}
                    >
                      <option>Placed</option>
                      <option>Packed</option>
                      <option>Shipped</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-slate-400 text-sm">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold">Order #ORD-{selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Customer</p>
                    <p className="font-bold">{selectedOrder.customer_name}</p>
                    <p className="text-slate-500 text-xs">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Amount</p>
                    <p className="font-black text-lg">₹{Number(selectedOrder.total_amount).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Status</p>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl", statusColors[selectedOrder.status])}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Payment</p>
                    <p className="font-bold">{selectedOrder.payment_method === "cod" ? "Cash on Delivery" : "Razorpay"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Shipping Address</p>
                  <p className="text-sm">{selectedOrder.address_line_1}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}</p>
                  {selectedOrder.phone && <p className="text-xs text-slate-500 mt-1">Phone: {selectedOrder.phone}</p>}
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        {item.product_image && (
                          <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-bold">{item.product_name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}</p>
                        </div>
                        <p className="text-sm font-bold">₹{(item.quantity * Number(item.price)).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
