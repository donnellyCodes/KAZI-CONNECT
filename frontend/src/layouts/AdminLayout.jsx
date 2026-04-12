import { Users, Briefcase, AlertTriangle, BarChart3, Brain, Settings } from 'lucide-react';
import SharedLayout from './SharedLayout';

export default function AdminLayout({ children }) {
    const navigation = [
        { name: 'System Overview', href: '/admin', icon: BarChart3 },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Job Moderation', href: '/admin/jobs', icon: Briefcase },
        { name: 'AI Matching Lab', href: '/admin/ai-inspector', icon: Brain },
        { name: 'Disputes & Reports', href: '/admin/disputes', icon: AlertTriangle },
        { name: 'System Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <SharedLayout navigation={navigation} role="admin">
            {children}
        </SharedLayout>
    );
}