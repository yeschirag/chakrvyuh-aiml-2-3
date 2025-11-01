import React, { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Level4 from './pages/Level4.jsx';
import { getToken, ping } from './api.js';

export default function App(){
  const [authed, setAuthed] = useState(!!getToken());
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!authed) return;
    (async () => {
      const p = await ping();
      if (p?.ok) setProfile(p);
    })();
  }, [authed]);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Level4 profile={profile} onLogout={() => { localStorage.clear(); location.reload(); }} />;
}
