import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(formData);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="glass p-10 rounded-3xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Create Account</h2>
        <p className="text-slate-500 text-center mb-8">Join thousands of productive users today.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input 
              name="username"
              type="text" 
              className="input-field" 
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              name="email"
              type="email" 
              className="input-field" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              name="password"
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-4">
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
