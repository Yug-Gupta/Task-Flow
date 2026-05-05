import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';
import CalendarView from './pages/CalendarView';
import useAuthStore from './store/useAuthStore';

const VALID_THEMES = ['light', 'dark', 'midnight', 'rose', 'forest'];

function App() {
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const theme = userInfo?.preferences?.theme;
    const validated = VALID_THEMES.includes(theme) ? theme : 'light';
    document.documentElement.setAttribute('data-theme', validated);
  }, [userInfo]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/" element={userInfo ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to={userInfo ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
