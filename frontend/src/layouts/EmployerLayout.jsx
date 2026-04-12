import { LayoutDashboard, User, PlusCircle, Briefcase, MessageSquare } from 'lucide-react';
import SharedLayout from './SharedLayout';

export default function EmployerLayout({ children }) {
    const navigation = [
        { name: 'Dashboard', href: '/employer', icon: LayoutDashboard },
        { name: 'Company Profile', href: '/employer/profile', icon: User },
        { name: 'Post a New Job', href: '/employer/post-job', icon: PlusCircle },
        { name: 'My Job Postings', href: '/employer/my-jobs', icon: Briefcase },
        { name: 'Messages', href: '/employer/messages', icon: MessageSquare },
    ];

    return (
        <SharedLayout navigation={navigation} role="employer">
            {children}
        </SharedLayout>
    );
}