import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import WorkerLayout from './layouts/WorkerLayout';
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerMessages from './pages/worker/WorkerMessages';
import EmployerLayout from './layouts/EmployerLayout';
import PostJob from './pages/employer/PostJob';
import MyJobs from './pages/employer/MyJobs';
import ViewApplicants from './pages/employer/ViewApplicants';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

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
                <div className="text-2xl font-bold text-slate-800">Worker Dashboard Home</div>
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

        <Route path="/worker/messages" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout>
              <WorkerMessages />
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

        {/*Protected employer route*/}
        <Route path="/employer" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerLayout>
                <div className="text-2xl font-bold text-slate-800">Employer Overview Dashboard</div>
              </EmployerLayout>
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
      </Routes>
    </AuthProvider>
  );
}

export default App;