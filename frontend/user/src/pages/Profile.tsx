import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, MapPin, LogOut, Settings, Camera, ChevronRight,
  CheckCircle2, XCircle, Clock, Truck, ShoppingBag, CalendarDays, ChevronDown, ChevronUp,
  Mail, Phone, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { Link } from 'react-router-dom';
import OrderTracker from '../components/OrderTracker';
import WriteReviewModal from '../components/WriteReviewModal';

type ProfileTab = 'personal' | 'orders' | 'address';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [addressData, setAddressData] = useState({ address: '', city: '', postalCode: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{ productId: number; productName: string; orderId: number } | null>(null);
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set());

  // FIX #6: Sync form fields when user data changes (e.g. after address is saved from checkout)
  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  }, [user?.firstName, user?.lastName, user?.email, user?.phone]);

  // Parse saved address
  useEffect(() => {
    if (user?.address) {
      try {
        const p = JSON.parse(user.address);
        setAddressData({ address: p.address || '', city: p.city || '', postalCode: p.postalCode || '' });
      } catch {
        setAddressData({ address: user.address, city: '', postalCode: '' });
      }
    }
  }, [user?.address]);

  useEffect(() => {
    if (activeTab === 'orders') loadOrders();
  }, [activeTab]);

  // FIX #2: Expose error state instead of catching silently
  const loadOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      const msg =
        err?.response?.status === 401
          ? 'Session expired. Please sign in again.'
          : err?.response?.data?.detail ||
            'Failed to load orders. Please try again.';
      setOrdersError(msg);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSavePersonal = async () => {
    setIsSaving(true); setSaveMsg(null);
    try {
      await updateUser({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone });
      setIsEditing(false);
      setSaveMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally { setIsSaving(false); }
  };

  const handleSaveAddress = async () => {
    setIsSaving(true); setSaveMsg(null);
    try {
      await updateUser({ address: JSON.stringify(addressData) });
      setSaveMsg({ type: 'success', text: 'Address saved! This will pre-fill at checkout.' });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg({ type: 'error', text: 'Failed to save address.' });
    } finally { setIsSaving(false); }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Delivered') return { cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <CheckCircle2 className="w-3 h-3" /> };
    if (status === 'Cancelled') return { cls: 'bg-red-50 text-red-500 border-red-100', icon: <XCircle className="w-3 h-3" /> };
    if (status === 'Placed')    return { cls: 'bg-blue-50 text-blue-500 border-blue-100', icon: <ShoppingBag className="w-3 h-3" /> };
    return { cls: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock className="w-3 h-3" /> };
  };

  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white transition-all';
  const labelCls = 'text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5';

  if (!user) return null;

  const tabs = [
    { id: 'personal' as ProfileTab, label: 'Personal Info', icon: User },
    { id: 'orders' as ProfileTab, label: 'My Orders', icon: Package },
    { id: 'address' as ProfileTab, label: 'Delivery Address', icon: MapPin },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=4CAF50&color=fff&size=200`}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
              <h2 className="font-black text-slate-900 text-lg">{user.firstName} {user.lastName}</h2>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>

              {/* Tab Nav */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-1 text-left">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>

              <button
                onClick={logout}
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 text-sm font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-4">
            {/* Save message */}
            <AnimatePresence>
              {saveMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center gap-2 p-4 rounded-2xl border text-sm font-bold ${
                    saveMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      : 'bg-red-50 border-red-100 text-red-500'
                  }`}
                >
                  {saveMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {saveMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* Personal Info */}
              {activeTab === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">Personal Information</h1>
                      <p className="text-slate-400 text-sm mt-1">Manage your account details</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: 'First Name', key: 'firstName', icon: User },
                      { label: 'Last Name', key: 'lastName', icon: User },
                      { label: 'Email', key: 'email', icon: Mail },
                      { label: 'Phone', key: 'phone', icon: Phone },
                    ].map(({ label, key, icon: Icon }) => (
                      <div key={key}>
                        <label className={labelCls}>{label}</label>
                        {isEditing ? (
                          <input
                            className={inputCls}
                            value={(formData as any)[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            placeholder={`Enter ${label.toLowerCase()}`}
                          />
                        ) : (
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-700">
                            <Icon className="w-4 h-4 text-slate-400" />
                            {(user as any)[key] || <span className="text-slate-300 italic">Not set</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSavePersonal}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2"
                      >
                        {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => { setIsEditing(false); setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || '' }); }}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* My Orders */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
                      <p className="text-slate-400 text-sm">Track and manage your orders</p>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="py-16 flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-slate-400 text-sm">Loading orders...</p>
                    </div>
                  ) : ordersError ? (
                    <div className="py-16 flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <XCircle className="w-8 h-8 text-red-300" />
                      </div>
                      <h3 className="font-bold text-slate-700">Could not load orders</h3>
                      <p className="text-slate-400 text-sm max-w-xs">{ordersError}</p>
                      <button
                        onClick={loadOrders}
                        className="px-5 py-2.5 bg-primary text-white font-bold rounded-2xl text-sm hover:bg-primary/90 transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="font-bold text-slate-700">No orders yet</h3>
                      <p className="text-slate-400 text-sm max-w-xs">Start shopping to see your orders here!</p>
                      <Link
                        to="/"
                        className="px-5 py-2.5 bg-primary text-white font-bold rounded-2xl text-sm hover:bg-primary/90 transition-all"
                      >
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => {
                        const badge = getStatusBadge(order.status);
                        return (
                          <div key={order.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                            <button
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                  <Package className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${badge.cls}`}>
                                      {badge.icon}{order.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <CalendarDays className="w-3 h-3" />
                                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span>•</span>
                                    <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="font-black text-primary">₹{Number(order.total_amount).toFixed(2)}</p>
                                  <p className="text-[10px] text-slate-400">{order.items?.length || 0} item(s)</p>
                                </div>
                                {expandedOrder === order.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                              </div>
                            </button>

                            <AnimatePresence>
                              {expandedOrder === order.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 border-t border-slate-100">

                                    {/* ── Order Tracker ── */}
                                    <div className="mt-5 mb-4">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Order Progress</p>
                                      <OrderTracker status={order.status as OrderStatus} />
                                    </div>

                                    {/* ── Items Ordered ── */}
                                    <div className="space-y-1 mt-4">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Items Ordered</p>
                                      {order.items?.map((item, idx) => {
                                        const itemKey       = `${order.id}-${item.product_id}`;
                                        const alreadyReviewed = reviewedItems.has(itemKey);
                                        const canReview     = order.status === 'Delivered';
                                        return (
                                          <div key={idx} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                                <ShoppingBag className="w-4 h-4 text-slate-400" />
                                              </div>
                                              <div>
                                                <p className="text-sm font-semibold text-slate-700">{item.product_name}</p>
                                                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                              <span className="font-bold text-slate-900 text-sm">₹{Number(item.price).toFixed(2)}</span>
                                              {canReview && !alreadyReviewed && (
                                                <button
                                                  onClick={() => setReviewTarget({
                                                    productId:   item.product_id!,
                                                    productName: item.product_name,
                                                    orderId:     order.id,
                                                  })}
                                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold rounded-xl transition-all whitespace-nowrap"
                                                >
                                                  <Star className="w-3 h-3" />
                                                  Review
                                                </button>
                                              )}
                                              {alreadyReviewed && (
                                                <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold whitespace-nowrap">
                                                  <CheckCircle2 className="w-3 h-3" />
                                                  Reviewed
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* ── Delivery To ── */}
                                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery To</p>
                                      <div className="flex items-start gap-2">
                                        <Truck className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div className="text-sm text-slate-600">
                                          <p className="font-bold">{order.first_name} {order.last_name}</p>
                                          <p>{order.address_line_1}</p>
                                          <p>{order.city} — {order.postal_code}</p>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Address */}
              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6"
                >
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">Delivery Address</h1>
                    <p className="text-slate-400 text-sm mt-1">Set your default shipping address — it will be pre-filled at checkout.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Street Address</label>
                      <input className={inputCls} placeholder="House No., Street, Area"
                        value={addressData.address} onChange={(e) => setAddressData({ ...addressData, address: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>City</label>
                        <input className={inputCls} placeholder="Your city"
                          value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelCls}>Postal Code</label>
                        <input className={inputCls} placeholder="PIN code"
                          value={addressData.postalCode} onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {addressData.address && (
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Default Checkout Address</p>
                        <p className="text-slate-700">{addressData.address}</p>
                        {addressData.city && <p className="text-slate-500">{addressData.city}{addressData.postalCode ? ` — ${addressData.postalCode}` : ''}</p>}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSaveAddress}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
                  >
                    {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MapPin className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save Address'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>

    {/* ── Write Review Modal ── */}
    {reviewTarget && (
      <WriteReviewModal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        onSuccess={() => {
          const key = `${reviewTarget.orderId}-${reviewTarget.productId}`;
          setReviewedItems(prev => new Set(prev).add(key));
          setReviewTarget(null);
        }}
        productId={reviewTarget.productId}
        productName={reviewTarget.productName}
        orderId={reviewTarget.orderId}
      />
    )}
    </>
  );
};

export default Profile;
