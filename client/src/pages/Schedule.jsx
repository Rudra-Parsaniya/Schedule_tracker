import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Schedule = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.get('/schedule/today');
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch schedule', err);
        // Fallback data for demo
        setTasks([
          { id: 1, title: 'Morning Workout', time: '08:00 AM', completed: true },
          { id: 2, title: 'Team Sync Meeting', time: '10:30 AM', completed: false },
          { id: 3, title: 'Project Deep Dive', time: '02:00 PM', completed: false },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const toggleComplete = async (id) => {
    try {
      // await api.post(`/tasks/complete`, { taskId: id });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800">Today's Schedule</h2>
        <button className="btn-primary">Add New Task</button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`glass p-6 rounded-2xl flex items-center justify-between transition-all duration-300 ${task.completed ? 'opacity-60 grayscale' : 'hover:scale-[1.01]'}`}
          >
            <div className="flex items-center gap-6">
              <div className="text-primary font-mono font-bold bg-primary/5 px-4 py-2 rounded-xl">
                {task.time}
              </div>
              <div>
                <h4 className={`text-xl font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </h4>
              </div>
            </div>
            
            <button 
              onClick={() => toggleComplete(task.id)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-slate-200 hover:border-primary text-transparent'
              }`}
            >
              ✓
            </button>
          </div>
        ))}

        {tasks.length === 0 && !loading && (
          <div className="text-center py-20 glass rounded-3xl">
            <p className="text-slate-400 italic">No tasks scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
