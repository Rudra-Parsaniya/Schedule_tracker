import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/authContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [editForm, setEditForm] = useState({ name: '', dob: '', address: '', mobile: '', gender: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  
  const [msg, setMsg] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setProfile(res.data);
      setEditForm({
        name: res.data.name,
        dob: res.data.dob.split('T')[0],
        address: res.data.address,
        mobile: res.data.mobile,
        gender: res.data.gender
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', editForm);
      showMessage('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/change-password', passwordForm);
      showMessage('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to change password', 'error');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/user/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showMessage('Profile image updated');
      fetchProfile();
    } catch (err) {
      showMessage('Failed to upload image', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <Skeleton className="w-48 h-10" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px]" />
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20 text-slate-500">Failed to load profile.</div>;

  const getProfileImageUrl = () => {
    if (profile.profileImagePath) {
      return `http://localhost:5193${profile.profileImagePath}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=7c3aed&color=fff&size=200`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and view statistics</p>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl font-medium border ${msg.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Stats */}
        <div className="space-y-8">
          <Card className="text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-100 to-brand-50"></div>
            
            <div className="relative inline-block mt-4 mb-4 cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <img 
                src={getProfileImageUrl()} 
                alt="Profile" 
                className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-md transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Edit
                </span>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{profile.name}</h3>
            <p className="text-slate-500 text-sm mb-6">{profile.email}</p>
            <div className="inline-block bg-slate-50 border border-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Your Impact</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-brand-200 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center text-lg">🔥</span>
                  <span className="font-medium text-slate-700 text-sm">Current Streak</span>
                </div>
                <span className="font-bold text-slate-900">{profile.streak} <span className="text-xs text-slate-400 font-normal">days</span></span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-brand-200 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center text-lg">✓</span>
                  <span className="font-medium text-slate-700 text-sm">Completed Tasks</span>
                </div>
                <span className="font-bold text-slate-900">{profile.totalCompletedTasks}</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-brand-200 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center text-lg">📈</span>
                  <span className="font-medium text-slate-700 text-sm">Completion Rate</span>
                </div>
                <span className="font-bold text-brand-600">{profile.completionPercentage}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal Information</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <Input 
                label="Full Name" 
                required 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})} 
                containerClassName="md:col-span-2"
              />
              
              <Input 
                type="date" 
                label="Date of Birth" 
                required 
                value={editForm.dob} 
                onChange={e => setEditForm({...editForm, dob: e.target.value})} 
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                <select 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  value={editForm.gender}
                  onChange={e => setEditForm({...editForm, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input 
                label="Mobile Number" 
                required 
                value={editForm.mobile} 
                onChange={e => setEditForm({...editForm, mobile: e.target.value})} 
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <textarea 
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  rows="3"
                  value={editForm.address}
                  onChange={e => setEditForm({...editForm, address: e.target.value})}
                ></textarea>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
              <Input 
                type="password" 
                label="Current Password" 
                required 
                value={passwordForm.currentPassword} 
                onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
              />
              
              <Input 
                type="password" 
                label="New Password" 
                required 
                minLength={6} 
                value={passwordForm.newPassword} 
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
              />

              <div className="flex justify-start pt-2">
                <Button type="submit" variant="secondary">Update Password</Button>
              </div>
            </form>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Profile;
