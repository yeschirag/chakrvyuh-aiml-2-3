import React, { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Level4 from './pages/Level4.jsx';
import { getToken, ping } from './api.js';

export default function App(){
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      if (!token) {
        setAuthed(false);
        setLoading(false);
        return;
      }

      // Verify token is valid
      const p = await ping();
      if (p?.ok) {
        setProfile(p);
        setAuthed(true);
      } else {
        // Token is invalid, clear it
        localStorage.clear();
        setAuthed(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!authed) {
    return <Login onSuccess={() => {
      setAuthed(true);
      // Re-fetch profile after login
      ping().then(p => {
        if (p?.ok) setProfile(p);
      });
    }} />;
  }

  return <Level4 profile={profile} onLogout={() => { 
    localStorage.clear(); 
    setAuthed(false);
    setProfile(null);
  }} />;
}