const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Save and get token
export const saveToken = (t) => localStorage.setItem('token', t);
export const getToken = () => localStorage.getItem('token');

// ✅ Login request
export const login = async (teamCode) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamCode }),
  });
  return res.json();
};

// ✅ Ping backend for status
export const ping = async () => {
  const token = getToken();
  if (!token) return { ok: false };
  const res = await fetch(`${API_BASE}/api/level4/ping`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ✅ Download dataset function
export const downloadDataset = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/level4/dataset`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Download failed');

  // Trigger browser download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dataset.csv';
  a.click();
};

// ✅ Submit answer
export const submitAnswer = async (answer) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/level4/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });
  return res.json();
};
