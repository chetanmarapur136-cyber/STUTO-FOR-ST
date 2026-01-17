
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AppData } from '../types';
import { getStudyInsights } from '../services/gemini';

interface StudyAnalyticsProps {
  appData: AppData;
}

const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({ appData }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const result = await getStudyInsights(appData);
      setInsights(result || '');
    } catch (e) {
      setInsights('Failed to load insights. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appData.subjects.length > 0) {
      fetchInsights();
    }
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">AI Insights</h2>
          <p className="text-slate-500 font-medium">Personalized study mentorship</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl hover:bg-indigo-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className={`p-1 rounded-[40px] bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 shadow-2xl shadow-indigo-500/20`}>
        <div className={`p-8 rounded-[38px] ${appData.user?.darkMode ? 'bg-slate-800' : 'bg-white'} min-h-[400px]`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl">Stuto AI Mentor</h3>
              <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Powered by Gemini</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6 animate-pulse mt-12">
              <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-full w-3/4"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full w-full"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full w-5/6"></div>
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-3xl"></div>
                <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-3xl"></div>
              </div>
            </div>
          ) : insights ? (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {insights}
              </div>
              
              <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-700">
                <h4 className="font-bold mb-4 flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> Focus Targets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appData.subjects.filter(s => {
                    const subjAtt = appData.attendance.filter(a => a.subjectId === s.id);
                    return subjAtt.length > 0 && (subjAtt.filter(a => a.status === 'present').length / subjAtt.length) * 100 < 75;
                  }).map(s => (
                    <div key={s.id} className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 flex items-center justify-between">
                       <span className="font-bold text-rose-600 text-sm">{s.name}</span>
                       <span className="text-[10px] font-black uppercase text-rose-400">Low Attendance</span>
                    </div>
                  ))}
                  {appData.subjects.length === 0 && (
                    <p className="text-sm opacity-50 italic">Add subjects to see specific focus targets.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <BrainCircuit className="mx-auto mb-4 text-slate-200" size={80} />
              <h4 className="text-xl font-bold mb-2">Ready to Analyze</h4>
              <p className="text-slate-500 max-w-xs mx-auto mb-8">Click the refresh button to get personalized AI insights based on your academic data.</p>
              <button 
                onClick={fetchInsights}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Generate Mentor Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyAnalytics;
