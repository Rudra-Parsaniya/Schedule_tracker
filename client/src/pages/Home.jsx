import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Master Your Time.
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl">
        The ultimate schedule tracker for high-performers. Organize your tasks, set reminders, and track your progress all in one place.
      </p>
      <div className="flex gap-4">
        <Link to="/signup" className="btn-primary text-lg px-8 py-3">
          Get Started for Free
        </Link>
        <Link to="/login" className="px-8 py-3 rounded-xl border border-slate-200 font-medium hover:bg-slate-100 transition-all">
          Sign In
        </Link>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {[
          { title: 'Smart Scheduling', desc: 'AI-powered task prioritization.' },
          { title: 'Real-time Sync', desc: 'Your schedule, everywhere you go.' },
          { title: 'Goal Tracking', desc: 'Visualize your progress effortlessly.' }
        ].map((feat, i) => (
          <div key={i} className="glass p-8 rounded-2xl text-left hover:scale-[1.03] transition-transform duration-300">
            <h3 className="text-xl font-bold mb-3 text-slate-800">{feat.title}</h3>
            <p className="text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
