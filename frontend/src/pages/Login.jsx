import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login, register, userInfo, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => { if (userInfo) navigate('/dashboard'); }, [userInfo, navigate]);

  const switchMode = () => { setIsLogin(v => !v); clearError(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) await login(email, password);
    else await register(name, email, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon"><Sparkles size={28} /></div>
          <h1>TaskFlow</h1>
        </div>
        <h2 className="auth-tagline">Organize your work.<br />Achieve more.</h2>
        <p className="auth-sub">A production-grade task manager for focused people.</p>
        <div className="auth-features">
          <div className="feature-pill">⚡ Lightning fast</div>
          <div className="feature-pill">🎨 5 beautiful themes</div>
          <div className="feature-pill">📅 Calendar view</div>
          <div className="feature-pill">🔒 Secure auth</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => isLogin || switchMode()}>Sign In</button>
            <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => isLogin && switchMode()}>Sign Up</button>
          </div>

          <h3>{isLogin ? 'Welcome back!' : 'Create your account'}</h3>
          <p className="auth-subtitle">{isLogin ? 'Sign in to your workspace' : 'Start your productivity journey'}</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <div className="input-icon"><User size={18} /></div>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoFocus={!isLogin}
                />
              </div>
            )}
            <div className="input-group">
              <div className="input-icon"><Mail size={18} /></div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus={isLogin}
              />
            </div>
            <div className="input-group">
              <div className="input-icon"><Lock size={18} /></div>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="btn-auth" disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="auth-switch-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            {' '}<span onClick={switchMode}>{isLogin ? 'Sign up free' : 'Sign in'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
