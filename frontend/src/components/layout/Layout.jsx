import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useTaskStore from '../../store/useTaskStore';
import { LayoutDashboard, CalendarDays, Settings, LogOut, Sparkles, CheckCircle2, Clock, Inbox } from 'lucide-react';

const Layout = () => {
  const { userInfo, logout } = useAuthStore();
  const { tasks } = useTaskStore();
  const navigate = useNavigate();

  const counts = {
    inbox: tasks.filter(t => t.status === 'inbox').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const initial = userInfo?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon"><Sparkles size={20} /></div>
            <span className="brand-name">TaskFlow</span>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="avatar">{initial}</div>
          <div className="profile-info">
            <span className="profile-name">{userInfo?.name}</span>
            <span className="profile-email">{userInfo?.email}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Navigation</p>

          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/calendar" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <CalendarDays size={20} />
            <span>Calendar</span>
          </NavLink>

          <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>

          <p className="nav-section-label" style={{ marginTop: '24px' }}>Quick Stats</p>

          <div className="stat-pills">
            <div className="stat-pill inbox">
              <Inbox size={14} /> <span>{counts.inbox} Inbox</span>
            </div>
            <div className="stat-pill progress">
              <Clock size={14} /> <span>{counts['in-progress']} Active</span>
            </div>
            <div className="stat-pill done">
              <CheckCircle2 size={14} /> <span>{counts.completed} Done</span>
            </div>
          </div>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </aside>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <CalendarDays size={18} />
          <span>Calendar</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <main className="main-area">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
