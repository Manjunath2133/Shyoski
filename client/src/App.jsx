import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import EvaluatorDashboard from './pages/EvaluatorDashboard';
import PaymentPage from './pages/PaymentPage';
import CertificatePage from './pages/CertificatePage';
import DashboardRedirect from './pages/DashboardRedirect';
import ProjectsPage from './pages/ProjectsPage';
import PublicProfilePage from './pages/PublicProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import EvaluatorRoute from './components/EvaluatorRoute';
import MainLayout from './layout/MainLayout';
import PublicLayout from './layout/PublicLayout';
import { AnimatePresence } from 'framer-motion';
import LanderPage from './pages/LanderPage';
import './App.css';

function App() {
  const location = useLocation();

  return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/lander" element={<LanderPage />} />
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/user/:userId" element={<PublicLayout><PublicProfilePage /></PublicLayout>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardRedirect /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute><MainLayout><StudentDashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><MainLayout><PaymentPage /></MainLayout></ProtectedRoute>} />
          <Route path="/certificate" element={<ProtectedRoute><MainLayout><CertificatePage /></MainLayout></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><MainLayout><ProjectsPage /></MainLayout></ProtectedRoute>} />
          
          <Route path="/admin" element={<AdminRoute><MainLayout><AdminDashboard /></MainLayout></AdminRoute>} />
          <Route path="/evaluator-dashboard" element={<EvaluatorRoute><MainLayout><EvaluatorDashboard /></MainLayout></EvaluatorRoute>} />
        </Routes>
      </AnimatePresence>
  )
}

export default App;
