
import React, { useState } from 'react';
import { User as UserIcon, LogOut, Moon, Sun, Shield, Bell, Target, Coins } from 'lucide-react';
import { AppData, User } from '../types';

interface ProfileSettingsProps {
  appData: AppData;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ appData, onUpdateUser, onLogout }) => {
  const { user } = appData;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user! });

  const toggleDarkMode = () => {
    onUpdateUser({ ...user!, darkMode: !user?.darkMode });
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setEditing(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight">Profile</h2>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-rose-500 font-bold hover:underline"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className={`p-8 rounded-[40px] border flex flex-col items-center text-center ${user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl'}`}>
          <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-indigo-700 p-1 mb-6">
            <div className="w-full h-full rounded-[38px] bg-white dark:bg-slate-800 flex items-center justify-center text-5xl font-black text-indigo-600">
              {user?.name.charAt(0)}
            </div>
          </div>
          <h3 className="text-2xl font-black">{user?.name}</h3>
          <p className="text-slate-500 font-medium">{user?.email}</p>
          <div className="mt-4 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full text-xs font-black uppercase tracking-wider">
            {user?.course}
          </div>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-12 border-t border-slate-100 dark:border-slate-700 pt-8">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Semester</p>
              <p className="font-bold">{user?.semester}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ID Status</p>
              <p className="font-bold text-emerald-500 flex items-center justify-center gap-1"><Shield size={12}/> Active</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-8 rounded-[40px] border ${user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h4 className="text-lg font-black mb-6">Account Settings</h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    {user?.darkMode ? <Moon size={20}/> : <Sun size={20}/>}
                  </div>
                  <div>
                    <p className="font-bold">Dark Mode</p>
                    <p className="text-xs opacity-50">Toggle interface appearance</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full transition-all relative ${user?.darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user?.darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <Target size={20}/>
                  </div>
                  <div>
                    <p className="font-bold">Attendance Goal</p>
                    <p className="text-xs opacity-50">Current: {user?.attendanceGoal}%</p>
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="text-indigo-600 font-bold text-sm">Edit</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <Coins size={20}/>
                  </div>
                  <div>
                    <p className="font-bold">Monthly Budget</p>
                    <p className="text-xs opacity-50">Limit: ${user?.monthlyBudget}</p>
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="text-indigo-600 font-bold text-sm">Edit</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <Bell size={20}/>
                  </div>
                  <div>
                    <p className="font-bold">Notifications</p>
                    <p className="text-xs opacity-50">App alerts and reminders</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full uppercase">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${user?.darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-black mb-6">Edit Goals</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Course</label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.course}
                  onChange={e => setFormData({ ...formData, course: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Attendance Goal (%)</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                    value={formData.attendanceGoal}
                    onChange={e => setFormData({ ...formData, attendanceGoal: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Monthly Budget ($)</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                    value={formData.monthlyBudget}
                    onChange={e => setFormData({ ...formData, monthlyBudget: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setEditing(false)} className="flex-1 py-4 font-bold rounded-xl border border-slate-200 dark:border-slate-700">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20">Save Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
