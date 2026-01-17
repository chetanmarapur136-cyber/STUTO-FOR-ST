
import React, { useState } from 'react';
import { BarChart3, Plus, Trash2, BookOpen, TrendingUp, ChevronDown } from 'lucide-react';
import { AppData, Mark, Subject } from '../types';

interface PerformanceMarksProps {
  appData: AppData;
  updateMarks: (marks: Mark[]) => void;
}

const PerformanceMarks: React.FC<PerformanceMarksProps> = ({ appData, updateMarks }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    examName: '',
    score: '',
    total: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMark: Mark = {
      id: Math.random().toString(36).substr(2, 9),
      subjectId: formData.subjectId,
      examName: formData.examName,
      score: parseFloat(formData.score),
      total: parseFloat(formData.total),
      date: new Date().toISOString()
    };
    updateMarks([...appData.marks, newMark]);
    setShowAdd(false);
    setFormData({ subjectId: '', examName: '', score: '', total: '' });
  };

  const getGrade = (perc: number) => {
    if (perc >= 90) return { label: 'A+', color: 'text-emerald-600' };
    if (perc >= 80) return { label: 'A', color: 'text-emerald-500' };
    if (perc >= 70) return { label: 'B', color: 'text-indigo-500' };
    if (perc >= 60) return { label: 'C', color: 'text-amber-500' };
    if (perc >= 50) return { label: 'D', color: 'text-orange-500' };
    return { label: 'F', color: 'text-rose-500' };
  };

  const averagePercentage = appData.marks.length > 0 
    ? Math.round(appData.marks.reduce((acc, m) => acc + (m.score / m.total) * 100, 0) / appData.marks.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Performance</h2>
          <p className="text-slate-500 font-medium">Analyze your academic scores</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Exam
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-3xl border ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Average Marks</p>
          <p className="text-3xl font-black mt-1">{averagePercentage}%</p>
        </div>
        <div className={`p-6 rounded-3xl border ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 size={20} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Exams Logged</p>
          <p className="text-3xl font-black mt-1">{appData.marks.length}</p>
        </div>
        <div className={`p-6 rounded-3xl border ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Overall Grade</p>
          <p className={`text-3xl font-black mt-1 ${getGrade(averagePercentage).color}`}>
            {getGrade(averagePercentage).label}
          </p>
        </div>
      </div>

      {/* List of Marks */}
      <div className={`rounded-3xl border overflow-hidden ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-black text-lg">Exam History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`text-[10px] font-black uppercase tracking-widest ${appData.user?.darkMode ? 'text-slate-400 bg-slate-700/50' : 'text-slate-400 bg-slate-50'}`}>
              <tr>
                <th className="px-6 py-4">Exam Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Percentage</th>
                <th className="px-6 py-4 text-center">Grade</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {appData.marks.map(mark => {
                const subject = appData.subjects.find(s => s.id === mark.subjectId);
                const perc = Math.round((mark.score / mark.total) * 100);
                const grade = getGrade(perc);
                return (
                  <tr key={mark.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-bold">{mark.examName}</td>
                    <td className="px-6 py-4 text-sm opacity-60 font-medium">{subject?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-center font-bold">{mark.score} / {mark.total}</td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex items-center justify-center gap-2">
                         <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: `${perc}%` }} />
                         </div>
                         <span className="text-xs font-bold">{perc}%</span>
                       </div>
                    </td>
                    <td className={`px-6 py-4 text-center font-black ${grade.color}`}>{grade.label}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => updateMarks(appData.marks.filter(m => m.id !== mark.id))}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {appData.marks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center opacity-40">
                    <BarChart3 className="mx-auto mb-2" size={32} />
                    <p className="font-bold">No exam marks added yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${appData.user?.darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-black mb-6">Log Exam Score</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Subject</label>
                <div className="relative">
                  <select
                    required
                    className={`w-full px-4 py-3 rounded-xl border appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                    value={formData.subjectId}
                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                  >
                    <option value="">Select a subject</option>
                    {appData.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Exam Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Midterm Assessment"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.examName}
                  onChange={e => setFormData({ ...formData, examName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Marks Obtained</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="85"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                    value={formData.score}
                    onChange={e => setFormData({ ...formData, score: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Total Marks</label>
                  <input
                    required
                    type="number"
                    placeholder="100"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                    value={formData.total}
                    onChange={e => setFormData({ ...formData, total: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 font-bold rounded-xl border border-slate-200 dark:border-slate-700">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20">Save Score</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMarks;
