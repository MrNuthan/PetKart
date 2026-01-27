
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Package, Heart, Bell, LogOut, Camera, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  if (!user) return null;

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
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/5 text-primary text-sm font-bold transition-all">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3" />
                    Personal Info
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white text-sm font-bold transition-all">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-3" />
                    My Orders
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white text-sm font-bold transition-all">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-3" />
                    Wishlist
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
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
          <div className="lg:col-span-3 space-y-8 animate-fade-in">
            <div className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-display font-extrabold text-white">Personal Information</h1>
                  <p className="text-zinc-500 mt-1">Manage your account details and preferences.</p>
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
                <div className="sm:col-span-2 space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Email Address</label>
                  {isEditing ? (
                    <input 
                      className="w-full bg-dark-700 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <div className="w-full bg-dark-800 rounded-2xl py-4 px-5 text-zinc-400 border border-white/5">{user.email}</div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-zinc-300 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Notifications</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">Marketing Emails</span>
                    <div className="w-10 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">Order Updates</span>
                    <div className="w-10 h-6 bg-zinc-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                  </div>
                </div>
              </div>
              <div className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col justify-center text-center space-y-2">
                <p className="text-zinc-500 text-sm">Membership Level</p>
                <h3 className="text-2xl font-display font-extrabold text-white tracking-tighter">DIAMOND <span className="text-primary">TIER</span></h3>
                <p className="text-xs text-primary font-bold uppercase tracking-widest pt-2">Platinum Access Enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
