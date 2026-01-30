import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';

// layouts
import AdminLayout from './layouts/AdminLayout';
import WorkerLayout from './layouts/WorkerLayout';
import EmployerLayout from './layouts/EmployerLayout';

// dashboards
import WorkerDashboard from './pages/worker/WorkerDashboard';

// admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

// worker pages
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerMessages from './pages/worker/WorkerMessages';
import JobDiscovery from './pages/worker/JobDiscovery';
import JobDetails from './pages/worker/JobDetails';

// employer pages
import PostJob from './pages/employer/PostJob';
import MyJobs from './pages/employer/MyJobs';
import ViewApplicants from './pages/employer/ViewApplicants';



function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Route */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Protected Worker route*/ }
        <Route path="/worker" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <WorkerLayout>
                <WorkerDashboard />
              </WorkerLayout>
            </ProtectedRoute>
        } />

        <Route path="/worker/profile" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout>
              <WorkerProfile/>
            </WorkerLayout>
          </ProtectedRoute>
        } />

        // worker job discovery
        <Route path="/worker/jobs" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout><JobDiscovery /></WorkerLayout>
          </ProtectedRoute>
        } />

        // worker job detail
        <Route path="/worker/jobs/:id" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout><JobDetails /></WorkerLayout>
          </ProtectedRoute>
        } />

        <Route path="/worker/messages" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout>
              <WorkerMessages />
            </WorkerLayout>
          </ProtectedRoute>
        } />

        {/*Protected employer routes*/}
        <Route path="/employer" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerLayout>
                <div className="text-2xl font-bold text-slate-800">Employer Overview Dashboard</div>
              </EmployerLayout>
            </ProtectedRoute>
        } />

        <Route path="/employer/profile" element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerLayout><div className="text-2xl font-bold">Employer Profile Page</div></EmployerLayout>
          </ProtectedRoute>
        } />

        <Route path="/employer/post-job" element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerLayout>
              <PostJob />
            </EmployerLayout>
          </ProtectedRoute>
        } />

        <Route path="/employer/my-jobs" element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerLayout>
              <MyJobs />
            </EmployerLayout>
          </ProtectedRoute>
        } />

        <Route path="/employer/jobs/:jobId/aplicants" element={
          <ProtectedRoute allowedRoutes={['employer']}>
            <EmployerLayout><ViewApplicants /></EmployerLayout>
          </ProtectedRoute>
        } />

        <Route path="/employer/messages" element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerLayout><div className = "text-2xl font-bold">Employer Messages Page</div></EmployerLayout>
          </ProtectedRoute>
        } />

      </Routes>
    </AuthProvider>
  );
}

export default App;