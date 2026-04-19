
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, Package, Heart, LogOut, Camera, ChevronRight,
  MapPin, Clock, CheckCircle2, XCircle, Truck, IndianRupee, ShoppingBag,
  ChevronDown, ChevronUp, Phone, Mail, CalendarDays
} from 'lucide-react';

type ProfileTab = 'personal' | 'orders' | 'address';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Personal info form
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Address form
  const [addressData, setAddressData] = useState({
    address: user?.address || '',
    city: '',
    postalCode: '',
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Parse address JSON if stored
  useEffect(() => {
    if (user?.address) {
      try {
        const parsed = JSON.parse(user.address);
        setAddressData({
          address: parsed.address || '',
          city: parsed.city || '',
          postalCode: parsed.postalCode || '',
        });
      } catch {
        setAddressData({ address: user.address, city: '', postalCode: '' });
      }
    }
  }, [user?.address]);

  // Load orders when tab switches to orders
  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSavePersonal = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });
      setIsEditing(false);
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // Store address as JSON string in the user's address field
      const addressJson = JSON.stringify({
        address: addressData.address,
        city: addressData.city,
        postalCode: addressData.postalCode,
      });
      await updateUser({ address: addressJson });
      setSaveMessage({ type: 'success', text: 'Address saved successfully! This will be your default checkout address.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save address. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-400 bg-emerald-400/10';
      case 'Cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-amber-400 bg-amber-400/10';
    }
  };

  const getPaymentLabel = (method: string) => {
    return method === 'cod' ? 'Cash on Delivery' : 'Razorpay';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  const sidebarItems = [
    { id: 'personal' as ProfileTab, label: 'Personal Info', icon: User },
    { id: 'orders' as ProfileTab, label: 'My Orders', icon: Package },
    { id: 'address' as ProfileTab, label: 'Delivery Address', icon: MapPin },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-8 rounded-[2rem] border border-white/5 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary ring-4 ring-primary/10">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-dark-800 rounded-full border border-white/10 hover:bg-zinc-700 transition-colors">
                  <Camera className="w-4 h-4 text-zinc-300" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h2>
              <p className="text-zinc-500 text-sm">{user.email}</p>
              
              <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === item.id
                        ? 'bg-primary/5 text-primary'
                        : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <button 
                onClick={logout}
                className="mt-8 w-full flex items-center justify-center p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-bold transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Save Message Toast */}
            <AnimatePresence>
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 ${
                    saveMessage.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {saveMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {saveMessage.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Personal Info Tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div
                  key="personal"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeUp}
                  className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-10"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-display font-extrabold text-white">Personal Information</h1>
                      <p className="text-zinc-500 mt-1">Manage your account details. Changes are saved to your account.</p>
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 rounded-full bg-dark-700 hover:bg-dark-600 text-white text-xs font-bold border border-white/10 transition-all flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Details
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">First Name</label>
                      {isEditing ? (
                        <input 
                          className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      ) : (
                        <div className="w-full bg-dark-800 rounded-2xl py-4 px-5 text-white font-medium border border-white/5">{user.firstName}</div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Last Name</label>
                      {isEditing ? (
                        <input 
                          className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      ) : (
                        <div className="w-full bg-dark-800 rounded-2xl py-4 px-5 text-white font-medium border border-white/5">{user.lastName}</div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Email Address</label>
                      {isEditing ? (
                        <input 
                          className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      ) : (
                        <div className="w-full bg-dark-800 rounded-2xl py-4 px-5 text-zinc-400 border border-white/5 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-zinc-500" />{user.email}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Phone Number</label>
                      {isEditing ? (
                        <input 
                          className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={formData.phone}
                          placeholder="Enter your phone number"
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      ) : (
                        <div className="w-full bg-dark-800 rounded-2xl py-4 px-5 text-zinc-400 border border-white/5 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-zinc-500" />{user.phone || 'Not set'}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4">
                      <button 
                        onClick={handleSavePersonal}
                        disabled={isSaving}
                        className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSaving ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => { setIsEditing(false); setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || '' }); }}
                        className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-zinc-300 font-bold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* My Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeUp}
                  className="space-y-6"
                >
                  <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-display font-extrabold text-white">My Orders</h1>
                        <p className="text-zinc-500 mt-0.5">Track and manage all your orders</p>
                      </div>
                    </div>

                    {ordersLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-zinc-500 text-sm">Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No Orders Yet</h3>
                        <p className="text-zinc-500 text-sm text-center max-w-sm">
                          Looks like you haven't placed any orders. Start shopping and your orders will appear here!
                        </p>
                        <a
                          href="#/"
                          className="mt-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all text-sm"
                        >
                          Start Shopping
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-800/50 rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
                          >
                            {/* Order Header */}
                            <button
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              className="w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Package className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-white font-bold text-sm">Order #{order.id}</span>
                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                      {getStatusIcon(order.status)}
                                      <span className="ml-1">{order.status}</span>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <span className="flex items-center gap-1">
                                      <CalendarDays className="w-3 h-3" />
                                      {formatDate(order.created_at)}
                                    </span>
                                    <span>{formatTime(order.created_at)}</span>
                                    <span className="text-zinc-600">•</span>
                                    <span>{getPaymentLabel(order.payment_method)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-primary font-extrabold text-lg">₹{Number(order.total_amount).toFixed(2)}</p>
                                  <p className="text-[10px] text-zinc-500">{order.items?.length || 0} item(s)</p>
                                </div>
                                {expandedOrder === order.id ? (
                                  <ChevronUp className="w-5 h-5 text-zinc-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                                )}
                              </div>
                            </button>

                            {/* Order Details (Expanded) */}
                            <AnimatePresence>
                              {expandedOrder === order.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 border-t border-white/5">
                                    {/* Order Items */}
                                    <div className="mt-4 space-y-3">
                                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Items Ordered</h4>
                                      {order.items && order.items.length > 0 ? (
                                        order.items.map((item, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                                                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                                              </div>
                                              <div>
                                                <p className="text-white text-sm font-medium">{item.product_name}</p>
                                                <p className="text-zinc-500 text-xs">Qty: {item.quantity}</p>
                                              </div>
                                            </div>
                                            <span className="text-white font-bold text-sm">₹{Number(item.price).toFixed(2)}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-zinc-500 text-sm py-2">No item details available</p>
                                      )}
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="mt-5 p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Delivery Address</h4>
                                      <div className="flex items-start gap-3">
                                        <Truck className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-zinc-300 space-y-0.5">
                                          <p className="text-white font-semibold">{order.first_name} {order.last_name}</p>
                                          <p>{order.address_line_1}</p>
                                          <p>{order.city} — {order.postal_code}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeUp}
                  className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-10"
                >
                  <div>
                    <h1 className="text-3xl font-display font-extrabold text-white">Delivery Address</h1>
                    <p className="text-zinc-500 mt-1">Set your default delivery address. This will be pre-filled at checkout.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Street Address</label>
                      <input
                        className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                        value={addressData.address}
                        onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                        placeholder="House No, Street, Area"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">City</label>
                        <input
                          className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={addressData.city}
                          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                          placeholder="Your city"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Postal Code</label>
                        <input
                          className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={addressData.postalCode}
                          onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                          placeholder="PIN code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current saved address preview */}
                  {addressData.address && (
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Default Checkout Address</p>
                          <p className="text-white text-sm">{addressData.address}</p>
                          {addressData.city && <p className="text-zinc-400 text-sm">{addressData.city}{addressData.postalCode ? ` — ${addressData.postalCode}` : ''}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSaveAddress}
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Address'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
