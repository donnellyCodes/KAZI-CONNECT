import { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function WorkerProfile() {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', location: '', availability: true, skills: '', experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Profile</h2>
        
        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600">Location</label>
            <input 
              className="mt-1 w-full p-2 border rounded-md" 
              value={profile.location || ''}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600">Availability</label>
            <select 
              className="mt-1 w-full p-2 border rounded-md"
              value={profile.availability}
              onChange={(e) => setProfile({...profile, availability: e.target.value === 'true'})}
            >
              <option value="true">Available for Work</option>
              <option value="false">Busy / Not Available</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-600">Skills (Comma separated)</label>
            <textarea 
              className="mt-1 w-full p-2 border rounded-md" 
              placeholder="e.g. Plumbing, Electrical, Painting"
              onChange={(e) => setProfile({...profile, skills: e.target.value})}
            />
          </div>

          <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-indigo-700">
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Verification Section */}
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-2">Account Verification</h3>
        <p className="text-sm text-indigo-700 mb-4">Upload a clear photo of your National ID or Passport to get a "Verified" badge.</p>
        <input 
          type="file" 
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        />
        {uploading && <p className="mt-2 text-indigo-600 animate-pulse">Uploading...</p>}
      </div>
    </div>
  );
}