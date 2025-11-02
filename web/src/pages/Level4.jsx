import React, { useEffect, useState } from 'react';
import { downloadDataset, submitAnswer, ping } from '../api.js';

export default function Level4({ profile, onLogout }) {
  const [status, setStatus] = useState(profile || null);
  const [answer, setAnswer] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { setStatus(profile); }, [profile]);

  const doDownload = async () => {
    try { await downloadDataset(); setMsg('Dataset downloaded successfully.'); }
    catch (e) { setMsg('Dataset download failed.'); }
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
        <h2>Level 3 — Strange's 14,000,605 Timelines</h2>
        <p className="small">
          I am the language of broken tomorrows,
          Carved in countless pairs of numbers.
          Alone I seem chaos, meaningless dust,
          Yet drawn together, I whisper the one truth.
        </p>

        <button className="btn" onClick={doDownload}>Download Dataset</button>
        <button className="btn" onClick={onLogout} style={{ marginLeft: 10 }}>Logout</button>

        <hr />

        <label>Submit your final answer (single word)</label>
        <input
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ENTER TEXT"
        />
        <button className="btn" onClick={doSubmit} style={{ marginTop: 10 }}>Submit Answer</button>

        {msg && (
          <p style={{ marginTop: 12 }} className={/Correct/i.test(msg) ? 'good' : 'bad'}>
            {msg}
          </p>
        )}

        {status?.completed && (
          <div>
            <p className="good" style={{ marginTop: 10 }}>
              ✅ Completed at: {new Date(status.submission?.timestamp).toLocaleString()}
            </p>
            <button className="btn" onClick={() => window.location.href = 'https://chakrvyuh-aiml-d2-c4.vercel.app/'}>Go to next level</button>
          </div>
        )}
      </div>
    </div>
  );
}
