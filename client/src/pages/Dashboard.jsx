import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-20 text-center text-slate-500 glass rounded-3xl mt-8">
        Failed to load dashboard stats.
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-4xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-2">Your progress and statistics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl border-l-4 border-l-orange-500 flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <p className="text-slate-500 font-medium mb-1">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-5xl font-black text-slate-800">{stats.streak}</h4>
            <span className="text-2xl text-orange-500 font-bold">🔥</span>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-l-4 border-l-primary flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <p className="text-slate-500 font-medium mb-1">Daily Completion</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-5xl font-black text-slate-800">{Math.round(stats.dailyCompletionPercentage)}</h4>
            <span className="text-2xl font-bold text-slate-400">%</span>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-l-4 border-l-green-500 flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <p className="text-slate-500 font-medium mb-1">Total Tasks Completed</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-5xl font-black text-slate-800">{stats.totalCompletedTasks}</h4>
            <span className="text-2xl font-bold text-slate-400">✓</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Weekly Progress</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Completed" animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Monthly Consistency</h3>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Score: {Math.round(stats.consistencyScore)}%
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }} 
                  name="Completion %" 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
