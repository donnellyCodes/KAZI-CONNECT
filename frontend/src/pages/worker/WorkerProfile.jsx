import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { User, MapPin, Briefcase, Star, Edit2, Save, X, ShieldCheck } from 'lucide-react';

export default function WorkerProfile() {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', location: '', availability: true, skills: '', experience: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    API.get('/users/profile').then(({ data }) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/profile', profile);
      setIsEditing(false);
      alert("Profile Saved!");
    } catch (err) { alert("Error saving profile"); }
  };

  useEffect(() => {
    // Fetch current profile data
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          location: data.location || '',
          availability: data.availability ?? true,
          experience: data.experience || ''
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/profile', profile);
      alert("Profile is updated!");
    } catch (err) {
      console.error("Update error:", err.response?.data);
      alert("Failed to save: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    
    setUploading(true);
    try {
      await API.post('/users/upload-id', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("ID Uploaded successfully for verification!");
    } catch (err) { alert("Upload failed"); }
    setUploading(false);
  };

  if (loading) return <div className="p-10 text-indigo-600 font-bold">Loading Profile...</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="p-8 -mt-12">
          <div className="flex justify-between items-end">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center text-indigo-600">
                <User size={48} />
              </div>
              {!isEditing && (
                <div className="pb-2">
                  <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
                  <p className="text-indigo-600 font-bold flex items-center gap-1">
                    <ShieldCheck size={16} /> {profile.availability ? 'Available' : 'Busy'}
                  </p>
                </div>
              )}
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                <Edit2 size={18}/> Edit Profile
              </button>
            )}
          </div>

          <div className="mt-10 border-t pt-8">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input className="p-3 border rounded-xl" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} placeholder="First Name" />
                  <input className="p-3 border rounded-xl" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} placeholder="Last Name" />
                  <input className="p-3 border rounded-xl" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="Location" />
                  <select className="p-3 border rounded-xl" value={profile.availability} onChange={e => setProfile({...profile, availability: e.target.value === 'true'})}>
                    <option value="true">Available</option>
                    <option value="false">Busy</option>
                  </select>
                </div>
                <textarea className="w-full p-3 border rounded-xl h-32" value={profile.experience} onChange={e => setProfile({...profile, experience: e.target.value})} placeholder="Bio / Experience" />
                <div className="flex gap-4">
                  <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-100 px-8 py-2 rounded-xl">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase mb-2">Experience</h3>
                    <p className="text-slate-700 leading-relaxed">{profile.experience || 'No bio provided'}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border">
                  <h3 className="font-bold mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-center gap-2"><MapPin size={16}/> {profile.location}</p>
                    <p className="flex items-center gap-2"><Briefcase size={16}/> Professional Worker</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}