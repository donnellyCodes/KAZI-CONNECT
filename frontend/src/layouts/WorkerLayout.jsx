import { LayoutDashboard, User, Briefcase, MessageSquare } from 'lucide-react';
import SharedLayout from './SharedLayout';

export default function WorkerLayout({ children }) {
    const navigation = [
        { name: 'Dashboard', href: '/worker', icon: LayoutDashboard },
        { name: 'My Profile', href: '/worker/profile', icon: User },
        { name: 'Find Jobs', href: '/worker/jobs', icon: Briefcase },
        { name: 'Messages', href: '/worker/messages', icon: MessageSquare },
    ];

    return (
        <SharedLayout navigation={navigation} role="worker">
            {children}
        </SharedLayout>
    );
}