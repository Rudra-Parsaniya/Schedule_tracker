import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="inline-block bg-brand-50 border border-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-8">
        The Future of Productivity
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900">
        Master Your <span className="text-gradient">Time.</span>
      </h1>
      <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
        The ultimate schedule tracker for high-performers. Organize your tasks, set reminders, and track your progress all in one professional dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/signup">
          <Button size="lg" className="w-full sm:w-auto">Get Started for Free</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">Sign In</Button>
        </Link>
      </div>
      
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {[
          { title: 'Smart Scheduling', desc: 'AI-powered task prioritization for your daily routines.', icon: '⚡' },
          { title: 'Real-time Sync', desc: 'Your schedule, everywhere you go on any device.', icon: '🔄' },
          { title: 'Goal Tracking', desc: 'Visualize your progress effortlessly with rich analytics.', icon: '📈' }
        ].map((feat, i) => (
          <Card key={i} className="text-left hover:scale-105 transition-all duration-300 border-transparent hover:border-brand-200 hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl mb-6">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">{feat.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
