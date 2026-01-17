
import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Trash2, PieChart as PieChartIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AppData, Expense } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExpenseTrackerProps {
  appData: AppData;
  updateExpenses: (expenses: Expense[]) => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ appData, updateExpenses }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food' as Expense['category'],
    note: ''
  });

  const categories = ['Food', 'Travel', 'Books', 'Hostel', 'Misc'];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

  const categoryTotals = useMemo(() => {
    return categories.map(cat => ({
      name: cat,
      value: appData.expenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0)
    })).filter(c => c.value > 0);
  }, [appData.expenses]);

  const totalSpent = useMemo(() => {
    return appData.expenses.reduce((acc, e) => acc + e.amount, 0);
  }, [appData.expenses]);

  const monthlyBudget = appData.user?.monthlyBudget || 1000;
  const budgetPerc = Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(formData.amount),
      category: formData.category,
      note: formData.note,
      date: new Date().toISOString()
    };
    updateExpenses([newExpense, ...appData.expenses]);
    setShowAdd(false);
    setFormData({ amount: '', category: 'Food', note: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Expenses</h2>
          <p className="text-slate-500 font-medium">Manage your college spending</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Log Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Budget Overview */}
        <div className={`lg:col-span-1 p-8 rounded-[40px] border flex flex-col justify-between ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
          <div>
            <h3 className="font-bold text-lg mb-8">Monthly Budget</h3>
            <div className="text-center mb-8">
              <p className="text-5xl font-black tracking-tighter">${totalSpent}</p>
              <p className="text-sm font-bold text-slate-400 mt-1">Spent out of ${monthlyBudget}</p>
            </div>
            <div className="space-y-2 mb-10">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                <span>Usage</span>
                <span>{budgetPerc}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${budgetPerc > 90 ? 'bg-rose-500' : budgetPerc > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${budgetPerc}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[categories.indexOf(entry.name)]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg">Recent History</h3>
          <div className="space-y-3">
            {appData.expenses.map(expense => (
              <div 
                key={expense.id} 
                className={`p-5 rounded-3xl border flex items-center justify-between group transition-all ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                    expense.category === 'Food' ? 'bg-indigo-500 shadow-indigo-500/20' :
                    expense.category === 'Travel' ? 'bg-emerald-500 shadow-emerald-500/20' :
                    expense.category === 'Books' ? 'bg-amber-500 shadow-amber-500/20' :
                    expense.category === 'Hostel' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-slate-500 shadow-slate-500/20'
                  }`}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="font-bold leading-tight">{expense.note || expense.category}</p>
                    <p className="text-xs opacity-50 mt-1">{new Date(expense.date).toLocaleDateString()} • {expense.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-black text-slate-800 dark:text-white">-${expense.amount}</p>
                  <button 
                    onClick={() => updateExpenses(appData.expenses.filter(e => e.id !== expense.id))}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {appData.expenses.length === 0 && (
              <div className="text-center py-20 opacity-30">
                <Wallet className="mx-auto mb-2" size={48} />
                <p className="font-bold">No expenses logged yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${appData.user?.darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-black mb-6">Add Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Amount ($)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  autoFocus
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xl font-black ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat as any })}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        formData.category === cat 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lunch at cafeteria"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 font-bold rounded-xl border border-slate-200 dark:border-slate-700">Cancel</button>
                <button type="submit" className="flex-1 bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20">Add Spend</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
