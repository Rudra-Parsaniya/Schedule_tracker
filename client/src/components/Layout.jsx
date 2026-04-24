import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ScheduleTracker
        </Link>
        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/schedule" className="text-slate-600 hover:text-primary transition-colors">Schedule</Link>
              <button 
                onClick={handleLogout}
                className="btn-primary py-2 px-4 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-primary transition-colors">Login</Link>
              <Link to="/signup" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-6 pb-12">
        {children}
      </main>
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto">
        &copy; {new Date().getFullYear()} ScheduleTracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
