import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Schedule = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ taskName: '', time: '' });

  const fetchSchedule = async () => {
    try {
      const res = await api.get('/schedule/today');
      // Sort tasks by time
      const sortedTasks = res.data.sort((a, b) => a.time.localeCompare(b.time));
      setTasks(sortedTasks);
    } catch (err) {
      console.error('Failed to fetch schedule', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const toggleComplete = async (id) => {
    try {
      await api.post('/tasks/complete', { templateId: id });
      setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: true } : t));
    } catch (err) {
      console.error('Failed to mark complete', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/schedule/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/schedule/${editingTask.id}`, formData);
      } else {
        await api.post('/schedule', formData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({ taskName: '', time: '' });
      fetchSchedule(); // Refresh to get correct IDs and re-sort
    } catch (err) {
      console.error('Failed to save', err);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({ taskName: task.taskName, time: task.time });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setFormData({ taskName: '', time: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Today's Schedule</h2>
          <p className="text-slate-500 mt-2">Manage your daily tasks and routines</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <span className="text-xl leading-none">+</span> Add Task
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-slate-500 text-lg">No tasks scheduled for today.</p>
          <button onClick={openAddModal} className="text-primary font-medium mt-4 hover:underline">
            Click here to add one
          </button>
        </div>
      ) : (
        <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:inset-0 before:ml-6 md:before:ml-10 before:-translate-x-px md:before:-translate-x-0.5 before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              {/* Timeline dot */}
              <div className={`absolute -left-10 md:-left-14 top-6 w-5 h-5 rounded-full border-4 border-[#f8fafc] z-10 transition-colors duration-300 ${task.isCompleted ? 'bg-green-500' : 'bg-primary'}`}></div>
              
              {/* Task Card */}
              <div className={`glass p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-300 hover:shadow-md ${task.isCompleted ? 'opacity-70 bg-slate-50/50' : 'hover:-translate-y-1'}`}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-4 md:mb-0 w-full">
                  <div className={`font-mono font-bold px-4 py-2 rounded-xl text-center min-w-[100px] transition-colors ${task.isCompleted ? 'bg-green-50 text-green-600' : 'bg-primary/10 text-primary'}`}>
                    {task.time}
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold transition-colors ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.taskName}
                    </h4>
                    {task.isCompleted && <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">Completed</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  {!task.isCompleted && (
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      title="Mark as Complete"
                      className="w-10 h-10 flex items-center justify-center bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-xl transition-colors"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    onClick={() => openEditModal(task)}
                    title="Edit Task"
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    title="Delete Task"
                    className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Task Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={formData.taskName}
                  onChange={e => setFormData({...formData, taskName: e.target.value})}
                  placeholder="e.g. Morning Workout"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary hover:bg-[#5b21b6] text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/30"
                >
                  {editingTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
