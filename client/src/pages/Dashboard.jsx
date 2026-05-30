import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

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
      <div className="space-y-8 animate-in fade-in">
        <div className="space-y-2">
          <Skeleton className="w-48 h-10" />
          <Skeleton className="w-64 h-5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="text-center py-20 bg-slate-50 border-dashed">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-slate-500 font-medium">Failed to load dashboard statistics.</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-brand-600 hover:underline">Try Again</button>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-1">Overview of your productivity and progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 font-medium">Current Streak</p>
            <span className="text-xl">🔥</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-bold text-slate-900 tracking-tight">{stats.streak}</h4>
            <span className="text-sm font-medium text-slate-400">days</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 font-medium">Daily Completion</p>
            <span className="text-brand-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <h4 className="text-4xl font-bold text-slate-900 tracking-tight">{Math.round(stats.dailyCompletionPercentage)}</h4>
            <span className="text-xl font-bold text-slate-400">%</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 font-medium">Tasks Completed</p>
            <span className="text-emerald-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-bold text-slate-900 tracking-tight">{stats.totalCompletedTasks}</h4>
            <span className="text-sm font-medium text-slate-400">total</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Weekly Progress</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Completed" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Monthly Consistency</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Score: {Math.round(stats.consistencyScore)}%
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  name="Completion %" 
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
