import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { User, MapPin, Briefcase, Edit2, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES = [
    "Electrician", "House help", "Mason", "Contractor", "House Keeping", "Carpenter", "Painter", "Other"
  ];

export default function WorkerProfile() {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', location: '', availability: true, skills: '', customSkill: '', yearsOfExperience: '', experience: '', cvUrl: '', idUrl: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const displaySkill = profile.skills === 'Other' && profile.customSkill
    ? profile.customSkill
    : profile.skills;
  
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
            customSkill: data.customSkill || '',
            yearsOfExperience: data.yearsOfExperience || '',
            experience: data.experience || '',
            cvUrl: data.cvUrl || '',
            idUrl: data.idUrl || ''
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
      // Upload CV if selected
      let cvUrl = profile.cvUrl;
      if (cvFile) {
        const cvFormData = new FormData();
        cvFormData.append('cv', cvFile);
        const cvResponse = await API.post('/users/upload-cv', cvFormData);
        cvUrl = cvResponse.data.url;
      }

      // Upload ID if selected
      let idUrl = profile.idUrl;
      if (idFile) {
        const idFormData = new FormData();
        idFormData.append('idDocument', idFile);
        const idResponse = await API.post('/users/upload-id', idFormData);
        idUrl = idResponse.data.url;
      }

      // Update profile with file URLs
      const profileData = { ...profile, cvUrl, idUrl };
      const { data } = await API.put('/users/profile', profileData);

      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        location: data.location || '',
        availability: data.availability,
        skills: data.skills || '',
        customSkill: data.customSkill || '',
        yearsOfExperience: data.yearsOfExperience || '',
        experience: data.experience || '',
        cvUrl: data.cvUrl || '',
        idUrl: data.idUrl || ''
      });

      setCvFile(null);
      setIdFile(null);
      setIsEditing(false);
      alert("Profile updated and verified!");
    } catch (err) { alert("Error saving profile"); }
  };

  if (loading) return <div className={clsx('p-10', 'text-indigo-600', 'font-bold')}>Loading Profile...</div>

  return (
    <div className={clsx('max-w-4xl', 'mx-auto', 'pb-10')}>
      <div className={clsx('bg-white', 'rounded-3xl', 'shadow-sm', 'border', 'border-slate-200', 'overflow-hidden')}>
        <div className={clsx('h-32', 'bg-indigo-600')}></div>
        <div className={clsx('p-8', '-mt-12')}>
          <div className={clsx('flex', 'justify-between', 'items-end')}>
            <div className={clsx('flex', 'items-end', 'gap-4')}>
              <div className={clsx('w-24', 'h-24', 'bg-white', 'p-2', 'rounded-2xl', 'shadow-lg', 'flex', 'items-center', 'justify-center', 'text-indigo-600')}>
                <User size={48} />
              </div>
              {!isEditing && (
                <div className="pb-2">
                  <h1 className={clsx('text-3xl', 'font-bold', 'text-slate-800')}>{profile.firstName} {profile.lastName || 'Set Name'}</h1>
                  <p className={clsx('text-indigo-600', 'font-bold', 'flex', 'items-center', 'gap-1')}>
                    <ShieldCheck size={16}/> {displaySkill || 'No Skill Selected'}
                  </p>
                </div>
              )}
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className={clsx('bg-indigo-50', 'text-indigo-600', 'px-6', 'py-2', 'rounded-xl', 'font-bold', 'flex', 'items-center', 'gap-2', 'hover:bg-indigo-100', 'transition-all')}
              >
                <Edit2 size={18}/> Edit Profile
              </button>
            )}
          </div>

          <div className={clsx('mt-10', 'border-t', 'border-slate-100', 'pt-8')}>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>First Name</label>
                    <input
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500')}
                      value={profile.firstName}
                      onChange={e => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>Last Name</label>
                    <input
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500')}
                      value={profile.lastName}
                      onChange={e => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>Primary Skill</label>
                    <select
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500')}
                      value={profile.skills}
                      onChange={e => setProfile({...profile, skills: e.target.value, customSkill: ''})}
                    >
                      <option value="">Select your trade...</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {/* Custom skill input */}
                    {profile.skills === 'Other' && (
                      <input
                        type="text"
                        placeholder="Please specify your skill"
                        className={clsx('w-full', 'mt-3', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500')}
                        value={profile.customSkill}
                        onChange={e => setProfile({...profile, customSkill: e.target.value})}
                      />
                    )}
                  </div>
                  
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>Location</label>
                    <input
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500')}
                      value={profile.location}
                      onChange={e => setProfile({...profile, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      placeholder="e.g. 3"
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500')}
                      value={profile.yearsOfExperience}
                      onChange={e => setProfile({...profile, yearsOfExperience: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>Professional Bio</label>
                    <textarea
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500')}
                      placeholder="Describe your experience, specialties, and what makes you a great worker..."
                      value={profile.experience}
                      onChange={e => setProfile({...profile, experience: e.target.value})}
                      rows="4"
                    />
                  </div>
                </div>

                {/* CV Upload */}
                <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>Upload CV</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e => setCvFile(e.target.files[0])}
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500', 'file:mr-4', 'file:py-2', 'file:px-4', 'file:rounded-full', 'file:border-0', 'file:text-sm', 'file:font-semibold', 'file:bg-indigo-50', 'file:text-indigo-700', 'hover:file:bg-indigo-100')}
                    />
                    {profile.cvUrl && !cvFile && (
                      <p className={clsx('text-xs', 'text-green-600', 'mt-2')}>CV uploaded: {profile.cvUrl.split('/').pop()}</p>
                    )}
                    {cvFile && (
                      <p className={clsx('text-xs', 'text-blue-600', 'mt-2')}>Selected: {cvFile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={clsx('block', 'text-xs', 'font-black', 'uppercase', 'text-slate-400', 'mb-2')}>Upload ID Document</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => setIdFile(e.target.files[0])}
                      className={clsx('w-full', 'p-3', 'bg-slate-50', 'border', 'border-slate-200', 'rounded-xl', 'outline-none', 'focus:ring-2', 'focus:ring-indigo-500', 'file:mr-4', 'file:py-2', 'file:px-4', 'file:rounded-full', 'file:border-0', 'file:text-sm', 'file:font-semibold', 'file:bg-indigo-50', 'file:text-indigo-700', 'hover:file:bg-indigo-100')}
                    />
                    {profile.idUrl && !idFile && (
                      <p className={clsx('text-xs', 'text-green-600', 'mt-2')}>ID uploaded: {profile.idUrl.split('/').pop()}</p>
                    )}
                    {idFile && (
                      <p className={clsx('text-xs', 'text-blue-600', 'mt-2')}>Selected: {idFile.name}</p>
                    )}
                  </div>
                </div>

                <div className={clsx('flex', 'gap-4')}>
                  <button type="submit" className={clsx('bg-indigo-600', 'text-white', 'px-10', 'py-3', 'rounded-xl', 'font-bold', 'shadow-lg', 'shadow-indigo-200')}>Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className={clsx('bg-slate-100', 'text-slate-600', 'px-10', 'py-3', 'rounded-xl', 'font-bold')}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-8')}>
                <div className={clsx('md:col-span-2', 'space-y-8')}>
                  <div>
                    <h3 className={clsx('text-sm', 'font-black', 'text-slate-400', 'uppercase', 'tracking-widest', 'mb-3')}>Professional Bio</h3>
                    <p className={clsx('text-slate-700', 'leading-relaxed', 'text-lg')}>{profile.experience || 'No bio provided yet.'}</p>
                  </div>
                  
                  {/* Uploaded Documents */}
                  <div>
                    <h3 className={clsx('text-sm', 'font-black', 'text-slate-400', 'uppercase', 'tracking-widest', 'mb-3')}>Verification Documents</h3>
                    <div className="space-y-3">
                      {profile.cvUrl ? (
                        <a 
                          href={`http://localhost:5000/${profile.cvUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={clsx('flex', 'items-center', 'gap-3', 'p-3', 'bg-indigo-50', 'rounded-xl', 'hover:bg-indigo-100', 'transition-colors')}
                        >
                          <div className={clsx('w-10', 'h-10', 'bg-indigo-600', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-white')}>
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className={clsx('font-semibold', 'text-slate-800')}>CV / Resume</p>
                            <p className={clsx('text-xs', 'text-slate-500')}>{profile.cvUrl.split('/').pop()}</p>
                          </div>
                        </a>
                      ) : (
                        <p className={clsx('text-slate-500', 'italic')}>No CV uploaded</p>
                      )}
                      
                      {profile.idUrl ? (
                        <a 
                          href={`http://localhost:5000/${profile.idUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={clsx('flex', 'items-center', 'gap-3', 'p-3', 'bg-indigo-50', 'rounded-xl', 'hover:bg-indigo-100', 'transition-colors')}
                        >
                          <div className={clsx('w-10', 'h-10', 'bg-green-600', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-white')}>
                            <ShieldCheck size={20} />
                          </div>
                          <div>
                            <p className={clsx('font-semibold', 'text-slate-800')}>ID Document</p>
                            <p className={clsx('text-xs', 'text-slate-500')}>{profile.idUrl.split('/').pop()}</p>
                          </div>
                        </a>
                      ) : (
                        <p className={clsx('text-slate-500', 'italic')}>No ID document uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={clsx('bg-slate-50', 'p-6', 'rounded-3xl', 'border', 'border-slate-100', 'space-y-4', 'h-fit')}>
                  <h3 className={clsx('font-bold', 'text-slate-800', 'border-b', 'pb-2')}>Quick Info</h3>
                  <div className="space-y-3">
                    <p className={clsx('flex', 'items-center', 'gap-2', 'text-sm', 'text-slate-600')}><MapPin size={16} className="text-indigo-500"/> {profile.location || 'Not set'}</p>
                    <p className={clsx('flex', 'items-center', 'gap-2', 'text-sm', 'text-slate-600')}><Briefcase size={16} className="text-indigo-500"/> {displaySkill || 'No skill selected'}</p>
                    <p className={clsx('flex', 'items-center', 'gap-2', 'text-sm', 'text-slate-600')}>
                      <Briefcase size={16} className="text-indigo-500"/> {profile.yearsOfExperience ? `${profile.yearsOfExperience} years experience` : 'Years of experience not set'}
                    </p>
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
