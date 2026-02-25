import { useState } from 'react';
import { Settings, Shield, Bell, Percent, HardDrive } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        platformFee: 10,
        maintenanceMode: false,
        minWithdrawal: 500,
        supportEmail: 'support@kaziconnect.com'
    });

    return (
        <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-black text-slate-800">Global System Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Settings */}
                <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                        <Percent size={18} className="text-red-500" /> Financials
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Platform Service Fee (%)</label>
                        <input type="number" className="w-full p-2 bg-slate-50 rounded-lg mt-1" value={settings.platformFee} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Min. Withdrawal (KES)</label>
                        <input type="number" className="w-full p-2 bg-slate-50 rounded-lg mt-1" value={settings.minWithdrawal} />
                    </div>
                </div>
                {/* System Status */}
                <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                        <HardDrive size={18} className="text-red-500" /> Infrastructure
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-2xl">
                        <div>
                            <p className="font-bold text-red-900 text-sm">Maintenance Mode</p>
                            <p className="font-bold text-red-900 text-sm">Disable all user interactions</p>
                        </div>
                        <input type="checkbox" className="w-6 h-6 accent-red-600" checked={settings.maintenanceMode} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Support Contact Email</label>
                        <input type="email" className="w-full p-2 bg-slate-50 rounded-lg mt-1" value={settings.supportEmail} />
                    </div>
                </div>
            </div>
            <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all">
                Save Global Configuration
            </button>
        </div>
    );
}