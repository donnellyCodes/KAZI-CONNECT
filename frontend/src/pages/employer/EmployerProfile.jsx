import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Building, MapPin, Globe, Edit2, Save, X } from 'lucide-react';

export default function EmployerProfile() {
    const [profile, setProfile] = useState({
        companyName: '',
        location: '',
        industry: '',
        bio: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // fetch profile on load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setProfile({
                    companyName: data.companyName || '',
                    location: data.location || '',
                    industry: data.industry || '',
                    bio: data.bio || ''
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await API.put('/users/profile', profile);
            alert("Profile updated successfully!");
            setIsEditing(false) // hides form after saving
        } catch (err) {
            alert("Failed to save profile changes.");
        }
    };

    if (loading) return <div className="p-10 text-emerald-600 font-bold">Loading Company/Individual Profile...</div>;

    return (
        <div className="p-10 text-emerald-600 font-bold">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/*Profile header banner*/}
                <div className="h-32 bg-emerald-600 w-full"></div>

                <div className="p-8 -mt-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="flex items-end gap-4">
                            <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-lg">
                                <div className="w-full h-full bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Building size={40} />
                                </div>
                            </div>
                            {!isEditing && (
                                <div className="pb-2">
                                    <h1 className="text-3xl font-bold text-slate-900">{profile.companyName || 'Set Company Name'}</h1>
                                    <p className="text-emerald-600 font-medium">{profile.industry || 'No industry set'}</p>
                                </div>
                            )}
                        </div>

                        {/* Toggle button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            >
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="mt-10 border-t border-slate-100 pt-8">
                        {isEditing ? (
                            /* --- form in edit mode --- */
                            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Company Name/Individual Name</label>
                                        <input
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={profile.companyName}
                                            onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                                        <input
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={profile.industry}
                                            placeholder="e.g. Construction, IT, Hospitality"
                                            onChange={(e) => setProfile({...profile, industry: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                        <input
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={profile.location}
                                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">About the company/individual</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={profile.bio}
                                        placeholder="Tell workers about your company missions and values..."
                                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
                                        <Save size={18} /> Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-2 bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* --- View mode --- */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">About us</h3>
                                        <p className="text-slate-700 leading-relaxed text-lg">{profile.bio || "No company bio provided yet. Click edit to add information about your company."}</p>
                                    </div>
                                </div>
                                <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Company details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <MapPin size={20} className="text-emerald-600" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-slate-400">Main Office</p>
                                                <p className="text-sm font-medium">{profile.location || 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Globe size={20} className="text-emerald-600" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-slate-400">Industry</p>
                                                <p className="text-sm font-medium">{profile.industry || 'Not set'}</p>
                                            </div>
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