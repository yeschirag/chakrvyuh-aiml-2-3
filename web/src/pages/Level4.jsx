import React, { useEffect, useState } from 'react';
import { downloadDataset, submitAnswer, ping } from '../api.js';

export default function Level4({ profile, onLogout }){
  const [status, setStatus] = useState(profile || null);
  const [answer, setAnswer] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { setStatus(profile); }, [profile]);

  const doDownload = async () => {
    try { await downloadDataset(); setMsg('Dataset downloaded successfully.'); }
    catch(e){ setMsg('Dataset download failed.'); }
  };

  const doSubmit = async () => {
    setMsg('');
    const res = await submitAnswer(answer);
    if (res.ok) {
      setMsg(res.msg);
      const refreshed = await ping();
      if (refreshed?.ok) setStatus(refreshed);
    } else {
      setMsg(res.msg || 'Submission error');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 700, margin: '40px auto' }}>
        <h2>Level 4 — Strange’s 14,000,605 Timelines</h2>
        <p className="small">
          You have been given a dataset. What it reveals is for you to discover.
          Use your own tools, logic, and creativity.
        </p>

        <button className="btn" onClick={doDownload}>Download Dataset</button>
        <button className="btn" onClick={onLogout} style={{ marginLeft: 10 }}>Logout</button>

        <hr />

        <label>Submit your final answer (single word)</label>
        <input
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="e.g., STARK"
        />
        <button className="btn" onClick={doSubmit} style={{ marginTop: 10 }}>Submit Answer</button>

        {msg && (
          <p style={{ marginTop: 12 }} className={/Correct/i.test(msg) ? 'good' : 'bad'}>
            {msg}
          </p>
        )}

        {status?.completed && (
          <p className="good" style={{ marginTop: 10 }}>
            ✅ Completed at: {new Date(status.submission?.timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
