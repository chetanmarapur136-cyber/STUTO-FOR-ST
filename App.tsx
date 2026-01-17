
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle, 
  BarChart2, 
  Wallet, 
  Calendar as CalendarIcon, 
  BrainCircuit, 
  User as UserIcon,
  LogOut,
  ChevronRight,
  Plus
} from 'lucide-react';
import { AppData, User, Subject, AttendanceRecord, Mark, Expense, Event, Note } from './types';
import Login from './components/Auth';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/Subjects';
import AttendanceTracker from './components/Attendance';
import PerformanceMarks from './components/Marks';
import ExpenseTracker from './components/Expenses';
import CalendarPlanner from './components/Calendar';
import StudyAnalytics from './components/Analytics';
import ProfileSettings from './components/Profile';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [appData, setAppData] = useState<AppData>(() => {
    const saved = localStorage.getItem('stuto_data');
    return saved ? JSON.parse(saved) : {
      user: null,
      subjects: [],
      attendance: [],
      marks: [],
      expenses: [],
      events: [],
      notes: []
    };
  });

  useEffect(() => {
    localStorage.setItem('stuto_data', JSON.stringify(appData));
    if (appData.user?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appData]);

  const handleLogin = (user: User) => {
    setAppData(prev => ({ ...prev, user }));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAppData(prev => ({ ...prev, user: null }));
    setCurrentPage('login');
  };

  const updateData = <K extends keyof AppData>(key: K, data: AppData[K]) => {
    setAppData(prev => ({ ...prev, [key]: data }));
  };

  if (!appData.user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard appData={appData} navigate={setCurrentPage} />;
      case 'subjects': return <SubjectManager appData={appData} updateSubjects={(s) => updateData('subjects', s)} />;
      case 'attendance': return <AttendanceTracker appData={appData} updateAttendance={(a) => updateData('attendance', a)} />;
      case 'marks': return <PerformanceMarks appData={appData} updateMarks={(m) => updateData('marks', m)} />;
      case 'expenses': return <ExpenseTracker appData={appData} updateExpenses={(e) => updateData('expenses', e)} />;
      case 'calendar': return <CalendarPlanner appData={appData} updateEvents={(ev) => updateData('events', ev)} />;
      case 'analytics': return <StudyAnalytics appData={appData} />;
      case 'profile': return <ProfileSettings appData={appData} onUpdateUser={(u) => updateData('user', u)} onLogout={handleLogout} />;
      default: return <Dashboard appData={appData} navigate={setCurrentPage} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Home' },
    { id: 'attendance', icon: <CheckCircle size={20} />, label: 'Attendance' },
    { id: 'marks', icon: <BarChart2 size={20} />, label: 'Marks' },
    { id: 'expenses', icon: <Wallet size={20} />, label: 'Expenses' },
    { id: 'analytics', icon: <BrainCircuit size={20} />, label: 'AI Insights' },
  ];

  return (
    <div className={`min-h-screen pb-20 md:pb-0 md:pl-64 flex flex-col transition-colors duration-200 ${appData.user.darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 hidden md:flex flex-col border-r transition-colors duration-200 z-30 ${appData.user.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">S</div>
          <span className="text-2xl font-bold tracking-tight text-indigo-600">STUTO</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                : `${appData.user?.darkMode ? 'text-slate-400 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-100'}`
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrentPage('subjects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === 'subjects' 
                ? 'bg-indigo-600 text-white' 
                : `${appData.user?.darkMode ? 'text-slate-400 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-100'}`
              }`}
            >
              <BookOpen size={20} />
              <span className="font-medium">Subjects</span>
            </button>
            <button
              onClick={() => setCurrentPage('calendar')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === 'calendar' 
                ? 'bg-indigo-600 text-white' 
                : `${appData.user?.darkMode ? 'text-slate-400 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-100'}`
              }`}
            >
              <CalendarIcon size={20} />
              <span className="font-medium">Calendar</span>
            </button>
          </div>
        </nav>

        <div className="p-4">
          <button
            onClick={() => setCurrentPage('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'profile' 
              ? 'bg-indigo-600/10 text-indigo-600' 
              : `${appData.user?.darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold uppercase">
              {appData.user.name.charAt(0)}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold truncate">{appData.user.name}</p>
              <p className="text-[10px] opacity-70 truncate">{appData.user.course}</p>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className={`md:hidden p-4 flex items-center justify-between border-b sticky top-0 z-20 transition-colors duration-200 ${appData.user.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
          <span className="text-xl font-bold tracking-tight text-indigo-600 uppercase">STUTO</span>
        </div>
        <button 
          onClick={() => setCurrentPage('profile')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 p-0.5"
        >
          <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-indigo-600 font-bold uppercase">
            {appData.user.name.charAt(0)}
          </div>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500">
        <div className="max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-2 flex justify-around items-center z-30 transition-colors duration-200 ${appData.user.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              currentPage === item.id 
              ? 'text-indigo-600' 
              : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
