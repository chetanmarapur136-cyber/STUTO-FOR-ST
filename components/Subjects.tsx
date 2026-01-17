
import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit3, X, User } from 'lucide-react';
import { AppData, Subject } from '../types';

interface SubjectManagerProps {
  appData: AppData;
  updateSubjects: (subjects: Subject[]) => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ appData, updateSubjects }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({ name: '', teacher: '', totalPlanned: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      const updated = appData.subjects.map(s => s.id === editingSubject.id ? { 
        ...editingSubject, 
        name: formData.name, 
        teacher: formData.teacher,
        totalPlanned: parseInt(formData.totalPlanned) || 0
      } : s);
      updateSubjects(updated);
    } else {
      const newSub: Subject = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        teacher: formData.teacher,
        totalPlanned: parseInt(formData.totalPlanned) || 0
      };
      updateSubjects([...appData.subjects, newSub]);
    }
    resetForm();
  };

  const deleteSubject = (id: string) => {
    if (window.confirm('Delete this subject and all associated data?')) {
      updateSubjects(appData.subjects.filter(s => s.id !== id));
    }
  };

  const openEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormData({ name: sub.name, teacher: sub.teacher, totalPlanned: sub.totalPlanned?.toString() || '' });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', teacher: '', totalPlanned: '' });
    setEditingSubject(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Subjects</h2>
          <p className="text-slate-500 font-medium">Manage your academic courses</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appData.subjects.map(sub => (
          <div key={sub.id} className={`p-6 rounded-3xl border transition-all ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(sub)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={18} /></button>
                <button onClick={() => deleteSubject(sub.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
            <h3 className="text-xl font-bold truncate">{sub.name}</h3>
            <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
              <User size={14} />
              <span className="text-sm font-medium">{sub.teacher}</span>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between">
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Attendance</p>
                <p className="text-lg font-black text-emerald-500">
                  {Math.round((appData.attendance.filter(a => a.subjectId === sub.id && a.status === 'present').length / (appData.attendance.filter(a => a.subjectId === sub.id).length || 1)) * 100)}%
                </p>
              </div>
              <div className="text-center flex-1 border-x border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Exam Avg</p>
                <p className="text-lg font-black text-indigo-500">
                  {Math.round(appData.marks.filter(m => m.subjectId === sub.id).reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / (appData.marks.filter(m => m.subjectId === sub.id).length || 1))}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {appData.subjects.length === 0 && (
        <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
           <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
           <p className="text-lg font-bold text-slate-400">No subjects added yet.</p>
           <p className="text-slate-400 text-sm">Click the plus button to start your journey.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-300 ${appData.user?.darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black">{editingSubject ? 'Edit Subject' : 'New Subject'}</h3>
              <button onClick={resetForm} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Subject Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Advanced Mathematics"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Teacher Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Sarah Connor"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.teacher}
                  onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Total Classes Planned (Target)</label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.totalPlanned}
                  onChange={e => setFormData({ ...formData, totalPlanned: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 mt-4">
                {editingSubject ? 'Save Changes' : 'Create Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManager;
