import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';

const Schedule = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ taskName: '', time: '', category: 'General', priority: 'Medium' });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchSchedule = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterCategory) params.append('category', filterCategory);
      if (filterPriority) params.append('priority', filterPriority);
      if (filterStatus === 'completed') params.append('completed', 'true');
      if (filterStatus === 'pending') params.append('completed', 'false');
      if (filterDate) params.append('date', filterDate);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/schedule?${params.toString()}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch schedule', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSchedule();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filterCategory, filterPriority, filterStatus, filterDate, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterPriority('');
    setFilterStatus('');
    setFilterDate('');
    setSortBy('');
  };

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
      setFormData({ taskName: '', time: '', category: 'General', priority: 'Medium' });
      fetchSchedule();
    } catch (err) {
      console.error('Failed to save', err);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({ 
      taskName: task.taskName, 
      time: task.time,
      category: task.category || 'General',
      priority: task.priority || 'Medium'
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setFormData({ taskName: '', time: '', category: 'General', priority: 'Medium' });
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-50 text-red-600 border-red-200';
      case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Low': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Work': return 'bg-indigo-50 text-indigo-700';
      case 'Personal': return 'bg-pink-50 text-pink-700';
      case 'Health': return 'bg-emerald-50 text-emerald-700';
      case 'Gym': return 'bg-cyan-50 text-cyan-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Today's Schedule</h2>
          <p className="text-slate-500 mt-1">Manage your daily tasks and routines</p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          <span className="mr-2">+</span> Add Task
        </Button>
      </div>

      {/* Filters & Search */}
      <Card className="space-y-4 bg-slate-50/50 border-dashed">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <input 
            type="date" 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-slate-600"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <Button onClick={clearFilters} variant="secondary" size="md">
            Clear Filters
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Gym">Gym</option>
          </select>

          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500 ml-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By: Default</option>
            <option value="time_asc">Time (Earliest)</option>
            <option value="time_desc">Time (Latest)</option>
            <option value="priority">Priority</option>
            <option value="created">Recently Created</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4 pl-10 relative">
          <div className="absolute top-0 bottom-0 left-[22px] w-[2px] bg-slate-100"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="relative">
              <div className="absolute -left-[30px] top-4 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="text-center py-20 bg-slate-50 border-dashed">
          <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No tasks found</h3>
          <p className="text-slate-500 mt-2">Adjust your filters or add a new task for today.</p>
        </Card>
      ) : (
        <div className="relative pl-8 md:pl-12 space-y-6">
          {/* Timeline continuous line */}
          <div className="absolute top-4 bottom-4 left-3 md:left-5 w-px bg-slate-200"></div>
          
          {tasks.map((task) => (
            <div key={task.id} className="relative group">
              {/* Timeline dot */}
              <div className={`absolute -left-[25px] md:-left-[33px] top-6 w-3.5 h-3.5 rounded-full border-2 border-white z-10 transition-colors shadow-sm ${task.isCompleted ? 'bg-emerald-500' : 'bg-brand-500'}`}></div>
              
              {/* Task Card */}
              <div className={`bg-white border rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center transition-all duration-200 hover:shadow-md ${task.isCompleted ? 'border-slate-100 opacity-60 bg-slate-50' : 'border-slate-200 hover:border-brand-200'}`}>
                
                {/* Time Badge */}
                <div className={`flex-shrink-0 font-medium font-mono text-sm px-3 py-1.5 rounded-lg border ${task.isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {task.time.substring(0,5)}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <h4 className={`text-lg font-semibold truncate transition-colors ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.taskName}
                  </h4>
                  <div className="flex gap-2 mt-2 flex-wrap items-center">
                    {task.isCompleted && <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase tracking-wider">Done</span>}
                    {task.category && <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${getCategoryColor(task.category)}`}>{task.category}</span>}
                    {task.priority && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {!task.isCompleted && (
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      title="Complete"
                      className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                  )}
                  <button 
                    onClick={() => openEditModal(task)}
                    title="Edit"
                    className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    title="Delete"
                    className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input 
            label="Task Name"
            required
            value={formData.taskName}
            onChange={e => setFormData({...formData, taskName: e.target.value})}
            placeholder="e.g., Morning Standup"
          />
          <Input 
            type="time"
            label="Time"
            required
            value={formData.time}
            onChange={e => setFormData({...formData, time: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Gym">Gym</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button 
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              fullWidth
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Schedule;
