import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Reminders = () => {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Drink Water', time: 'Every 2 hours', status: 'active' },
    { id: 2, title: 'Stand up and stretch', time: '11:00 AM', status: 'inactive' },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reminders</h2>
          <p className="text-slate-500 mt-1">Manage your active alerts and notifications</p>
        </div>
        <Button variant="primary">
          <span className="mr-2">+</span> New Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reminders.map(reminder => (
          <Card key={reminder.id} className="flex justify-between items-center group hover:border-brand-300 transition-colors">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{reminder.title}</h3>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {reminder.time}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={reminder.status === 'active'} readOnly />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-brand-600 p-1">Edit</button>
                <button className="text-slate-400 hover:text-red-500 p-1">Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {reminders.length === 0 && (
        <Card className="text-center py-16 bg-slate-50 border-dashed border-2">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No active reminders</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">You don't have any reminders set up yet. Create your first one to stay on track.</p>
          <Button variant="secondary">Create Reminder</Button>
        </Card>
      )}
    </div>
  );
};

export default Reminders;
