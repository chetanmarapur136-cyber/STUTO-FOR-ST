
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Clock, MapPin } from 'lucide-react';
import { AppData, Event } from '../types';

interface CalendarPlannerProps {
  appData: AppData;
  updateEvents: (events: Event[]) => void;
}

const CalendarPlanner: React.FC<CalendarPlannerProps> = ({ appData, updateEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Assignment' as Event['type'],
    date: new Date().toISOString().split('T')[0]
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const eventsForDay = (day: number) => {
    return appData.events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      type: formData.type,
      date: formData.date
    };
    updateEvents([...appData.events, newEvent]);
    setShowAdd(false);
    setFormData({ title: '', type: 'Assignment', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Calendar</h2>
          <p className="text-slate-500 font-medium">Plan your academic activities</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar View */}
        <div className={`lg:col-span-3 p-8 rounded-[40px] border ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"><ChevronLeft size={20} /></button>
              <button onClick={nextMonth} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {Array.from({ length: daysInMonth(currentDate.getMonth(), currentDate.getFullYear()) }).map((_, i) => {
              const day = i + 1;
              const hasEvents = eventsForDay(day).length > 0;
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div 
                  key={day} 
                  className={`aspect-square p-2 rounded-2xl border flex flex-col items-center justify-center relative transition-all cursor-pointer hover:border-indigo-400 ${
                    isToday ? 'bg-indigo-600 border-indigo-600 text-white' : 
                    appData.user?.darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <span className="font-black text-sm">{day}</span>
                  {hasEvents && !isToday && (
                    <div className="mt-1 flex gap-0.5">
                      {eventsForDay(day).slice(0, 3).map((e, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${
                          e.type === 'Exam' ? 'bg-rose-500' : 
                          e.type === 'Assignment' ? 'bg-indigo-500' : 'bg-amber-500'
                        }`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Schedule */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Schedule</h3>
          <div className="space-y-4">
            {appData.events.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map(event => (
              <div key={event.id} className={`p-5 rounded-3xl border transition-all ${appData.user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    event.type === 'Exam' ? 'bg-rose-100 text-rose-600' : 
                    event.type === 'Assignment' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {event.type}
                  </span>
                  <button onClick={() => updateEvents(appData.events.filter(e => e.id !== event.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={14}/></button>
                </div>
                <h4 className="font-bold text-sm mt-3">{event.title}</h4>
                <div className="flex items-center gap-2 mt-3 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
            {appData.events.length === 0 && (
              <div className="text-center py-12 opacity-30">
                <CalendarIcon className="mx-auto mb-2" size={32} />
                <p className="text-sm font-bold">No events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${appData.user?.darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-black mb-6">New Planner Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Physics Submission"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Assignment', 'Exam', 'Study Plan', 'Fee', 'Other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type as any })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        formData.type === type 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Date</label>
                <input
                  required
                  type="date"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${appData.user?.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 font-bold rounded-xl border border-slate-200 dark:border-slate-700">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20">Add to Planner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Trash2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

export default CalendarPlanner;
