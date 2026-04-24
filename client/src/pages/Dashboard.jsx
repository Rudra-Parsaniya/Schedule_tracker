import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalTasks: 0, completedToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Placeholder for real API call
        // const res = await api.get('/stats');
        // setStats(res.data);
        setStats({ totalTasks: 12, completedToday: 5 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="py-8">
      <h2 className="text-4xl font-bold text-slate-800 mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-3xl border-l-4 border-l-primary">
          <p className="text-slate-500 font-medium mb-1">Total Tasks</p>
          <h4 className="text-4xl font-black text-slate-800">{stats.totalTasks}</h4>
        </div>
        
        <div className="glass p-8 rounded-3xl border-l-4 border-l-secondary">
          <p className="text-slate-500 font-medium mb-1">Completed Today</p>
          <h4 className="text-4xl font-black text-slate-800">{stats.completedToday}</h4>
        </div>

        <div className="glass p-8 rounded-3xl border-l-4 border-l-green-500">
          <p className="text-slate-500 font-medium mb-1">Completion Rate</p>
          <h4 className="text-4xl font-black text-slate-800">
            {stats.totalTasks > 0 ? Math.round((stats.completedToday / stats.totalTasks) * 100) : 0}%
          </h4>
        </div>
      </div>

      <div className="mt-12 glass p-8 rounded-3xl min-h-[300px]">
        <h3 className="text-xl font-bold mb-6 text-slate-800">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-slate-800">Task {i + 1} completed</p>
                <p className="text-sm text-slate-400">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
