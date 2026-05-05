import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Save, User, Moon, Sun, Sunset } from 'lucide-react';

const THEMES = [
  { id: 'light', name: 'Light', preview: ['#ffffff', '#6366f1', '#f4f6f8'] },
  { id: 'dark', name: 'Dark', preview: ['#1a1a2e', '#8b5cf6', '#16213e'] },
  { id: 'midnight', name: 'Midnight Blue', preview: ['#0d1b2a', '#00b4d8', '#1b2838'] },
  { id: 'rose', name: 'Rose Gold', preview: ['#fff1f2', '#e11d48', '#ffe4e6'] },
  { id: 'forest', name: 'Forest', preview: ['#1a2e1a', '#4ade80', '#132013'] },
];

const Settings = () => {
  const { userInfo, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(userInfo?.name || '');
  const [theme, setTheme] = useState(userInfo?.preferences?.theme || 'light');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await updateProfile({ name, preferences: { theme } });
    if (ok) {
      document.documentElement.setAttribute('data-theme', theme);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError('Failed to save. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your profile and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-layout">
        {/* Profile Section */}
        <section className="settings-card">
          <div className="settings-card-header">
            <User size={20} />
            <h2>Profile</h2>
          </div>
          <div className="field-row">
            <label>Display Name</label>
            <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="field-row">
            <label>Email</label>
            <input className="form-input disabled" type="email" value={userInfo?.email || ''} readOnly />
            <span className="field-hint">Email cannot be changed</span>
          </div>
        </section>

        {/* Theme Section */}
        <section className="settings-card">
          <div className="settings-card-header">
            <Sun size={20} />
            <h2>Appearance</h2>
          </div>
          <p className="settings-desc">Choose a theme that matches your vibe. Changes apply immediately after saving.</p>

          <div className="theme-grid">
            {THEMES.map(t => (
              <button
                key={t.id}
                type="button"
                className={`theme-option ${theme === t.id ? 'selected' : ''}`}
                onClick={() => { setTheme(t.id); document.documentElement.setAttribute('data-theme', t.id); }}
              >
                <div className="theme-preview-swatch">
                  {t.preview.map((c, i) => (
                    <div key={i} style={{ background: c, flex: 1, borderRadius: i === 0 ? '6px 6px 0 0' : i === 2 ? '0 0 6px 6px' : 0 }} />
                  ))}
                </div>
                <span className="theme-name">{t.name}</span>
                {theme === t.id && <span className="theme-check">✓</span>}
              </button>
            ))}
          </div>
        </section>

        {error && <div className="alert alert-error">{error}</div>}
        {saved && <div className="alert alert-success">✓ Settings saved successfully!</div>}

        <button type="submit" className="btn-save" disabled={isLoading}>
          {isLoading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default Settings;
