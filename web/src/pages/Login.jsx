import React, { useState } from 'react';
import { login, saveToken } from '../api.js';

export default function Login({ onSuccess }) {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault(); // prevents page reload
    setMsg('');

    const res = await login(code.trim());
    if (res.ok) {
      saveToken(res.token); // store token
      onSuccess(); // redirect to Level4 page
    } else {
      setMsg(res.msg || 'Invalid Team Code');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '60px auto' }}>
        <h1>Level 3 — Strange’s Timelines</h1>
        <p className="small">Enter your <b>Team Code</b> to begin.</p>

        <form onSubmit={submit}>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="TEAM_ALPHA"
          />
          <button type="submit" className="btn">Enter</button>
        </form>

        {msg && <p className="bad" style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
}
