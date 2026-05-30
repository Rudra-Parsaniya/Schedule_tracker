import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card noPadding className="sticky top-24 overflow-hidden">
            <nav className="flex flex-col">
              <a href="#account" className="px-6 py-4 text-brand-700 font-medium bg-brand-50 border-l-2 border-brand-600 transition-colors">Account</a>
              <a href="#preferences" className="px-6 py-4 text-slate-600 font-medium hover:bg-slate-50 border-l-2 border-transparent transition-colors">Preferences</a>
              <a href="#notifications" className="px-6 py-4 text-slate-600 font-medium hover:bg-slate-50 border-l-2 border-transparent transition-colors">Notifications</a>
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card id="account">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">Account Information</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" disabled value="user@example.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <Button variant="secondary" className="mr-3">Change Password</Button>
                <Button variant="destructive" className="bg-white text-red-600 border border-red-200 hover:bg-red-50">Delete Account</Button>
              </div>
            </div>
          </Card>

          <Card id="preferences">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">App Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Time Zone</h4>
                  <p className="text-sm text-slate-500">Automatically adjust times to your location</p>
                </div>
                <select className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                  <option>UTC (GMT+0)</option>
                  <option>EST (GMT-5)</option>
                  <option>PST (GMT-8)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Start of Week</h4>
                  <p className="text-sm text-slate-500">Choose which day the calendar starts on</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-sm font-medium text-slate-900">Sunday</button>
                  <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900">Monday</button>
                </div>
              </div>
            </div>
          </Card>
          
          <Card id="notifications">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">Notifications</h3>
            <div className="space-y-4">
              {[
                { title: 'Daily Digest', desc: 'Receive a summary of your tasks every morning' },
                { title: 'Task Reminders', desc: 'Get notified 15 minutes before a scheduled task' },
                { title: 'Streak Alerts', desc: 'Notify me when I am close to losing a streak' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
