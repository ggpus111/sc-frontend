import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './lib/store';

import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import { RegisterPage, OnboardingPage } from './pages/RegisterPage';
import AppLayout      from './components/layout/AppLayout';
import HomePage       from './pages/HomePage';
import NoticePage     from './pages/NoticePage';
import { SchedulePage } from './pages/SchedulePage';
import { ChecklistPage } from './pages/SchedulePage';
import FreeBoardPage  from './pages/FreeBoardPage';
import SettingsPage   from './pages/SettingsPage';
import AdminPage      from './pages/AdminPage';
import ChatPage       from './pages/ChatPage';

function Private({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}
function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/home" replace />;
}
function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/home" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<LandingPage />} />
        <Route path="/login"      element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register"   element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/onboarding" element={<Private><OnboardingPage /></Private>} />

        <Route path="/" element={<Private><AppLayout /></Private>}>
          <Route path="home"      element={<HomePage />} />
          <Route path="notice"    element={<NoticePage />} />
          <Route path="schedule"  element={<SchedulePage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="free"      element={<FreeBoardPage />} />
          <Route path="chat"      element={<ChatPage />} />
          <Route path="settings"  element={<SettingsPage />} />
          <Route path="admin"     element={<AdminOnly><AdminPage /></AdminOnly>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ style:{ fontSize:'13px' } }} />
    </BrowserRouter>
  );
}
