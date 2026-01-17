
import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, BookOpen } from 'lucide-react';
import { AppData, AttendanceRecord, Subject } from '../types';

interface AttendanceTrackerProps {
  appData: AppData;
  updateAttendance: (attendance: AttendanceRecord[]) => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ appData, updateAttendance }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const markAttendance = (status: 'present' | 'absent') => {
    if (!selectedSubject) return;
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      subjectId: selectedSubject.id,
      date: new Date().toISOString(),
      status
    };
    updateAttendance([...appData.attendance, newRecord]);
  };

  const getSubAttendance = (id: string) => {
    const records = appData.attendance.filter(a => a.subjectId === id);
    const present = records.filter(a => a.status === 'present').length;
    const absent = records.filter(a => a.status === 'absent').length;
    const total = records.length;
    const perc = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, total, perc };
  };

  const attendanceGoal = appData.user?.attendanceGoal || 75;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Attendance</h2>
          <p className="text-slate-500 font-medium">Track your presence in classes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subject List */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Select Subject</h3>
          <div className="space-y-3">
            {appData.subjects.map(sub => {
              const stats = getSubAttendance(sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub)}
                  className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${
                    selectedSubject?.id === sub.id 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                    : `border-slate-100 dark:border-slate-800 ${appData.user?.darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${selectedSubject?.id === sub.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      <BookOpen size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">{sub.name}</p>
                      <p className="text-xs opacity-60">Goal: {attendanceGoal}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-sm font-black ${stats.perc >= attendanceGoal ? 'text-emerald-500' : 'text-rose-500'}`}>{stats.perc}%</p>
                      <p className="text-[10px] opacity-40 uppercase font-bold">{stats.present}/{stats.total}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tracker Panel */}
        <div className={`p-8 rounded-[40px] border flex flex-col items-center justify-center text-center transition-all min-h-[400px] ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
          {selectedSubject ? (
            <div className="w-full animate-in zoom-in duration-300">
              <h3 className="text-2xl font-black mb-1">{selectedSubject.name}</h3>
              <p className="text-slate-500 mb-8 font-medium">Class Log for Today</p>
              
              <div className="relative w-48 h-48 mx-auto mb-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-700"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={552.9}
                    strokeDashoffset={552.9 - (552.9 * getSubAttendance(selectedSubject.id).perc) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ${getSubAttendance(selectedSubject.id).perc >= attendanceGoal ? 'text-emerald-500' : 'text-rose-500'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black">{getSubAttendance(selectedSubject.id).perc}%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current</span>
                </div>
              </div>

              {getSubAttendance(selectedSubject.id).perc < attendanceGoal && getSubAttendance(selectedSubject.id).total > 0 && (
                <div className="mb-6 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl text-xs font-bold inline-flex items-center gap-2">
                  <XCircle size={14} /> Attention: Attendance below goal!
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => markAttendance('present')}
                  className="flex flex-col items-center gap-2 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <CheckCircle size={32} />
                  <span className="font-bold">Present</span>
                </button>
                <button
                  onClick={() => markAttendance('absent')}
                  className="flex flex-col items-center gap-2 p-4 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                >
                  <XCircle size={32} />
                  <span className="font-bold">Absent</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="opacity-50">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={40} className="text-slate-400" />
              </div>
              <p className="font-bold text-lg">Select a subject to start tracking</p>
              <p className="text-sm mt-1">Attendance percentage is calculated in real-time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
