import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { User, MapPin, Briefcase, Star, Edit2, Save, X, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
    "Electrician", "House help", "Mason", "Contractor", "House Keeping", "Carpenter", "Painter"
  ];

export default function WorkerProfile() {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', location: '', availability: true, skills: '', experience: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        if (data) {
          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            location: data.location || '',
            availability: data.availability ?? true,
            skills: data.skills || '',
            experience: data.experience || ''
          });
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/users/profile', profile);

      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        location: data.location || '',
        availability: data.availability,
        skills: data.skills || '',
        experience: data.experience || ''
      });

      setIsEditing(false);
      alert("Profile updated and verified!");
    } catch (err) { alert("Error saving profile"); }
  };

  if (loading) return <div className="p-10 text-indigo-600 font-bold">Loading Profile...</div>

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="p-8 -mt-12">
          <div className="flex justify-between items-end">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center text-indigo-600">
                <User size={48} />
              </div>
              {!isEditing && (
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-slate-800">{profile.firstName} {profile.lastName || 'Set Name'}</h1>
                  <p className="text-indigo-600 font-bold flex items-center gap-1">
                    <ShieldCheck size={16}/> {profile.skills || 'No Skill Selected'}
                  </p>
                </div>
              )}
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all"
              >
                <Edit2 size={18}/> Edit Profile
              </button>
            )}
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">First Name</label>
                    <input
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      value={profile.firstName}
                      onChange={e => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">Last Name</label>
                    <input
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      value={profile.lastName}
                      onChange={e => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">Primary Skill</label>
                    <select
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      value={profile.skills}
                      onChange={e => setProfile({...profile, skills: e.target.value})}
                    >
                      <option value="">Select your trade...</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">Location</label>
                    <input
                      lassName="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      value={profile.location}
                      onChange={e => setProfile({...profile, location: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2">Experience & Bio</label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={profile.experience}
                    onChange={e => setProfile({...profile, experience: e.target.value})}
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-600 px-10 py-3 rounded-xl font-bold">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Professional Bio</h3>
                    <p className="text-slate-700 leading-relaxed text-lg">{profile.experience || 'No bio provided yet.'}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 h-fit">
                  <h3 className="font-bold text-slate-800 border-b pb-2">Quick Info</h3>
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} className="text-indigo-500"/> {profile.location || 'Not set'}</p>
                    <p className="flex items-center gap-2 text-sm text-slate-600"><Briefcase size={16} className="text-indigo-500"/> {profile.skills || 'No skill selected'}</p>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${profile.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {profile.availability ? 'Available for Work' : 'Currently Busy'}
                    </div>
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