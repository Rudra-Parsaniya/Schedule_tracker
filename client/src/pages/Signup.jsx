import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    mobile: '',
    email: '',
    password: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await signup(formData);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-8 sm:p-10 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
             <span className="text-white font-black text-xl">ST</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2">Join thousands of productive users today.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <Input 
            name="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required 
            containerClassName="md:col-span-2"
          />

          <Input 
            name="dob"
            type="date"
            label="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            required 
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
            <select 
              name="gender"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Input 
            name="mobile"
            type="tel"
            label="Mobile Number"
            placeholder="+1 234 567 890"
            value={formData.mobile}
            onChange={handleChange}
            required 
          />

          <Input 
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required 
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <textarea 
              name="address"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
              rows="3"
              placeholder="123 Main St, City, Country"
              value={formData.address}
              onChange={handleChange}
              required 
            ></textarea>
          </div>

          <Input 
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required 
            containerClassName="md:col-span-2"
          />

          <div className="md:col-span-2 pt-2">
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Create Account
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
