
import React from 'react';
import { 
  CheckCircle, 
  BarChart2, 
  Wallet, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';
import { AppData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardProps {
  appData: AppData;
  navigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appData, navigate }) => {
  const { user, subjects, attendance, marks, expenses, events } = appData;

  // Real-time calculations
  const overallAttendance = React.useMemo(() => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    return Math.round((presentCount / attendance.length) * 100);
  }, [attendance]);

  const averageMarks = React.useMemo(() => {
    if (marks.length === 0) return 0;
    const totalPerc = marks.reduce((acc, m) => acc + (m.score / m.total) * 100, 0);
    return Math.round(totalPerc / marks.length);
  }, [marks]);

  const monthlyExpenses = React.useMemo(() => {
    const currentMonth = new Date().getMonth();
    return expenses
      .filter(e => new Date(e.date).getMonth() === currentMonth)
      .reduce((acc, e) => acc + e.amount, 0);
  }, [expenses]);

  const upcomingEvents = React.useMemo(() => {
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  const stats = [
    { label: 'Attendance', value: `${overallAttendance}%`, icon: <CheckCircle className="text-emerald-500" />, color: 'emerald', target: 'attendance' },
    { label: 'Avg Marks', value: `${averageMarks}%`, icon: <BarChart2 className="text-indigo-500" />, color: 'indigo', target: 'marks' },
    { label: 'Spent', value: `$${monthlyExpenses}`, icon: <Wallet className="text-rose-500" />, color: 'rose', target: 'expenses' },
    { label: 'Goal', value: `${user?.attendanceGoal}%`, icon: <TrendingUp className="text-amber-500" />, color: 'amber', target: 'profile' },
  ];

  const chartData = React.useMemo(() => {
    // Simple mock daily performance
    return [
      { name: 'Mon', marks: 65, attendance: 100 },
      { name: 'Tue', marks: 78, attendance: 100 },
      { name: 'Wed', marks: 72, attendance: 0 },
      { name: 'Thu', marks: 85, attendance: 100 },
      { name: 'Fri', marks: 90, attendance: 100 },
    ];
  }, []);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${user?.darkMode ? 'text-white' : 'text-slate-800'}`}>
            Hi, {user?.name.split(' ')[0]} 👋
          </h2>
          <p className={`${user?.darkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
            {user?.course} • {user?.semester}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('subjects')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            {/* Added missing Plus icon */}
            <Plus size={18} /> Add Subject
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(stat.target)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
              user?.darkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-100 shadow-sm'
            }`}
          >
            <div className="mb-3">{stat.icon}</div>
            <p className={`text-sm font-semibold ${user?.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
            <p className={`text-2xl font-black ${user?.darkMode ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Weekly Performance</h3>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Marks</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Attendance</div>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={user?.darkMode ? "#334155" : "#f1f5f9"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="marks" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMarks)" />
                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deadlines / Schedule */}
        <div className={`p-6 rounded-3xl border ${user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <h3 className="font-bold text-lg mb-6">Upcoming</h3>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
              <div key={event.id} className={`flex items-start gap-4 p-3 rounded-2xl ${user?.darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <div className={`p-2 rounded-lg ${
                  event.type === 'Exam' ? 'bg-rose-100 text-rose-600' : 
                  event.type === 'Assignment' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">{event.title}</p>
                  <p className="text-xs opacity-60 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 opacity-50">
                <Calendar className="mx-auto mb-2" />
                <p className="text-sm">No upcoming deadlines</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('calendar')}
            className="w-full mt-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            View Planner
          </button>
        </div>
      </div>

      {/* Subjects Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl">My Subjects</h3>
          <button onClick={() => navigate('subjects')} className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.slice(0, 3).map(subject => {
            const subjAtt = attendance.filter(a => a.subjectId === subject.id);
            const present = subjAtt.filter(a => a.status === 'present').length;
            const perc = subjAtt.length > 0 ? Math.round((present / subjAtt.length) * 100) : 0;
            return (
              <div key={subject.id} className={`p-5 rounded-3xl border ${user?.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${perc >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {perc}% Att.
                  </span>
                </div>
                <h4 className="font-bold text-lg truncate">{subject.name}</h4>
                <p className="text-sm opacity-60 mb-4">{subject.teacher}</p>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${perc >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ width: `${perc}%` }}
                  />
                </div>
              </div>
            );
          })}
          {subjects.length === 0 && (
            <div className="col-span-full py-12 text-center opacity-50 border-2 border-dashed rounded-3xl border-slate-200 dark:border-slate-700">
               <BookOpen className="mx-auto mb-2" size={32} />
               <p className="font-bold">No subjects added yet</p>
               <button onClick={() => navigate('subjects')} className="mt-2 text-indigo-600 font-bold">Add your first subject</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
